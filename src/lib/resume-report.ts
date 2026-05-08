import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  buildResumePaidPack,
  runResumeAudit,
  type ResumeAuditInput,
} from "@/lib/resume-audit";

export interface BuildResumeReportInput {
  resumeText: string;
  targetRole: string;
  orderId: string;
  email?: string;
}

type DrawCtx = {
  page: ReturnType<PDFDocument["addPage"]>;
  y: number;
};

function wrapText(text: string, maxChars = 95): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildResumeReportPdf(input: BuildResumeReportInput): Promise<{
  filename: string;
  bytes: Uint8Array;
}> {
  const auditInput: ResumeAuditInput = {
    resumeText: input.resumeText,
    targetRole: input.targetRole,
  };
  const audit = runResumeAudit(auditInput);
  const paidPack = buildResumePaidPack(auditInput, audit);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const width = 595;
  const height = 842;
  const margin = 48;

  const addPage = (): DrawCtx => {
    const page = doc.addPage([width, height]);
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width,
      height: 120,
      color: rgb(0.05, 0.08, 0.13),
    });
    return { page, y: height - 44 };
  };

  let ctx = addPage();

  const drawHeader = (title: string, subtitle: string) => {
    ctx.page.drawText(title, {
      x: margin,
      y: height - 52,
      size: 20,
      font: bold,
      color: rgb(1, 1, 1),
    });
    ctx.page.drawText(subtitle, {
      x: margin,
      y: height - 74,
      size: 10,
      font,
      color: rgb(0.87, 0.9, 0.95),
    });
    ctx.y = height - 145;
  };

  const ensureSpace = (required = 40) => {
    if (ctx.y < margin + required) {
      ctx = addPage();
      drawHeader("AI Resume Report", "Continued");
    }
  };

  const heading = (text: string) => {
    ensureSpace(50);
    ctx.page.drawText(text, {
      x: margin,
      y: ctx.y,
      size: 14,
      font: bold,
      color: rgb(0.06, 0.1, 0.16),
    });
    ctx.y -= 22;
  };

  const paragraph = (text: string) => {
    const lines = wrapText(text, 92);
    for (const line of lines) {
      ensureSpace(26);
      ctx.page.drawText(line, {
        x: margin,
        y: ctx.y,
        size: 10.5,
        font,
        color: rgb(0.13, 0.16, 0.2),
      });
      ctx.y -= 15;
    }
    ctx.y -= 6;
  };

  const bulletList = (items: string[]) => {
    for (const item of items) {
      const lines = wrapText(item, 86);
      for (let i = 0; i < lines.length; i++) {
        ensureSpace(24);
        ctx.page.drawText(i === 0 ? `- ${lines[i]}` : `  ${lines[i]}`, {
          x: margin,
          y: ctx.y,
          size: 10.5,
          font,
          color: rgb(0.12, 0.15, 0.2),
        });
        ctx.y -= 14;
      }
    }
    ctx.y -= 6;
  };

  drawHeader(
    "AI Resume Action Report",
    `Order #${input.orderId} | Role: ${input.targetRole} | Generated ${new Date().toISOString().slice(0, 10)}`
  );

  heading("1) Executive Summary");
  paragraph(
    `Overall score: ${audit.overallScore}/100. ${audit.verdict} This report explains exactly what to fix to improve shortlist probability in AI-first screening workflows.`
  );
  paragraph(
    `Primary gap: ${audit.metrics
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 1)
      .map((m) => `${m.label} (${m.score}/100)`)
      .join(", ")}.`
  );

  heading("2) AI Recruiter Scores");
  bulletList(
    audit.engineScores.map(
      (s) => `${s.label}: ${s.score}/100. ${s.note}`
    )
  );

  heading("3) Core Diagnostics");
  bulletList(
    audit.metrics.map((m) => `${m.label}: ${m.score}/100. ${m.note}`)
  );

  heading("4) Missing Signals");
  paragraph(
    `Missing sections: ${audit.missingSections.length > 0 ? audit.missingSections.join(", ") : "none"}`
  );
  paragraph(
    `Missing role keywords: ${audit.missingKeywords.length > 0 ? audit.missingKeywords.join(", ") : "none"}`
  );

  heading("5) Priority Fix Plan");
  bulletList(paidPack.implementationPlan);

  heading("6) Rewritten Summary (Use This)");
  paragraph(paidPack.rewrittenSummary);

  heading("7) Rewritten Achievement Bullets");
  bulletList(
    paidPack.rewrittenBullets.length > 0
      ? paidPack.rewrittenBullets
      : ["No strong bullets found in source. Add achievement bullets with metrics."]
  );

  heading("8) AI Instructions for Fast Improvement");
  bulletList(audit.aiPrompts);

  heading("9) Interview Positioning Snippets");
  bulletList(paidPack.interviewSnippets);

  heading("10) Next 24-Hour Execution Checklist");
  bulletList([
    "Replace old summary with rewritten summary.",
    "Update at least 6 bullets with quantified outcomes.",
    "Add missing role keywords naturally to top half of resume.",
    "Keep ATS-safe formatting (single column, standard headings, no tables).",
    "Run one final AI polish pass, then export clean PDF.",
  ]);

  const safeRole = input.targetRole.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const filename = `resume-audit-report-${safeRole || "target-role"}-${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;

  return { filename, bytes: await doc.save() };
}
