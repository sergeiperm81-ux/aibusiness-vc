export type ScoreSeverity = "critical" | "warning" | "ok" | "good";

export interface AuditMetric {
  key: string;
  label: string;
  score: number;
  severity: ScoreSeverity;
  shortHuman: string;
}

export interface QuickAudit {
  id: string;
  url: string;
  domain: string;
  scannedAt: string;
  overallScore: number;
  industryAverage: number;
  metrics: AuditMetric[];
  /** Set when the site could not be scanned. Metrics are empty in that case. */
  failure?: string;
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
        label: "AI crawler permission in robots.txt",
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
        label: "What an AI actually sees",
        score: 55,
        severity: "warning",
        shortHuman:
          "Part of this page is assembled in the visitor's browser, so assistants miss it.",
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

/**
 * Reduces user input to a bare hostname before it ever reaches a URL.
 *
 * Credentials and ports are stripped here as well as in the scanner, so that
 * `example.com@127.0.0.1` cannot survive into a link or a page heading.
 */
export function encodeDomainAsId(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^[^/@]*@/, "")
    .replace(/[/?#].*$/, "")
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .replace(/\.$/, "");
  const domain = cleaned || "example.com";
  return `demo-${domain.replace(/\./g, "__dot__")}`;
}
