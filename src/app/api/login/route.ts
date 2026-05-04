import { NextRequest, NextResponse } from "next/server";

const PAGE_PASSWORDS: Record<string, string> = {
  "/amerilife-marketing-strategy": "ovitas2026",
  "/ca47media": "troutman2026",
  "/calendarprototype": "Marketing2026",
  "/gmailcleaner": process.env.GMAIL_CLEANER_PASSWORD ?? "CHANGE_ME_IN_VERCEL",
};

const DEFAULT_PASSWORD = "ovitas2026";

export async function POST(request: NextRequest) {
  const { password, page } = await request.json();

  const normalizedPage = (page || "/").toLowerCase();
  const expected = PAGE_PASSWORDS[normalizedPage] || DEFAULT_PASSWORD;

  if (password === expected) {
    // Use a per-page cookie so access to one page doesn't unlock others
    const cookieName = `auth_${normalizedPage.replace(/\//g, "_")}`;
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieName, "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
