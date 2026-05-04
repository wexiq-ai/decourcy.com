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
}: {
  sweep: SweepRun;
  costSoFar: number;
}) {
  const total = sweep.totalMessages ?? 0;
  const fetchPct = total > 0 ? (sweep.fetchedCount / total) * 100 : 0;
  const classifyPct =
    total > 0 ? (sweep.classifiedCount / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <PollSweep intervalMs={5000} />
      <div className="rounded border border-[#5b9bd5] bg-[#143d24] p-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
            Sweep Running — {STAGE_LABELS[sweep.status] ?? sweep.status}
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Cost so far · <span className="text-[#5b9bd5]">${costSoFar.toFixed(4)}</span>
          </p>
        </div>

        <ProgressBar
          label="Metadata Fetched"
          current={sweep.fetchedCount}
          total={total}
          pct={fetchPct}
        />
        <div className="mt-6">
          <ProgressBar
            label="Classified"
            current={sweep.classifiedCount}
            total={total}
            pct={classifyPct}
          />
        </div>
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
