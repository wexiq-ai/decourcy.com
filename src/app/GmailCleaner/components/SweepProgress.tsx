import { PollSweep } from "./PollSweep";
import type { SweepRun } from "@/lib/dashboard/queries";

const STAGE_LABELS: Record<string, string> = {
  pending: "Queued",
  fetching: "Fetching Metadata",
  classifying: "Classifying with Haiku",
  "sonnet-recheck": "Sonnet Re-check",
  done: "Complete",
  failed: "Failed",
};

export function SweepProgress({
  sweep,
  costSoFar,
  dbFetched,
  dbClassified,
  inboxUnreadEstimate,
}: {
  sweep: SweepRun;
  costSoFar: number;
  dbFetched: number;
  dbClassified: number;
  inboxUnreadEstimate: number;
}) {
  // For a re-sweep that's just starting, sweep.totalMessages is still null
  // and sweep.fetchedCount is 0, but the DB already has 33k messages from
  // the prior sweep. We treat this as "Initializing" rather than showing a
  // misleadingly-full progress bar.
  const initializing =
    sweep.status === "pending" &&
    sweep.totalMessages === null &&
    sweep.fetchedCount === 0;

  // For an active sweep, prefer the per-sweep counters over cumulative DB
  // counts. Only fall back to dbFetched if the sweep_runs row appears
  // stuck (matches the pre-deploy memoization edge case).
  const isStaleCounter =
    !initializing && sweep.fetchedCount === 0 && dbFetched > 0;
  const fetched = isStaleCounter ? dbFetched : sweep.fetchedCount;
  const classified = isStaleCounter ? dbClassified : sweep.classifiedCount;
  const total = sweep.totalMessages ?? Math.max(fetched, inboxUnreadEstimate);

  const derivedStage = initializing
    ? "Initializing — Checking for New Messages"
    : classified > 0
      ? "Classifying with Haiku"
      : fetched > 0
        ? "Fetching Metadata"
        : (STAGE_LABELS[sweep.status] ?? sweep.status);

  const fetchPct = total > 0 ? (fetched / total) * 100 : 0;
  const classifyPct = total > 0 ? (classified / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <PollSweep intervalMs={5000} />
      <div className="rounded border border-[#5b9bd5] bg-[#143d24] p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
            Sweep Running — {derivedStage}
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Cost so far · <span className="text-[#5b9bd5]">${costSoFar.toFixed(4)}</span>
          </p>
        </div>

        {initializing ? (
          <p className="text-sm text-white/70">
            Pulling the current unread inbox list from Gmail and comparing
            against the {dbFetched.toLocaleString()} messages already
            classified. Anything new will be fetched and routed to a bucket.
          </p>
        ) : (
          <>
            <ProgressBar
              label="Metadata Fetched"
              current={fetched}
              total={total}
              pct={fetchPct}
            />
            <div className="mt-6">
              <ProgressBar
                label="Classified"
                current={classified}
                total={total}
                pct={classifyPct}
              />
            </div>
          </>
        )}
        {sweep.status === "sonnet-recheck" && (
          <p className="mt-6 text-xs text-white/60">
            Sonnet re-checking {sweep.sonnetRecheckCount.toLocaleString()}{" "}
            low-confidence senders…
          </p>
        )}
        <p className="mt-6 text-xs text-white/40">
          Page auto-refreshes every 5 seconds while the sweep is running.
        </p>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  current,
  total,
  pct,
}: {
  label: string;
  current: number;
  total: number;
  pct: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-xs uppercase tracking-[0.2em]">
        <span className="font-bold text-white/60">{label}</span>
        <span className="font-bold text-white">
          {current.toLocaleString()}{" "}
          <span className="text-white/40">/ {total.toLocaleString()}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-[#0d2b18]">
        <div
          className="h-full bg-[#5b9bd5] transition-all"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}
