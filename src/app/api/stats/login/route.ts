import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.STATS_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.redirect(new URL("/stats?error=1", req.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/stats", req.url), { status: 303 });
  res.cookies.set("stats_auth", expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
