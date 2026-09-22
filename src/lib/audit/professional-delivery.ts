/**
 * The outside world of a paid AI Person Scan: the discount code in Lemon
 * Squeezy, the report email, the delay notice and the owner's alerts.
 *
 * Every string that came from a model or a buyer is escaped before it goes
 * into HTML. The report itself travels as a PDF attachment, where nothing is
 * interpreted.
 */

import { createHmac } from "node:crypto";
import { buildPersonReportPdf, COMPANY_PRODUCT_NAME, CONTACT_EMAIL, PRODUCT_NAME } from "./person-report-pdf";
import type { ProfessionalOrder } from "./professional-order";
import type { DiscountSpec, ReportEmail } from "./professional-worker";
import { computeAnswerSignals } from "./answer-check-report";

export const FULL_PRICE = "€14.97";

const PROVIDER_NAMES: Readonly<Record<string, string>> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Gemini",
  perplexity: "Perplexity",
  xai: "Grok",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** A code Lemon Squeezy accepts (uppercase letters and digits), the same every time for the same seed. */
export function codeFor(seed: string, secret: string): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const digest = createHmac("sha256", secret).update(seed).digest();
  const body = [...digest.subarray(0, 8)].map((byte) => alphabet[byte % alphabet.length]).join("");
  return `PRO${body}`;
}

/** The product the order is for, as the buyer saw it at checkout. */
export function productNameFor(order: ProfessionalOrder): string {
  return order.subject.kind === "company" ? COMPANY_PRODUCT_NAME : PRODUCT_NAME;
}

/* ------------------------------------------------------------ Lemon Squeezy */

/** The code works on every variant given: both scans, so a bonus from one can be spent on the other. */
export async function createLemonDiscount(
  spec: DiscountSpec,
  config: { apiKey: string; storeId: string; variantIds: readonly string[] }
): Promise<void> {
  const response = await fetch("https://api.lemonsqueezy.com/v1/discounts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "discounts",
        attributes: {
          name: spec.name.slice(0, 120),
          code: spec.code,
          amount: spec.percent,
          amount_type: "percent",
          is_limited_to_products: true,
          is_limited_redemptions: true,
          max_redemptions: spec.maxRedemptions,
          duration: "once",
        },
        relationships: {
          store: { data: { type: "stores", id: config.storeId } },
          variants: { data: config.variantIds.map((id) => ({ type: "variants", id })) },
        },
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (response.ok) return;
  const detail = (await response.text()).slice(0, 400);
  // The same code again means an earlier run created it and then stopped before saving: that is success.
  if (response.status === 422 && /code/i.test(detail) && /taken|exists|already|unique/i.test(detail)) return;
  throw new Error(`Lemon Squeezy ${response.status}: ${detail}`);
}

/* ------------------------------------------------------------------- Brevo */

interface MailConfig {
  readonly apiKey: string;
  readonly from: string;
  readonly owner: string | null;
}

async function sendBrevo(
  config: MailConfig,
  message: { to: string; subject: string; html: string; text: string; attachment?: { name: string; content: string }[]; bccOwner?: boolean }
): Promise<void> {
  const payload: Record<string, unknown> = {
    sender: { email: config.from, name: "AI Business" },
    to: [{ email: message.to }],
    subject: message.subject,
    htmlContent: message.html,
    textContent: message.text,
    ...(message.attachment ? { attachment: message.attachment } : {}),
    ...(message.bccOwner && config.owner ? { bcc: [{ email: config.owner }] } : {}),
  };
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json", "api-key": config.apiKey },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Brevo ${response.status}: ${(await response.text()).slice(0, 300)}`);
}

const BONUS_LEAD = "Your bonus: a code for 50% off up to 7 additional AI Person or AI Company Scans, yours to give away.";
const BONUS_BODY =
  "Give the code to friends, family, colleagues and partners so they can see what AI says about them, or use it yourself before you work with someone new.";

function bonusHtml(code: string): string {
  return `<p><strong>${BONUS_LEAD}</strong> ${BONUS_BODY}<br><span style="font-size:18px;letter-spacing:1px"><strong>${escapeHtml(code)}</strong></span><br><a href="https://aibusiness.vc/ai-tools">aibusiness.vc/ai-tools</a></p>`;
}

function bonusText(code: string): string {
  return `${BONUS_LEAD} ${BONUS_BODY}\nCode: ${code}\nhttps://aibusiness.vc/ai-tools`;
}

function apologyHtml(order: ProfessionalOrder): string {
  const which = order.missingProviders.map((id) => PROVIDER_NAMES[id] ?? id).join(", ");
  return `<p><strong>One model was missing.</strong> ${escapeHtml(which)} did not answer after several tries, so your report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: <strong>${escapeHtml(order.apologyCode ?? "")}</strong></p>`;
}

/** The disclaimer under every letter, for the scan the order is. */
function disclaimer(order: ProfessionalOrder): { html: string; text: string } {
  const line =
    order.subject.kind === "company"
      ? "This report shows what AI models say about the organisation represented by the website you gave. It is not a registry extract, a credit report, legal advice or full due diligence, and it must not be the sole basis for a contract, a payment or an investment."
      : "This report shows what AI models say. It is not a background check and must not be used to decide on employment, tenancy, credit or insurance.";
  return { html: `<p style="font-size:12px;color:#666">${line}</p>`, text: line };
}

/** The letter that brings a code the report's letter could not: sent once, only when a code was owed and is now made. */
export function codesEmailContent(order: ProfessionalOrder): { subject: string; html: string; text: string } {
  const parts: { html: string; text: string }[] = [
    {
      html: `<p>Your ${productNameFor(order)} report for <strong>${escapeHtml(order.subject.name)}</strong> went out earlier without its code. Here it is.</p>`,
      text: `Your ${productNameFor(order)} report for ${order.subject.name} went out earlier without its code. Here it is.`,
    },
  ];
  if (order.discountCode) parts.push({ html: bonusHtml(order.discountCode), text: bonusText(order.discountCode) });
  if (order.apologyCode) {
    const which = order.missingProviders.map((id) => PROVIDER_NAMES[id] ?? id).join(", ");
    parts.push({ html: apologyHtml(order), text: `One model was missing. ${which} did not answer after several tries, so your report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: ${order.apologyCode}` });
  }
  parts.push({
    html: `<p>Questions: write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and I will answer personally.</p><p>Sergei Ponomarev<br>aibusiness.vc</p>`,
    text: `Questions: write to ${CONTACT_EMAIL} and I will answer personally.\n\nSergei Ponomarev\naibusiness.vc`,
  });
  return {
    subject: `${productNameFor(order)}: your code`,
    html: parts.map((p) => p.html).join("\n"),
    text: parts.map((p) => p.text).join("\n\n"),
  };
}

export async function sendCodesEmail(order: ProfessionalOrder, config: MailConfig): Promise<void> {
  await sendBrevo(config, { to: order.email, ...codesEmailContent(order), bccOwner: true });
}

export function reportEmailContent(order: ProfessionalOrder): { subject: string; html: string; text: string } {
  const name = order.subject.name;
  const missing = order.missingProviders.length > 0;
  const lines: { html: string; text: string }[] = [
    {
      html: `<p>Your ${productNameFor(order)} for <strong>${escapeHtml(name)}</strong> is attached as a PDF.</p>`,
      text: `Your ${productNameFor(order)} for ${name} is attached as a PDF.`,
    },
    {
      html: "<p>Start with the first pages: who the AI models say is behind the name, what they do, and whether any red flag came up. The recommendations follow, and every answer with its sources is in the appendix.</p>",
      text: "Start with the first pages: who the AI models say is behind the name, what they do, and whether any red flag came up. The recommendations follow, and every answer with its sources is in the appendix.",
    },
  ];
  if (missing) {
    const which = order.missingProviders.map((id) => PROVIDER_NAMES[id] ?? id).join(", ");
    lines.push({
      html: `<p><strong>One model was missing.</strong> ${escapeHtml(which)} did not answer after several tries, so this report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: <strong>${escapeHtml(order.apologyCode ?? "it follows in a separate email")}</strong></p>`,
      text: `One model was missing. ${which} did not answer after several tries, so this report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: ${order.apologyCode ?? "it follows in a separate email"}`,
    });
  }
  if (order.discountCode) {
    lines.push({
      html: bonusHtml(order.discountCode),
      text: bonusText(order.discountCode),
    });
  }
  const note = disclaimer(order);
  lines.push({
    html: `${note.html}<p>Questions, or a file that will not open: write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and I will answer personally.</p><p>Sergei Ponomarev<br>aibusiness.vc</p>`,
    text: `${note.text}\n\nQuestions, or a file that will not open: write to ${CONTACT_EMAIL} and I will answer personally.\n\nSergei Ponomarev\naibusiness.vc`,
  });
  return {
    subject: `${productNameFor(order)}: ${name}`,
    html: `<h2>What AI says about ${escapeHtml(name)}</h2>${lines.map((l) => l.html).join("\n")}`,
    text: lines.map((l) => l.text).join("\n\n"),
  };
}

/** The report PDF for a stored order; `sample` makes the public, appendix-free version. */
export async function reportPdfFor(email: ReportEmail, sample = false): Promise<Uint8Array> {
  const notFoundKeys = new Set(
    computeAnswerSignals(email.check)
      .filter((s) => s.nonAnswer.notFound)
      .map((s) => `${s.factId}/${s.providerId}`)
  );
  return buildPersonReportPdf({
    name: email.order.subject.name,
    profileUrl: email.order.subject.profileUrl,
    check: email.check,
    synthesis: email.synthesis,
    notFoundKeys,
    sample,
  });
}

export async function sendReportEmail(email: ReportEmail, config: MailConfig): Promise<void> {
  const pdf = await reportPdfFor(email);
  const content = reportEmailContent(email.order);
  const slug = email.order.subject.name.normalize("NFKD").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "report";
  await sendBrevo(config, {
    to: email.order.email,
    ...content,
    attachment: [{ name: `${productNameFor(email.order).replace(/ /g, "-")}-${slug}.pdf`, content: Buffer.from(pdf).toString("base64") }],
    bccOwner: true,
  });
}

export async function sendDelayEmail(order: ProfessionalOrder, config: MailConfig): Promise<void> {
  const text =
    `Your ${productNameFor(order)} for ${order.subject.name} is taking longer than usual: one of the AI models is not answering right now. ` +
    `We keep trying and will send it as soon as they answer. You do not need to do anything. ` +
    `If it cannot be made, you get your money back in full.\n\nSergei Ponomarev\naibusiness.vc`;
  await sendBrevo(config, {
    to: order.email,
    subject: `${productNameFor(order)}: your report is on its way`,
    html: `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`,
    text,
  });
}

export async function sendGiveUpEmail(order: ProfessionalOrder, config: MailConfig): Promise<void> {
  const text =
    `We could not complete your ${productNameFor(order)} for ${order.subject.name}: the AI models it needs did not answer. ` +
    `We are sorry. Your payment will be refunded in full to your original payment method.\n\n` +
    `Sergei Ponomarev\naibusiness.vc`;
  await sendBrevo(config, {
    to: order.email,
    subject: `${productNameFor(order)}: we could not complete your report, full refund`,
    html: `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`,
    text,
    bccOwner: true,
  });
}

export async function sendOwnerAlert(subject: string, text: string, config: MailConfig): Promise<void> {
  if (!config.owner) {
    console.error(`[pscan/owner] ${subject}: ${text}`);
    return;
  }
  await sendBrevo(config, { to: config.owner, subject, html: `<pre>${escapeHtml(text)}</pre>`, text });
}
