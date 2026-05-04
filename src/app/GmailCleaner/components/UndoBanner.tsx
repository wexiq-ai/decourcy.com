import type { RecentAction } from "@/lib/dashboard/queries";
import { undoLastAction } from "../actions";

const KIND_LABELS: Record<string, string> = {
  "archive-bucket": "Archive",
  "unsubscribe-bucket": "Unsubscribe + archive",
};

export function UndoBanner({ actions }: { actions: RecentAction[] }) {
  if (actions.length === 0) return null;
  return (
    <div className="mb-8 space-y-2">
      {actions.map((a) => (
        <ActionRow key={a.id} action={a} />
      ))}
    </div>
  );
}

function ActionRow({ action }: { action: RecentAction }) {
  const isUndone = !!action.undoneAt;
  const isCompleted = action.phase === "completed";
  const isPending = !isUndone && !isCompleted;

  const label = KIND_LABELS[action.kind] ?? action.kind;
  const bucket = action.bucket ?? "messages";
  const minutesLeft = Math.max(
    0,
    Math.floor((action.expiresAt.getTime() - Date.now()) / 60_000),
  );
  const elapsedSec = Math.max(
    1,
    Math.floor((Date.now() - action.createdAt.getTime()) / 1000),
  );

  const tone = isUndone
    ? "border-white/20 bg-[#0d2b18] text-white/40"
    : isPending
      ? "border-yellow-500/40 bg-yellow-950/30 text-yellow-200"
      : "border-[#5b9bd5] bg-[#143d24] text-[#5b9bd5]";

  return (
    <div className={`rounded border px-5 py-3 ${tone}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-[0.2em]">
            {isUndone && "Undone · "}
            {label} · {bucket}
            {isCompleted &&
              ` · ${action.messageCount.toLocaleString()} archived`}
          </p>
          {isPending && (
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-yellow-100/70">
              {phaseDescription(action, elapsedSec)}
            </p>
          )}
        </div>
        {isCompleted && !isUndone && minutesLeft > 0 && (
          <form action={undoLastAction}>
            <input type="hidden" name="actionId" value={action.id} />
            <button
              type="submit"
              className="shrink-0 rounded border border-white/40 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 transition-colors hover:bg-white/10"
            >
              Undo · {minutesLeft >= 60 ? `${Math.floor(minutesLeft / 60)}h` : `${minutesLeft}m`} left
            </button>
          </form>
        )}
      </div>
      {isPending && <ProgressBar action={action} />}
    </div>
  );
}

function ProgressBar({ action }: { action: RecentAction }) {
  let pct = 0;
  if (action.phase === "unsubscribing" && action.sendersTotal) {
    pct = ((action.sendersProcessed ?? 0) / action.sendersTotal) * 100;
  } else if (action.phase === "archiving" && action.messageCount > 0) {
    pct = (action.archivedSoFar / action.messageCount) * 100;
  } else if (action.phase === "queued") {
    pct = 0;
  }
  return (
    <div className="mt-2 h-1 w-full overflow-hidden rounded bg-black/30">
      <div
        className="h-full bg-yellow-300 transition-all"
        style={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

function phaseDescription(action: RecentAction, elapsedSec: number): string {
  const elapsed = formatElapsed(elapsedSec);

  if (action.phase === "queued") {
    return `Waiting for prior action to finish · ${elapsed} elapsed`;
  }

  if (action.phase === "unsubscribing") {
    const done = action.sendersProcessed ?? 0;
    const total = action.sendersTotal ?? 0;
    if (total === 0) return `Preparing unsubscribe queue · ${elapsed} elapsed`;
    const eta = etaFor(done, total, elapsedSec);
    return `Unsubscribing senders · ${done.toLocaleString()} of ${total.toLocaleString()} done · ${elapsed} elapsed${eta ? ` · ~${eta} remaining` : ""}`;
  }

  if (action.phase === "archiving") {
    const done = action.archivedSoFar;
    const total = action.messageCount;
    if (total === 0) return `Preparing archive · ${elapsed} elapsed`;
    const eta = etaFor(done, total, elapsedSec);
    return `Archiving messages · ${done.toLocaleString()} of ${total.toLocaleString()} done · ${elapsed} elapsed${eta ? ` · ~${eta} remaining` : ""}`;
  }

  return `${elapsed} elapsed`;
}

function formatElapsed(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  return remSec > 0 ? `${min}m ${remSec}s` : `${min}m`;
}

function etaFor(done: number, total: number, elapsedSec: number): string | null {
  if (done <= 0 || total <= done) return null;
  const ratePerSec = done / elapsedSec;
  if (ratePerSec <= 0) return null;
  const remainingSec = Math.ceil((total - done) / ratePerSec);
  if (remainingSec < 60) return `${remainingSec}s`;
  const min = Math.ceil(remainingSec / 60);
  return `${min}m`;
}
