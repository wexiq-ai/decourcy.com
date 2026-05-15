"use client";

import { useMemo, useState } from "react";

type Bucket = {
  key: string | number;
  doc_count?: number;
  metrics?: Record<string, number | null>;
  metadata?: Record<string, unknown>;
};

export type ReportData = {
  range: string;
  filter?: unknown;
  data: {
    groups?: Record<
      string,
      {
        metrics?: Record<string, number | null>;
        buckets?: Bucket[];
      }
    >;
  };
};

// CPS below this threshold is flagged for further investigation —
// unusually low cost-per-sale may indicate data issues, misattribution,
// or an outlier worth a closer look.
const CPS_INVESTIGATION_THRESHOLD = 50;

type SortColumn = "rank" | "agent" | "sales" | "spend" | "cps";
type SortDirection = "asc" | "desc";
type SortState = { column: SortColumn; direction: SortDirection };

const DEFAULT_SORT: SortState = { column: "rank", direction: "asc" };

type EnrichedRow = {
  bucket: Bucket;
  salesRank: number;
  name: string;
  sales: number;
  spend: number;
  cps: number | null;
};

export function Leaderboard({ data }: { data: ReportData | null }) {
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  if (!data) return null;

  const summary = data.data.groups?.summary?.metrics ?? {};
  const buckets = data.data.groups?.byAgent?.buckets ?? [];

  const totalSales = numeric(summary["totalSales"]);
  const totalSpend = numeric(summary["totalBillableSum"]);
  const cps = totalSales > 0 ? totalSpend / totalSales : null;

  return (
    <div className="flex flex-col gap-8">
      <KpiRow totalSales={totalSales} totalSpend={totalSpend} cps={cps} />
      <AgentTable buckets={buckets} sort={sort} onSort={setSort} />
    </div>
  );
}

function KpiRow({ totalSales, totalSpend, cps }: { totalSales: number; totalSpend: number; cps: number | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Kpi label="Total Sales" value={formatNumber(totalSales)} accent />
      <Kpi label="Total Spend" value={formatCurrency(totalSpend)} />
      <Kpi label="Cost Per Sale" value={cps === null ? "—" : formatCurrency(cps)} />
    </div>
  );
}

function Kpi({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] px-6 py-5 flex flex-col gap-2">
      <div className="text-[0.625rem] tracking-[0.22em] uppercase text-white/55 font-medium">{label}</div>
      <div className={`text-3xl font-semibold tabular-nums ${accent ? "text-[#eeb54e]" : "text-white"}`}>{value}</div>
    </div>
  );
}

function AgentTable({
  buckets,
  sort,
  onSort,
}: {
  buckets: Bucket[];
  sort: SortState;
  onSort: (next: SortState) => void;
}) {
  // Buckets come pre-sorted by sales desc from the server. Their position in
  // that input order IS each agent's intrinsic sales rank — that's what drives
  // the medals, regardless of the current display sort.
  const rows: EnrichedRow[] = useMemo(
    () =>
      buckets.map((b, i) => {
        const sales = numeric(b.metrics?.totalSales);
        const spend = numeric(b.metrics?.totalBillableSum);
        return {
          bucket: b,
          salesRank: i + 1,
          name: displayName(b),
          sales,
          spend,
          cps: sales > 0 ? spend / sales : null,
        };
      }),
    [buckets]
  );

  const sortedRows = useMemo(() => sortRows(rows, sort), [rows, sort]);
  const flagCount = sortedRows.filter((r) => isFlagged(r.cps)).length;
  const isDefaultSort = sort.column === "rank" && sort.direction === "asc";

  if (buckets.length === 0) {
    return (
      <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] py-16 text-center text-white/50 tracking-[0.05em]">
        No sales yet in this period.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {flagCount > 0 && <FlagLegend count={flagCount} />}
      <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] overflow-hidden">
        <div className="grid grid-cols-[7rem_1fr_7rem_8rem_8rem] gap-4 px-6 py-3 border-b border-[#eeb54e]/15 text-[0.625rem] tracking-[0.22em] uppercase text-white/55 font-medium">
          <HeaderCell column="rank" label="Rank by Total Sales" sort={sort} onSort={onSort} align="left" />
          <HeaderCell column="agent" label="Agent" sort={sort} onSort={onSort} align="left" />
          <HeaderCell column="sales" label="Sales" sort={sort} onSort={onSort} align="right" />
          <HeaderCell column="spend" label="Spend" sort={sort} onSort={onSort} align="right" />
          <HeaderCell column="cps" label="CPS" sort={sort} onSort={onSort} align="right" />
        </div>
        {sortedRows.map((row, visualIndex) => (
          <Row
            key={String(row.bucket.key)}
            row={row}
            isTopVisual={visualIndex === 0 && isDefaultSort}
          />
        ))}
      </div>
    </div>
  );
}

function FlagLegend({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 text-[0.6875rem] text-[#eeb54e]/85">
      <FlagIcon />
      <span className="tracking-[0.04em]">
        {count} {count === 1 ? "agent has" : "agents have"} CPS under{" "}
        {formatCurrency(CPS_INVESTIGATION_THRESHOLD)} — investigate.
      </span>
    </div>
  );
}

function HeaderCell({
  column,
  label,
  sort,
  onSort,
  align,
}: {
  column: SortColumn;
  label: string;
  sort: SortState;
  onSort: (next: SortState) => void;
  align: "left" | "right";
}) {
  const isActive = sort.column === column;
  const handleClick = () => {
    if (isActive) {
      onSort({ column, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSort({ column, direction: defaultDirectionFor(column) });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 text-inherit uppercase tracking-[0.22em] font-medium transition-colors hover:text-[#eeb54e] ${
        align === "right" ? "justify-end" : "justify-start"
      } ${isActive ? "text-[#eeb54e]" : ""}`}
      title={`Sort by ${label}`}
    >
      <span>{label}</span>
      <SortArrow active={isActive} direction={sort.direction} />
    </button>
  );
}

function SortArrow({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 12 12"
      className={active ? "opacity-100" : "opacity-25"}
      aria-hidden
    >
      {direction === "asc" ? (
        <polygon points="6,2 10,8 2,8" fill="currentColor" />
      ) : (
        <polygon points="6,10 10,4 2,4" fill="currentColor" />
      )}
    </svg>
  );
}

function Row({ row, isTopVisual }: { row: EnrichedRow; isTopVisual: boolean }) {
  const flagged = isFlagged(row.cps);

  // Top agent (sales rank #1) gets a 20% font bump — but only when the table
  // is in its canonical sales-rank order so the bumped row is always visually
  // on top.
  const enlarged = isTopVisual && row.salesRank === 1;
  const baseText = enlarged ? "text-xl" : "text-base";
  const baseNum = enlarged ? "text-xl" : "text-base";

  return (
    <div
      className={`grid grid-cols-[7rem_1fr_7rem_8rem_8rem] gap-4 px-6 py-4 items-center border-b border-white/[0.04] last:border-b-0 ${
        enlarged ? "bg-[#eeb54e]/[0.04]" : ""
      } ${flagged ? "ring-1 ring-inset ring-[#eeb54e]/15" : ""}`}
    >
      <div className="flex items-center justify-start">
        <RankBadge rank={row.salesRank} />
      </div>
      <div className={`font-medium tracking-[0.02em] ${baseText} ${enlarged ? "text-[#eeb54e]" : "text-white"}`}>
        {row.name}
      </div>
      <div className={`text-right tabular-nums font-semibold ${baseNum} ${enlarged ? "text-[#eeb54e]" : "text-white"}`}>
        {formatNumber(row.sales)}
      </div>
      <div className={`text-right tabular-nums ${baseNum} text-white/70`}>{formatCurrency(row.spend)}</div>
      <div className={`text-right tabular-nums ${baseNum} ${flagged ? "text-[#eeb54e]" : "text-white/70"}`}>
        <span className="inline-flex items-center justify-end gap-1.5">
          {row.cps === null ? "—" : formatCurrency(row.cps)}
          {flagged && <FlagIcon title={`CPS below ${formatCurrency(CPS_INVESTIGATION_THRESHOLD)} — investigate`} />}
        </span>
      </div>
    </div>
  );
}

function FlagIcon({ title }: { title?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label={title}>
      {title && <title>{title}</title>}
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Medal color="#eeb54e" label="1" title="Gold" />;
  if (rank === 2) return <Medal color="#c0c0c0" label="2" title="Silver" />;
  if (rank === 3) return <Medal color="#cd7f32" label="3" title="Bronze" />;
  return <div className="text-white/40 text-sm tabular-nums w-8 text-center">{rank}</div>;
}

function Medal({ color, label, title }: { color: string; label: string; title: string }) {
  return (
    <div className="relative flex items-center justify-center" title={title}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-label={title}>
        <polygon
          points="16,2 19.6,11.3 29.6,12 21.8,18.5 24.4,28 16,22.7 7.6,28 10.2,18.5 2.4,12 12.4,11.3"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#231f20" fontFamily="Poppins, sans-serif">
          {label}
        </text>
      </svg>
    </div>
  );
}

function sortRows(rows: EnrichedRow[], { column, direction }: SortState): EnrichedRow[] {
  const sign = direction === "asc" ? 1 : -1;
  const copy = [...rows];

  if (column === "rank") {
    copy.sort((a, b) => sign * (a.salesRank - b.salesRank));
    return copy;
  }

  if (column === "agent") {
    copy.sort((a, b) => sign * a.name.localeCompare(b.name, "en-US", { sensitivity: "base" }));
    return copy;
  }

  const accessor: (r: EnrichedRow) => number | null =
    column === "sales" ? (r) => r.sales : column === "spend" ? (r) => r.spend : (r) => r.cps;

  copy.sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    // Nulls always sort to the bottom regardless of direction — agents with
    // no sales (and therefore no CPS) shouldn't crowd the top of any view.
    if (av === null && bv === null) return a.salesRank - b.salesRank;
    if (av === null) return 1;
    if (bv === null) return -1;
    if (av === bv) return a.salesRank - b.salesRank;
    return sign * (av - bv);
  });
  return copy;
}

function defaultDirectionFor(column: SortColumn): SortDirection {
  // Numerical columns default to descending (biggest first) — what people
  // usually want from a leaderboard. Names default ascending (A→Z). Rank
  // default ascending puts the gold medalist on top.
  if (column === "agent" || column === "rank") return "asc";
  return "desc";
}

function isFlagged(cps: number | null): boolean {
  return cps !== null && cps < CPS_INVESTIGATION_THRESHOLD;
}

function displayName(b: Bucket): string {
  const md = b.metadata ?? {};
  const first = pickString(md, ["agent.firstName", "participantList.firstName"]);
  const last = pickString(md, ["agent.lastName", "participantList.lastName"]);
  if (first || last) return `${first ?? ""} ${last ?? ""}`.trim();
  const email = pickString(md, ["agent.email", "participantList.email"]);
  if (email) return email;
  return `Agent ${String(b.key).slice(0, 8)}`;
}

function pickString(md: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = md[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0];
  }
  return null;
}

function numeric(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}
