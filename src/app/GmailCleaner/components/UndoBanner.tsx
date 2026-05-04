import type { RecentAction } from "@/lib/dashboard/queries";
import { undoLastAction } from "../actions";

const KIND_LABELS: Record<string, string> = {
  "archive-bucket": "Archived",
  "unsubscribe-bucket": "Unsubscribed + archived",
};

export function UndoBanner({ action }: { action: RecentAction }) {
  const isUndone = !!action.undoneAt;
  const isPending = action.status === "pending";
  const label = KIND_LABELS[action.kind] ?? action.kind;
  const bucket = action.bucket ?? "messages";
  const minutesLeft = Math.max(
    0,
    Math.floor((action.expiresAt.getTime() - Date.now()) / 60_000),
  );

  return (
    <div
      className={`mb-8 flex items-center justify-between gap-4 rounded border px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] ${
        isUndone
          ? "border-white/20 bg-[#0d2b18] text-white/40"
          : "border-[#5b9bd5] bg-[#143d24] text-[#5b9bd5]"
      }`}
    >
      <span className="truncate">
        {isUndone ? "Undone · " : ""}
        {label} {action.messageCount.toLocaleString()} {bucket} message
        {action.messageCount === 1 ? "" : "s"}
        {isPending && !isUndone && " (running)"}
      </span>
      {!isUndone && !isPending && minutesLeft > 0 && (
        <form action={undoLastAction}>
          <input type="hidden" name="actionId" value={action.id} />
          <button
            type="submit"
            className="rounded border border-white/40 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 transition-colors hover:bg-white/10"
          >
            Undo · {minutesLeft >= 60 ? `${Math.floor(minutesLeft / 60)}h` : `${minutesLeft}m`} left
          </button>
        </form>
      )}
    </div>
  );
}
