import { google, type gmail_v1 } from "googleapis";
import { getOAuthClient } from "@/lib/oauth/google";
import {
  getStoredAccount,
  updateAccessToken,
  type StoredAccount,
} from "./account";

export async function getGmailClient(): Promise<{
  account: StoredAccount;
  gmail: gmail_v1.Gmail;
} | null> {
  const account = await getStoredAccount();
  if (!account) return null;

  const oauth = getOAuthClient();
  oauth.setCredentials({
    refresh_token: account.refreshToken,
    access_token: account.accessToken ?? undefined,
    expiry_date: account.expiresAt?.getTime(),
  });

  oauth.on("tokens", async (tokens) => {
    if (tokens.access_token && tokens.expiry_date) {
      await updateAccessToken(
        account.email,
        tokens.access_token,
        new Date(tokens.expiry_date),
      );
    }
  });

  const gmail = google.gmail({ version: "v1", auth: oauth });
  return { account, gmail };
}
