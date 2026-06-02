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
    "Right now AI assistants have no 'map' of your site, so they skip or misread it. Create an llms.txt file at your domain root (yourdomain.com/llms.txt) listing your most important pages with a one-line description of each, plus a fuller llms-full.txt — a menu you hand to ChatGPT, Perplexity and Claude so they cite the right pages. Hand it to a developer (about half a day), or do it yourself by asking Claude Code / ChatGPT: 'Generate an llms.txt and llms-full.txt for my site from these top pages and a short description of what we do.'",
  schema:
    "Search and AI engines read your pages far better when the key facts are labelled in a machine-readable way. Add JSON-LD structured data (Schema.org) across the site — Organization on the homepage, Article on posts, FAQPage for any Q&A, and a 'speakable' block. Give it to a developer, or do it yourself by asking ChatGPT / Claude Code: 'Write JSON-LD structured data (Organization, Article, FAQPage, speakable) for this page and tell me exactly where to paste it.'",
  "ai-crawlers":
    "AI answer engines can only quote you if their bots are allowed to read your site — and many sites block them by accident. Allow the AI crawlers in your robots.txt. It's a 5-minute change: ask your developer, or paste this to ChatGPT: 'Write a robots.txt that allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and OAI-SearchBot, while keeping my admin pages blocked.'",
  citability:
    "AI lifts clear, factual sentences and ignores vague marketing copy. Restructure your top pages into a question-and-answer format with concrete numbers, dates and named sources, and add a short FAQ at the bottom — give the AI a clean sentence it can quote and attribute to you. Brief your content team, or ask ChatGPT / Claude: 'Rewrite this page into a clear Q&A format with concrete facts and a short FAQ, optimised to be quoted by AI search.'",
  "page-speed":
    "Slow pages get crawled less and frustrate visitors, hurting both ranking and AI visibility. Improve Core Web Vitals — compress and lazy-load images, strip unused JavaScript, enable caching and a CDN — aiming for a load time (LCP) under 2.5 seconds. Hand it to a developer, or ask Claude Code: 'Audit this page's Core Web Vitals and apply fixes — image compression, lazy loading, removing unused JS, and caching.'",
  "javascript-dependency":
    "Some of your content may only appear after scripts run, and many AI crawlers don't run scripts — so they see a blank page. Make sure important text is in the raw HTML via server-side rendering or static generation (quick test: open a page with JavaScript disabled — if the content vanishes, that's the issue). Ask your developer, or tell Claude Code: 'Make this page render its main content server-side so it's visible without JavaScript.'",
  https:
    "Security and trust signals influence how search and AI systems weigh your site. Serve every page over HTTPS with a valid certificate and add standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy). Routine for a developer, or ask Claude Code: 'Force HTTPS and add HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy to my site.'",
  structure:
    "Clear page structure helps AI extract and quote you accurately instead of garbling your message. Give each page one clear H1 and logical H2/H3 sections, a one- or two-sentence summary under the title, short paragraphs, and an FAQ at the end. Mostly an editing pass: brief your team, or ask ChatGPT / Claude: 'Restructure this page with one H1, clear H2/H3 sections, a summary under the title, and an FAQ at the end.'",
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
      (m) => `
      <li style="margin-bottom:12px">
        <strong style="color:#111">${escapeHtml(m.label)} (${m.score}/100)</strong><br/>
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

      <h2 style="font-size:16px;margin-top:24px">Your scores — all 8 metrics</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">${metricRows}</table>

      <h2 style="font-size:16px;margin-top:24px">Why this matters</h2>
      <p style="font-size:14px;color:#555">AI answer engines now send a fast-growing share of traffic, and they only cite sites they can read, parse and trust. The recommendations below show exactly how to make your content machine-readable (llms.txt, schema), crawlable by AI bots, and quotable (clear Q&A, numbers, sources).</p>

      <h2 style="font-size:16px;margin-top:24px">Recommendations</h2>
      <p style="font-size:14px;color:#555;margin-top:4px">Your weakest areas, in priority order. You don't have to do them yourself — hand each one to your developer as a task. Or, if you're a hands-on founder, paste the suggested prompt straight into ChatGPT or Claude Code and let it do the heavy lifting. Either way, these are the biggest levers for getting found and cited by ChatGPT, Perplexity, Gemini and Google's AI Overviews.</p>
      <ol style="padding-left:18px;margin-top:8px">${planItems || "<li>No critical gaps — you're in good shape. Keep content fresh and add FAQ schema.</li>"}</ol>

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
    `YOUR SCORES — ALL METRICS:`,
    ...audit.metrics.map((m) => `- ${m.label}: ${m.score}/100 (${sevWord(m.severity)})`),
    ``,
    `RECOMMENDATIONS:`,
    ...(weak.length
      ? weak.map((m, i) => `${i + 1}. ${m.label} (${m.score}/100): ${fixFor(m)}`)
      : ["No critical gaps — keep content fresh and add FAQ schema."]),
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
