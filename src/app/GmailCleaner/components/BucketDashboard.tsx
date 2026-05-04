import type { BucketSummary } from "@/lib/dashboard/queries";

const BUCKET_DESCRIPTIONS: Record<string, string> = {
  PERSONAL: "Human-to-human correspondence",
  TRANSACTIONAL: "Receipts, orders, statements, calendar invites",
  NEWSLETTER: "Recurring editorial content you opted in to",
  PROMOTIONAL: "Sales, deals, marketing — drives the unsubscribe queue",
  NOTIFICATIONS: "Automated app/service alerts",
  JOB: "Recruiter outreach and hiring updates",
  UNCERTAIN: "Confidence below 0.75 — review manually",
};

export function BucketDashboard({
  summaries,
  totalSweepCost,
}: {
  summaries: BucketSummary[];
  totalSweepCost: number;
}) {
  const totalCount = summaries.reduce((s, b) => s + b.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-[#1a4a2e] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
          Sweep Complete · {totalCount.toLocaleString()} Messages Categorized
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Sweep Cost · <span className="text-[#5b9bd5]">${totalSweepCost.toFixed(2)}</span>
        </p>
      </div>

      <div className="space-y-4">
        {summaries
          .filter((s) => s.count > 0)
          .sort((a, b) => b.count - a.count)
          .map((s) => (
            <BucketCard key={s.bucket} summary={s} />
          ))}
      </div>
    </div>
  );
}

function BucketCard({ summary }: { summary: BucketSummary }) {
  return (
    <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-6">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">
          {summary.bucket}
        </p>
        <p className="text-2xl font-bold text-[#5b9bd5]">
          {summary.count.toLocaleString()}
        </p>
      </div>
      <p className="mb-4 text-xs text-white/50">
        {BUCKET_DESCRIPTIONS[summary.bucket]}
      </p>

      {summary.topSenders.length > 0 && (
        <div className="mb-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
            Top Senders
          </p>
          <ul className="space-y-1">
            {summary.topSenders.map((s) => (
              <li
                key={s.email}
                className="flex justify-between gap-4 text-xs text-white/70"
              >
                <span className="truncate">{s.email}</span>
                <span className="text-white/40">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.sampleSubjects.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
            Recent Subjects
          </p>
          <ul className="space-y-1">
            {summary.sampleSubjects.map((subj, i) => (
              <li key={i} className="truncate text-xs text-white/60">
                {subj}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
