import { NextResponse, type NextRequest } from "next/server";
import {
  buildLeadsSessionToken,
  getExpectedLeadsPassword,
  getExpectedLeadsUser,
  SESSION_COOKIE_NAME,
} from "@/lib/leads-auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const expectedUser = getExpectedLeadsUser();
  const expectedPassword = getExpectedLeadsPassword();

  if (!expectedPassword) {
    return new NextResponse(
      "Leads dashboard is locked. Set LEADS_DASH_PASSWORD in environment variables.",
      { status: 503 }
    );
  }

  if (pathname === "/materials/leads/login") {
    return NextResponse.next();
  }

  const expectedToken = await buildLeadsSessionToken(expectedUser, expectedPassword);
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";

  if (token !== expectedToken) {
    const loginUrl = new URL("/materials/leads/login", request.url);
    const nextPath = `${pathname}${search}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/materials/leads", "/materials/leads/:path*"],
};
