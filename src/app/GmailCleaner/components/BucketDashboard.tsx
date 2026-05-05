import type { BucketSummary } from "@/lib/dashboard/queries";
import { archiveBucket, unsubscribeBucket, startSweep } from "../actions";

const BUCKET_DESCRIPTIONS: Record<string, string> = {
  PERSONAL: "Human-to-human correspondence",
  TRANSACTIONAL: "Receipts, orders, statements, calendar invites",
  NEWSLETTER: "Recurring editorial content you opted in to",
  PROMOTIONAL: "Sales, deals, marketing — drives the unsubscribe queue",
  NOTIFICATIONS: "Automated app/service alerts",
  JOB: "Recruiter outreach and hiring updates",
  UNCERTAIN: "Confidence below 0.75 — review manually",
};

const UNSUB_BUCKETS = new Set(["NEWSLETTER", "PROMOTIONAL"]);
const SAFE_BUCKETS = new Set(["PERSONAL", "UNCERTAIN"]);

export function BucketDashboard({
  summaries,
  totalSweepCost,
}: {
  summaries: BucketSummary[];
  totalSweepCost: number;
}) {
  const totalCount = summaries.reduce((s, b) => s + b.count, 0);
  const visible = summaries
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-4 border-b border-[#1a4a2e] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
          Sweep Complete · {totalCount.toLocaleString()} Messages Pending
        </p>
        <div className="flex items-center gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Sweep Cost · <span className="text-[#5b9bd5]">${totalSweepCost.toFixed(2)}</span>
          </p>
          <form action={startSweep}>
            <button
              type="submit"
              className="rounded border border-[#5b9bd5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#5b9bd5] transition-colors hover:bg-[#5b9bd5]/10"
            >
              Sweep New Messages
            </button>
          </form>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {visible.map((s) => (
            <BucketCard key={s.bucket} summary={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded border border-[#5b9bd5] bg-[#143d24] p-8 text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
        Inbox Cleaned
      </p>
      <p className="text-sm text-white/70">
        No messages pending action. Click <span className="font-bold text-[#5b9bd5]">Sweep New Messages</span> above to fetch and classify anything that has arrived since the last sweep.
      </p>
    </div>
  );
}

function BucketCard({ summary }: { summary: BucketSummary }) {
  const showUnsub = UNSUB_BUCKETS.has(summary.bucket);
  const isSafe = SAFE_BUCKETS.has(summary.bucket);

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
        <div className="mb-4">
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

      {!isSafe && (
        <div className="mt-4 flex flex-wrap gap-3 border-t border-[#1a4a2e] pt-4">
          <form action={archiveBucket}>
            <input type="hidden" name="bucket" value={summary.bucket} />
            <button
              type="submit"
              className="rounded border border-[#5b9bd5] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#5b9bd5] transition-colors hover:bg-[#5b9bd5]/10"
            >
              Archive {summary.count.toLocaleString()}
            </button>
          </form>
          {showUnsub && (
            <form action={unsubscribeBucket}>
              <input type="hidden" name="bucket" value={summary.bucket} />
              <button
                type="submit"
                className="rounded border border-yellow-500/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-300 transition-colors hover:bg-yellow-500/10"
              >
                Unsubscribe All & Archive
              </button>
            </form>
          )}
        </div>
      )}
      {isSafe && (
        <p className="mt-4 border-t border-[#1a4a2e] pt-4 text-[10px] uppercase tracking-[0.25em] text-white/30">
          Manual review only — no bulk actions for this bucket
        </p>
      )}
    </div>
  );
}
