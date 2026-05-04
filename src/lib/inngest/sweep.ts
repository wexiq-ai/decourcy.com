import { eq, sql, and, isNull, lt } from "drizzle-orm";
import { inngest } from "./client";
import { db, schema } from "@/lib/db/client";
import { getGmailClient } from "@/lib/gmail/client";
import {
  listAllUnreadInboxIds,
  fetchMessageMetadata,
} from "@/lib/gmail/fetch";
import { classifyOne } from "@/lib/claude/classify";
import { mapWithConcurrency } from "@/lib/util/concurrency";

const FETCH_BATCH_SIZE = 100;
const CLASSIFY_BATCH_SIZE = 30;
const CLASSIFY_CONCURRENCY = 8;
const SONNET_BATCH_SIZE = 15;
const SONNET_CONCURRENCY = 4;
const SONNET_CONFIDENCE_THRESHOLD = 0.75;

type SweepEvent = {
  data: { sweepId: string };
};

export const sweepRun = inngest.createFunction(
  {
    id: "gmailcleaner-sweep-run",
    concurrency: { limit: 1 },
    retries: 2,
    triggers: [{ event: "gmailcleaner/sweep.start" }],
  },
  async ({ event, step }) => {
    const { sweepId } = (event as unknown as SweepEvent).data;

    const ids = await step.run("list-ids", async () => {
      const client = await getGmailClient();
      if (!client) throw new Error("No connected Gmail account");
      const all = await listAllUnreadInboxIds(client.gmail);

      const existingRows = await db
        .select({ id: schema.messages.gmailId })
        .from(schema.messages);
      const existingSet = new Set(existingRows.map((r) => r.id));
      const newIds = all.filter((id) => !existingSet.has(id));

      await db
        .update(schema.sweepRuns)
        .set({
          totalMessages: all.length,
          fetchedCount: existingRows.length,
          status: "fetching",
        })
        .where(eq(schema.sweepRuns.id, sweepId));
      return newIds;
    });

    for (let i = 0; i < ids.length; i += FETCH_BATCH_SIZE) {
      const batch = ids.slice(i, i + FETCH_BATCH_SIZE);
      await step.run(`fetch-${i}`, async () => {
        const client = await getGmailClient();
        if (!client) throw new Error("No connected Gmail account");
        const fetched = await fetchMessageMetadata(client.gmail, batch);
        if (fetched.length === 0) return { added: 0 };
        await db
          .insert(schema.messages)
          .values(
            fetched.map((m) => ({
              gmailId: m.gmailId,
              threadId: m.threadId,
              senderEmail: m.senderEmail,
              senderName: m.senderName,
              subject: m.subject,
              snippet: m.snippet,
              internalDate: m.internalDate,
              listUnsubscribeHeader: m.listUnsubscribeHeader,
            })),
          )
          .onConflictDoNothing();
        await db
          .update(schema.sweepRuns)
          .set({
            fetchedCount: sql`${schema.sweepRuns.fetchedCount} + ${fetched.length}`,
          })
          .where(eq(schema.sweepRuns.id, sweepId));
        return { added: fetched.length };
      });
    }

    await step.run("update-sender-counts", async () => {
      await db.execute(sql`
        INSERT INTO senders (sender_email, message_count, last_seen_at)
        SELECT sender_email, COUNT(*), MAX(internal_date)
        FROM messages
        WHERE category IS NULL
        GROUP BY sender_email
        ON CONFLICT (sender_email) DO UPDATE
        SET message_count = EXCLUDED.message_count,
            last_seen_at = EXCLUDED.last_seen_at
      `);
      await db
        .update(schema.sweepRuns)
        .set({ status: "classifying" })
        .where(eq(schema.sweepRuns.id, sweepId));
    });

    const senders = await step.run("list-unique-senders", async () => {
      const rows = await db
        .selectDistinctOn([schema.messages.senderEmail])
        .from(schema.messages)
        .where(isNull(schema.messages.category))
        .orderBy(schema.messages.senderEmail, schema.messages.internalDate);
      return rows.map((r) => ({
        senderEmail: r.senderEmail,
        senderName: r.senderName,
        subject: r.subject,
        snippet: r.snippet,
      }));
    });

    for (let i = 0; i < senders.length; i += CLASSIFY_BATCH_SIZE) {
      const batch = senders.slice(i, i + CLASSIFY_BATCH_SIZE);
      await step.run(`classify-haiku-${i}`, async () => {
        const results = await mapWithConcurrency(
          batch,
          CLASSIFY_CONCURRENCY,
          async (s) => {
            try {
              const { result } = await classifyOne("claude-haiku-4-5-20251001", {
                from: `${s.senderName ?? ""} <${s.senderEmail}>`.trim(),
                subject: s.subject ?? "",
                snippet: s.snippet ?? "",
              });
              return { sender: s.senderEmail, ...result };
            } catch {
              return {
                sender: s.senderEmail,
                category: "UNCERTAIN" as const,
                confidence: 0,
              };
            }
          },
        );
        const now = new Date();
        for (const r of results) {
          await db
            .update(schema.messages)
            .set({
              category: r.category,
              confidence: r.confidence,
              classifiedByModel: "claude-haiku-4-5-20251001",
              classifiedAt: now,
            })
            .where(
              and(
                eq(schema.messages.senderEmail, r.sender),
                isNull(schema.messages.category),
              ),
            );
          await db
            .update(schema.senders)
            .set({
              patternCategory: r.category,
              patternConfidence: r.confidence,
            })
            .where(eq(schema.senders.senderEmail, r.sender));
        }
        await db
          .update(schema.sweepRuns)
          .set({
            classifiedCount: sql`${schema.sweepRuns.classifiedCount} + ${results.length}`,
          })
          .where(eq(schema.sweepRuns.id, sweepId));
        return { classified: results.length };
      });
    }

    await step.run("set-sonnet-stage", async () => {
      await db
        .update(schema.sweepRuns)
        .set({ status: "sonnet-recheck" })
        .where(eq(schema.sweepRuns.id, sweepId));
    });

    const uncertain = await step.run("list-uncertain-senders", async () => {
      const rows = await db
        .selectDistinctOn([schema.messages.senderEmail])
        .from(schema.messages)
        .where(
          and(
            eq(schema.messages.classifiedByModel, "claude-haiku-4-5-20251001"),
            lt(schema.messages.confidence, SONNET_CONFIDENCE_THRESHOLD),
          ),
        )
        .orderBy(schema.messages.senderEmail, schema.messages.internalDate);
      return rows.map((r) => ({
        senderEmail: r.senderEmail,
        senderName: r.senderName,
        subject: r.subject,
        snippet: r.snippet,
      }));
    });

    for (let i = 0; i < uncertain.length; i += SONNET_BATCH_SIZE) {
      const batch = uncertain.slice(i, i + SONNET_BATCH_SIZE);
      await step.run(`classify-sonnet-${i}`, async () => {
        const results = await mapWithConcurrency(
          batch,
          SONNET_CONCURRENCY,
          async (s) => {
            try {
              const { result } = await classifyOne("claude-sonnet-4-6", {
                from: `${s.senderName ?? ""} <${s.senderEmail}>`.trim(),
                subject: s.subject ?? "",
                snippet: s.snippet ?? "",
              });
              return { sender: s.senderEmail, ...result };
            } catch {
              return null;
            }
          },
        );
        const now = new Date();
        for (const r of results) {
          if (!r) continue;
          await db
            .update(schema.messages)
            .set({
              category: r.category,
              confidence: r.confidence,
              classifiedByModel: "claude-sonnet-4-6",
              classifiedAt: now,
            })
            .where(eq(schema.messages.senderEmail, r.sender));
          await db
            .update(schema.senders)
            .set({
              patternCategory: r.category,
              patternConfidence: r.confidence,
            })
            .where(eq(schema.senders.senderEmail, r.sender));
        }
        await db
          .update(schema.sweepRuns)
          .set({
            sonnetRecheckCount: sql`${schema.sweepRuns.sonnetRecheckCount} + ${results.filter(Boolean).length}`,
          })
          .where(eq(schema.sweepRuns.id, sweepId));
        return { rechecked: results.filter(Boolean).length };
      });
    }

    await step.run("finalize", async () => {
      await db
        .update(schema.sweepRuns)
        .set({ status: "done", finishedAt: new Date() })
        .where(eq(schema.sweepRuns.id, sweepId));
    });

    return { sweepId, fetched: ids.length };
  },
);
