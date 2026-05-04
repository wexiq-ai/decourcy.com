"use server";

import { revalidatePath } from "next/cache";
import { db, schema } from "@/lib/db/client";
import { inngest } from "@/lib/inngest/client";

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
