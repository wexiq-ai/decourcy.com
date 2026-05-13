import { NextRequest, NextResponse } from "next/server";

const ENROLLHERE_URL = "https://api.enrollhere.com/v1/reporting/report";
const TZ = "America/New_York";
const INDEX = "lead-calls";

type RangeKey = "today" | "wtd" | "mtd" | "qtd" | "ytd";

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
  if (!range || !["today", "wtd", "mtd", "qtd", "ytd"].includes(range)) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }
  const topN = Math.min(Math.max(body.topN ?? 10, 1), 50);

  const { gte, lt } = computeRange(range, new Date());

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
      createdAt: { gte, lt },
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
                "participantList.firstName",
                "participantList.lastName",
                "participantList.name",
                "participantList.displayName",
                "participantList.fullName",
                "participantList.email",
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

  return NextResponse.json({ range, gte, lt, data: reranked });
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

function computeRange(range: RangeKey, now: Date): { gte: string; lt: string } {
  const parts = easternParts(now);
  const todayStart = easternIso(parts.year, parts.month, parts.day, 0, 0, 0, now);
  const tomorrowStart = addDaysEastern(parts.year, parts.month, parts.day, 1, now);

  if (range === "today") {
    return { gte: todayStart, lt: tomorrowStart };
  }

  if (range === "wtd") {
    const dow = easternDayOfWeek(parts.year, parts.month, parts.day);
    const sundayStart = addDaysEastern(parts.year, parts.month, parts.day, -dow, now);
    return { gte: sundayStart, lt: tomorrowStart };
  }

  if (range === "mtd") {
    const monthStart = easternIso(parts.year, parts.month, 1, 0, 0, 0, now);
    return { gte: monthStart, lt: tomorrowStart };
  }

  if (range === "qtd") {
    const qStartMonth = parts.month - ((parts.month - 1) % 3);
    const qStart = easternIso(parts.year, qStartMonth, 1, 0, 0, 0, now);
    return { gte: qStart, lt: tomorrowStart };
  }

  const yStart = easternIso(parts.year, 1, 1, 0, 0, 0, now);
  return { gte: yStart, lt: tomorrowStart };
}

function easternParts(date: Date): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
    second: get("second"),
  };
}

function easternOffsetString(reference: Date): string {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "longOffset" });
  const part = fmt.formatToParts(reference).find((p) => p.type === "timeZoneName")?.value ?? "GMT-05:00";
  return part.replace(/^GMT/, "") || "-05:00";
}

function easternIso(year: number, month: number, day: number, hour: number, minute: number, second: number, reference: Date): string {
  const offset = easternOffsetString(reference);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}${offset}`;
}

function addDaysEastern(year: number, month: number, day: number, deltaDays: number, reference: Date): string {
  const baseUtc = Date.UTC(year, month - 1, day, 12, 0, 0);
  const shifted = new Date(baseUtc + deltaDays * 86_400_000);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth() + 1;
  const d = shifted.getUTCDate();
  return easternIso(y, m, d, 0, 0, 0, reference);
}

function easternDayOfWeek(year: number, month: number, day: number): number {
  const utc = Date.UTC(year, month - 1, day, 12, 0, 0);
  return new Date(utc).getUTCDay();
}
