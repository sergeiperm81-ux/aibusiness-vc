import { NextResponse, type NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Leads Dashboard", charset="UTF-8"',
    },
  });
}

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expectedUser = (process.env.LEADS_DASH_USER ?? "owner").trim();
  const expectedPassword = process.env.LEADS_DASH_PASSWORD?.trim();

  if (!expectedPassword) {
    return new NextResponse(
      "Leads dashboard is locked. Set LEADS_DASH_PASSWORD in environment variables.",
      { status: 503 }
    );
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  const encoded = authHeader.split(" ")[1] ?? "";
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex <= 0) return unauthorized();

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== expectedUser || password !== expectedPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/materials/leads", "/materials/leads/:path*"],
};
