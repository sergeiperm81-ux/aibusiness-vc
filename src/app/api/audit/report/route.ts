import { NextResponse } from "next/server";
import { getLiveQuickAudit } from "@/lib/audit/live";
import type { AuditMetric, QuickAudit } from "@/lib/audit/mock";
import { sendBrevoEmail, upsertBrevoContact, isValidEmail, escapeHtml } from "@/lib/email/brevo";

export const runtime = "nodejs";
export const maxDuration = 30;

const SITE = "https://aibusiness.vc";

// Concrete GEO fix per metric key — used to build the "action plan".
const FIXES: Record<string, string> = {
  "llms-txt":
    "Add an llms.txt (and llms-full.txt) file at your domain root so AI engines know what to read and cite.",
  schema:
    "Add JSON-LD structured data — Organization, Article, FAQPage and 'speakable' — so answer engines can parse your pages.",
  "ai-crawlers":
    "Explicitly allow GPTBot, ClaudeBot, PerplexityBot and Google-Extended in robots.txt — these crawlers feed AI answers.",
  citability:
    "Restructure content into clear questions and answers with specific numbers, dates and named sources — the format LLMs prefer to quote.",
  "page-speed":
    "Improve Core Web Vitals (LCP / INP / CLS). Slow pages get crawled and cited less.",
  "javascript-dependency":
    "Render key content server-side so crawlers see it without executing JavaScript.",
  https:
    "Serve everything over HTTPS and add security headers (HSTS, X-Content-Type-Options, a Content-Security-Policy).",
  structure:
    "Use a clear H1/H2 hierarchy, add a short summary near the top and an FAQ block at the bottom of each page.",
};

function fixFor(metric: AuditMetric): string {
  return FIXES[metric.key] ?? `Improve "${metric.label}" — ${metric.shortHuman}`;
}

function sevWord(s: AuditMetric["severity"]): string {
  return s === "critical" ? "Critical" : s === "warning" ? "Needs work" : s === "ok" ? "Acceptable" : "Healthy";
}

function sevColor(s: AuditMetric["severity"]): string {
  return s === "critical" ? "#ef4444" : s === "warning" ? "#f59e0b" : s === "ok" ? "#eab308" : "#10b981";
}

function buildUserEmail(audit: QuickAudit): { subject: string; html: string; text: string } {
  // Always recommend the lowest-scoring areas (even a 96/100 site has room to improve).
  const weak = audit.metrics
    .filter((m) => m.score < 100)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const subject = `Your AI Visibility Report — ${audit.domain} scored ${audit.overallScore}/100`;

  const metricRows = audit.metrics
    .slice()
    .sort((a, b) => a.score - b.score)
    .map(
      (m) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;color:#111">${escapeHtml(m.label)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:700;color:${sevColor(m.severity)};text-align:right">${m.score}/100</td>
        <td style="padding:8px 0 8px 12px;border-bottom:1px solid #eee;font-size:12px;color:${sevColor(m.severity)}">${sevWord(m.severity)}</td>
      </tr>`
    )
    .join("");

  const planItems = weak
    .map(
      (m, i) => `
      <li style="margin-bottom:12px">
        <strong style="color:#111">${i + 1}. ${escapeHtml(m.label)} (${m.score}/100)</strong><br/>
        <span style="color:#555;font-size:14px">${escapeHtml(fixFor(m))}</span>
      </li>`
    )
    .join("");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:640px;margin:0 auto;color:#222">
    <div style="background:#0a0a0a;padding:24px;border-radius:12px 12px 0 0">
      <p style="margin:0;color:#f59e0b;font-size:12px;letter-spacing:1px;text-transform:uppercase">AI Business · Visibility Report</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:22px">${escapeHtml(audit.domain)}</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px">
      <p style="font-size:16px">Here's your full AI visibility report. Your site scored
        <strong style="color:${audit.overallScore < 65 ? "#ef4444" : "#10b981"}">${audit.overallScore}/100</strong>
        (industry average ${audit.industryAverage}/100).</p>

      <h2 style="font-size:16px;margin-top:24px">Your GEO action plan</h2>
      <p style="font-size:14px;color:#555;margin-top:4px">These are your lowest-scoring areas and exactly how to push each one higher — the biggest levers for getting found and cited by ChatGPT, Perplexity, Gemini and Google's AI Overviews.</p>
      <ol style="padding-left:18px;margin-top:8px">${planItems || "<li>No critical gaps — you're in good shape. Keep content fresh and add FAQ schema.</li>"}</ol>

      <h2 style="font-size:16px;margin-top:24px">All 8 metrics</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">${metricRows}</table>

      <h2 style="font-size:16px;margin-top:24px">Why this matters</h2>
      <p style="font-size:14px;color:#555">AI answer engines now send a fast-growing share of traffic, and they only cite sites they can read, parse and trust. The fixes above make your content machine-readable (llms.txt, schema), crawlable by AI bots, and quotable (clear Q&A, numbers, sources).</p>

      <div style="margin-top:24px;text-align:center">
        <a href="${SITE}/audit" style="display:inline-block;background:#f59e0b;color:#000;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px">Re-run your scan anytime →</a>
      </div>

      <p style="font-size:12px;color:#999;margin-top:24px">You received this because you requested an AI visibility report at aibusiness.vc. Reply to this email if you have questions.</p>
    </div>
  </div>`;

  const text = [
    `AI Visibility Report — ${audit.domain}`,
    `Score: ${audit.overallScore}/100 (industry average ${audit.industryAverage}/100)`,
    ``,
    `GEO ACTION PLAN:`,
    ...(weak.length
      ? weak.map((m, i) => `${i + 1}. ${m.label} (${m.score}/100): ${fixFor(m)}`)
      : ["No critical gaps — keep content fresh and add FAQ schema."]),
    ``,
    `ALL METRICS:`,
    ...audit.metrics.map((m) => `- ${m.label}: ${m.score}/100 (${sevWord(m.severity)})`),
    ``,
    `Re-run your scan: ${SITE}/audit`,
  ].join("\n");

  return { subject, html, text };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; auditId?: string; consent?: boolean };
    const email = (body.email ?? "").trim().toLowerCase();
    const auditId = (body.auditId ?? "").trim();
    const consent = body.consent === true;

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json(
        { ok: false, error: "Please tick the box so we can email you the report." },
        { status: 400 }
      );
    }
    if (!auditId) {
      return NextResponse.json({ ok: false, error: "Missing audit." }, { status: 400 });
    }

    // Re-run the scan server-side (don't trust client-provided scores).
    const audit = await getLiveQuickAudit(auditId);

    const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
    const ip = forwardedFor.split(",")[0]?.trim() ?? "";
    const lead = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      email,
      domain: audit.domain,
      score: audit.overallScore,
      auditId,
      ip,
    };
    // Captured lead — appears in logs / leads dashboard.
    console.log("[audit_lead]", JSON.stringify(lead));

    // 1) Send the report to the visitor.
    const userEmail = buildUserEmail(audit);
    const userResult = await sendBrevoEmail({
      to: email,
      subject: userEmail.subject,
      html: userEmail.html,
      text: userEmail.text,
    });
    if (userResult.error) console.error("[audit_report_user_email]", userResult.error);

    // 2) Notify the owner (this is where leads are collected).
    const ownerTo = (process.env.LEADS_TO_EMAIL?.trim() || process.env.LEADS_DASH_USER?.trim() || "").toLowerCase();
    if (ownerTo && isValidEmail(ownerTo) && ownerTo !== email) {
      await sendBrevoEmail({
        to: ownerTo,
        replyTo: email,
        subject: `[AUDIT LEAD] ${email} — ${audit.domain} (${audit.overallScore}/100)`,
        html: `<p><strong>New AI Audit lead</strong></p>
          <p>Email: ${escapeHtml(email)}<br/>Domain: ${escapeHtml(audit.domain)}<br/>Score: ${audit.overallScore}/100<br/>Time: ${escapeHtml(lead.timestamp)}<br/>IP: ${escapeHtml(ip || "-")}</p>`,
        text: `New AI Audit lead\nEmail: ${email}\nDomain: ${audit.domain}\nScore: ${audit.overallScore}/100\nTime: ${lead.timestamp}\nIP: ${ip || "-"}`,
      });
    }

    // 3) Save the lead to our contact database (Brevo) — ready for future campaigns.
    const contact = await upsertBrevoContact({
      email,
      attributes: {
        DOMAIN: audit.domain,
        AUDIT_SCORE: audit.overallScore,
        SIGNUP_SOURCE: "ai_audit",
        CONSENT: true,
      },
    });
    if (contact.error) console.error("[audit_lead_contact]", contact.error);

    return NextResponse.json({
      ok: true,
      delivered: userResult.ok,
      score: audit.overallScore,
      domain: audit.domain,
      message: userResult.ok
        ? "Report sent — check your inbox (and spam, just in case)."
        : "Saved. Email delivery is being set up; we'll send it shortly.",
    });
  } catch (error) {
    console.error("[audit_report_error]", error);
    return NextResponse.json({ ok: false, error: "Something went wrong. Try again." }, { status: 500 });
  }
}
