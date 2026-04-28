import { NextResponse } from "next/server";
import {
  buildLeadsSessionToken,
  getExpectedLeadsPassword,
  getExpectedLeadsUser,
  normalizeLeadsUser,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "@/lib/leads-auth";

function normalizeNextPath(path?: string | null): string {
  if (!path || !path.startsWith("/materials/leads")) return "/materials/leads";
  if (path.startsWith("/materials/leads/login")) return "/materials/leads";
  return path;
}

function redirectTo(requestUrl: string, path: string): NextResponse {
  const url = new URL(path, requestUrl);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const expectedUser = getExpectedLeadsUser();
  const expectedPassword = getExpectedLeadsPassword();

  if (!expectedPassword) {
    return new NextResponse(
      "Leads dashboard is locked. Set LEADS_DASH_PASSWORD in environment variables.",
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const username = normalizeLeadsUser(String(formData.get("username") ?? ""));
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeNextPath(String(formData.get("next") ?? "/materials/leads"));

  if (username !== expectedUser || password.trim() !== expectedPassword) {
    return redirectTo(request.url, `/materials/leads/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const response = redirectTo(request.url, nextPath);
  const token = await buildLeadsSessionToken(expectedUser, expectedPassword);
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/materials/leads",
  });
  return response;
}
