/**
 * Renders the AI Visibility report a paying customer receives.
 *
 * Replaces a one-page template that carried no figures at all — it said
 * "calculated per audited domain" where the number should have been. A report
 * that shows the buyer someone else's placeholder is worse than no report, so
 * every value here comes from the scan of their own domain.
 */

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { AuditMetric, QuickAudit } from "@/lib/audit/mock";
import { fixFor } from "@/lib/audit/fixes";
import type { BrandKnowledge } from "@/lib/audit/brand-knowledge";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const INK = rgb(0.09, 0.09, 0.11);
const MUTED = rgb(0.42, 0.42, 0.47);
const ACCENT = rgb(0.85, 0.47, 0.02);
const HAIRLINE = rgb(0.88, 0.88, 0.9);

const SEVERITY_COLOUR: Record<AuditMetric["severity"], ReturnType<typeof rgb>> = {
  critical: rgb(0.86, 0.15, 0.15),
  warning: rgb(0.85, 0.47, 0.02),
  ok: rgb(0.72, 0.62, 0.05),
  good: rgb(0.02, 0.55, 0.34),
};

const SEVERITY_WORD: Record<AuditMetric["severity"], string> = {
  critical: "Critical",
  warning: "Needs work",
  ok: "Acceptable",
  good: "Healthy",
};

interface Fonts {
  readonly regular: PDFFont;
  readonly bold: PDFFont;
}

/** Wraps to the measured width of the actual font rather than a character count. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * pdf-lib's standard fonts are WinAnsi-encoded and throw on characters outside
 * it — model output is full of typographic dashes and curly quotes.
 */
function toWinAnsi(text: string): string {
  return text
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7E¡-ÿ]/g, "");
}

class Doc {
  private page: PDFPage;
  private y: number;

  constructor(
    private readonly doc: PDFDocument,
    private readonly fonts: Fonts
  ) {
    this.page = this.newPage();
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private newPage(): PDFPage {
    return this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  }

  private ensure(space: number): void {
    if (this.y - space < MARGIN + 24) {
      this.page = this.newPage();
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  gap(amount: number): void {
    this.y -= amount;
  }

  heading(text: string, size = 15): void {
    this.ensure(size + 14);
    this.page.drawText(toWinAnsi(text), {
      x: MARGIN,
      y: this.y - size,
      size,
      font: this.fonts.bold,
      color: INK,
    });
    this.y -= size + 10;
  }

  kicker(text: string): void {
    this.ensure(18);
    this.page.drawText(toWinAnsi(text.toUpperCase()), {
      x: MARGIN,
      y: this.y - 9,
      size: 8.5,
      font: this.fonts.bold,
      color: ACCENT,
    });
    this.y -= 20;
  }

  paragraph(text: string, options: { size?: number; muted?: boolean; indent?: number } = {}): void {
    const size = options.size ?? 10;
    const indent = options.indent ?? 0;
    const lines = wrap(toWinAnsi(text), this.fonts.regular, size, CONTENT_WIDTH - indent);

    for (const line of lines) {
      this.ensure(size + 5);
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y - size,
        size,
        font: this.fonts.regular,
        color: options.muted ? MUTED : INK,
      });
      this.y -= size + 4.5;
    }
  }

  rule(): void {
    this.ensure(12);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y - 6 },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y - 6 },
      thickness: 0.7,
      color: HAIRLINE,
    });
    this.y -= 16;
  }

  metricRow(metric: AuditMetric): void {
    this.ensure(46);
    const colour = SEVERITY_COLOUR[metric.severity];

    this.page.drawText(toWinAnsi(metric.label), {
      x: MARGIN,
      y: this.y - 11,
      size: 11,
      font: this.fonts.bold,
      color: INK,
    });

    const scoreText = `${metric.score}/100`;
    const scoreWidth = this.fonts.bold.widthOfTextAtSize(scoreText, 11);
    this.page.drawText(scoreText, {
      x: PAGE_WIDTH - MARGIN - scoreWidth,
      y: this.y - 11,
      size: 11,
      font: this.fonts.bold,
      color: colour,
    });

    const word = SEVERITY_WORD[metric.severity];
    const wordWidth = this.fonts.regular.widthOfTextAtSize(word, 8.5);
    this.page.drawText(word, {
      x: PAGE_WIDTH - MARGIN - scoreWidth - wordWidth - 10,
      y: this.y - 11,
      size: 8.5,
      font: this.fonts.regular,
      color: MUTED,
    });

    this.y -= 17;
    this.paragraph(metric.shortHuman, { size: 9.5, muted: true });
    this.gap(5);
  }

  quoteBlock(text: string): void {
    const lines = wrap(toWinAnsi(text), this.fonts.regular, 10, CONTENT_WIDTH - 18);
    this.ensure(lines.length * 15 + 14);
    const top = this.y;

    for (const line of lines) {
      this.ensure(15);
      this.page.drawText(line, {
        x: MARGIN + 14,
        y: this.y - 10,
        size: 10,
        font: this.fonts.regular,
        color: INK,
      });
      this.y -= 14.5;
    }

    this.page.drawLine({
      start: { x: MARGIN + 2, y: top - 2 },
      end: { x: MARGIN + 2, y: this.y + 8 },
      thickness: 2.5,
      color: ACCENT,
    });
    this.gap(6);
  }

  scoreBadge(score: number, domain: string, scannedAt: string): void {
    this.page.drawRectangle({
      x: MARGIN,
      y: this.y - 92,
      width: CONTENT_WIDTH,
      height: 92,
      color: rgb(0.06, 0.06, 0.08),
    });

    this.page.drawText(toWinAnsi(domain), {
      x: MARGIN + 20,
      y: this.y - 36,
      size: 17,
      font: this.fonts.bold,
      color: rgb(1, 1, 1),
    });
    this.page.drawText(toWinAnsi(`Scanned ${scannedAt}`), {
      x: MARGIN + 20,
      y: this.y - 56,
      size: 9,
      font: this.fonts.regular,
      color: rgb(0.75, 0.75, 0.8),
    });
    this.page.drawText(toWinAnsi("AI visibility score"), {
      x: MARGIN + 20,
      y: this.y - 76,
      size: 9,
      font: this.fonts.regular,
      color: rgb(0.75, 0.75, 0.8),
    });

    const big = `${score}`;
    const bigWidth = this.fonts.bold.widthOfTextAtSize(big, 44);
    this.page.drawText(big, {
      x: PAGE_WIDTH - MARGIN - 20 - bigWidth - 34,
      y: this.y - 66,
      size: 44,
      font: this.fonts.bold,
      color: rgb(0.96, 0.62, 0.04),
    });
    this.page.drawText("/100", {
      x: PAGE_WIDTH - MARGIN - 20 - 32,
      y: this.y - 52,
      size: 13,
      font: this.fonts.regular,
      color: rgb(0.75, 0.75, 0.8),
    });

    this.y -= 108;
  }

  async finish(): Promise<Uint8Array> {
    const pages = this.doc.getPages();
    pages.forEach((page, index) => {
      page.drawText(toWinAnsi(`AI Business  ·  aibusiness.vc`), {
        x: MARGIN,
        y: 30,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });
      const label = `${index + 1} / ${pages.length}`;
      const width = this.fonts.regular.widthOfTextAtSize(label, 8);
      page.drawText(label, {
        x: PAGE_WIDTH - MARGIN - width,
        y: 30,
        size: 8,
        font: this.fonts.regular,
        color: MUTED,
      });
    });
    return this.doc.save();
  }
}

export interface BuildAuditReportInput {
  readonly audit: QuickAudit;
  readonly brand?: BrandKnowledge;
}

export async function buildAuditReportPdf(
  input: BuildAuditReportInput
): Promise<{ filename: string; bytes: Uint8Array }> {
  const { audit, brand } = input;

  const pdf = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };

  pdf.setTitle(`AI Visibility Report — ${audit.domain}`);
  pdf.setAuthor("AI Business");
  pdf.setSubject("AI visibility audit");

  const doc = new Doc(pdf, fonts);
  const scannedAt = new Date(audit.scannedAt).toISOString().slice(0, 10);

  doc.kicker("AI Visibility Report");
  doc.scoreBadge(audit.overallScore, audit.domain, scannedAt);

  doc.paragraph(
    "This report measures how well your website can be read, understood and quoted by AI assistants — ChatGPT, Claude, Perplexity and Google's AI answers. Every figure below was measured on your own domain on the date above. Nothing is estimated or averaged from other sites.",
    { muted: true }
  );
  doc.gap(6);

  if (brand && (brand.status === "recognised" || brand.status === "unrecognised")) {
    doc.heading("What ChatGPT already knows about you");
    doc.paragraph(
      brand.status === "recognised"
        ? "Asked about your domain from memory alone, with no web search, the model answered:"
        : "Asked about your domain from memory alone, with no web search, the model answered:",
      { size: 9.5, muted: true }
    );
    doc.gap(4);
    doc.quoteBlock(brand.answer);
    doc.paragraph(
      brand.status === "recognised"
        ? "Read it as a customer would. Anything out of date or simply wrong here is what people are told when they ask about you."
        : "This is a separate matter from the technical score: a site can be built perfectly and still be unknown to the model, because recall is built from what has been written about you elsewhere, over years.",
      { size: 9.5, muted: true }
    );
    doc.gap(10);
    doc.rule();
  }

  doc.heading("Your scores");
  doc.paragraph(
    "Eight signals, weighted so that what an assistant can actually read on the page counts for most.",
    { size: 9.5, muted: true }
  );
  doc.gap(8);

  const ordered = [...audit.metrics].sort((a, b) => a.score - b.score);
  for (const metric of ordered) doc.metricRow(metric);

  doc.gap(6);
  doc.rule();

  doc.heading("What to fix, in order");
  doc.paragraph(
    "Ranked by what costs you visibility first. Each item can be handed to a developer as-is, or pasted into an AI coding assistant.",
    { size: 9.5, muted: true }
  );
  doc.gap(8);

  // Only signals that actually need work. A 99/100 llms.txt does not need the
  // "create an llms.txt" lecture — advising fixes for healthy signals reads as
  // template filler and undermines trust in the measured ones.
  const weakest = ordered.filter((m) => m.severity !== "good").slice(0, 5);
  weakest.forEach((metric, index) => {
    doc.heading(`${index + 1}. ${metric.label} — ${metric.score}/100`, 11.5);
    doc.paragraph(fixFor(metric));
    doc.gap(8);
  });

  if (weakest.length === 0) {
    doc.paragraph(
      "Every measured signal on this domain is in good health. There is nothing structural to fix. To keep it that way: refresh key pages when facts change, keep llms.txt in step with new sections, and re-scan after any redesign or platform migration."
    );
  }

  doc.gap(6);
  doc.rule();
  doc.heading("About this report");
  doc.paragraph(
    "Produced by AI Business (aibusiness.vc), an independent publication and consultancy covering the business of AI. The scan is automated and reproducible: re-run it at any time on the same domain and compare. Questions about any finding go to info@aibusiness.vc.",
    { size: 9.5, muted: true }
  );

  const bytes = await doc.finish();
  const slug = audit.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return { filename: `AI-Visibility-Report-${slug}-${scannedAt}.pdf`, bytes };
}
