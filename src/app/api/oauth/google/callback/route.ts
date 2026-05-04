import { google } from "googleapis";
import { NextResponse, type NextRequest } from "next/server";
import { getOAuthClient } from "@/lib/oauth/google";
import { saveAccount } from "@/lib/gmail/account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return redirectWithMessage(request, `oauth_error=${encodeURIComponent(error)}`);
  }

  const expectedState = request.cookies.get("oauth_state")?.value;
  if (!state || !expectedState || state !== expectedState) {
    return redirectWithMessage(request, "oauth_error=state_mismatch");
  }

  if (!code) {
    return redirectWithMessage(request, "oauth_error=no_code");
  }

  const oauth = getOAuthClient();
  const { tokens } = await oauth.getToken(code);

  if (!tokens.refresh_token || !tokens.access_token || !tokens.expiry_date) {
    return redirectWithMessage(request, "oauth_error=missing_tokens");
  }

  oauth.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth });
  const profile = await gmail.users.getProfile({ userId: "me" });
  const email = profile.data.emailAddress;
  if (!email) {
    return redirectWithMessage(request, "oauth_error=no_email");
  }

  await saveAccount({
    email,
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    expiresAt: new Date(tokens.expiry_date),
  });

  const response = redirectWithMessage(request, "connected=1");
  response.cookies.delete("oauth_state");
  return response;
}

function redirectWithMessage(request: NextRequest, query: string): NextResponse {
  const target = new URL("/GmailCleaner", request.url);
  target.search = query;
  return NextResponse.redirect(target);
}
