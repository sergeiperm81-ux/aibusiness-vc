import { createZip, type ZipEntry } from "@/lib/zip";
import { getLiveQuickAudit } from "@/lib/audit/live";
import { getBrandKnowledge, hasAnswer, type BrandKnowledge } from "@/lib/audit/brand-knowledge";
import { encodeDomainAsId, type QuickAudit } from "@/lib/audit/mock";
import { buildAuditReportPdf } from "@/lib/audit/report-pdf";
import {
  buildAgentCardJsonLd,
  buildAgentCardMarkdown,
  extractAgentCardFacts,
} from "@/lib/audit/agent-card";
import { fixFor } from "@/lib/audit/fixes";
import { promises as fs } from "node:fs";
import path from "node:path";

export interface AuditPackageAttachment {
  name: string;
  content: string;
  type: string;
}

export interface BuildAuditPackageInput {
  domain?: string;
  auditId?: string;
  orderId?: string;
  plan?: "standard" | "deep";
}

function sanitizeDomain(value?: string): string {
  const trimmed = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*/, "");
  return trimmed || "example.com";
}

function toSlug(value: string): string {
  return value.replace(/[^a-z0-9.-]/g, "").replace(/\./g, "-");
}

function buildReadme(
  domain: string,
  dateStamp: string,
  hasMeasuredReport: boolean,
  hasAgentCard: boolean
): string {
  const slug = toSlug(domain);
  const reportLine = hasMeasuredReport
    ? `1. \`measured-report-${slug}-${dateStamp}.md\`
The same measurements as your PDF report, in plain text. Feed this file to an AI coding assistant (Claude Code, Cursor, ChatGPT) so it works from your real numbers.`
    : `1. \`measured-report-${slug}-${dateStamp}.md\`
Your site could not be scanned automatically (this usually means a login wall or a firewall). Reply to the delivery email and we will run the measurement manually and send it within one business day.`;

  return `# AI Fix Kit

Domain: \`${domain}\`
Generated: \`${dateStamp}\`

## Where to start

Your personal report is the PDF attached next to this archive in the delivery
email. It contains your score, every measured signal, and the fixes in
priority order. Read it first.

## What is in this archive

### For people
1. \`Manual-Implementation-Guide.docx\`
Step by step instructions for doing every fix by hand, without AI tools:
what to change, where, and how to verify it worked.

### For AI assistants and ops
${reportLine}
2. \`execution-playbook-${slug}.md\`: the work split into three sessions.
3. \`ai-builder-pack-prompts-${slug}.md\`: ready prompts for AI coding tools.
4. \`qa-checklist-${slug}.md\`: what to verify after implementation.
5. \`implementation-backlog-${slug}.csv\`: the tasks as a spreadsheet.
6. \`schema-patches-${slug}.json\`: JSON-LD blocks to adapt and paste.
7. \`llms-${slug}-draft.txt\`: a draft llms.txt to adapt and publish.${
    hasAgentCard
      ? `

### Ready to publish
8. \`agent-card-${slug}.md\`: your Agent Card, drafted from your own homepage. Review it, fill any FILL IN gaps, upload to your site as /agent-card.md.
9. \`agent-card-jsonld-${slug}.json\`: the matching JSON-LD for your homepage.`
      : ""
  }

## How to use
1. Read the PDF report from the email.
2. Choose implementation mode:
   - Manual team: follow the DOCX guide.
   - AI-assisted team: hand the markdown, JSON and CSV files to your assistant.
3. Run the QA checklist after implementation.
4. Re-scan free at https://aibusiness.vc/audit and compare scores.

Questions: info@aibusiness.vc
`;
}

function severityWord(severity: string): string {
  switch (severity) {
    case "critical":
      return "CRITICAL";
    case "warning":
      return "NEEDS WORK";
    case "ok":
      return "ACCEPTABLE";
    default:
      return "GOOD";
  }
}

/**
 * The machine-readable twin of the PDF report, built from the same scan.
 *
 * It exists so a buyer can hand their real measurements to an AI coding
 * assistant instead of retyping them. Before this the archive carried a
 * template with invented "expected impact" numbers and a wrong price — a paid
 * product must not contain figures that were never measured.
 */
function buildMeasuredReport(
  domain: string,
  dateStamp: string,
  audit: QuickAudit | null,
  brands: readonly BrandKnowledge[]
): string {
  const header = `# AI Fix Kit: measured report

Domain: \`${domain}\`
Date: \`${dateStamp}\`

`;

  if (!audit) {
    return `${header}## Scan unavailable

The automated scan could not read this site. The usual causes are a login
wall, a firewall that challenges unknown visitors, or a server that only
responds to browsers.

Nothing is wrong with your order. Reply to the delivery email and we will run
the measurement manually and send this file filled in, normally within one
business day.

The rest of the package (guide, playbook, prompts, checklist, schema patches,
llms.txt draft) does not depend on the scan and is ready to use.
`;
  }

  const metricLines = audit.metrics
    .map(
      (m) =>
        `| ${m.label} | ${m.score}/100 | ${severityWord(m.severity)} | ${m.shortHuman} |`
    )
    .join("\n");

  const toFix = [...audit.metrics]
    .filter((m) => m.severity !== "good")
    .sort((a, b) => a.score - b.score);

  const fixSections = toFix
    .map(
      (m, i) => `### ${i + 1}. ${m.label} (${m.score}/100)

${fixFor(m)}
`
    )
    .join("\n");

  const answered = brands.filter(hasAnswer);
  const brandSection =
    answered.length > 0
      ? `## What the assistants say about this brand

Each model asked from memory, no web search.

${answered
  .map(
    (b) => `**${b.providerLabel}** (${b.model}, ${b.checkedAt.slice(0, 10)}):

> ${b.answer.replace(/\n+/g, " ").trim()}
`
  )
  .join("\n")}
`
      : "";

  return `${header}Overall score: **${audit.overallScore}/100**
Scanned: ${audit.scannedAt.slice(0, 10)}, live measurement of \`${audit.url}\`

This file carries the same measurements as the PDF report, formatted for AI
coding assistants. Paste it into Claude Code, Cursor or ChatGPT together with
the prompts file and the assistant will work from your real numbers.

## Measured signals

| Signal | Score | Status | Finding |
|---|---|---|---|
${metricLines}

${brandSection}## Fixes in priority order

${fixSections.length > 0 ? fixSections : "All measured signals are in good shape. Focus on content freshness and internal linking.\n"}
## After implementation

Re-scan free at https://aibusiness.vc/audit and compare this file against the
new result. Technical signals update within days; content signals move after
the next AI crawl, typically within a few weeks.
`;
}

/** Looks up a measured metric by key; null when the scan is unavailable. */
function metricByKey(audit: QuickAudit | null, key: string): AuditMetricLike | null {
  if (!audit) return null;
  return audit.metrics.find((m) => m.key === key) ?? null;
}

interface AuditMetricLike {
  readonly key: string;
  readonly label: string;
  readonly score: number;
  readonly severity: string;
  readonly shortHuman: string;
}

/**
 * One line of measured context under a task: the real score and finding, or a
 * skip note when the signal is already healthy. Personalises every kit file
 * without inventing anything: if there was no scan, there is no line.
 */
function measuredLine(audit: QuickAudit | null, key: string): string {
  const m = metricByKey(audit, key);
  if (!m) return "";
  if (m.severity === "good") {
    return `Measured ${m.score}/100 on ${audit!.domain}: already healthy. Skip unless something regresses.`;
  }
  return `Measured ${m.score}/100 on ${audit!.domain} (${severityWord(m.severity)}): ${m.shortHuman}`;
}

function buildExecutionPlaybook(domain: string, audit: QuickAudit | null): string {
  const note = (key: string) => {
    const line = measuredLine(audit, key);
    return line ? `  ${line}\n` : "";
  };

  const header = `# Execution Playbook

Domain: \`${domain}\`
${audit ? `Overall score at purchase: \`${audit.overallScore}/100\` (scanned ${audit.scannedAt.slice(0, 10)})` : "Scan unavailable at purchase; see measured-report for details."}

Work through the sessions in order. Where a signal is marked healthy, skip it
and spend the time on the ones that are not.
`;

  return `${header}
## Session 1 (technical foundation)
- Allow AI crawlers in robots.txt.
${note("ai-crawlers")}- Adapt and publish the llms.txt draft.
${note("llms-txt")}- Apply schema patches by template and validate JSON-LD syntax.
${note("schema")}- Confirm HTTPS and baseline security headers.
${note("https")}
## Session 2 (citation formatting)
- Add FAQ and comparison blocks to high intent pages.
${note("citability")}- Give each page one H1, clear sections and a summary under the title.
${note("structure")}
## Session 3 (quality lock)
- Check server side rendering: key text must be visible without JavaScript.
${note("javascript-dependency")}- Check response speed and Core Web Vitals.
${note("page-speed")}- Add contextual hub and spoke links, normalize metadata.
- Run the final QA checklist, then re-scan at https://aibusiness.vc/audit.
`;
}

function buildAiPrompts(domain: string, audit: QuickAudit | null): string {
  const ctx = (key: string) => {
    const line = measuredLine(audit, key);
    return line ? `Context: ${line}\n` : "";
  };

  return `# AI Builder Pack Prompts

Domain: \`${domain}\`

How to use: open Claude Code, Cursor or ChatGPT inside your website project.
First paste the whole measured-report file from this package, then run the
prompts below one at a time. Each prompt carries the measured context for
${domain}, so the assistant works from your real numbers, not from guesses.

## Prompt 0: load the measurements
\`\`\`text
Here is a measured AI visibility report for ${domain} (attached below).
Read it, list the failing signals in priority order, and wait for my go
before changing anything.
\`\`\`
Paste the contents of the measured-report file after this prompt.

## Prompt 1: schema rollout
${ctx("schema")}\`\`\`text
Implement template-level JSON-LD for ${domain}:
- Home: Organization + WebSite
- Articles: Article + BreadcrumbList
- FAQ blocks: FAQPage
- Category pages: BreadcrumbList

Use the blocks in schema-patches-${toSlug(domain)}.json as the starting
point and fill in the real company details. Return file-by-file diffs only.
\`\`\`

## Prompt 2: AI crawler access
${ctx("ai-crawlers")}\`\`\`text
Update robots.txt for ${domain} so the answer-engine bots OAI-SearchBot,
Claude-SearchBot and PerplexityBot are explicitly allowed, while keeping
existing rules for admin and private paths. Leave GPTBot, ClaudeBot and
Google-Extended (training crawlers) as the site owner decides; do not change
them without a decision. Then check the firewall/CDN allows the same bots:
robots.txt is permission, not access.
\`\`\`

## Prompt 3: llms.txt
${ctx("llms-txt")}\`\`\`text
Take the draft in llms-${toSlug(domain)}-draft.txt, replace the placeholder
paths with the real top pages of ${domain}, one line description each, and
output the final llms.txt ready to publish at the domain root.
\`\`\`

## Prompt 4: FAQ expansion
${ctx("citability")}\`\`\`text
On high-intent pages of ${domain}, add 4-6 concise FAQs each.
Add matching FAQPage JSON-LD.
Keep each answer under 90 words.
Do not invent unsupported claims.
\`\`\`

## Prompt 5: page structure
${ctx("structure")}\`\`\`text
For each key page of ${domain}: one clear H1, logical H2/H3 sections, a one
or two sentence summary directly under the title, short paragraphs.
Return diffs only.
\`\`\`

## Prompt 6: internal linking graph
\`\`\`text
Build hub-and-spoke links across priority clusters of ${domain}.
Each spoke links to its hub.
Each hub links to at least 5 relevant spokes.
\`\`\`

## Prompt 7: QA pass
\`\`\`text
Run QA checks on ${domain}:
- valid JSON-LD
- no duplicate H1
- no broken links
- no contradictory claims
Compare against qa-checklist-${toSlug(domain)}.md and report every failure.
\`\`\`
`;
}

function buildQaChecklist(domain: string, audit: QuickAudit | null): string {
  const targets = audit
    ? audit.metrics
        .filter((m) => m.severity !== "good")
        .sort((a, b) => a.score - b.score)
        .map(
          (m) =>
            `- [ ] ${m.label}: was ${m.score}/100 at purchase. Done when a re-scan shows 85 or higher.`
        )
        .join("\n")
    : "";

  const targetBlock = targets
    ? `## Measured targets for ${domain}

${targets}

`
    : "";

  return `# QA Checklist

Domain: \`${domain}\`

${targetBlock}## General checks

- [ ] JSON-LD validates on all updated pages.
- [ ] robots.txt allows OAI-SearchBot, Claude-SearchBot, PerplexityBot. GPTBot, ClaudeBot and Google-Extended set by an explicit decision. Firewall/CDN lets the same bots through.
- [ ] llms.txt is live at the domain root and every listed URL opens.
- [ ] No duplicate H1 on updated templates.
- [ ] All new internal links resolve.
- [ ] FAQ answers match source content.
- [ ] Comparison tables add non-duplicative value.
- [ ] Meta descriptions are 130-160 characters and intent-specific.
- [ ] No placeholder text remains.
- [ ] Re-scan at https://aibusiness.vc/audit and compare against measured-report.
`;
}

interface BacklogTemplate {
  readonly task: string;
  readonly owner: string;
  readonly effortHours: string;
  readonly acceptance: string;
}

/** How each measured signal translates into a backlog task. */
const BACKLOG_BY_METRIC: Record<string, BacklogTemplate> = {
  "ai-crawlers": {
    task: "Allow answer-engine bots in robots.txt",
    owner: "developer",
    effortHours: "0.5",
    acceptance: "OAI-SearchBot Claude-SearchBot PerplexityBot explicitly allowed; GPTBot, ClaudeBot and Google-Extended decided by the owner",
  },
  "llms-txt": {
    task: "Adapt and publish llms.txt",
    owner: "content_ops",
    effortHours: "1.5",
    acceptance: "Draft adapted with real URLs and live at /llms.txt",
  },
  schema: {
    task: "Deploy JSON-LD schema templates",
    owner: "developer",
    effortHours: "3.0",
    acceptance: "JSON-LD valid on home/article/faq/category templates",
  },
  https: {
    task: "Harden HTTPS and security headers",
    owner: "developer",
    effortHours: "1.0",
    acceptance: "HSTS X-Content-Type-Options X-Frame-Options CSP present",
  },
  citability: {
    task: "Add FAQ and comparison blocks to high intent pages",
    owner: "editor",
    effortHours: "2.5",
    acceptance: "Priority pages contain concise FAQ and decision tables",
  },
  structure: {
    task: "Fix heading hierarchy and add summaries",
    owner: "editor",
    effortHours: "2.0",
    acceptance: "One H1 per page with summary under the title and clear sections",
  },
  "javascript-dependency": {
    task: "Server side render key content",
    owner: "developer",
    effortHours: "4.0",
    acceptance: "Main text visible in raw HTML with JavaScript disabled",
  },
  "page-speed": {
    task: "Improve response speed and Core Web Vitals",
    owner: "developer",
    effortHours: "3.0",
    acceptance: "LCP under 2.5s on priority pages",
  },
};

const BACKLOG_ALWAYS: readonly (readonly string[])[] = [
  [
    "P3",
    "Improve internal linking graph",
    "seo_ops",
    "1.5",
    "medium",
    "Each spoke links to hub and hubs link to key spokes",
  ],
  [
    "P3",
    "Normalize metadata",
    "editor",
    "1.0",
    "medium",
    "All target descriptions follow intent + value format",
  ],
];

function backlogPriority(severity: string): { priority: string; impact: string } {
  if (severity === "critical") return { priority: "P1", impact: "high" };
  if (severity === "warning") return { priority: "P2", impact: "high" };
  return { priority: "P3", impact: "medium" };
}

/**
 * When the scan succeeded the backlog contains one row per signal that
 * actually needs work on this domain, priority derived from the measured
 * severity. The generic five row backlog remains only as the no-scan fallback.
 */
function buildBacklogCsv(domain: string, audit: QuickAudit | null): string {
  const header = ["priority", "task", "owner", "effort_hours", "impact", "acceptance_criteria"];

  if (!audit) {
    const fallback = Object.entries(BACKLOG_BY_METRIC).map(([, t]) => [
      "P2",
      t.task,
      t.owner,
      t.effortHours,
      "high",
      t.acceptance,
    ]);
    return [header, ...fallback, ...BACKLOG_ALWAYS].map((row) => row.join(",")).join("\n");
  }

  const measured = [...audit.metrics]
    .filter((m) => m.severity !== "good" && BACKLOG_BY_METRIC[m.key])
    .sort((a, b) => a.score - b.score)
    .map((m) => {
      const t = BACKLOG_BY_METRIC[m.key];
      const { priority, impact } = backlogPriority(m.severity);
      return [
        priority,
        `${t.task} (measured ${m.score}/100)`,
        t.owner,
        t.effortHours,
        impact,
        t.acceptance,
      ];
    });

  return [header, ...measured, ...BACKLOG_ALWAYS].map((row) => row.join(",")).join("\n");
}

function buildSchemaPatchesJson(domain: string): string {
  return JSON.stringify(
    {
      _readme: [
        "These are templates, not finished markup. Anything in ALL CAPS between",
        "<< >> must be replaced with your real details before publishing.",
        "Paste each block into a <script type=\"application/ld+json\"> tag on the",
        "matching page, then validate at validator.schema.org.",
        "Delete this _readme key from anything you publish.",
      ],
      domain,
      language: "en",
      schema: {
        organization: {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "<<YOUR COMPANY LEGAL OR TRADING NAME>>",
          url: `https://${domain}`,
          logo: `https://${domain}/<<PATH-TO-YOUR-LOGO>>.png`,
          sameAs: [
            "<<FULL URL OF YOUR LINKEDIN PAGE>>",
            "<<FULL URL OF ANY OTHER OFFICIAL PROFILE, OR DELETE THIS LINE>>",
          ],
        },
        website: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: `https://${domain}`,
          name: "<<YOUR SITE NAME AS SHOWN IN THE BROWSER TAB>>",
        },
        faqTemplate: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "<<A REAL QUESTION YOUR CUSTOMERS ASK>>",
              acceptedAnswer: {
                "@type": "Answer",
                text: "<<THE ANSWER, WORD FOR WORD AS IT APPEARS ON THE PAGE>>",
              },
            },
          ],
        },
      },
    },
    null,
    2
  );
}

function buildLlmsDraft(domain: string, audit: QuickAudit | null): string {
  const status = metricByKey(audit, "llms-txt");
  const statusNote = status
    ? `# Status at purchase: ${status.score}/100. ${status.shortHuman}\n# The paths below are placeholders. Replace them with your real top pages.\n`
    : `# The paths below are placeholders. Replace them with your real top pages.\n`;

  return `${statusNote}# ${domain}
> AI visibility map for key commercial and informational pages.

## Priority pages
- https://${domain}/
- https://${domain}/about
- https://${domain}/services
- https://${domain}/pricing
- https://${domain}/contact

## High-intent content
- https://${domain}/blog
- https://${domain}/compare
- https://${domain}/guides

## Notes
- Keep summaries factual and concise.
- Update this file when priority URLs change.
`;
}

/**
 * Static literal path, so Next's file tracer can see exactly which file the
 * function needs. A path assembled from arguments made the tracer give up and
 * bundle the whole project into the serverless function.
 */
const GUIDE_TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "audit-kit",
  "Manual-Implementation-Guide-Template.docx"
);

async function readGuideAttachment(): Promise<AuditPackageAttachment> {
  const binary = await fs.readFile(GUIDE_TEMPLATE_PATH);
  return {
    name: "Manual-Implementation-Guide.docx",
    content: binary.toString("base64"),
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}



interface LiveScanResult {
  readonly audit: QuickAudit | null;
  readonly brands: readonly BrandKnowledge[];
}

/**
 * Runs the live scan once; the result feeds both the PDF and the markdown
 * report so the buyer can never receive two documents that disagree.
 *
 * Returns nulls rather than throwing if the scan fails: a site behind a login
 * or a firewall should still get the rest of the package plus a human
 * follow-up, not a failed delivery and not somebody else's placeholder figures.
 */
async function runLiveScan(domain: string): Promise<LiveScanResult> {
  try {
    const audit = await getLiveQuickAudit(encodeDomainAsId(domain));
    if (audit.failure) {
      console.error(`[fulfillment] scan failed for ${domain}: ${audit.failure}`);
      return { audit: null, brands: [] };
    }
    const brands = await getBrandKnowledge(audit.domain, "fulfillment");
    return { audit, brands };
  } catch (error) {
    console.error(`[fulfillment] scan failed for ${domain}:`, error);
    return { audit: null, brands: [] };
  }
}

async function buildReportPdfAttachment(
  scan: LiveScanResult
): Promise<AuditPackageAttachment | null> {
  if (!scan.audit) return null;
  try {
    const { filename, bytes } = await buildAuditReportPdf({
      audit: scan.audit,
      brands: scan.brands,
    });
    return {
      name: filename,
      content: Buffer.from(bytes).toString("base64"),
      type: "application/pdf",
    };
  } catch (error) {
    console.error(`[fulfillment] PDF generation failed:`, error);
    return null;
  }
}

export async function buildAuditPackageAttachments(
  input: BuildAuditPackageInput
): Promise<AuditPackageAttachment[]> {
  const domain = sanitizeDomain(input.domain);
  const slug = toSlug(domain);
  const dateStamp = new Date().toISOString().slice(0, 10);

  // The buyer must receive a report measured on their own domain, not the
  // template. A generic PDF is what we replaced, and what we told our payment
  // provider customers no longer get.
  const scan = await runLiveScan(domain);
  const reportAttachment = await buildReportPdfAttachment(scan);

  const guide = await readGuideAttachment();

  // The Agent Card: drafted from the buyer's own homepage, so every stated
  // fact traces back to their site. Null (unreachable site, missing key)
  // means the package ships without it, same policy as the report.
  const cardFacts = scan.audit ? await extractAgentCardFacts(domain) : null;
  const cardFiles: ZipEntry[] = cardFacts
    ? [
        {
          name: `agent-card-${slug}.md`,
          data: Buffer.from(buildAgentCardMarkdown(domain, cardFacts, dateStamp), "utf8"),
        },
        {
          name: `agent-card-jsonld-${slug}.json`,
          data: Buffer.from(buildAgentCardJsonLd(domain, cardFacts), "utf8"),
        },
      ]
    : [];


  // Everything except the report goes into one archive. Ten separate
  // attachments read as clutter; inside a ZIP the files also keep their real
  // .md and .json names, because the mail provider only inspects the container.
  const packedFiles: ZipEntry[] = [
    {
      name: "README.md",
      data: Buffer.from(
        buildReadme(domain, dateStamp, scan.audit != null, cardFacts != null),
        "utf8"
      ),
    },
    {
      name: `measured-report-${slug}-${dateStamp}.md`,
      data: Buffer.from(buildMeasuredReport(domain, dateStamp, scan.audit, scan.brands), "utf8"),
    },
    {
      name: `execution-playbook-${slug}.md`,
      data: Buffer.from(buildExecutionPlaybook(domain, scan.audit), "utf8"),
    },
    {
      name: `ai-builder-pack-prompts-${slug}.md`,
      data: Buffer.from(buildAiPrompts(domain, scan.audit), "utf8"),
    },
    {
      name: `qa-checklist-${slug}.md`,
      data: Buffer.from(buildQaChecklist(domain, scan.audit), "utf8"),
    },
    {
      name: `implementation-backlog-${slug}.csv`,
      data: Buffer.from(buildBacklogCsv(domain, scan.audit), "utf8"),
    },
    {
      name: `schema-patches-${slug}.json`,
      data: Buffer.from(buildSchemaPatchesJson(domain), "utf8"),
    },
    {
      name: `llms-${slug}-draft.txt`,
      data: Buffer.from(buildLlmsDraft(domain, scan.audit), "utf8"),
    },
    ...cardFiles,
    { name: guide.name, data: Buffer.from(guide.content, "base64") },
  ];

  const archive: AuditPackageAttachment = {
    name: `AI-Fix-Kit-${slug}-${dateStamp}.zip`,
    content: createZip(packedFiles, new Date()).toString("base64"),
    type: "application/zip",
  };

  // The report stays loose: it is the thing the buyer wants to open first, and
  // burying it inside an archive adds a step for no reason.
  return reportAttachment ? [reportAttachment, archive] : [archive];
}

