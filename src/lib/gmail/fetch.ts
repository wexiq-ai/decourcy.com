import type { gmail_v1 } from "googleapis";
import { mapWithConcurrency } from "@/lib/util/concurrency";
import { withRetry, isRateLimitError } from "@/lib/util/retry";

const GMAIL_FETCH_CONCURRENCY = 3;

export type FetchedMessage = {
  gmailId: string;
  threadId: string;
  senderEmail: string;
  senderName: string | null;
  subject: string | null;
  snippet: string | null;
  internalDate: Date;
  listUnsubscribeHeader: string | null;
};

export async function listAllUnreadInboxIds(
  gmail: gmail_v1.Gmail,
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined = undefined;
  do {
    const res: gmail_v1.Schema$ListMessagesResponse = (
      await gmail.users.messages.list({
        userId: "me",
        q: "in:inbox is:unread",
        maxResults: 500,
        pageToken,
      })
    ).data;
    for (const m of res.messages ?? []) {
      if (m.id) ids.push(m.id);
    }
    pageToken = res.nextPageToken ?? undefined;
  } while (pageToken);
  return ids;
}

export async function fetchMessageMetadata(
  gmail: gmail_v1.Gmail,
  ids: string[],
): Promise<FetchedMessage[]> {
  const responses = await mapWithConcurrency(ids, GMAIL_FETCH_CONCURRENCY, (id) =>
    withRetry(
      () =>
        gmail.users.messages.get({
          userId: "me",
          id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date", "List-Unsubscribe"],
        }),
      { isRetryable: isRateLimitError, maxAttempts: 6 },
    ),
  );

  return responses.map((res): FetchedMessage => {
    const headers = res.data.payload?.headers ?? [];
    const get = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value ?? null;
    const fromRaw = get("From") ?? "";
    const { email, name } = parseFromHeader(fromRaw);
    return {
      gmailId: res.data.id!,
      threadId: res.data.threadId!,
      senderEmail: email,
      senderName: name,
      subject: get("Subject"),
      snippet: res.data.snippet ?? null,
      internalDate: new Date(Number(res.data.internalDate ?? 0)),
      listUnsubscribeHeader: get("List-Unsubscribe"),
    };
  });
}

function parseFromHeader(raw: string): { email: string; name: string | null } {
  const match = raw.match(/^(?:"?([^"<]*)"?\s*)?<([^>]+)>$/);
  if (match) {
    return {
      email: match[2].trim().toLowerCase(),
      name: match[1]?.trim() || null,
    };
  }
  return { email: raw.trim().toLowerCase(), name: null };
}
