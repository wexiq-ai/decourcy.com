"use client";

type Bucket = {
  key: string | number;
  doc_count?: number;
  metrics?: Record<string, number | null>;
  metadata?: Record<string, unknown>;
};

export type ReportData = {
  range: string;
  gte: string;
  lt: string;
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

export function Leaderboard({ data }: { data: ReportData | null }) {
  if (!data) return null;

  const summary = data.data.groups?.summary?.metrics ?? {};
  const buckets = data.data.groups?.byAgent?.buckets ?? [];

  const totalSales = numeric(summary["totalSales"]);
  const totalSpend = numeric(summary["totalBillableSum"]);
  const cps = totalSales > 0 ? totalSpend / totalSales : null;

  return (
    <div className="flex flex-col gap-8">
      <KpiRow totalSales={totalSales} totalSpend={totalSpend} cps={cps} />
      <Top10 buckets={buckets} />
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

function Top10({ buckets }: { buckets: Bucket[] }) {
  if (buckets.length === 0) {
    return (
      <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] py-16 text-center text-white/50 tracking-[0.05em]">
        No sales yet in this period.
      </div>
    );
  }

  return (
    <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] overflow-hidden">
      <div className="grid grid-cols-[3rem_1fr_8rem_8rem_8rem] gap-4 px-6 py-3 border-b border-[#eeb54e]/15 text-[0.625rem] tracking-[0.22em] uppercase text-white/55 font-medium">
        <div>Rank</div>
        <div>Agent</div>
        <div className="text-right">Sales</div>
        <div className="text-right">Spend</div>
        <div className="text-right">CPS</div>
      </div>
      {buckets.map((b, i) => (
        <Row key={String(b.key)} bucket={b} rank={i + 1} isTop={i === 0} />
      ))}
    </div>
  );
}

function Row({ bucket, rank, isTop }: { bucket: Bucket; rank: number; isTop: boolean }) {
  const name = displayName(bucket);
  const sales = numeric(bucket.metrics?.totalSales);
  const spend = numeric(bucket.metrics?.totalBillableSum);
  const cps = sales > 0 ? spend / sales : null;

  // Top agent: 20% larger
  const baseText = isTop ? "text-xl" : "text-base";
  const baseNum = isTop ? "text-xl" : "text-base";

  return (
    <div
      className={`grid grid-cols-[3rem_1fr_8rem_8rem_8rem] gap-4 px-6 py-4 items-center border-b border-white/[0.04] last:border-b-0 ${
        isTop ? "bg-[#eeb54e]/[0.04]" : ""
      }`}
    >
      <div className="flex items-center justify-start">
        <RankBadge rank={rank} />
      </div>
      <div className={`font-medium tracking-[0.02em] ${baseText} ${isTop ? "text-[#eeb54e]" : "text-white"}`}>
        {name}
      </div>
      <div className={`text-right tabular-nums font-semibold ${baseNum} ${isTop ? "text-[#eeb54e]" : "text-white"}`}>
        {formatNumber(sales)}
      </div>
      <div className={`text-right tabular-nums ${baseNum} text-white/70`}>{formatCurrency(spend)}</div>
      <div className={`text-right tabular-nums ${baseNum} text-white/70`}>{cps === null ? "—" : formatCurrency(cps)}</div>
    </div>
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

function displayName(b: Bucket): string {
  const md = b.metadata ?? {};
  const first = pickString(md, ["participantList.firstName"]);
  const last = pickString(md, ["participantList.lastName"]);
  if (first || last) return `${first ?? ""} ${last ?? ""}`.trim();
  const full = pickString(md, [
    "participantList.fullName",
    "participantList.displayName",
    "participantList.name",
  ]);
  if (full) return full;
  const email = pickString(md, ["participantList.email"]);
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
