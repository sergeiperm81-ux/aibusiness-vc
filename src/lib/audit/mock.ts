export type ScoreSeverity = "critical" | "warning" | "ok" | "good";

export interface AuditMetric {
  key: string;
  label: string;
  score: number;
  severity: ScoreSeverity;
  shortHuman: string;
}

export interface AuditFinding {
  key: string;
  category: string;
  severity: ScoreSeverity;
  title: string;
  human: string;
  aiPrompt: string;
}

export interface QuickAudit {
  id: string;
  url: string;
  domain: string;
  scannedAt: string;
  overallScore: number;
  industryAverage: number;
  metrics: AuditMetric[];
}

export interface FullAuditReport {
  id: string;
  url: string;
  domain: string;
  generatedAt: string;
  overallScore: number;
  competitorAverage: number;
  competitors: { domain: string; score: number }[];
  brandTests: {
    platform: string;
    sentiment: "positive" | "neutral" | "negative" | "absent";
    summary: string;
  }[];
  findings: AuditFinding[];
  generatedFiles: { name: string; description: string }[];
}

export function severityColor(s: ScoreSeverity): string {
  switch (s) {
    case "critical":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    case "ok":
      return "text-yellow-500";
    case "good":
      return "text-emerald-500";
  }
}

export function severityBadge(s: ScoreSeverity): string {
  switch (s) {
    case "critical":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "warning":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "ok":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case "good":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
}

export function scoreToSeverity(score: number): ScoreSeverity {
  if (score < 40) return "critical";
  if (score < 65) return "warning";
  if (score < 85) return "ok";
  return "good";
}

export function getMockQuickAudit(id: string): QuickAudit {
  const domain = decodeDomainFromId(id);
  return {
    id,
    url: `https://${domain}`,
    domain,
    scannedAt: new Date().toISOString(),
    overallScore: 54,
    industryAverage: 62,
    metrics: [
      {
        key: "llms-txt",
        label: "llms.txt",
        score: 0,
        severity: "critical",
        shortHuman:
          "Missing. AI engines have no curated map of your site.",
      },
      {
        key: "schema",
        label: "Schema markup",
        score: 42,
        severity: "warning",
        shortHuman: "Basic schema only. No FAQ, HowTo, or speakable.",
      },
      {
        key: "ai-crawlers",
        label: "AI crawlers access",
        score: 65,
        severity: "ok",
        shortHuman: "GPTBot allowed. ClaudeBot and PerplexityBot not explicit.",
      },
      {
        key: "citability",
        label: "Citation readiness",
        score: 58,
        severity: "warning",
        shortHuman: "Content lacks Q&A structure AI models prefer to cite.",
      },
      {
        key: "page-speed",
        label: "Page speed",
        score: 88,
        severity: "good",
        shortHuman: "Core Web Vitals look healthy.",
      },
      {
        key: "javascript-dependency",
        label: "JavaScript rendering",
        score: 55,
        severity: "warning",
        shortHuman:
          "Some content depends on JavaScript. AI crawlers do not run JS.",
      },
      {
        key: "https",
        label: "HTTPS & security",
        score: 100,
        severity: "good",
        shortHuman: "Secure connection, valid certificate.",
      },
      {
        key: "structure",
        label: "Content structure",
        score: 76,
        severity: "ok",
        shortHuman: "Headings present. Some sections lack clear summaries.",
      },
    ],
  };
}

export function getMockFullReport(id: string): FullAuditReport {
  const domain = decodeDomainFromId(id);
  return {
    id,
    url: `https://${domain}`,
    domain,
    generatedAt: new Date().toISOString(),
    overallScore: 54,
    competitorAverage: 67,
    competitors: [
      { domain: "competitor-one.com", score: 78 },
      { domain: "competitor-two.com", score: 64 },
      { domain: "competitor-three.com", score: 59 },
    ],
    brandTests: [
      {
        platform: "ChatGPT",
        sentiment: "absent",
        summary:
          "ChatGPT could not produce a description of your brand. No training-data exposure detected.",
      },
      {
        platform: "Perplexity",
        sentiment: "neutral",
        summary:
          "Perplexity references your domain in 1 of 5 test queries. No competitive comparison cited.",
      },
      {
        platform: "Google AI Overviews",
        sentiment: "absent",
        summary:
          "Not surfaced for any of the 5 commercial-intent queries we tested.",
      },
      {
        platform: "Claude",
        sentiment: "neutral",
        summary:
          "Generic mention based on URL patterns. No verified content citations.",
      },
    ],
    findings: mockFindings(),
    generatedFiles: [
      {
        name: "llms.txt",
        description:
          "Curated map of your top 50 pages, formatted for AI crawlers.",
      },
      {
        name: "llms-full.txt",
        description: "Markdown dump of primary content for full ingestion.",
      },
      {
        name: "schema-patches.json",
        description:
          "JSON-LD blocks (FAQ, HowTo, Article, Organization) ready to drop into your templates.",
      },
      {
        name: "ai-builder-pack.zip",
        description:
          "All 30+ fix prompts bundled for Claude Code, Cursor, and ChatGPT.",
      },
    ],
  };
}

function mockFindings(): AuditFinding[] {
  return [
    {
      key: "javascript-rendering-blocks-ai",
      category: "AI Discovery",
      severity: "critical",
      title: "Critical content rendered only by JavaScript",
      human:
        "AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) do not execute JavaScript. If your hero, pricing, or product copy is rendered client-side, AI engines see a blank or partial page and cannot cite you.",
      aiPrompt: `Audit this Next.js project for client-side-only content that AI crawlers cannot see.

Tasks:
1. Open every route in src/app/**/page.tsx. For each one, identify components that fetch or render data inside "use client" boundaries with no server-side fallback.
2. For each affected route, refactor so the primary content (H1, intro paragraph, pricing cards, FAQs, schema blocks) renders on the server. Move interactivity to small leaf client components.
3. Use Server Components by default. If data is dynamic, prefer fetch() in the server component or generateStaticParams + ISR.
4. Verify the result with: \`curl -s https://yourdomain/PATH | grep -i "<h1"\` — the primary heading and first paragraph MUST appear in raw HTML.
5. Output a per-file diff. Do not break existing client interactivity.

Acceptance: every priority page returns at least 600 words of body text in raw HTML, and primary headings, lead paragraph, and JSON-LD all appear without JavaScript execution.`,
    },
    {
      key: "intent-buried-under-filler",
      category: "Citability",
      severity: "warning",
      title: "First paragraph buried under intro filler",
      human:
        "AI engines scan the first 40-60 words to decide whether your page answers the user intent. Phrases like \"In this article we will explore\" or \"Welcome to our guide\" push the actual answer below the fold of the LLM extractor.",
      aiPrompt: `For every article and landing page in this codebase, rewrite the lead paragraph so that the answer to the page's primary query appears in the first sentence.

Required structure:
- Sentence 1: direct answer to the page H1, 8-25 words.
- Sentence 2-3: the 2-3 most important supporting facts with concrete numbers, dates, or named entities.
- Then transition into the body content.

Forbidden opening phrases (delete on sight):
- "In this article", "In this guide", "In this post"
- "Today we will", "We will explore", "Let's dive into"
- "Welcome to", "Have you ever wondered", "Did you know"
- "In the world of", "In today's"

Process: open each article file, extract the H1 and the implied user intent, rewrite the lead. Output a per-file diff. Keep total word count change under +/- 15%.`,
    },
    {
      key: "marketing-fluff-over-facts",
      category: "Citability",
      severity: "warning",
      title: "Marketing fluff outweighs concrete facts",
      human:
        "AI models cite content with concrete numbers, dates, and named entities 35% more often than content full of subjective adjectives like \"best\", \"leading\", \"innovative\", \"feature-rich\". Your pages skew heavily toward fluff.",
      aiPrompt: `Find and replace marketing fluff with concrete facts across all article and landing pages.

Step 1: search the codebase for these fluff terms (case-insensitive):
best, leading, world-class, cutting-edge, innovative, feature-rich, state-of-the-art, game-changing, revolutionary, premier, top-notch, industry-leading, unparalleled, seamless, robust, next-generation, powerful, comprehensive, advanced.

Step 2: for each occurrence, choose one:
A) Replace with a concrete fact (number, percent, date, dollar amount, named entity, or measurable claim) that supports the same point.
B) If no fact is available, delete the sentence and tighten the surrounding paragraph.

Examples:
- BAD: "Our platform offers world-class security."
- GOOD: "SOC 2 Type II audited in 2026, 99.99% uptime over the last 12 months."
- BAD: "Industry-leading customer support."
- GOOD: "Average first-response time: 4 minutes 30 seconds across 18,000 monthly tickets."

Output a per-file diff. Do not invent facts. If a claim has no supporting evidence, delete it.`,
    },
    {
      key: "unchunkable-long-sections",
      category: "Content structure",
      severity: "ok",
      title: "Sections too long for AI extraction",
      human:
        "AI engines extract content in chunks, typically one H2 plus the next 2-3 paragraphs. When sections run 400+ words without subheadings or bullet lists, the extractor truncates and your key points get cut.",
      aiPrompt: `Restructure long-form articles so each H2/H3 section is extractable as a self-contained chunk.

Rules:
- Every H2 should be followed by a 1-2 sentence summary of what this section answers.
- Section length between H2 boundaries: target 80-200 words. Hard cap 250 words before adding an H3 or list.
- Every section that compares or enumerates 3+ items should use a markdown list or table, not prose.
- Every key claim should be one sentence (subject-verb-object), not a stacked clause.

Process:
1. For each article, walk the H2 boundaries.
2. If a section exceeds 250 words, insert an H3 break or convert prose into a bullet list.
3. Add a one-sentence summary directly under each H2 (this becomes the most-cited line in AI answers).

Output a per-file diff. Preserve all factual content; only change structure.`,
    },
    {
      key: "missing-llms-txt",
      category: "AI Discovery",
      severity: "critical",
      title: "llms.txt is missing",
      human:
        "AI engines like ChatGPT and Perplexity look for /llms.txt to understand which pages matter on your site. Without it, they crawl blindly and frequently miss your best content.",
      aiPrompt: `Create a file at /public/llms.txt in this Next.js project with the following structure:

# {SITE_NAME}
> {ONE_LINE_DESCRIPTION_FROM_META}

## Documentation
- [{Title}]({URL}): {one-sentence summary}

## Products
- [{Title}]({URL}): {one-sentence summary}

## Blog
- [{Title}]({URL}): {one-sentence summary}

Populate it with the 50 most important URLs on the site, grouped under the sections above. Each link MUST have a one-sentence description.

Also create /public/llms-full.txt containing the same URLs but with the full markdown content of each page concatenated below the link line.

Spec reference: https://llmstxt.org`,
    },
    {
      key: "no-faq-schema",
      category: "Schema markup",
      severity: "critical",
      title: "No FAQPage schema on guide pages",
      human:
        "Pages with question-and-answer content rank higher in AI Overviews when wrapped in FAQPage JSON-LD. Yours have none.",
      aiPrompt: `On every page in this codebase that contains an FAQ block (look for headings like "Frequently asked", "FAQ", "Common questions"), add a JSON-LD <script type="application/ld+json"> block with the following shape:

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question text}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer text, plain string, no HTML}"
      }
    }
  ]
}

Generate one Question entry per H3 inside the FAQ block. Place the script tag inside the page component, after the visible FAQ markup. Validate against https://search.google.com/test/rich-results before merging.`,
    },
    {
      key: "ai-crawlers-not-explicit",
      category: "AI Discovery",
      severity: "warning",
      title: "AI crawlers not explicitly allowed in robots.txt",
      human:
        "Your robots.txt does not name ClaudeBot, PerplexityBot, or Google-Extended. Some legal teams interpret silence as denial.",
      aiPrompt: `Update /public/robots.txt to explicitly allow the major AI crawlers. Append (or merge with existing rules):

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

If there are paths you do NOT want indexed by AI (e.g. /admin, /draft), add a Disallow line under each crawler block.`,
    },
    {
      key: "thin-meta-descriptions",
      category: "Citability",
      severity: "warning",
      title: "Meta descriptions under 100 chars on 18 pages",
      human:
        "AI summarizers often quote your meta description verbatim. Short or generic descriptions get skipped.",
      aiPrompt: `Audit every page route in src/app/**/page.tsx. For each page, check the exported metadata.description. If it is missing or shorter than 120 characters, rewrite it as a 140–160 character sentence that:

1. Starts with the primary keyword
2. States the unique value (numbers, scope, or specificity)
3. Ends with a soft action verb (compare, learn, see, get)

Use the page H1 and first paragraph as source material. Do not invent facts. Output a diff per file.`,
    },
    {
      key: "no-author-schema",
      category: "Authority (E-E-A-T)",
      severity: "warning",
      title: "No Person/author schema on articles",
      human:
        "AI models weight content with verifiable authorship higher. Your articles have no Person schema linking to a real human.",
      aiPrompt: `For every article template (src/components/ArticlePage.tsx and any pages rendering article content), inject a Person + Article JSON-LD block:

{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{article title}",
  "datePublished": "{ISO date}",
  "dateModified": "{ISO date or same as published}",
  "author": {
    "@type": "Person",
    "name": "{author name}",
    "url": "{author profile URL on this site}",
    "sameAs": [
      "{LinkedIn URL}",
      "{X/Twitter URL}"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "AI Business",
    "url": "https://aibusiness.vc"
  }
}

If the article frontmatter has no author field, default to a site-level author "AI Business Editorial" with url "/about". Validate with the Rich Results Test.`,
    },
    {
      key: "no-comparison-tables",
      category: "Content structure",
      severity: "ok",
      title: "Few comparison tables in long-form content",
      human:
        "AI engines cite tables 2.5× more than prose. You have under 1 table per 10 articles.",
      aiPrompt: `Scan all article files (src/data/**/*.ts, MDX, or article templates). For any article over 1000 words that compares 3+ entities (tools, methods, plans, models), insert a markdown table with:

| {Entity} | {Key dimension 1} | {Key dimension 2} | {Verdict} |

Pick 3–5 dimensions that match the article's topic (price, accuracy, speed, etc.). Place the table after the second H2. Do not duplicate text already in the prose — the table should add at-a-glance scannability, not repeat sentences.`,
    },
    {
      key: "no-howto-schema",
      category: "Schema markup",
      severity: "warning",
      title: "Tutorials missing HowTo schema",
      human:
        "Step-by-step content gets surfaced in AI Overviews when wrapped in HowTo JSON-LD. None detected.",
      aiPrompt: `Find every page or article that contains a numbered or step-by-step tutorial. For each, append HowTo JSON-LD:

{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{tutorial title}",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "{step heading}",
      "text": "{step body, plain text}"
    }
  ]
}

Extract one HowToStep per H3 (or numbered <li>) in the tutorial. Strip HTML from text fields. Add the script tag inside the page component.`,
    },
    {
      key: "weak-internal-linking",
      category: "Authority (E-E-A-T)",
      severity: "ok",
      title: "Pillar pages not linked from supporting articles",
      human:
        "Hub-and-spoke linking helps AI models understand your topical authority. Some pillars are linked from fewer than 3 sub-articles.",
      aiPrompt: `Build a hub-and-spoke linking audit:

1. Identify pillar pages — pages with the broadest target keyword (e.g. "How to make money with AI").
2. For each pillar, find all supporting articles in the same topical cluster.
3. For every supporting article that does NOT link to its pillar, insert one contextual link in the introduction or first H2 section, using the pillar's H1 as anchor text.
4. For each pillar, ensure it has a "Related guides" block linking to at least 5 supporting articles.

Output a list of edits per file, do not modify code yet.`,
    },
    {
      key: "no-speakable-schema",
      category: "Schema markup",
      severity: "ok",
      title: "No speakable schema for voice/AI assistants",
      human:
        "Voice search and AI assistants prioritize content marked with speakable schema. Optional but a quick win.",
      aiPrompt: `Add speakable specification to the Article JSON-LD on long-form articles:

"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".article-summary", ".article-tldr", "h1", "h2"]
}

Wrap the first paragraph or TL;DR section of each article with class="article-summary" so the selector resolves. Place the speakable block inside the existing Article JSON-LD object.`,
    },
  ];
}

export function decodeDomainFromId(id: string): string {
  if (!id) return "example.com";
  try {
    const raw = decodeURIComponent(id).replace(/^demo-/, "");
    const decoded = raw.includes("__dot__")
      ? raw.replace(/__dot__/g, ".")
      : raw.replace(/-/g, ".");
    if (decoded && decoded.includes(".")) return decoded;
  } catch {
    // fall through
  }
  return "example.com";
}

export function encodeDomainAsId(input: string): string {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*/, "")
    .toLowerCase();
  const domain = cleaned || "example.com";
  return `demo-${domain.replace(/\./g, "__dot__")}`;
}
