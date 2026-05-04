import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildAuthUrl } from "@/lib/oauth/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const url = buildAuthUrl(state);

  const response = NextResponse.redirect(url);
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
