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
  const isCompleted = action.status === "completed";
  const isPending = !isUndone && !isCompleted;
  const label = KIND_LABELS[action.kind] ?? action.kind;
  const bucket = action.bucket ?? "messages";
  const minutesLeft = Math.max(
    0,
    Math.floor((action.expiresAt.getTime() - Date.now()) / 60_000),
  );
  const pct =
    action.messageCount > 0
      ? Math.min(100, (action.archivedSoFar / action.messageCount) * 100)
      : 0;

  const tone = isUndone
    ? "border-white/20 bg-[#0d2b18] text-white/40"
    : isPending
      ? "border-yellow-500/40 bg-yellow-950/30 text-yellow-200"
      : "border-[#5b9bd5] bg-[#143d24] text-[#5b9bd5]";

  return (
    <div className={`rounded border px-5 py-3 ${tone}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="truncate text-xs font-bold uppercase tracking-[0.2em]">
          {isUndone && "Undone · "}
          {label} · {bucket} · {action.archivedSoFar.toLocaleString()} /{" "}
          {action.messageCount.toLocaleString()}
          {isPending && " (running)"}
        </span>
        {!isUndone && !isPending && minutesLeft > 0 && (
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
      {isPending && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded bg-black/30">
          <div
            className="h-full bg-yellow-300 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
