import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildAuditPackageAttachments } from "@/lib/audit/fulfillment";
import { decodeDomainFromId } from "@/lib/audit/mock";

export const runtime = "nodejs";
export const maxDuration = 20;

type JsonObject = Record<string, unknown>;

const processedEvents = new Set<string>();

function isSupportedEvent(eventName: string): boolean {
  return eventName === "order_created" || eventName === "order_paid";
}

function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function cleanDomain(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*/, "");
  return cleaned && cleaned.includes(".") ? cleaned : null;
}

function pickString(obj: JsonObject | null | undefined, key: string): string | null {
  const value = obj?.[key];
  return typeof value === "string" ? value : null;
}

function secureEqualHex(left: string, right: string): boolean {
  try {
    const a = Buffer.from(left, "hex");
    const b = Buffer.from(right, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function verifyLemonSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim();
  if (!secret) return true;
  if (!signature) return false;
  const normalizedSignature = signature.trim().replace(/^sha256=/i, "");
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return secureEqualHex(digest, normalizedSignature);
}

function resolveAuditSender(): string | null {
  const from =
    process.env.AUDIT_FROM_EMAIL?.trim().toLowerCase() ??
    process.env.LEADS_FROM_EMAIL?.trim().toLowerCase() ??
    "";
  if (!from) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from) ? from : null;
}

function resolveAuditBcc(): string | null {
  const bcc =
    process.env.AUDIT_OWNER_EMAIL?.trim().toLowerCase() ??
    process.env.LEADS_TO_EMAIL?.trim().toLowerCase() ??
    "";
  if (!bcc) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bcc) ? bcc : null;
}

async function sendPackageEmail(params: {
  toEmail: string;
  domain: string;
  orderId: string;
  auditId?: string;
  plan?: "standard" | "deep";
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = resolveAuditSender();
  if (!apiKey || !fromEmail) {
    throw new Error("Missing BREVO_API_KEY or AUDIT_FROM_EMAIL/LEADS_FROM_EMAIL");
  }

  const attachments = await buildAuditPackageAttachments({
    domain: params.domain,
    auditId: params.auditId,
    orderId: params.orderId,
    plan: params.plan,
  });

  const bcc = resolveAuditBcc();
  const subject = `Your AI Visibility package is ready (${params.domain})`;
  const htmlContent = `
    <h2>Your AI Visibility package is ready</h2>
    <p><strong>Domain:</strong> ${params.domain}</p>
    <p><strong>Order ID:</strong> ${params.orderId}</p>
    <p>Attached files include:</p>
    <ul>
      <li>Executive-Brief.pdf</li>
      <li>Manual-Implementation-Guide.docx</li>
      <li>README + implementation markdown/json/csv/txt files</li>
    </ul>
    <p>All files are provided in English.</p>
  `;

  const textContent = [
    "Your AI Visibility package is ready.",
    `Domain: ${params.domain}`,
    `Order ID: ${params.orderId}`,
    "",
    "Attached files include:",
    "- Executive-Brief.pdf",
    "- Manual-Implementation-Guide.docx",
    "- README + implementation markdown/json/csv/txt files",
    "",
    "All files are provided in English.",
  ].join("\n");

  const payload: JsonObject = {
    sender: { email: fromEmail, name: "AI Business Audit" },
    to: [{ email: params.toEmail }],
    subject,
    htmlContent,
    textContent,
    attachment: attachments.map((file) => ({
      name: file.name,
      content: file.content,
      type: file.type,
    })),
  };

  if (bcc) {
    payload.bcc = [{ email: bcc }];
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo ${response.status}: ${body}`);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  let payload: JsonObject;
  try {
    payload = JSON.parse(rawBody) as JsonObject;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const meta = (payload.meta as JsonObject | undefined) ?? {};
  const data = (payload.data as JsonObject | undefined) ?? {};
  const attributes = (data.attributes as JsonObject | undefined) ?? {};
  const customData = (meta.custom_data as JsonObject | undefined) ?? {};
  const eventName = pickString(meta, "event_name") ?? "";
  const eventId = pickString(data, "id") ?? crypto.randomUUID();

  if (!isSupportedEvent(eventName)) {
    return NextResponse.json({ ok: true, ignored: true, event: eventName });
  }

  if (processedEvents.has(eventId)) {
    return NextResponse.json({ ok: true, duplicate: true, eventId });
  }

  const toEmail =
    cleanEmail(attributes.user_email) ??
    cleanEmail(attributes.email) ??
    cleanEmail(attributes.customer_email);

  if (!toEmail) {
    return NextResponse.json(
      { ok: false, error: "Missing customer email in Lemon Squeezy payload" },
      { status: 422 }
    );
  }

  const auditId =
    pickString(customData, "audit_id") ??
    pickString(attributes, "audit_id") ??
    undefined;
  const domainFromCustom =
    cleanDomain(customData.domain) ??
    cleanDomain(attributes.domain) ??
    (auditId ? cleanDomain(decodeDomainFromId(auditId)) : null);
  const domain = domainFromCustom ?? "example.com";

  const planRaw = pickString(customData, "plan") ?? pickString(attributes, "plan") ?? "standard";
  const plan = planRaw === "deep" ? "deep" : "standard";
  const orderId =
    pickString(attributes, "order_number") ?? pickString(data, "id") ?? crypto.randomUUID();

  try {
    await sendPackageEmail({
      toEmail,
      domain,
      orderId,
      auditId,
      plan,
    });
    processedEvents.add(eventId);
    return NextResponse.json({ ok: true, sent: true, eventId, toEmail, domain, orderId });
  } catch (error) {
    console.error("[audit_fulfillment_error]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown fulfillment error",
      },
      { status: 500 }
    );
  }
}
