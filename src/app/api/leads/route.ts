import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

type LeadSource = "roi_calculator" | "playbook_templates";

interface LeadRequestBody {
  email: string;
  source: LeadSource;
  payload?: Record<string, unknown>;
}

interface LeadEvent {
  id: string;
  timestamp: string;
  email: string;
  source: LeadSource;
  payload: Record<string, unknown>;
  userAgent: string;
  ip: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildLeadEvent(request: Request, body: LeadRequestBody): LeadEvent {
  const headers = request.headers;
  const forwardedFor = headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() ?? "";

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    email: body.email.trim().toLowerCase(),
    source: body.source,
    payload: body.payload ?? {},
    userAgent: headers.get("user-agent") ?? "",
    ip,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequestBody;
    const email = (body.email ?? "").trim().toLowerCase();
    const source = body.source;

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    if (source !== "roi_calculator" && source !== "playbook_templates") {
      return NextResponse.json({ ok: false, error: "Unsupported source" }, { status: 400 });
    }

    const leadEvent = buildLeadEvent(request, { ...body, email });
    console.log("[lead_capture]", JSON.stringify(leadEvent));

    return NextResponse.json({
      ok: true,
      saved: true,
      leadId: leadEvent.id,
      message: "Lead saved.",
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ ok: false, error: "Failed to process lead" }, { status: 500 });
  }
}
