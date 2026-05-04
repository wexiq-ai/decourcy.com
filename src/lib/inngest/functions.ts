import { inngest } from "./client";
import { sweepRun } from "./sweep";
import { bulkArchive, bulkUnsubscribe, undoAction } from "./actions";

export const ping = inngest.createFunction(
  {
    id: "gmailcleaner-ping",
    triggers: [{ event: "gmailcleaner/test.ping" }],
  },
  async ({ event, step }) => {
    await step.sleep("brief-pause", "1s");
    const note =
      event.data && typeof event.data === "object" && "note" in event.data
        ? String((event.data as { note?: unknown }).note ?? "no note")
        : "no note";
    return {
      message: `pong from gmailcleaner: ${note}`,
      receivedAt: new Date().toISOString(),
    };
  },
);

export const functions = [ping, sweepRun, bulkArchive, bulkUnsubscribe, undoAction];
