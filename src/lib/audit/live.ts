import {
  getMockQuickAudit,
  scoreToSeverity,
  type AuditMetric,
  type QuickAudit,
  decodeDomainFromId,
} from "@/lib/audit/mock";

const QUICK_AUDIT_CACHE_TTL_MS = 10 * 60 * 1000;

type CachedAudit = {
  expiresAt: number;
  data: QuickAudit;
};

const quickAuditCache = new Map<string, CachedAudit>();

type FetchSnapshot = {
  url: string;
  html: string;
  headers: Headers;
  durationMs: number;
  ok: boolean;
};

function buildMetric(
  key: string,
  label: string,
  score: number,
  shortHuman: string
): AuditMetric {
  return {
    key,
    label,
    score,
    severity: scoreToSeverity(score),
    shortHuman,
  };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*/, "");
}

function shortReasonFromError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.slice(0, 120);
  }
  return "Request failed";
}

function toBaseUrl(domain: string): string {
  return `https://${domain}`;
}

function extractTextContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(input: string, pattern: RegExp): number {
  const matched = input.match(pattern);
  return matched ? matched.length : 0;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = new Headers(init?.headers);
    headers.set(
      "user-agent",
      "AIBusinessAuditBot/1.0 (+https://aibusiness.vc/audit)"
    );

    return await fetch(url, {
      ...init,
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
      headers,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHomepage(domain: string): Promise<FetchSnapshot> {
  const started = Date.now();
  const response = await fetchWithTimeout(toBaseUrl(domain), 9000);
  const html = await response.text();
  return {
    url: response.url || toBaseUrl(domain),
    html,
    headers: response.headers,
    durationMs: Date.now() - started,
    ok: response.ok,
  };
}

async function fetchTextOrEmpty(url: string): Promise<{ ok: boolean; text: string }> {
  try {
    const response = await fetchWithTimeout(url, 6000);
    if (!response.ok) return { ok: false, text: "" };
    return { ok: true, text: await response.text() };
  } catch {
    return { ok: false, text: "" };
  }
}

interface LlmsTxtScoreResult {
  score: number;
  summary: string;
}

function scoreLlmsTxt(present: boolean, body: string): LlmsTxtScoreResult {
  if (!present) {
    return {
      score: 0,
      summary:
        "Missing at /llms.txt; AI crawlers have no curated site map.",
    };
  }

  const trimmed = body.trim();
  if (trimmed.length < 80) {
    return {
      score: 25,
      summary:
        "Found at /llms.txt but content is too short to guide AI crawlers.",
    };
  }

  const lines = trimmed.split(/\r?\n/);

  // Required: H1 title — first non-empty line should start with "# ".
  const firstLine = lines.find((l) => l.trim().length > 0)?.trim() ?? "";
  const hasH1Title = /^#\s+\S/.test(firstLine);

  // Required: blockquote-style summary line (markdown ">"); spec-recommended.
  const hasBlockquote = lines.some((l) => /^>\s+\S/.test(l.trim()));

  // Sections: at least one "## " heading.
  const sectionCount = lines.filter((l) => /^##\s+\S/.test(l.trim())).length;

  // Linked entries with descriptions: "- [Title](URL): description".
  const richLinkCount = lines.filter((l) =>
    /^-\s+\[[^\]]+\]\([^)]+\):\s+\S/.test(l.trim())
  ).length;

  // Bare links (no description) — accepted but not as valuable.
  const bareLinkCount = lines.filter(
    (l) =>
      /^-\s+\[[^\]]+\]\([^)]+\)\s*$/.test(l.trim()) &&
      !/:\s+\S/.test(l.trim())
  ).length;

  let score = 35;
  if (hasH1Title) score += 18;
  if (hasBlockquote) score += 10;
  if (sectionCount >= 3) score += 14;
  else if (sectionCount >= 1) score += 8;
  if (richLinkCount >= 10) score += 22;
  else if (richLinkCount >= 5) score += 14;
  else if (richLinkCount >= 1) score += 6;
  if (bareLinkCount > 0 && richLinkCount === 0) score -= 6;

  // Penalty for files that look like robots.txt or sitemap entries pasted in.
  const robotsLike = /^User-agent:\s/im.test(trimmed) || /^Allow:\s/im.test(trimmed);
  if (robotsLike) score -= 25;

  const finalScore = clampScore(score);

  if (!hasH1Title) {
    return {
      score: finalScore,
      summary:
        "Found at /llms.txt but missing the required H1 title; AI crawlers may ignore it.",
    };
  }
  if (sectionCount === 0) {
    return {
      score: finalScore,
      summary:
        "Found at /llms.txt but no `## Section` headings; structure is too flat.",
    };
  }
  if (richLinkCount < 3) {
    return {
      score: finalScore,
      summary:
        "Found at /llms.txt but very few linked entries with descriptions; expand to 10+ priority pages.",
    };
  }
  if (finalScore >= 90) {
    return {
      score: finalScore,
      summary: `Valid llms.txt with ${sectionCount} section${
        sectionCount === 1 ? "" : "s"
      } and ${richLinkCount} described links.`,
    };
  }
  return {
    score: finalScore,
    summary: `llms.txt structure is acceptable; consider adding more sections and descriptions (${sectionCount} sections, ${richLinkCount} described links).`,
  };
}

function scoreSchemaBlocks(schemaBlocks: number): number {
  if (schemaBlocks >= 3) return 92;
  if (schemaBlocks === 2) return 80;
  if (schemaBlocks === 1) return 65;
  return 30;
}

function scoreAiCrawlerAccess(robots: string): { score: number; summary: string } {
  if (!robots.trim()) {
    return {
      score: 35,
      summary: "robots.txt missing or unavailable; crawler policy is unclear.",
    };
  }

  const majorCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
  ];

  const normalized = robots.toLowerCase();
  const listed = majorCrawlers.filter((crawler) =>
    normalized.includes(`user-agent: ${crawler.toLowerCase()}`)
  );

  const score = clampScore(35 + listed.length * 13);
  if (listed.length === 0) {
    return {
      score,
      summary: "No AI crawler directives found in robots.txt.",
    };
  }

  return {
    score,
    summary: `${listed.length}/${majorCrawlers.length} major AI crawlers are explicitly listed.`,
  };
}

interface IntentAnswerSignal {
  hasFiller: boolean;
  bonus: number;
}

interface ConcreteFactsSignal {
  factsPer1000: number;
  fluffPer1000: number;
  bonus: number;
}

const INTENT_FILLER_PHRASES: readonly string[] = [
  "in this article",
  "in this guide",
  "in this post",
  "today we will",
  "today we'll",
  "we will explore",
  "we'll explore",
  "let's dive",
  "let's take a look",
  "welcome to",
  "have you ever",
  "did you know",
  "in the world of",
  "in today's",
];

const FLUFF_PATTERN =
  /\b(?:best|leading|world-class|cutting-edge|innovative|feature-rich|state-of-the-art|game-changing|revolutionary|premier|top-notch|industry-leading|unparalleled|seamless|robust|next-generation|powerful|comprehensive|advanced)\b/gi;

const CONCRETE_NUMBER_PATTERN =
  /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s?(?:%|percent|million|billion|hours?|days?|weeks?|months?|years?|kg|km|miles|usd|eur|seconds?|minutes?))/gi;
const CURRENCY_PATTERN = /[$€£¥]\s?\d/g;
const DATE_PATTERN =
  /\b(?:20[12]\d|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi;

function checkIntentAnswerSignal(textContent: string): IntentAnswerSignal {
  const first80Words = textContent
    .split(/\s+/)
    .slice(0, 80)
    .join(" ")
    .toLowerCase();
  const hasFiller = INTENT_FILLER_PHRASES.some((phrase) =>
    first80Words.includes(phrase)
  );

  const firstSentenceMatch = textContent.match(/^[^.!?]+[.!?]/);
  const firstSentenceWords = firstSentenceMatch
    ? firstSentenceMatch[0].split(/\s+/).filter(Boolean).length
    : 0;

  let bonus = 0;
  if (!hasFiller) bonus += 8;
  if (firstSentenceWords >= 8 && firstSentenceWords <= 30) bonus += 6;

  return { hasFiller, bonus };
}

function checkConcreteFactsSignal(textContent: string): ConcreteFactsSignal {
  const words = textContent.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { factsPer1000: 0, fluffPer1000: 0, bonus: 0 };
  }

  const facts =
    countMatches(textContent, CONCRETE_NUMBER_PATTERN) +
    countMatches(textContent, CURRENCY_PATTERN) +
    countMatches(textContent, DATE_PATTERN);

  const fluff = countMatches(textContent, FLUFF_PATTERN);

  const per1000 = words.length / 1000;
  const factsPer1000 = facts / per1000;
  const fluffPer1000 = fluff / per1000;

  let bonus = 0;
  if (factsPer1000 >= 8) bonus += 8;
  else if (factsPer1000 >= 4) bonus += 5;
  else if (factsPer1000 >= 2) bonus += 2;

  if (fluffPer1000 > 6) bonus -= 5;
  if (fluff > facts * 1.5 && fluff > 4) bonus -= 4;

  return { factsPer1000, fluffPer1000, bonus };
}

function scoreCitationReadiness(
  html: string,
  textContent: string
): { score: number; summary: string } {
  const headingCount = countMatches(html, /<h[1-3]\b/gi);
  const h1Count = countMatches(html, /<h1\b/gi);
  const tableCount = countMatches(html, /<table\b/gi);
  const faqHints = /(faq|frequently asked|q&a|common questions|\?<\/h[23]>)/i.test(
    html
  );
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  const intent = checkIntentAnswerSignal(textContent);
  const facts = checkConcreteFactsSignal(textContent);

  let score = 30;
  if (h1Count === 1) score += 12;
  if (headingCount >= 8) score += 16;
  else if (headingCount >= 4) score += 9;
  if (tableCount > 0) score += 10;
  if (faqHints) score += 10;
  if (wordCount >= 1200) score += 10;
  else if (wordCount >= 600) score += 6;

  score += intent.bonus;
  score += facts.bonus;

  const finalScore = clampScore(score);

  const summaryParts: string[] = [];
  if (intent.hasFiller) {
    summaryParts.push("first paragraph buried under intro filler");
  }
  if (facts.fluffPer1000 > facts.factsPer1000 && facts.fluffPer1000 > 4) {
    summaryParts.push("marketing fluff outweighs concrete facts");
  }
  if (!faqHints) {
    summaryParts.push("no FAQ-style blocks detected");
  }

  if (finalScore < 55) {
    const issues =
      summaryParts.length > 0 ? `: ${summaryParts.join(", ")}` : "";
    return {
      score: finalScore,
      summary: `Low citation potential for AI answers${issues}.`,
    };
  }
  if (finalScore < 80) {
    const issues =
      summaryParts.length > 0
        ? ` Issues: ${summaryParts.join(", ")}.`
        : "";
    return {
      score: finalScore,
      summary: `Decent structure but room to improve.${issues}`,
    };
  }
  return {
    score: finalScore,
    summary:
      "Strong intent answers, concrete facts, and Q&A structure for AI citation.",
  };
}

function scorePageSpeed(durationMs: number, htmlBytes: number): { score: number; summary: string } {
  let score = 92;
  if (durationMs > 2500) score = 48;
  else if (durationMs > 1700) score = 62;
  else if (durationMs > 1100) score = 76;

  if (htmlBytes > 900_000) score -= 18;
  else if (htmlBytes > 500_000) score -= 10;

  const finalScore = clampScore(score);
  if (finalScore < 60) {
    return {
      score: finalScore,
      summary: `Slow initial response (${durationMs}ms) or heavy HTML payload.`,
    };
  }
  return {
    score: finalScore,
    summary: `Response speed is acceptable (${durationMs}ms).`,
  };
}

function scoreJavaScriptDependency(
  html: string,
  textContent: string
): { score: number; summary: string } {
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const htmlBytes = html.length;

  // Detect empty mount points used by SPA frameworks.
  const emptyRoot =
    /<div\s+id=["'](?:root|__next|app|__nuxt|svelte)["'][^>]*>\s*(?:<noscript[\s\S]*?<\/noscript>\s*)?<\/div>/i.test(
      html
    );

  // Detect well-known client-side framework signals.
  const reactSignals =
    /\b(?:react-dom|react\.production|__NEXT_DATA__|react-scripts)\b/.test(
      html
    );
  const vueSignals = /\b(?:vue\.runtime|__nuxt|__vue__|vite\/client)\b/.test(
    html
  );
  const angularSignals = /\bng-version\b|<app-root\b/.test(html);
  const hasFrameworkSignal = reactSignals || vueSignals || angularSignals;

  // Heuristic: text-to-HTML ratio (words per KB of HTML).
  const textToHtmlRatio = htmlBytes > 0 ? wordCount / (htmlBytes / 1024) : 0;

  let score = 90;
  let summary =
    "Server-rendered HTML detected. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) ingest your content directly.";

  if (emptyRoot) {
    score = 12;
    summary =
      "Empty SPA mount point detected. AI crawlers likely see a blank page — they do not execute JavaScript.";
  } else if (wordCount < 100 && hasFrameworkSignal) {
    score = 25;
    summary =
      "Almost no server-rendered text on a JS-heavy page. AI crawlers see a near-empty document.";
  } else if (wordCount < 250 && hasFrameworkSignal && textToHtmlRatio < 4) {
    score = 50;
    summary =
      "Mixed rendering. JS-heavy page with thin server-rendered content; AI crawlers likely miss critical sections.";
  } else if (hasFrameworkSignal && textToHtmlRatio < 6) {
    score = 70;
    summary =
      "Framework-driven page with reasonable server-rendered content. Verify hero and pricing sections render in raw HTML.";
  } else if (wordCount >= 600 && textToHtmlRatio >= 8) {
    score = 96;
    summary =
      "Strong server-side content; AI crawlers ingest your full page directly.";
  }

  return { score: clampScore(score), summary };
}

function scoreHttpsAndSecurity(
  finalUrl: string,
  headers: Headers
): { score: number; summary: string } {
  const isHttps = finalUrl.toLowerCase().startsWith("https://");
  const hasHsts = Boolean(headers.get("strict-transport-security"));
  const hasCsp = Boolean(headers.get("content-security-policy"));
  const hasXContentType = Boolean(headers.get("x-content-type-options"));

  let score = isHttps ? 72 : 20;
  if (hasHsts) score += 16;
  if (hasCsp) score += 7;
  if (hasXContentType) score += 5;

  const finalScore = clampScore(score);
  const summary = isHttps
    ? "HTTPS is enabled with baseline security headers checked."
    : "Site is not served over HTTPS.";
  return { score: finalScore, summary };
}

interface ChunkableSignal {
  ratio: number;
  bonus: number;
}

function checkChunkableSignal(html: string): ChunkableSignal {
  // Split on H2/H3 boundaries; each chunk represents content under a heading.
  const sections = html.split(/<h[23]\b/i).slice(1);
  if (sections.length < 2) {
    return { ratio: 0, bonus: 0 };
  }

  let goodCount = 0;
  let oversizedCount = 0;

  for (const raw of sections) {
    const upToNext = raw.split(/<h[23]\b/i)[0] ?? "";
    const text = extractTextContent(upToNext);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount >= 30 && wordCount <= 220) goodCount++;
    else if (wordCount > 420) oversizedCount++;
  }

  const ratio = goodCount / sections.length;

  let bonus = 0;
  if (ratio >= 0.6) bonus += 10;
  else if (ratio >= 0.35) bonus += 5;
  if (oversizedCount > sections.length * 0.4) bonus -= 5;

  return { ratio, bonus };
}

function scoreContentStructure(
  html: string,
  textContent: string
): { score: number; summary: string } {
  const h1Count = countMatches(html, /<h1\b/gi);
  const headingCount = countMatches(html, /<h[1-3]\b/gi);
  const hasMetaDescription = /<meta[^>]+name=["']description["'][^>]*content=/i.test(
    html
  );
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;

  const chunkable = checkChunkableSignal(html);

  let score = 32;
  if (h1Count === 1) score += 18;
  else if (h1Count > 1) score -= 10;
  if (headingCount >= 6) score += 14;
  else if (headingCount >= 3) score += 8;
  if (hasMetaDescription) score += 10;
  if (wordCount >= 500) score += 8;

  score += chunkable.bonus;

  const finalScore = clampScore(score);

  if (finalScore < 60) {
    const chunkNote =
      chunkable.ratio < 0.3 && headingCount >= 2
        ? " Long unchunked sections make extraction hard for AI engines."
        : "";
    return {
      score: finalScore,
      summary: `Heading hierarchy and section sizing need work.${chunkNote}`,
    };
  }
  return {
    score: finalScore,
    summary:
      "Headings and section sizes are friendly to AI extraction and citations.",
  };
}

function buildQuickAudit(
  id: string,
  domain: string,
  metrics: AuditMetric[]
): QuickAudit {
  const total = metrics.reduce((sum, metric) => sum + metric.score, 0);
  const overallScore = clampScore(total / metrics.length);

  return {
    id,
    url: toBaseUrl(domain),
    domain,
    scannedAt: new Date().toISOString(),
    overallScore,
    industryAverage: 68,
    metrics,
  };
}

async function runLiveAudit(id: string): Promise<QuickAudit> {
  const domain = normalizeDomain(decodeDomainFromId(id));
  if (!domain.includes(".")) {
    return getMockQuickAudit(id);
  }

  const homepage = await fetchHomepage(domain);
  if (!homepage.ok || !homepage.html.trim()) {
    throw new Error("Homepage unavailable");
  }

  const base = new URL(homepage.url);
  const llmsUrl = new URL("/llms.txt", base).toString();
  const robotsUrl = new URL("/robots.txt", base).toString();

  const [llms, robots] = await Promise.all([
    fetchTextOrEmpty(llmsUrl),
    fetchTextOrEmpty(robotsUrl),
  ]);

  const textContent = extractTextContent(homepage.html);
  const schemaCount = countMatches(
    homepage.html,
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi
  );

  const llmsResult = scoreLlmsTxt(llms.ok, llms.text);
  const schemaScore = scoreSchemaBlocks(schemaCount);
  const crawlerAccess = scoreAiCrawlerAccess(robots.text);
  const citation = scoreCitationReadiness(homepage.html, textContent);
  const speed = scorePageSpeed(
    homepage.durationMs,
    Buffer.byteLength(homepage.html, "utf8")
  );
  const jsDependency = scoreJavaScriptDependency(homepage.html, textContent);
  const https = scoreHttpsAndSecurity(homepage.url, homepage.headers);
  const structure = scoreContentStructure(homepage.html, textContent);

  const metrics: AuditMetric[] = [
    buildMetric("llms-txt", "llms.txt", llmsResult.score, llmsResult.summary),
    buildMetric(
      "schema",
      "Schema markup",
      schemaScore,
      schemaCount > 0
        ? `${schemaCount} JSON-LD block${schemaCount === 1 ? "" : "s"} detected.`
        : "No JSON-LD schema found on homepage."
    ),
    buildMetric(
      "ai-crawlers",
      "AI crawlers access",
      crawlerAccess.score,
      crawlerAccess.summary
    ),
    buildMetric(
      "citability",
      "Citation readiness",
      citation.score,
      citation.summary
    ),
    buildMetric("page-speed", "Page speed", speed.score, speed.summary),
    buildMetric(
      "javascript-dependency",
      "JavaScript rendering",
      jsDependency.score,
      jsDependency.summary
    ),
    buildMetric("https", "HTTPS & security", https.score, https.summary),
    buildMetric(
      "structure",
      "Content structure",
      structure.score,
      structure.summary
    ),
  ];

  return buildQuickAudit(id, domain, metrics);
}

export async function getLiveQuickAudit(id: string): Promise<QuickAudit> {
  const cached = quickAuditCache.get(id);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  try {
    const data = await runLiveAudit(id);
    quickAuditCache.set(id, {
      data,
      expiresAt: now + QUICK_AUDIT_CACHE_TTL_MS,
    });
    return data;
  } catch (error) {
    const fallback = getMockQuickAudit(id);
    const note = shortReasonFromError(error);
    const downgraded = fallback.metrics.map((metric) =>
      metric.key === "page-speed"
        ? {
            ...metric,
            score: 30,
            severity: scoreToSeverity(30),
            shortHuman: `Live scan failed (${note}). Showing fallback estimate.`,
          }
        : metric
    );
    const withFallbackContext: QuickAudit = {
      ...fallback,
      scannedAt: new Date().toISOString(),
      metrics: downgraded,
      overallScore: clampScore(
        downgraded.reduce((sum, item) => sum + item.score, 0) / downgraded.length
      ),
    };
    quickAuditCache.set(id, {
      data: withFallbackContext,
      expiresAt: now + 60_000,
    });
    return withFallbackContext;
  }
}
