import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildAuditReportPdf } from "../src/lib/audit/report-pdf";
import type { QuickAudit } from "../src/lib/audit/mock";
import type { BrandKnowledge } from "../src/lib/audit/brand-knowledge";

const audit: QuickAudit = {
  id: "sample-mylo-family",
  url: "https://mylo.family",
  domain: "mylo.family",
  scannedAt: "2026-09-16T00:00:00.000Z",
  overallScore: 83,
  industryAverage: 0,
  metrics: [
    { key: "structure", label: "Content structure", score: 59, severity: "warning", shortHuman: "Heading hierarchy and section sizing need work." },
    { key: "page-speed", label: "Page speed", score: 76, severity: "ok", shortHuman: "Response speed is acceptable (1427ms)." },
    { key: "llms-txt", label: "llms.txt", score: 77, severity: "ok", shortHuman: "Found at /llms.txt but very few linked entries with descriptions; expand to 10+ priority pages." },
    { key: "citability", label: "Citation readiness", score: 78, severity: "ok", shortHuman: "Decent structure but room to improve." },
    { key: "schema", label: "Schema markup", score: 80, severity: "ok", shortHuman: "2 valid JSON-LD blocks on the homepage." },
    { key: "ai-crawlers", label: "AI crawler permission in robots.txt", score: 87, severity: "good", shortHuman: "2/3 answer-engine bots are explicitly allowed. Training crawlers GPTBot, ClaudeBot are allowed; that is your decision and does not affect this score." },
    { key: "javascript-dependency", label: "What an AI actually sees", score: 96, severity: "good", shortHuman: "An assistant reading your page without a browser sees 1,155 words of text. That is a full page. Assistants read your content exactly as a reader would." },
    { key: "https", label: "HTTPS & security", score: 100, severity: "good", shortHuman: "HTTPS is enabled with baseline security headers checked." },
  ],
};

const checkedAt = "2026-09-16T00:00:00.000Z";
const brands: BrandKnowledge[] = [
  {
    provider: "openai",
    providerLabel: "OpenAI",
    status: "unrecognised",
    answer: "The model says it does not recognise the company behind this domain.",
    model: "gpt-4.1-mini",
    checkedAt,
    cached: true,
  },
  {
    provider: "anthropic",
    providerLabel: "Anthropic",
    status: "unrecognised",
    answer: "I do not have reliable information about mylo.family in my training data. I cannot provide details about this organization, their services, or their target audience without risking inaccuracy. To learn about them, I recommend visiting their website directly, checking their official social media channels, or reviewing recent business listings and news articles about the organization.",
    model: "claude-haiku-4-5-20251001",
    checkedAt,
    cached: true,
  },
];

async function main(): Promise<void> {
  const { bytes } = await buildAuditReportPdf({ audit, brands });
  await writeFile(resolve("public/audit-kit/Sample-AI-Fix-Kit-Report.pdf"), bytes);
}

void main();
