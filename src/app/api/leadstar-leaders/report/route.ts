import { NextRequest, NextResponse } from "next/server";

const ENROLLHERE_URL = "https://api.enrollhere.com/v1/reporting/report";
const AGENT_LOOKUP_URL = "https://api.enrollhere.com/v1/dialer/agents/performance";
const TZ = "America/New_York";
const INDEX = "lead-calls";

type RangeKey =
  | "today"
  | "wtd"
  | "mtd"
  | "lastMonth"
  | "qtd"
  | "lastQuarter"
  | "ytd";

const VALID_RANGES: RangeKey[] = [
  "today",
  "wtd",
  "mtd",
  "lastMonth",
  "qtd",
  "lastQuarter",
  "ytd",
];

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-leadstar-api-key")?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "Missing X-LeadStar-API-Key header" }, { status: 400 });
  }

  let body: { range?: RangeKey; topN?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const range = body.range;
  if (!range || !VALID_RANGES.includes(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }
  const topN = Math.min(Math.max(body.topN ?? 10, 1), 50);

  const dateFilter = buildDateFilter(range, new Date());

  // totalSales is a *computed* metric (success + double + triple*2) so Elasticsearch
  // can't use it to order buckets. We order by totalResultSuccess (raw count of sale
  // events) which is a near-perfect proxy, fetch a wider pool, then re-rank the
  // buckets server-side by the true totalSales value before slicing to topN.
  const oversize = Math.max(topN * 3, 30);

  const payload = {
    sources: [
      {
        index: INDEX,
        metrics: ["totalSales", "totalBillableSum", "costPerSale"],
      },
    ],
    filter: {
      createdAt: dateFilter,
    },
    groups: [
      {
        name: "summary",
        metrics: ["totalSales", "totalBillableSum", "costPerSale"],
      },
      {
        name: "byAgent",
        dimensions: [
          {
            field: "participantList.id",
            size: oversize,
            orderBy: { metric: "totalResultSuccess", direction: "desc" },
            includeMetadata: {
              fields: [
                "agent.firstName",
                "agent.lastName",
                "agent.email",
                "agent.npn",
              ],
            },
          },
        ],
        metrics: [
          "totalSales",
          "totalResultSuccess",
          "totalBillableSum",
          "costPerSale",
        ],
      },
    ],
  };

  let upstream: Response;
  try {
    upstream = await fetch(ENROLLHERE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Upstream request failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json(
      { error: "Upstream returned non-JSON", status: upstream.status, body: text.slice(0, 500) },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Upstream error", status: upstream.status, body: parsed },
      { status: upstream.status }
    );
  }

  // Re-rank the byAgent buckets by the true (computed) totalSales and slice to topN.
  const reranked = rerankByAgent(parsed, topN);

  // The reporting endpoint's dimension metadata does not expose agent names on
  // this index, so do a second lookup against /v1/dialer/agents/performance —
  // which DOES return id + firstName + lastName — and merge the names into each
  // bucket's metadata. Failures here degrade gracefully back to ID-only labels.
  const enriched = await enrichAgentNames(reranked, apiKey);

  return NextResponse.json({ range, filter: dateFilter, data: enriched });
}

async function enrichAgentNames(parsed: unknown, apiKey: string): Promise<unknown> {
  if (!parsed || typeof parsed !== "object") return parsed;
  const root = parsed as { groups?: Record<string, { buckets?: BucketLike[] }> };
  const buckets = root.groups?.byAgent?.buckets;
  if (!buckets || !Array.isArray(buckets) || buckets.length === 0) return parsed;

  const ids = Array.from(
    new Set(buckets.map((b) => String(b.key)).filter((k) => k && k !== "undefined"))
  );
  if (ids.length === 0) return parsed;

  let nameMap: Record<string, { firstName?: string; lastName?: string; npn?: string }> = {};
  try {
    const lookupRes = await fetch(AGENT_LOOKUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${apiKey}`,
      },
      body: JSON.stringify({
        filter: {
          date: { range: "last365days", timeZone: TZ },
          agent: { ids },
        },
      }),
      cache: "no-store",
    });
    if (lookupRes.ok) {
      const json = (await lookupRes.json()) as {
        agents?: Array<{ id?: string; firstName?: string; lastName?: string; npn?: string }>;
      };
      for (const a of json.agents ?? []) {
        if (a.id) {
          nameMap[a.id] = { firstName: a.firstName, lastName: a.lastName, npn: a.npn };
        }
      }
    }
  } catch {
    // Swallow — name enrichment is best-effort.
    nameMap = {};
  }

  const annotated = buckets.map((b) => {
    const info = nameMap[String(b.key)];
    if (!info) return b;
    return {
      ...b,
      metadata: {
        ...(b.metadata ?? {}),
        "agent.firstName": info.firstName ?? b.metadata?.["agent.firstName"],
        "agent.lastName": info.lastName ?? b.metadata?.["agent.lastName"],
        "agent.npn": info.npn ?? b.metadata?.["agent.npn"],
      },
    };
  });

  return {
    ...root,
    groups: {
      ...root.groups,
      byAgent: { ...root.groups!.byAgent, buckets: annotated },
    },
  };
}

type BucketLike = {
  key: string | number;
  metrics?: Record<string, number | null>;
  metadata?: Record<string, unknown>;
  doc_count?: number;
};

function rerankByAgent(parsed: unknown, topN: number): unknown {
  if (!parsed || typeof parsed !== "object") return parsed;
  const root = parsed as { groups?: Record<string, { buckets?: BucketLike[] }> };
  const byAgent = root.groups?.byAgent;
  if (!byAgent?.buckets || !Array.isArray(byAgent.buckets)) return parsed;

  const sorted = [...byAgent.buckets].sort((a, b) => {
    const sa = typeof a.metrics?.totalSales === "number" ? a.metrics.totalSales : 0;
    const sb = typeof b.metrics?.totalSales === "number" ? b.metrics.totalSales : 0;
    return sb - sa;
  });

  return {
    ...root,
    groups: {
      ...root.groups,
      byAgent: { ...byAgent, buckets: sorted.slice(0, topN) },
    },
  };
}

type DateFilter =
  | { range: "today"; timeZone: string }
  | { range: "thisMonth"; timeZone: string }
  | { range: "lastMonth"; timeZone: string }
  | { range: "thisYear"; timeZone: string }
  | { range: "custom"; start: string; end: string; timeZone: string };

// EnrollHere's reporting endpoint accepts a date filter object whose value is either
// a named preset (e.g. { range: "today" }) or { range: "custom", start, end, timeZone }.
// Named presets are honored where they line up with our tab labels; the rest fall
// back to "custom" with start/end timestamps anchored to America/New_York.
function buildDateFilter(range: RangeKey, now: Date): DateFilter {
  const tz = TZ;

  if (range === "today") return { range: "today", timeZone: tz };
  if (range === "mtd") return { range: "thisMonth", timeZone: tz };
  if (range === "lastMonth") return { range: "lastMonth", timeZone: tz };
  if (range === "ytd") return { range: "thisYear", timeZone: tz };

  const p = easternParts(now);
  const dayStartTs = (y: number, m: number, d: number) => fmtTs(y, m, d, 0, 0, 0);
  const dayEndTs = (y: number, m: number, d: number) => fmtTs(y, m, d, 23, 59, 59);
  const todayEnd = dayEndTs(p.year, p.month, p.day);

  if (range === "wtd") {
    const dow = easternDayOfWeek(p.year, p.month, p.day);
    const sunday = shiftDate(p.year, p.month, p.day, -dow);
    return {
      range: "custom",
      start: dayStartTs(sunday.year, sunday.month, sunday.day),
      end: todayEnd,
      timeZone: tz,
    };
  }

  if (range === "qtd") {
    const qStartMonth = p.month - ((p.month - 1) % 3);
    return {
      range: "custom",
      start: dayStartTs(p.year, qStartMonth, 1),
      end: todayEnd,
      timeZone: tz,
    };
  }

  if (range === "lastQuarter") {
    const currentQStartMonth = p.month - ((p.month - 1) % 3);
    const prevQStartMonthRaw = currentQStartMonth - 3;
    const prevQStart =
      prevQStartMonthRaw < 1
        ? { year: p.year - 1, month: prevQStartMonthRaw + 12 }
        : { year: p.year, month: prevQStartMonthRaw };
    // Last day of prev quarter = day before the current quarter's first day.
    const dayBeforeCurrentQ = shiftDate(p.year, currentQStartMonth, 1, -1);
    return {
      range: "custom",
      start: dayStartTs(prevQStart.year, prevQStart.month, 1),
      end: dayEndTs(dayBeforeCurrentQ.year, dayBeforeCurrentQ.month, dayBeforeCurrentQ.day),
      timeZone: tz,
    };
  }

  // exhaustive guard — type system enforces no other RangeKey reaches here
  const _exhaustive: never = range;
  void _exhaustive;
  return { range: "today", timeZone: tz };
}

function fmtTs(year: number, month: number, day: number, hour: number, minute: number, second: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

function shiftDate(year: number, month: number, day: number, deltaDays: number): { year: number; month: number; day: number } {
  // Use UTC noon to avoid any DST edge issues — we only care about Y/M/D.
  const baseUtc = Date.UTC(year, month - 1, day, 12, 0, 0);
  const shifted = new Date(baseUtc + deltaDays * 86_400_000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function easternParts(date: Date): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function easternDayOfWeek(year: number, month: number, day: number): number {
  const utc = Date.UTC(year, month - 1, day, 12, 0, 0);
  return new Date(utc).getUTCDay();
}
