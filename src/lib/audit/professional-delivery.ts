/**
 * The outside world of a paid AI Person Scan: the discount code in Lemon
 * Squeezy, the report email, the delay notice and the owner's alerts.
 *
 * Every string that came from a model or a buyer is escaped before it goes
 * into HTML. The report itself travels as a PDF attachment, where nothing is
 * interpreted.
 */

import { createHmac } from "node:crypto";
import { buildPersonReportPdf, CONTACT_EMAIL, PRODUCT_NAME } from "./person-report-pdf";
import type { ProfessionalOrder } from "./professional-order";
import type { DiscountSpec, ReportEmail } from "./professional-worker";
import { computeAnswerSignals } from "./answer-check-report";

export const FULL_PRICE = "€14.97";
export const CODE_PRICE = "€7.47";

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

/* ------------------------------------------------------------ Lemon Squeezy */

export async function createLemonDiscount(spec: DiscountSpec, config: { apiKey: string; storeId: string; variantId: string }): Promise<void> {
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
          variants: { data: [{ type: "variants", id: config.variantId }] },
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

export function reportEmailContent(order: ProfessionalOrder): { subject: string; html: string; text: string } {
  const name = order.subject.name;
  const missing = order.missingProviders.length > 0;
  const lines: { html: string; text: string }[] = [
    {
      html: `<p>Your AI Person Scan for <strong>${escapeHtml(name)}</strong> is attached as a PDF.</p>`,
      text: `Your AI Person Scan for ${name} is attached as a PDF.`,
    },
    {
      html: "<p>Start with the first pages: who the AI models say this is, what they do, and whether any red flag came up. The recommendations follow, and every answer with its sources is in the appendix.</p>",
      text: "Start with the first pages: who the AI models say this is, what they do, and whether any red flag came up. The recommendations follow, and every answer with its sources is in the appendix.",
    },
  ];
  if (missing) {
    const which = order.missingProviders.map((id) => PROVIDER_NAMES[id] ?? id).join(", ");
    lines.push({
      html: `<p><strong>One model was missing.</strong> ${escapeHtml(which)} did not answer after several tries, so this report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: <strong>${escapeHtml(order.apologyCode ?? "we will send your code by hand")}</strong></p>`,
      text: `One model was missing. ${which} did not answer after several tries, so this report has four models instead of five. We are sorry. Here is a free check for you, or for anyone you choose: ${order.apologyCode ?? "we will send your code by hand"}`,
    });
  }
  if (order.discountCode) {
    lines.push({
      html: `<p><strong>Your bonus: 7 checks at half price, yours to give away.</strong> ${CODE_PRICE} instead of ${FULL_PRICE}, for up to 7 more checks. Give the code to friends, family, colleagues and partners so they can see what AI says about them, or use it yourself before you work with someone new.<br><span style="font-size:18px;letter-spacing:1px"><strong>${escapeHtml(order.discountCode)}</strong></span><br><a href="https://aibusiness.vc/professional-scan">aibusiness.vc/professional-scan</a></p>`,
      text: `Your bonus: 7 checks at half price, yours to give away. ${CODE_PRICE} instead of ${FULL_PRICE}, for up to 7 more checks. Give the code to friends, family, colleagues and partners so they can see what AI says about them, or use it yourself before you work with someone new.\nCode: ${order.discountCode}\nhttps://aibusiness.vc/professional-scan`,
    });
  }
  lines.push({
    html: `<p style="font-size:12px;color:#666">This report shows what AI models say. It is not a background check and must not be used to decide on employment, tenancy, credit or insurance.</p><p>Questions, or a file that will not open: write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and I will answer personally.</p><p>Sergei Ponomarev<br>aibusiness.vc</p>`,
    text: `This report shows what AI models say. It is not a background check and must not be used to decide on employment, tenancy, credit or insurance.\n\nQuestions, or a file that will not open: write to ${CONTACT_EMAIL} and I will answer personally.\n\nSergei Ponomarev\naibusiness.vc`,
  });
  return {
    subject: `${PRODUCT_NAME}: ${name}`,
    html: `<h2>What AI says about ${escapeHtml(name)}</h2>${lines.map((l) => l.html).join("\n")}`,
    text: lines.map((l) => l.text).join("\n\n"),
  };
}

export async function sendReportEmail(email: ReportEmail, config: MailConfig): Promise<void> {
  const notFoundKeys = new Set(
    computeAnswerSignals(email.check)
      .filter((s) => s.nonAnswer.notFound)
      .map((s) => `${s.factId}/${s.providerId}`)
  );
  const pdf = await buildPersonReportPdf({
    name: email.order.subject.name,
    profileUrl: email.order.subject.profileUrl,
    check: email.check,
    synthesis: email.synthesis,
    notFoundKeys,
  });
  const content = reportEmailContent(email.order);
  const slug = email.order.subject.name.normalize("NFKD").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "report";
  await sendBrevo(config, {
    to: email.order.email,
    ...content,
    attachment: [{ name: `AI-Person-Scan-${slug}.pdf`, content: Buffer.from(pdf).toString("base64") }],
    bccOwner: true,
  });
}

export async function sendDelayEmail(order: ProfessionalOrder, config: MailConfig): Promise<void> {
  const text =
    `Your AI Person Scan for ${order.subject.name} is taking longer than usual: one of the AI models is not answering right now. ` +
    `We keep trying and will send it as soon as they answer. You do not need to do anything. ` +
    `If it cannot be made, you get your money back in full.\n\nSergei Ponomarev\naibusiness.vc`;
  await sendBrevo(config, {
    to: order.email,
    subject: `${PRODUCT_NAME}: your report is on its way`,
    html: `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`,
    text,
  });
}

export async function sendGiveUpEmail(order: ProfessionalOrder, config: MailConfig): Promise<void> {
  const text =
    `We could not complete your AI Person Scan for ${order.subject.name}: the AI models it needs did not answer. ` +
    `We are sorry. Your payment will be refunded in full to your original payment method.\n\n` +
    `Sergei Ponomarev\naibusiness.vc`;
  await sendBrevo(config, {
    to: order.email,
    subject: `${PRODUCT_NAME}: we could not complete your report, full refund`,
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
