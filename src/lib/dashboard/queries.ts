import { desc, eq, and, gte, isNull, isNotNull, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { BUCKETS, type Bucket } from "@/lib/claude/classify";

export type SweepRun = typeof schema.sweepRuns.$inferSelect;

export async function getLatestSweepRun(): Promise<SweepRun | null> {
  const rows = await db
    .select()
    .from(schema.sweepRuns)
    .orderBy(desc(schema.sweepRuns.startedAt))
    .limit(1);
  return rows[0] ?? null;
}

export type BucketSummary = {
  bucket: Bucket;
  count: number;
  topSenders: { email: string; count: number }[];
  sampleSubjects: string[];
};

export async function getBucketSummaries(): Promise<BucketSummary[]> {
  const counts = await db
    .select({
      category: schema.messages.category,
      count: sql<number>`count(*)::int`,
    })
    .from(schema.messages)
    .where(
      and(isNotNull(schema.messages.category), isNull(schema.messages.actedOnAt)),
    )
    .groupBy(schema.messages.category);

  const summaries: BucketSummary[] = [];

  for (const bucket of BUCKETS) {
    const row = counts.find((c) => c.category === bucket);
    const count = row?.count ?? 0;
    if (count === 0) {
      summaries.push({ bucket, count: 0, topSenders: [], sampleSubjects: [] });
      continue;
    }

    const topSenders = await db
      .select({
        email: schema.messages.senderEmail,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.category, bucket),
          isNull(schema.messages.actedOnAt),
        ),
      )
      .groupBy(schema.messages.senderEmail)
      .orderBy(sql`count(*) desc`)
      .limit(3);

    const subjects = await db
      .select({ subject: schema.messages.subject })
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.category, bucket),
          isNull(schema.messages.actedOnAt),
        ),
      )
      .orderBy(desc(schema.messages.internalDate))
      .limit(3);

    summaries.push({
      bucket,
      count,
      topSenders: topSenders.map((t) => ({ email: t.email, count: t.count })),
      sampleSubjects: subjects
        .map((s) => s.subject)
        .filter((s): s is string => Boolean(s)),
    });
  }

  return summaries;
}

export async function getCurrentSweepCost(): Promise<number> {
  const sweep = await getLatestSweepRun();
  if (!sweep) return 0;
  const rows = await db
    .select({ sum: sql<number>`coalesce(sum(cost_usd), 0)::float` })
    .from(schema.usageEvents)
    .where(gte(schema.usageEvents.createdAt, sweep.startedAt));
  return rows[0]?.sum ?? 0;
}

export async function getLifetimeCost(): Promise<number> {
  const rows = await db
    .select({ sum: sql<number>`coalesce(sum(cost_usd), 0)::float` })
    .from(schema.usageEvents);
  return rows[0]?.sum ?? 0;
}

export function isSweepActive(sweep: SweepRun | null): boolean {
  if (!sweep) return false;
  return ["pending", "fetching", "classifying", "sonnet-recheck"].includes(
    sweep.status,
  );
}

export function isSweepDone(sweep: SweepRun | null): boolean {
  return sweep?.status === "done";
}

const UNDO_WINDOW_MS = 24 * 60 * 60 * 1000;

export type RecentAction = {
  id: string;
  kind: string;
  bucket: string | null;
  messageCount: number;
  status: string;
  processed: number;
  succeeded: number | null;
  createdAt: Date;
  undoneAt: Date | null;
  expiresAt: Date;
};

export async function getRecentAction(): Promise<RecentAction | null> {
  const cutoff = new Date(Date.now() - UNDO_WINDOW_MS);
  const rows = await db
    .select()
    .from(schema.actions)
    .where(gte(schema.actions.createdAt, cutoff))
    .orderBy(desc(schema.actions.createdAt))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  const scope = (row.scopeJson ?? {}) as Record<string, unknown>;

  return {
    id: row.id,
    kind: row.kind,
    bucket: typeof scope.bucket === "string" ? scope.bucket : null,
    messageCount: row.messageIds?.length ?? 0,
    status: typeof scope.status === "string" ? scope.status : "pending",
    processed: typeof scope.processed === "number" ? scope.processed : 0,
    succeeded: typeof scope.succeeded === "number" ? scope.succeeded : null,
    createdAt: row.createdAt,
    undoneAt: row.undoneAt,
    expiresAt: new Date(row.createdAt.getTime() + UNDO_WINDOW_MS),
  };
}
