"use server";

import { revalidatePath } from "next/cache";
import { eq, and, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { inngest } from "@/lib/inngest/client";
import { getStoredAccount } from "@/lib/gmail/account";

export async function startSweep(): Promise<void> {
  const [sweepRun] = await db
    .insert(schema.sweepRuns)
    .values({ status: "pending" })
    .returning();

  await inngest.send({
    name: "gmailcleaner/sweep.start",
    data: { sweepId: sweepRun.id },
  });

  revalidatePath("/GmailCleaner");
}

export async function archiveBucket(formData: FormData): Promise<void> {
  const bucket = String(formData.get("bucket"));
  if (!bucket) return;

  const rows = await db
    .select({ id: schema.messages.gmailId })
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.category, bucket),
        isNull(schema.messages.actedOnAt),
      ),
    );
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return;

  const [action] = await db
    .insert(schema.actions)
    .values({
      kind: "archive-bucket",
      scopeJson: { bucket, status: "pending" },
      messageIds: ids,
    })
    .returning();

  await inngest.send({
    name: "gmailcleaner/action.archive",
    data: { actionId: action.id },
  });

  revalidatePath("/GmailCleaner");
}

export async function unsubscribeBucket(formData: FormData): Promise<void> {
  const bucket = String(formData.get("bucket"));
  if (!bucket) return;

  const account = await getStoredAccount();
  if (!account) return;

  const senderRows = await db
    .selectDistinctOn([schema.messages.senderEmail], {
      sender: schema.messages.senderEmail,
    })
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.category, bucket),
        isNull(schema.messages.actedOnAt),
      ),
    );

  const messageRows = await db
    .select({ id: schema.messages.gmailId })
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.category, bucket),
        isNull(schema.messages.actedOnAt),
      ),
    );

  if (senderRows.length === 0) return;

  const [action] = await db
    .insert(schema.actions)
    .values({
      kind: "unsubscribe-bucket",
      scopeJson: {
        bucket,
        senders: senderRows.map((s) => s.sender),
        account: account.email,
        status: "pending",
      },
      messageIds: messageRows.map((r) => r.id),
    })
    .returning();

  await inngest.send({
    name: "gmailcleaner/action.unsubscribe",
    data: { actionId: action.id, archiveExisting: true },
  });

  revalidatePath("/GmailCleaner");
}

export async function undoLastAction(formData: FormData): Promise<void> {
  const actionId = String(formData.get("actionId"));
  if (!actionId) return;

  await inngest.send({
    name: "gmailcleaner/action.undo",
    data: { actionId },
  });

  revalidatePath("/GmailCleaner");
}
