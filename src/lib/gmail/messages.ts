import type { gmail_v1 } from "googleapis";

export type SampleMessage = {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt: Date;
};

export async function getProfile(gmail: gmail_v1.Gmail): Promise<{
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
}> {
  const res = await gmail.users.getProfile({ userId: "me" });
  return {
    emailAddress: res.data.emailAddress ?? "",
    messagesTotal: res.data.messagesTotal ?? 0,
    threadsTotal: res.data.threadsTotal ?? 0,
  };
}

export async function getInboxUnreadCount(gmail: gmail_v1.Gmail): Promise<number> {
  const res = await gmail.users.labels.get({ userId: "me", id: "INBOX" });
  return res.data.messagesUnread ?? 0;
}

export async function listSampleMessages(
  gmail: gmail_v1.Gmail,
  maxResults = 10,
): Promise<SampleMessage[]> {
  const list = await gmail.users.messages.list({
    userId: "me",
    q: "in:inbox is:unread",
    maxResults,
  });

  const ids = (list.data.messages ?? []).map((m) => m.id!).filter(Boolean);
  if (ids.length === 0) return [];

  const messages = await Promise.all(
    ids.map((id) =>
      gmail.users.messages.get({
        userId: "me",
        id,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      }),
    ),
  );

  return messages.map((res): SampleMessage => {
    const headers = res.data.payload?.headers ?? [];
    const get = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())
        ?.value ?? "";

    return {
      id: res.data.id!,
      threadId: res.data.threadId!,
      from: get("From"),
      subject: get("Subject"),
      snippet: res.data.snippet ?? "",
      receivedAt: new Date(Number(res.data.internalDate ?? 0)),
    };
  });
}
