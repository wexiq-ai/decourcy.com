import { eq, sql, and, isNull, inArray } from "drizzle-orm";
import { inngest } from "./client";
import { db, schema } from "@/lib/db/client";
import { getGmailClient } from "@/lib/gmail/client";
import {
  batchArchive,
  batchRestoreToInbox,
  unsubscribeFromSenders,
  deleteFilters,
  type UnsubResult,
} from "@/lib/gmail/actions";

const ARCHIVE_BATCH_SIZE = 1000;
const UNSUB_BATCH_SIZE = 50;

type BulkArchiveEvent = { data: { actionId: string } };

export const bulkArchive = inngest.createFunction(
  {
    id: "gmailcleaner-bulk-archive",
    concurrency: { limit: 1 },
    retries: 2,
    triggers: [{ event: "gmailcleaner/action.archive" }],
  },
  async ({ event, step }) => {
    const { actionId } = (event as unknown as BulkArchiveEvent).data;

    const ids = await step.run("load-message-ids", async () => {
      const rows = await db
        .select()
        .from(schema.actions)
        .where(eq(schema.actions.id, actionId))
        .limit(1);
      return rows[0]?.messageIds ?? [];
    });

    if (ids.length === 0) {
      await step.run("mark-empty", async () => {
        await db
          .update(schema.actions)
          .set({
            scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({ status: "completed", processed: 0 })}::jsonb`,
          })
          .where(eq(schema.actions.id, actionId));
      });
      return { archived: 0 };
    }

    const client = await step.run("get-client", async () => {
      const c = await getGmailClient();
      if (!c) throw new Error("No Gmail account");
      return { account: c.account.email };
    });

    await step.run("set-archive-phase", async () => {
      await db
        .update(schema.actions)
        .set({
          scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({
            phase: "archiving",
            archiveTotal: ids.length,
            archivedSoFar: 0,
          })}::jsonb`,
        })
        .where(eq(schema.actions.id, actionId));
    });

    let archived = 0;
    for (let i = 0; i < ids.length; i += ARCHIVE_BATCH_SIZE) {
      const batch = ids.slice(i, i + ARCHIVE_BATCH_SIZE);
      const count = await step.run(`archive-${i}`, async () => {
        const c = await getGmailClient();
        if (!c) throw new Error("No Gmail account");
        await batchArchive(c.gmail, batch);
        await db
          .update(schema.messages)
          .set({ actedOnAt: new Date(), actionTaken: "archived" })
          .where(inArray(schema.messages.gmailId, batch));
        const newTotal = i + batch.length;
        await db
          .update(schema.actions)
          .set({
            scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({ archivedSoFar: newTotal })}::jsonb`,
          })
          .where(eq(schema.actions.id, actionId));
        return batch.length;
      });
      archived += count;
    }

    await step.run("finalize", async () => {
      await db
        .update(schema.actions)
        .set({
          scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({ status: "completed", processed: archived, account: client.account })}::jsonb`,
        })
        .where(eq(schema.actions.id, actionId));
    });

    return { archived };
  },
);

type BulkUnsubEvent = {
  data: {
    actionId: string;
    archiveExisting: boolean;
  };
};

export const bulkUnsubscribe = inngest.createFunction(
  {
    id: "gmailcleaner-bulk-unsubscribe",
    concurrency: { limit: 1 },
    retries: 2,
    triggers: [{ event: "gmailcleaner/action.unsubscribe" }],
  },
  async ({ event, step }) => {
    const { actionId, archiveExisting } = (event as unknown as BulkUnsubEvent)
      .data;

    const action = await step.run("load-action", async () => {
      const rows = await db
        .select()
        .from(schema.actions)
        .where(eq(schema.actions.id, actionId))
        .limit(1);
      return rows[0];
    });

    if (!action) return { unsubscribed: 0 };

    const senders = (action.scopeJson?.senders as string[]) ?? [];
    const myEmail = (action.scopeJson?.account as string) ?? "";

    await step.run("set-unsub-phase", async () => {
      await db
        .update(schema.actions)
        .set({
          scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({
            phase: "unsubscribing",
            sendersTotal: senders.length,
            sendersProcessed: 0,
          })}::jsonb`,
        })
        .where(eq(schema.actions.id, actionId));
    });

    const allResults: UnsubResult[] = [];
    for (let i = 0; i < senders.length; i += UNSUB_BATCH_SIZE) {
      const batch = senders.slice(i, i + UNSUB_BATCH_SIZE);
      const results = await step.run(`unsub-${i}`, async () => {
        const c = await getGmailClient();
        if (!c) throw new Error("No Gmail account");

        const senderRows = await db
          .selectDistinctOn([schema.messages.senderEmail])
          .from(schema.messages)
          .where(inArray(schema.messages.senderEmail, batch))
          .orderBy(schema.messages.senderEmail);

        const senderInputs = batch.map((email) => {
          const row = senderRows.find((r) => r.senderEmail === email);
          return {
            email,
            listUnsubscribeHeader: row?.listUnsubscribeHeader ?? null,
          };
        });

        const r = await unsubscribeFromSenders(c.gmail, senderInputs, myEmail);
        await db
          .update(schema.actions)
          .set({
            scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({ sendersProcessed: i + batch.length })}::jsonb`,
          })
          .where(eq(schema.actions.id, actionId));
        return r;
      });
      allResults.push(...results);
    }

    if (archiveExisting && action.messageIds && action.messageIds.length > 0) {
      const ids = action.messageIds;
      await step.run("set-archive-phase-after-unsub", async () => {
        await db
          .update(schema.actions)
          .set({
            scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({
              phase: "archiving",
              archiveTotal: ids.length,
              archivedSoFar: 0,
            })}::jsonb`,
          })
          .where(eq(schema.actions.id, actionId));
      });
      for (let i = 0; i < ids.length; i += ARCHIVE_BATCH_SIZE) {
        const batch = ids.slice(i, i + ARCHIVE_BATCH_SIZE);
        await step.run(`archive-existing-${i}`, async () => {
          const c = await getGmailClient();
          if (!c) throw new Error("No Gmail account");
          await batchArchive(c.gmail, batch);
          await db
            .update(schema.messages)
            .set({ actedOnAt: new Date(), actionTaken: "unsubscribed" })
            .where(inArray(schema.messages.gmailId, batch));
          const newTotal = i + batch.length;
          await db
            .update(schema.actions)
            .set({
              scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({ archivedSoFar: newTotal })}::jsonb`,
            })
            .where(eq(schema.actions.id, actionId));
        });
      }
    }

    await step.run("finalize", async () => {
      const filterIds = allResults
        .map((r) => r.filterId)
        .filter((id): id is string => Boolean(id));
      const succeeded = allResults.filter((r) => r.ok).length;

      await db
        .update(schema.actions)
        .set({
          scopeJson: sql`coalesce(scope_json, '{}'::jsonb) || ${JSON.stringify({
            status: "completed",
            processed: allResults.length,
            succeeded,
            filterIds,
            results: allResults,
          })}::jsonb`,
        })
        .where(eq(schema.actions.id, actionId));
    });

    return { unsubscribed: allResults.length };
  },
);

type UndoEvent = { data: { actionId: string } };

export const undoAction = inngest.createFunction(
  {
    id: "gmailcleaner-undo-action",
    concurrency: { limit: 1 },
    retries: 1,
    triggers: [{ event: "gmailcleaner/action.undo" }],
  },
  async ({ event, step }) => {
    const { actionId } = (event as unknown as UndoEvent).data;

    const action = await step.run("load-action", async () => {
      const rows = await db
        .select()
        .from(schema.actions)
        .where(eq(schema.actions.id, actionId))
        .limit(1);
      return rows[0];
    });

    if (!action || action.undoneAt) return { ok: false, reason: "already-undone" };

    if (action.kind === "archive-bucket" && action.messageIds) {
      const ids = action.messageIds;
      for (let i = 0; i < ids.length; i += ARCHIVE_BATCH_SIZE) {
        const batch = ids.slice(i, i + ARCHIVE_BATCH_SIZE);
        await step.run(`restore-${i}`, async () => {
          const c = await getGmailClient();
          if (!c) throw new Error("No Gmail account");
          await batchRestoreToInbox(c.gmail, batch);
          await db
            .update(schema.messages)
            .set({ actedOnAt: null, actionTaken: null })
            .where(inArray(schema.messages.gmailId, batch));
        });
      }
    }

    if (action.kind === "unsubscribe-bucket") {
      const filterIds = (action.scopeJson?.filterIds as string[]) ?? [];
      if (filterIds.length > 0) {
        await step.run("delete-filters", async () => {
          const c = await getGmailClient();
          if (!c) throw new Error("No Gmail account");
          await deleteFilters(c.gmail, filterIds);
        });
      }
      if (action.messageIds && action.messageIds.length > 0) {
        const ids = action.messageIds;
        for (let i = 0; i < ids.length; i += ARCHIVE_BATCH_SIZE) {
          const batch = ids.slice(i, i + ARCHIVE_BATCH_SIZE);
          await step.run(`restore-${i}`, async () => {
            const c = await getGmailClient();
            if (!c) throw new Error("No Gmail account");
            await batchRestoreToInbox(c.gmail, batch);
            await db
              .update(schema.messages)
              .set({ actedOnAt: null, actionTaken: null })
              .where(inArray(schema.messages.gmailId, batch));
          });
        }
      }
    }

    await step.run("mark-undone", async () => {
      await db
        .update(schema.actions)
        .set({ undoneAt: new Date() })
        .where(eq(schema.actions.id, actionId));
    });

    return { ok: true };
  },
);
