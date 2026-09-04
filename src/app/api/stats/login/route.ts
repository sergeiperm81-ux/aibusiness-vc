import { NextRequest, NextResponse } from "next/server";
import {
  clearAttempts,
  createSessionToken,
  isLockedOut,
  passwordMatches,
  recordFailedAttempt,
} from "@/lib/admin-session";

export const runtime = "nodejs";

const SESSION_TTL_SECONDS = 60 * 60 * 12;

function clientKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.STATS_PASSWORD;
  const key = `stats:${clientKey(req)}`;

  if (await isLockedOut(key)) {
    return NextResponse.redirect(new URL("/stats?error=locked", req.url), { status: 303 });
  }

  if (!expected || !passwordMatches(password, expected)) {
    await recordFailedAttempt(key);
    return NextResponse.redirect(new URL("/stats?error=1", req.url), { status: 303 });
  }

  await clearAttempts(key);

  const res = NextResponse.redirect(new URL("/stats", req.url), { status: 303 });
  // The cookie carries a signed, expiring token — never the password itself.
  res.cookies.set("stats_auth", createSessionToken("stats", expected, SESSION_TTL_SECONDS), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
