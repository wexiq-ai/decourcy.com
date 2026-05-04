import type { gmail_v1 } from "googleapis";
import { mapWithConcurrency } from "@/lib/util/concurrency";
import { withRetry, isRateLimitError } from "@/lib/util/retry";

const GMAIL_BATCH_SIZE = 1000;
const FILTER_CONCURRENCY = 3;
const UNSUB_CONCURRENCY = 3;

export async function batchArchive(
  gmail: gmail_v1.Gmail,
  messageIds: string[],
): Promise<void> {
  for (let i = 0; i < messageIds.length; i += GMAIL_BATCH_SIZE) {
    const batch = messageIds.slice(i, i + GMAIL_BATCH_SIZE);
    await withRetry(
      () =>
        gmail.users.messages.batchModify({
          userId: "me",
          requestBody: { ids: batch, removeLabelIds: ["INBOX"] },
        }),
      { isRetryable: isRateLimitError },
    );
  }
}

export async function batchRestoreToInbox(
  gmail: gmail_v1.Gmail,
  messageIds: string[],
): Promise<void> {
  for (let i = 0; i < messageIds.length; i += GMAIL_BATCH_SIZE) {
    const batch = messageIds.slice(i, i + GMAIL_BATCH_SIZE);
    await withRetry(
      () =>
        gmail.users.messages.batchModify({
          userId: "me",
          requestBody: { ids: batch, addLabelIds: ["INBOX"] },
        }),
      { isRetryable: isRateLimitError },
    );
  }
}

export async function createArchiveFilter(
  gmail: gmail_v1.Gmail,
  senderEmail: string,
): Promise<string | null> {
  try {
    const res = await withRetry(
      () =>
        gmail.users.settings.filters.create({
          userId: "me",
          requestBody: {
            criteria: { from: senderEmail },
            action: { removeLabelIds: ["INBOX"] },
          },
        }),
      { isRetryable: isRateLimitError, maxAttempts: 3 },
    );
    return res.data.id ?? null;
  } catch {
    return null;
  }
}

export async function deleteFilter(
  gmail: gmail_v1.Gmail,
  filterId: string,
): Promise<void> {
  try {
    await withRetry(
      () => gmail.users.settings.filters.delete({ userId: "me", id: filterId }),
      { isRetryable: isRateLimitError, maxAttempts: 3 },
    );
  } catch {
    // ignore — filter may already be gone
  }
}

export type UnsubResult = {
  sender: string;
  method: "https" | "mailto" | "none";
  ok: boolean;
  filterId: string | null;
  error?: string;
};

export async function unsubscribeFromSender(
  gmail: gmail_v1.Gmail,
  senderEmail: string,
  listUnsubscribeHeader: string | null,
  myEmail: string,
): Promise<UnsubResult> {
  let method: UnsubResult["method"] = "none";
  let ok = false;
  let error: string | undefined;

  if (listUnsubscribeHeader) {
    const httpsMatch = listUnsubscribeHeader.match(/<(https?:\/\/[^>]+)>/);
    const mailtoMatch = listUnsubscribeHeader.match(/<mailto:([^>]+)>/);

    if (httpsMatch) {
      method = "https";
      try {
        const res = await fetch(httpsMatch[1], {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "List-Unsubscribe=One-Click",
          signal: AbortSignal.timeout(8000),
        });
        ok = res.ok;
        if (!ok) error = `https-${res.status}`;
      } catch (e) {
        error = `https-${(e as Error).message}`;
      }
    } else if (mailtoMatch) {
      method = "mailto";
      const target = mailtoMatch[1].split("?")[0];
      try {
        const raw = [
          `From: ${myEmail}`,
          `To: ${target}`,
          `Subject: unsubscribe`,
          ``,
          `unsubscribe`,
        ].join("\r\n");
        await withRetry(
          () =>
            gmail.users.messages.send({
              userId: "me",
              requestBody: {
                raw: Buffer.from(raw).toString("base64url"),
              },
            }),
          { isRetryable: isRateLimitError, maxAttempts: 3 },
        );
        ok = true;
      } catch (e) {
        error = `mailto-${(e as Error).message}`;
      }
    }
  }

  // Always create the Gmail filter — primary defense against future emails
  const filterId = await createArchiveFilter(gmail, senderEmail);

  return { sender: senderEmail, method, ok: ok || !!filterId, filterId, error };
}

export async function unsubscribeFromSenders(
  gmail: gmail_v1.Gmail,
  senders: { email: string; listUnsubscribeHeader: string | null }[],
  myEmail: string,
): Promise<UnsubResult[]> {
  return mapWithConcurrency(senders, UNSUB_CONCURRENCY, (s) =>
    unsubscribeFromSender(gmail, s.email, s.listUnsubscribeHeader, myEmail),
  );
}

export async function deleteFilters(
  gmail: gmail_v1.Gmail,
  filterIds: string[],
): Promise<void> {
  await mapWithConcurrency(filterIds, FILTER_CONCURRENCY, (id) =>
    deleteFilter(gmail, id),
  );
}
