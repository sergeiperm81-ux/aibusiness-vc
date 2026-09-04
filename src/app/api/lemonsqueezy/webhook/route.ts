import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { buildAuditPackageAttachments } from "@/lib/audit/fulfillment";
import { decodeDomainFromId } from "@/lib/audit/mock";
import { claimOnce, persistClaim, releaseClaim } from "@/lib/redis";

export const runtime = "nodejs";
export const maxDuration = 60;

type JsonObject = Record<string, unknown>;

/**
 * Secondary, per-instance guard behind the Redis claim: still useful when
 * Redis is unreachable and the retry happens to land on the same instance.
 */
const processedEvents = new Set<string>();

/**
 * Two-phase idempotency lifetimes.
 *
 * The claim starts short: if the function crashes after claiming but before
 * the email goes out, the claim expires in minutes and a later Lemon Squeezy
 * retry delivers the order instead of being swallowed as a duplicate. Only a
 * confirmed send is persisted for the full week that covers every retry.
 */
const PROCESSING_TTL_SECONDS = 15 * 60;
const DELIVERED_TTL_SECONDS = 7 * 24 * 3600;

/**
 * Escapes values that reach an HTML email body.
 *
 * `custom_data.domain` arrives from the checkout and is attacker-controllable,
 * so it is escaped rather than trusted — an unescaped value can rewrite the
 * message a buyer receives.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Variants whose purchase should produce an AI Visibility Audit package,
 * from `LEMONSQUEEZY_AUDIT_VARIANT_IDS` (comma separated).
 *
 * One Lemon Squeezy account can hold several stores, and one webhook receives
 * orders from all of them. Without this check a subscription bought in an
 * unrelated store would trigger an audit email to a customer who never asked
 * for one. Fails closed: no allowlist, no fulfilment.
 */
function allowedAuditVariantIds(): string[] {
  return (process.env.LEMONSQUEEZY_AUDIT_VARIANT_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function orderVariantId(attributes: JsonObject): string | null {
  const item = (attributes.first_order_item ?? {}) as Record<string, unknown>;
  return item.variant_id != null ? String(item.variant_id) : null;
}

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
  // Fail closed. A missing secret means we cannot tell a real payment
  // notification from a forged one, so nothing is treated as genuine.
  if (!secret) {
    console.error("[lemonsqueezy] LEMONSQUEEZY_WEBHOOK_SECRET is not set; rejecting webhook");
    return false;
  }
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

  // The scan can legitimately fail (login wall, firewall). In that case the
  // package has no personal PDF, and the email must say so rather than promise
  // two attachments and deliver one — the owner follows up manually.
  const hasReport = attachments.some((file) => file.type === "application/pdf");

  const bcc = resolveAuditBcc();
  const subject = hasReport
    ? `Your AI Visibility package is ready (${params.domain})`
    : `Your AI Visibility kit, report to follow (${params.domain})`;
  const site = "https://aibusiness.vc";

  const attachmentsHtml = hasReport
    ? `
    <p><strong>Two attachments:</strong></p>
    <ul>
      <li><strong>The report (PDF).</strong> Start here. Your score, every signal explained in plain language, and the fixes in priority order. Measured on your domain today.</li>
      <li><strong>The implementation kit (ZIP).</strong> Everything your developer needs: the step by step guide, a prioritised backlog, ready schema patches, an llms.txt draft, prompts and a QA checklist. Plus your <strong>Agent Card</strong>: a machine readable company card drafted from your own site, ready to upload.</li>
    </ul>`
    : `
    <p><strong>One attachment for now:</strong></p>
    <ul>
      <li><strong>The implementation kit (ZIP).</strong> The step by step guide, a prioritised backlog, ready schema patches, an llms.txt draft, prompts and a QA checklist.</li>
    </ul>
    <p><strong>About your personal report:</strong> our scanner could not read ${escapeHtml(params.domain)} automatically. That usually means a login wall, a firewall, or a server that only answers browsers. Nothing is wrong with your order: we will run the measurement by hand and send your report within one business day, no action needed from you.</p>`;

  const htmlContent = `
    <h2>${hasReport ? "Your AI Visibility package is ready" : "Your AI Visibility kit is here, report to follow"}</h2>

    <p>Thank you for your trust, and for paying for an independent measurement rather than a marketing claim.</p>

    <p><strong>Domain:</strong> ${escapeHtml(params.domain)}<br>
    <strong>Order ID:</strong> ${escapeHtml(params.orderId)}</p>
${attachmentsHtml}

    <h3 style="margin-top:28px">Three other things you might want</h3>

    <p><strong>Check your competitors.</strong> Your report shows where you stand. The scan itself is free for any domain: run it on your closest competitor and see who an AI assistant understands better, and where you can overtake them first.<br>
    <a href="${site}/audit">Scan a competitor &rarr;</a></p>

    <p><strong>If you run an AI agent that talks to customers</strong>, a chatbot, an assistant, a booking or support bot, we test those too. It is a test purchase: ten real situations, and every finding checked against what your own website already promises, quoted word for word. Most owners have never seen what their bot actually tells people.<br>
    <a href="${site}/service-check">See how the test purchase works &rarr;</a></p>

    <p><strong>If you are building something with AI yourself</strong>, tell us about it. We publish founder stories in Submit Your Story. Free, no payment, no strings. If the story is real and specific, it gets read by the people looking for exactly what you are building.<br>
    <a href="${site}/submit-your-story">Send your story &rarr;</a></p>

    <p style="margin-top:28px">Anything at all: a file that will not open, a figure you want to question, a refund within 14 days. Write to <a href="mailto:info@aibusiness.vc">info@aibusiness.vc</a> and I will answer personally.</p>

    <p>Sergei Ponomarev<br>aibusiness.vc</p>
  `;

  const attachmentsText = hasReport
    ? [
        "TWO ATTACHMENTS",
        "",
        "The report (PDF). Start here. Your score, every signal explained, and the fixes in priority order. Measured on your domain today.",
        "",
        "The implementation kit (ZIP). Guide, backlog, schema patches, llms.txt draft, prompts, QA checklist. Plus your Agent Card: a machine readable company card drafted from your own site, ready to upload.",
      ]
    : [
        "ONE ATTACHMENT FOR NOW",
        "",
        "The implementation kit (ZIP). Guide, backlog, schema patches, llms.txt draft, prompts, QA checklist.",
        "",
        `About your personal report: our scanner could not read ${params.domain} automatically (usually a login wall or a firewall). Nothing is wrong with your order: we will run the measurement by hand and send your report within one business day, no action needed from you.`,
      ];

  const textContent = [
    hasReport
      ? "Your AI Visibility package is ready."
      : "Your AI Visibility kit is here, report to follow.",
    "",
    "Thank you for your trust, and for paying for an independent measurement rather than a marketing claim.",
    "",
    `Domain: ${params.domain}`,
    `Order ID: ${params.orderId}`,
    "",
    ...attachmentsText,
    "",
    "THREE OTHER THINGS YOU MIGHT WANT",
    "",
    "Check your competitors. Your report shows where you stand. The scan itself is free for any domain: run it on your closest competitor and see who an AI assistant understands better.",
    site + "/audit",
    "",
    "If you run an AI agent that talks to customers, a chatbot, an assistant, a booking or support bot, we test those too. It is a test purchase: ten real situations, and every finding checked against what your own website already promises, quoted word for word.",
    site + "/service-check",
    "",
    "If you are building something with AI yourself, tell us about it. We publish founder stories in Submit Your Story. Free, no payment, no strings.",
    site + "/submit-your-story",
    "",
    "Anything at all: a file that will not open, a figure you want to question, a refund within 14 days. Write to info@aibusiness.vc and I will answer personally.",
    "",
    "Sergei Ponomarev",
    "aibusiness.vc",
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

  const allowedVariants = allowedAuditVariantIds();
  if (allowedVariants.length === 0) {
    console.error("[lemonsqueezy] LEMONSQUEEZY_AUDIT_VARIANT_IDS is not set; refusing to fulfil");
    return NextResponse.json(
      { ok: false, error: "Fulfilment is not configured." },
      { status: 503 }
    );
  }

  const variantId = orderVariantId(attributes);
  if (!variantId || !allowedVariants.includes(variantId)) {
    // Someone else's product in the same account. Acknowledge so Lemon Squeezy
    // stops retrying, but send nothing.
    return NextResponse.json({ ok: true, ignored: true, reason: "variant_not_audit", variantId });
  }

  const planRaw = pickString(customData, "plan") ?? pickString(attributes, "plan") ?? "standard";
  const plan = planRaw === "deep" ? "deep" : "standard";
  const orderId =
    pickString(attributes, "order_number") ?? pickString(data, "id") ?? crypto.randomUUID();

  // Claim the event in shared storage before the send. A Lemon Squeezy retry
  // landing on a different instance sees the claim and stops; before Redis
  // each instance had its own memory and a retried webhook could send the
  // buyer a second package. The claim sits after validation on purpose: an
  // event rejected for a fixable reason (fulfilment not configured) must stay
  // claimable so the retry can succeed.
  const idempotencyKey = `ls:event:${eventId}`;
  const claim = await claimOnce(idempotencyKey, PROCESSING_TTL_SECONDS);
  if (claim === "duplicate" || processedEvents.has(eventId)) {
    return NextResponse.json({ ok: true, duplicate: true, eventId });
  }

  try {
    await sendPackageEmail({
      toEmail,
      domain,
      orderId,
      auditId,
      plan,
    });
    processedEvents.add(eventId);
    // The send is confirmed: extend the claim to cover the full retry window.
    if (claim === "claimed") {
      await persistClaim(idempotencyKey, DELIVERED_TTL_SECONDS);
    }
    return NextResponse.json({ ok: true, sent: true, eventId, toEmail, domain, orderId });
  } catch (error) {
    console.error("[audit_fulfillment_error]", error);
    // The send failed, so nothing was delivered: free the claim so the retry
    // Lemon Squeezy makes on this 500 can go through.
    if (claim === "claimed") {
      await releaseClaim(idempotencyKey);
    }
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown fulfillment error",
      },
      { status: 500 }
    );
  }
}
