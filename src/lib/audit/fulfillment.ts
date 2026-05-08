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

function buildReadme(domain: string, dateStamp: string): string {
  return `# AI Visibility Package

Domain: \`${domain}\`  
Generated: \`${dateStamp}\`  
Language: \`English only\`

## What is included

### Human-facing files
1. \`Executive-Brief.pdf\`  
Leadership summary with priorities and expected outcomes.

2. \`Manual-Implementation-Guide.docx\`  
Step-by-step fallback for manual execution without AI-assisted coding.

### AI/ops files
1. \`standard-report-${toSlug(domain)}-${dateStamp}.md\`
2. \`execution-playbook-${toSlug(domain)}.md\`
3. \`ai-builder-pack-prompts-${toSlug(domain)}.md\`
4. \`qa-checklist-${toSlug(domain)}.md\`
5. \`implementation-backlog-${toSlug(domain)}.csv\`
6. \`schema-patches-${toSlug(domain)}.json\`
7. \`llms-${toSlug(domain)}.txt.draft\`

## How to use
1. Read the Executive Brief.
2. Choose implementation mode:
   - Manual team: use the DOCX guide.
   - AI-assisted team: use markdown + JSON/CSV/TXT files.
3. Run QA checklist after implementation.
4. Re-scan and compare score deltas.
`;
}

function buildStandardReport(domain: string, dateStamp: string): string {
  return `# AI Visibility Report (Standard)

Domain: \`${domain}\`  
Date: \`${dateStamp}\`  
Plan: \`Standard (EUR 149)\`  
Language: \`English only\`

## Executive summary
This report package is focused on implementation quality: stronger schema coverage, better citation formatting, and clearer entity linking.

## Primary priorities
- Roll out template-level schema blocks.
- Improve citation-ready sections on high-intent pages.
- Strengthen internal links between hubs and spokes.
- Normalize metadata and run post-change QA.

## Expected impact range
- Schema quality: +15 to +25 points
- Citation readiness: +6 to +12 points
- Overall visibility: measurable uplift after deployment and re-scan
`;
}

function buildExecutionPlaybook(domain: string): string {
  return `# Execution Playbook

Domain: \`${domain}\`  
Language: \`English only\`

## Session 1 (technical foundation)
- Apply schema patches by template.
- Update llms.txt draft to production values.
- Validate JSON-LD syntax on priority pages.

## Session 2 (citation formatting)
- Add FAQ and comparison blocks to high-intent pages.
- Add summary sections under key H2s.
- Confirm factual consistency.

## Session 3 (quality lock)
- Add contextual hub-spoke links.
- Normalize metadata descriptions.
- Run final QA checklist.
`;
}

function buildAiPrompts(domain: string): string {
  return `# AI Builder Pack Prompts

Domain: \`${domain}\`  
Language policy: \`All generated outputs must be in English only.\`

## Prompt 1 - Schema rollout
\`\`\`text
Implement template-level JSON-LD for ${domain}:
- Home: Organization + WebSite
- Articles: Article + BreadcrumbList
- FAQ blocks: FAQPage
- Category pages: BreadcrumbList

Return file-by-file diffs only.
\`\`\`

## Prompt 2 - FAQ expansion
\`\`\`text
On high-intent pages, add 4-6 concise FAQs each.
Add matching FAQPage JSON-LD.
Keep each answer under 90 words.
Do not invent unsupported claims.
\`\`\`

## Prompt 3 - Comparison standard
\`\`\`text
Insert a decision table after H2 #2:
Option | Best for | Strength | Limitation | Price band
\`\`\`

## Prompt 4 - Internal linking graph
\`\`\`text
Build hub-and-spoke links across priority clusters.
Each spoke links to its hub.
Each hub links to at least 5 relevant spokes.
\`\`\`

## Prompt 5 - QA pass
\`\`\`text
Run QA checks:
- valid JSON-LD
- no duplicate H1
- no broken links
- no contradictory claims
\`\`\`
`;
}

function buildQaChecklist(domain: string): string {
  return `# QA Checklist

Domain: \`${domain}\`  
Language: \`English only\`

- [ ] JSON-LD validates on all updated pages.
- [ ] No duplicate H1 on updated templates.
- [ ] All new internal links resolve.
- [ ] FAQ answers match source content.
- [ ] Comparison tables add non-duplicative value.
- [ ] Meta descriptions are 130-160 characters and intent-specific.
- [ ] No placeholder text remains.
`;
}

function buildBacklogCsv(domain: string): string {
  const slug = toSlug(domain);
  const rows = [
    ["priority", "task", "owner", "effort_hours", "impact", "acceptance_criteria"],
    [
      "P1",
      "Deploy schema templates",
      "developer",
      "2.5",
      "high",
      "JSON-LD valid on home/article/faq/category templates",
    ],
    [
      "P1",
      "Refresh llms.txt",
      "content_ops",
      "1.0",
      "high",
      `llms-${slug}.txt.draft adapted and published as /llms.txt`,
    ],
    [
      "P1",
      "Add FAQ and comparison blocks",
      "editor",
      "2.0",
      "high",
      "Priority pages contain concise FAQ + decision tables",
    ],
    [
      "P2",
      "Improve internal linking graph",
      "seo_ops",
      "1.5",
      "medium",
      "Each spoke links to hub and hubs link to key spokes",
    ],
    [
      "P2",
      "Normalize metadata",
      "editor",
      "1.0",
      "medium",
      "All target descriptions follow intent + value format",
    ],
  ];
  return rows.map((row) => row.join(",")).join("\n");
}

function buildSchemaPatchesJson(domain: string): string {
  return JSON.stringify(
    {
      domain,
      language: "en",
      schema: {
        organization: {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: domain,
          url: `https://${domain}`,
        },
        website: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          url: `https://${domain}`,
          name: domain,
        },
        faqTemplate: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Sample question",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sample answer based on on-page content.",
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

function buildLlmsDraft(domain: string): string {
  return `# ${domain}
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

async function readTemplateAttachment(
  relativePath: string,
  outputName: string,
  type: string
): Promise<AuditPackageAttachment> {
  const absolutePath = path.join(process.cwd(), relativePath);
  const binary = await fs.readFile(absolutePath);
  return {
    name: outputName,
    content: binary.toString("base64"),
    type,
  };
}

function asTextAttachment(name: string, body: string, type: string): AuditPackageAttachment {
  return {
    name,
    content: Buffer.from(body, "utf8").toString("base64"),
    type,
  };
}

export async function buildAuditPackageAttachments(
  input: BuildAuditPackageInput
): Promise<AuditPackageAttachment[]> {
  const domain = sanitizeDomain(input.domain);
  const slug = toSlug(domain);
  const dateStamp = new Date().toISOString().slice(0, 10);

  const binaryAttachments = await Promise.all([
    readTemplateAttachment(
      path.join("public", "audit-kit", "Executive-Brief-Template.pdf"),
      "Executive-Brief.pdf",
      "application/pdf"
    ),
    readTemplateAttachment(
      path.join("public", "audit-kit", "Manual-Implementation-Guide-Template.docx"),
      "Manual-Implementation-Guide.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ),
  ]);

  const textAttachments: AuditPackageAttachment[] = [
    asTextAttachment("README.md", buildReadme(domain, dateStamp), "text/markdown"),
    asTextAttachment(
      `standard-report-${slug}-${dateStamp}.md`,
      buildStandardReport(domain, dateStamp),
      "text/markdown"
    ),
    asTextAttachment(
      `execution-playbook-${slug}.md`,
      buildExecutionPlaybook(domain),
      "text/markdown"
    ),
    asTextAttachment(
      `ai-builder-pack-prompts-${slug}.md`,
      buildAiPrompts(domain),
      "text/markdown"
    ),
    asTextAttachment(`qa-checklist-${slug}.md`, buildQaChecklist(domain), "text/markdown"),
    asTextAttachment(
      `implementation-backlog-${slug}.csv`,
      buildBacklogCsv(domain),
      "text/csv"
    ),
    asTextAttachment(
      `schema-patches-${slug}.json`,
      buildSchemaPatchesJson(domain),
      "application/json"
    ),
    asTextAttachment(`llms-${slug}.txt.draft`, buildLlmsDraft(domain), "text/plain"),
  ];

  return [...binaryAttachments, ...textAttachments];
}

