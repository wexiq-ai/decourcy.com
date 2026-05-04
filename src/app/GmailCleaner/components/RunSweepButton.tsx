import { startSweep } from "../actions";

export function RunSweepButton({
  inboxUnread,
  isResume = false,
  remaining,
}: {
  inboxUnread: number;
  isResume?: boolean;
  remaining?: number;
}) {
  const messagesToProcess = isResume && remaining !== undefined ? remaining : inboxUnread;
  const estHaiku = (messagesToProcess * 0.0003).toFixed(2);
  const estSonnet = (messagesToProcess * 0.0006 * 0.2).toFixed(2);
  const estTotal = (Number(estHaiku) + Number(estSonnet)).toFixed(2);

  return (
    <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-8">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
        {isResume ? "Resume Sweep" : "Initial Sweep"}
      </p>
      <p className="mb-6 text-sm leading-relaxed text-white/80">
        {isResume ? (
          <>
            Resume the sweep — already-fetched messages are skipped, so we only
            process the remaining{" "}
            <span className="font-bold text-white">
              {messagesToProcess.toLocaleString()}
            </span>{" "}
            unread. Each Gmail and Claude call retries with exponential backoff
            on rate limits, so transient quota hits self-heal.
          </>
        ) : (
          <>
            Fetch metadata for all {inboxUnread.toLocaleString()} unread inbox
            messages, group by sender, then classify each pattern with Haiku.
            Anything Haiku flags below 0.75 confidence gets re-classified with
            Sonnet. Read-only — no archiving or unsubscribing yet.
          </>
        )}
      </p>
      <dl className="mb-6 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
        <Estimate label="Haiku Pass" value={`~$${estHaiku}`} />
        <Estimate label="Sonnet Re-check (~20%)" value={`~$${estSonnet}`} />
        <Estimate label="Estimated Total" value={`~$${estTotal}`} highlight />
      </dl>
      <form action={startSweep}>
        <button
          type="submit"
          className="rounded border border-[#5b9bd5] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5b9bd5] transition-colors hover:bg-[#5b9bd5]/10"
        >
          {isResume ? "Resume Sweep" : "Run Sweep"}
        </button>
      </form>
    </div>
  );
}

function Estimate({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm font-bold ${
          highlight ? "text-[#5b9bd5]" : "text-white/80"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
