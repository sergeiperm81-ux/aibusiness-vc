import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/leads-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/materials/leads/login?logged_out=1", request.url), {
    status: 303,
  });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    maxAge: 0,
    path: "/materials/leads",
  });
  return response;
}
