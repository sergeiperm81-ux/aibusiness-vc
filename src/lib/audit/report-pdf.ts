/**
 * The AI Fix Kit report a paying customer receives, in the library's house
 * style (pdf-kit.ts): a centred cover, numbered sections with a yellow rule,
 * the running head and foot of every library PDF.
 *
 * Read top to bottom: what five AI models found when they looked the site up,
 * then the technical signs measured on the homepage, then the fixes in order.
 * Every number comes from the check of the buyer's own domain; nothing here
 * is a template figure.
 */

import type { AuditMetric, QuickAudit } from "@/lib/audit/mock";
import { fixFor } from "@/lib/audit/fixes";
import { hasAnswer, type BrandKnowledge } from "@/lib/audit/brand-knowledge";
import { REACH_WORDS, type ProviderVisibility, type SiteVisibility } from "@/lib/audit/site-visibility";
import { ACCENT, GREEN, GREY, MUTED, PdfWriter } from "@/lib/audit/pdf-kit";
import { plainAnswer } from "@/lib/audit/person-report-pdf";
import { sourceLabel } from "@/lib/audit/person-report-safety";

export const PRODUCT_NAME = "AI Website Visibility";

const SEVERITY_WORD: Record<AuditMetric["severity"], string> = {
  critical: "Critical",
  warning: "Needs work",
  ok: "Acceptable",
  good: "Healthy",
};

export interface BuildAuditReportInput {
  readonly audit: QuickAudit;
  readonly brands?: readonly BrandKnowledge[];
  /** The five assistants with live search. When present it replaces the memory-only answers. */
  readonly visibility?: SiteVisibility | null;
}

/** Long answers are cut in the PDF; the measured report in the archive carries them in full. */
const PDF_ANSWER_CHARS = 900;
const MAX_SOURCES_LISTED = 8;

function longDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** The answer as paragraphs, cut once it runs past the budget. */
function answerBlocks(text: string): { readonly blocks: ReturnType<typeof plainAnswer>; readonly cut: boolean } {
  const blocks = plainAnswer(text);
  let used = 0;
  const kept: (typeof blocks)[number][] = [];
  for (const block of blocks) {
    if (used + block.text.length > PDF_ANSWER_CHARS && kept.length > 0) return { blocks: kept, cut: true };
    kept.push(block);
    used += block.text.length;
  }
  return { blocks: kept, cut: false };
}

/** One entry per readable label: two addresses that differ only in a query string read as one. */
function uniqueByLabel(addresses: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  return addresses.filter((address) => {
    const label = sourceLabel(address);
    if (seen.has(label)) return false;
    seen.add(label);
    return true;
  });
}

function reachLine(row: ProviderVisibility): string {
  if (row.reach === "no_answer") return "did not answer";
  return `${REACH_WORDS[row.reach]}: ${plural(row.ownPages.length, "page", "pages")} of the site, ${plural(row.otherSources.length, "other source", "other sources")}`;
}

function writeVisibility(pdf: PdfWriter, visibility: SiteVisibility, domain: string): void {
  pdf.text(
    `On ${longDate(visibility.checkedAt)} each model was asked two questions about ${domain} with live web search on: what the site is, and which of its pages it can find. ` +
      "The sources each one cited are split into pages of the site itself and pages elsewhere. A model that cites the site's own pages could reach and use them this time. " +
      "One that answers from other sites only, or cites nothing, did not use the site in this run. This is one run: answers vary between runs, users and days.",
    { gapAfter: 8 }
  );
  pdf.table(
    ["Model", "Result", "Pages of the site", "Other sources"],
    visibility.providers.map((row) => [
      `${row.providerLabel} (${row.model})`,
      row.reach === "no_answer" ? "Did not answer" : REACH_WORDS[row.reach],
      String(row.ownPages.length),
      String(row.otherSources.length),
    ]),
    190
  );

  for (const row of visibility.providers) {
    pdf.gap(6);
    pdf.subheading(`${row.providerLabel}: ${reachLine(row)}`);
    for (const answer of row.answers) {
      pdf.text(answer.questionId === "site" ? "What the site is" : "Which pages it can find", { size: 9, bold: true, color: MUTED, gapAfter: 2 });
      if (!answer.ok) {
        pdf.text(answer.missing ?? "The model did not answer.", { color: MUTED, indent: 10, gapAfter: 6 });
        continue;
      }
      const { blocks, cut } = answerBlocks(answer.text);
      for (const block of blocks) {
        if (block.bullet) pdf.bullet(block.text, { size: 9.5, indent: 10 });
        else pdf.text(block.text, { size: 9.5, indent: 10, bold: block.heading, gapAfter: 4 });
      }
      if (cut) pdf.text("Shortened here. The full answer is in the measured report inside the archive.", { size: 8.5, color: MUTED, indent: 10 });
      pdf.gap(4);
    }
    if (row.ownPages.length > 0) {
      pdf.text("Pages of the site it cited", { size: 8.5, bold: true, color: MUTED, indent: 10 });
      const listed = uniqueByLabel(row.ownPages);
      for (const page of listed.slice(0, MAX_SOURCES_LISTED)) pdf.link(sourceLabel(page), page, { size: 8, indent: 18 });
      if (listed.length > MAX_SOURCES_LISTED) pdf.text(`and ${listed.length - MAX_SOURCES_LISTED} more`, { size: 8, color: MUTED, indent: 18 });
    }
    if (row.otherSources.length > 0) {
      pdf.text("Other sources it cited", { size: 8.5, bold: true, color: MUTED, indent: 10 });
      const listed = uniqueByLabel(row.otherSources);
      for (const page of listed.slice(0, MAX_SOURCES_LISTED)) pdf.link(sourceLabel(page), page, { size: 8, indent: 18 });
      if (listed.length > MAX_SOURCES_LISTED) pdf.text(`and ${listed.length - MAX_SOURCES_LISTED} more`, { size: 8, color: MUTED, indent: 18 });
    }
    if (row.ownPages.length === 0 && row.otherSources.length === 0 && row.reach !== "no_answer") {
      pdf.text("The model cited no source for its answers.", { size: 8.5, color: MUTED, indent: 10 });
    }
    pdf.gap(6);
  }
}

function writeMemory(pdf: PdfWriter, brands: readonly BrandKnowledge[]): void {
  pdf.text("Each model was asked about the domain from memory alone, with no web search. This is recall from training. It says nothing certain about what a model with search would answer today.", { gapAfter: 8 });
  for (const brand of brands) {
    pdf.subheading(`${brand.providerLabel} (${brand.model}): ${brand.status === "recognised" ? "recognises the site" : "has no memory of it"}`);
    for (const block of plainAnswer(brand.answer)) {
      if (block.bullet) pdf.bullet(block.text, { size: 9.5, indent: 10 });
      else pdf.text(block.text, { size: 9.5, indent: 10, gapAfter: 4 });
    }
    pdf.gap(6);
  }
}

export async function buildAuditReportPdf(input: BuildAuditReportInput): Promise<{ filename: string; bytes: Uint8Array }> {
  const { audit, brands = [] } = input;
  const visibility = input.visibility && input.visibility.providers.length > 0 ? input.visibility : null;
  const remembered = brands.filter(hasAnswer);
  const checkedAt = new Date(audit.scannedAt).toISOString().slice(0, 10);
  const scored = audit.metrics.filter((m) => m.key !== "llms-txt");
  const optionalLast = (m: AuditMetric): number => (m.key === "llms-txt" ? 1 : 0);
  const ordered = [...audit.metrics].sort((a, b) => optionalLast(a) - optionalLast(b) || a.score - b.score);
  const toFix = ordered.filter((m) => m.severity !== "good").slice(0, 5);

  const pdf = await PdfWriter.create(`AI Fix Kit report for ${audit.domain}`, `Can AI read ${audit.domain}?`, {
    left: PRODUCT_NAME.toUpperCase(),
    right: "SERGEI PONOMAREV · AI BUSINESS",
  });
  let section = 0;
  const numbered = (value: string): void => {
    section += 1;
    pdf.heading(`${section}. ${value}`);
  };

  /* ---------------------------------------------------------------- cover */
  const answered = visibility ? visibility.providers.flatMap((p) => p.answers).filter((a) => a.ok).length : 0;
  const asked = visibility ? visibility.providers.length * 2 : 0;
  pdf.gap(6);
  pdf.title(`Can AI read ${audit.domain}?`);
  pdf.centered(
    visibility
      ? `${PRODUCT_NAME}: ${visibility.providers.length} AI models, 2 questions, ${answered} of ${asked} answers received, ${scored.length} technical signs measured`
      : `${PRODUCT_NAME}: ${scored.length} technical signs measured on the homepage`,
    { size: 13, bold: true, color: GREY, gapAfter: 4 }
  );
  pdf.centeredLink(audit.url, audit.url, { size: 10.5, color: ACCENT });
  pdf.centered(`Checked ${longDate(audit.scannedAt)}`, { size: 10.5, color: GREY, gapAfter: 4 });
  pdf.rule();
  pdf.centered(`AI site readiness score: ${audit.overallScore} / 100`, { size: 16, bold: true, gapAfter: 8 });
  pdf.text(
    "ChatGPT, Claude, Gemini, Perplexity and Grok answer with what they can read. This report has two parts. " +
      (visibility
        ? "First, what the five models found when they looked the site up with live web search. Second, "
        : "First, what two models remember about the site without search. Second, ") +
      "the technical signs of whether AI crawlers can read the homepage, with the fixes in order. " +
      "The score applies documented rules to what was measured on the domain on the date above. It is not an industry benchmark and not a forecast of whether the site will appear in AI answers.",
    { gapAfter: 4 }
  );

  /* -------------------------------------------------------------- section 1 */
  if (visibility) {
    numbered("What five AI models find when they look the site up");
    writeVisibility(pdf, visibility, audit.domain);
  } else if (remembered.length > 0) {
    numbered("What the models remember about the site");
    writeMemory(pdf, remembered);
  }

  /* -------------------------------------------------------------- section 2 */
  numbered("The technical signs, measured on the homepage");
  pdf.text(
    "Weighted so that what a crawler can actually read on the page counts for most. llms.txt is shown but not scored: it is optional. What the models answered above is not part of this number.",
    { gapAfter: 8 }
  );
  for (const metric of ordered) {
    const note = metric.key === "llms-txt" ? `${metric.shortHuman} Not part of the score.` : metric.shortHuman;
    pdf.fact(metric.label, `${metric.score} / 100, ${SEVERITY_WORD[metric.severity].toLowerCase()}`, note);
  }

  /* -------------------------------------------------------------- section 3 */
  numbered("What to fix, in order");
  if (toFix.length === 0) {
    pdf.text(
      "Every measured sign on this homepage is in good health. There is nothing structural to fix. To keep it that way: refresh key pages when facts change, and re-check after any redesign or platform migration.",
      { gapAfter: 6 }
    );
  } else {
    pdf.text("Ranked by what costs visibility first. Each item can be handed to a developer as it is, or pasted into an AI coding assistant with the prompts file from the kit.", { gapAfter: 8 });
    toFix.forEach((metric, index) => {
      pdf.text(`${index + 1}. ${metric.label}, ${metric.score} / 100`, { bold: true, size: 11.5, gapAfter: 2 });
      pdf.text(fixFor(metric), { gapAfter: 8 });
    });
  }
  const healthy = ordered.filter((m) => m.severity === "good" && m.key !== "llms-txt");
  if (healthy.length > 0 && toFix.length > 0) {
    pdf.subheading("Already in good shape");
    for (const metric of healthy) pdf.bullet(`${metric.label}: ${metric.score} / 100`, { color: GREEN, size: 9.5, gapAfter: 2 });
  }

  /* ------------------------------------------------------------------ about */
  pdf.gap(8);
  pdf.heading("About this report");
  for (const line of [
    "The models' words are their own. Only formatting marks were removed; links inside an answer were moved to the source list under it. The measured report inside the archive carries every answer in full.",
    "The answers come from each provider's API with web search on, not from the consumer apps. The apps add their own instructions and remember their users, so what anyone sees in their own ChatGPT or Gemini may differ.",
    "These are generative models. Ask the same question twice and the wording, and sometimes the sources, will differ. This report is a snapshot taken on the date above.",
    "The technical signs are read from the homepage, robots.txt and llms.txt on a live request, the way a crawler starting from the domain does. Deep pages are not crawled.",
    "Fixing what stops machines from reading a site is a first step. It is not a promise that any assistant will cite or recommend the site.",
  ]) {
    pdf.bullet(line, { size: 9.5, gapAfter: 4 });
  }

  const slug = audit.domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return { filename: `AI-Fix-Kit-Report-${slug}-${checkedAt}.pdf`, bytes: await pdf.bytes() };
}
