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

interface DeliveryResult {
  delivered: boolean;
  message: string;
  error?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveLeadsRecipient(): string | undefined {
  const explicit = process.env.LEADS_TO_EMAIL?.trim().toLowerCase();
  if (explicit && isValidEmail(explicit)) return explicit;

  const fallback = process.env.LEADS_DASH_USER?.trim().toLowerCase();
  if (fallback && isValidEmail(fallback)) return fallback;

  return undefined;
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

async function deliverLeadEmailWithBrevo(leadEvent: LeadEvent): Promise<DeliveryResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.LEADS_FROM_EMAIL?.trim().toLowerCase();
  const toEmail = resolveLeadsRecipient();

  if (!apiKey || !fromEmail || !toEmail) {
    return {
      delivered: false,
      message: "Lead saved. Email delivery is not configured yet.",
    };
  }

  if (!isValidEmail(fromEmail)) {
    return {
      delivered: false,
      message: "Lead saved. Sender email is invalid.",
    };
  }

  const payloadJson = JSON.stringify(leadEvent.payload, null, 2);
  const subject = `New lead (${leadEvent.source}) — ${leadEvent.email}`;

  const textContent = [
    "New lead captured",
    "",
    `Email: ${leadEvent.email}`,
    `Source: ${leadEvent.source}`,
    `Timestamp: ${leadEvent.timestamp}`,
    `IP: ${leadEvent.ip || "-"}`,
    "",
    "Payload:",
    payloadJson,
  ].join("\n");

  const htmlContent = `
    <h2>New lead captured</h2>
    <p><strong>Email:</strong> ${escapeHtml(leadEvent.email)}</p>
    <p><strong>Source:</strong> ${escapeHtml(leadEvent.source)}</p>
    <p><strong>Timestamp:</strong> ${escapeHtml(leadEvent.timestamp)}</p>
    <p><strong>IP:</strong> ${escapeHtml(leadEvent.ip || "-")}</p>
    <h3>Payload</h3>
    <pre>${escapeHtml(payloadJson)}</pre>
  `;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: "AI Business Leads" },
        to: [{ email: toEmail }],
        replyTo: { email: leadEvent.email },
        subject,
        textContent,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const brevoError = await response.text();
      return {
        delivered: false,
        message: "Lead saved, but email delivery failed.",
        error: `Brevo ${response.status}: ${brevoError}`,
      };
    }

    return {
      delivered: true,
      message: "Lead saved and emailed to owner.",
    };
  } catch (error) {
    return {
      delivered: false,
      message: "Lead saved, but email delivery failed.",
      error: error instanceof Error ? error.message : "Unknown delivery error",
    };
  }
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
    const delivery = await deliverLeadEmailWithBrevo(leadEvent);

    if (delivery.error) {
      console.error("[lead_delivery_error]", delivery.error);
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      delivered: delivery.delivered,
      leadId: leadEvent.id,
      message: delivery.message,
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ ok: false, error: "Failed to process lead" }, { status: 500 });
  }
}
