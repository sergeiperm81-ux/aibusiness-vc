import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

type LeadSource = "roi_calculator" | "playbook_templates";

interface LeadRequestBody {
  email: string;
  source: LeadSource;
  payload?: Record<string, unknown>;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatNumber(value: unknown): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function formatCurrency(value: unknown): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    value
  );
}

function buildRoiEmail(payload: Record<string, unknown>) {
  const netMonthlyGain = formatCurrency(payload.netMonthlyGain);
  const annualNet = formatCurrency(payload.annualNet);
  const roiPercent = formatNumber(payload.roiPercent);
  const paybackMonths = formatNumber(payload.paybackMonths);

  const subject = "Your AI ROI Snapshot";
  const text = `Your AI ROI snapshot:

- Net Monthly Gain: ${netMonthlyGain}
- Annual Net Impact: ${annualNet}
- Year 1 ROI: ${roiPercent}%
- Payback Period (months): ${paybackMonths}

Built with aibusiness.vc ROI calculator.`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">Your AI ROI Snapshot</h2>
      <p style="margin:0 0 12px">Here is the result from your recent calculation:</p>
      <ul style="margin:0 0 16px;padding-left:18px">
        <li><strong>Net Monthly Gain:</strong> ${netMonthlyGain}</li>
        <li><strong>Annual Net Impact:</strong> ${annualNet}</li>
        <li><strong>Year 1 ROI:</strong> ${roiPercent}%</li>
        <li><strong>Payback Period:</strong> ${paybackMonths} months</li>
      </ul>
      <p style="margin:0">Built with <a href="https://aibusiness.vc/materials/roi-calculator">aibusiness.vc ROI calculator</a>.</p>
    </div>
  `;

  return { subject, text, html };
}

function buildTemplateEmail(payload: Record<string, unknown>) {
  const templateTitle =
    typeof payload.templateTitle === "string" && payload.templateTitle.trim().length > 0
      ? payload.templateTitle.trim()
      : "AI Playbook Template";
  const templateContent =
    typeof payload.templateContent === "string" && payload.templateContent.trim().length > 0
      ? payload.templateContent
      : "Template content is unavailable.";

  const subject = `Your Template: ${templateTitle}`;
  const text = `${templateTitle}

${templateContent}

Source: aibusiness.vc/playbook-templates`;

  const escaped = templateContent
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">${templateTitle}</h2>
      <p style="margin:0 0 12px">As requested, here is your template:</p>
      <pre style="white-space:pre-wrap;background:#f7f7f7;border:1px solid #e5e5e5;border-radius:8px;padding:12px;font-size:13px">${escaped}</pre>
      <p style="margin:12px 0 0">More templates: <a href="https://aibusiness.vc/materials/playbook-templates">aibusiness.vc/playbook-templates</a></p>
    </div>
  `;

  return { subject, text, html };
}

async function sendWithResend(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;

  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequestBody;
    const email = (body.email ?? "").trim().toLowerCase();
    const source = body.source;
    const payload = body.payload ?? {};

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    if (source !== "roi_calculator" && source !== "playbook_templates") {
      return NextResponse.json({ ok: false, error: "Unsupported source" }, { status: 400 });
    }

    const content = source === "roi_calculator" ? buildRoiEmail(payload) : buildTemplateEmail(payload);
    const delivered = await sendWithResend(email, content.subject, content.html, content.text);

    return NextResponse.json({
      ok: true,
      delivered,
      message: delivered
        ? "Email sent."
        : "Lead captured, but email delivery is not configured. Set RESEND_API_KEY and LEADS_FROM_EMAIL.",
    });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json({ ok: false, error: "Failed to process lead" }, { status: 500 });
  }
}
