import { NextResponse, type NextRequest } from "next/server";
import { getStoredAccount, clearAccount } from "@/lib/gmail/account";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const account = await getStoredAccount();
  if (account) {
    await clearAccount(account.email);
  }
  const target = new URL("/GmailCleaner", request.url);
  target.search = "disconnected=1";
  return NextResponse.redirect(target, { status: 303 });
}
