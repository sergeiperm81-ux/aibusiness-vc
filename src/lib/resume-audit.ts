export interface ResumeAuditInput {
  resumeText: string;
  targetRole: string;
  targetJobDescription?: string;
}

export interface ResumeAuditMetric {
  key: string;
  label: string;
  score: number;
  note: string;
}

export interface ResumeEngineScore {
  key: "linkedin_ai_recruiter" | "gpt_ats_screening" | "gpt4_hiring_screen";
  label: string;
  score: number;
  note: string;
}

export interface ResumeAuditResult {
  overallScore: number;
  verdict: string;
  wordCount: number;
  metrics: ResumeAuditMetric[];
  engineScores: ResumeEngineScore[];
  missingSections: string[];
  missingKeywords: string[];
  strengths: string[];
  recommendations: string[];
  aiPrompts: string[];
}

export interface ResumePaidPack {
  rewrittenSummary: string;
  rewrittenBullets: string[];
  implementationPlan: string[];
  interviewSnippets: string[];
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "you",
  "are",
  "was",
  "were",
  "have",
  "has",
  "had",
  "our",
  "their",
  "about",
  "into",
  "over",
  "under",
  "across",
  "through",
  "using",
  "use",
  "used",
  "role",
  "team",
  "work",
  "years",
  "year",
  "month",
  "months",
  "experience",
  "responsible",
  "helped",
  "managed",
  "project",
  "projects",
]);

const ACTION_VERBS = [
  "launched",
  "built",
  "scaled",
  "optimized",
  "designed",
  "implemented",
  "automated",
  "led",
  "delivered",
  "increased",
  "reduced",
  "improved",
  "negotiated",
  "analyzed",
  "migrated",
  "deployed",
  "integrated",
  "validated",
  "orchestrated",
  "closed",
];

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeText(input: string): string {
  return input.replace(/\r/g, "").trim();
}

function getTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function detectSections(resume: string): string[] {
  const lowered = resume.toLowerCase();
  const map: Array<[string, RegExp]> = [
    ["summary", /\b(summary|profile|about)\b/],
    ["experience", /\b(experience|work history|employment)\b/],
    ["skills", /\b(skills|tech stack|competencies)\b/],
    ["education", /\b(education|degree|university|college)\b/],
    ["projects", /\b(projects|portfolio|selected work)\b/],
  ];

  return map.filter(([, rx]) => rx.test(lowered)).map(([name]) => name);
}

function extractResumeBullets(resume: string): string[] {
  return resume
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*•]\s+/.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, "").trim())
    .filter((l) => l.length > 20);
}

function extractResumeBulletsSafe(resume: string): string[] {
  return resume
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*•]\s+/.test(line))
    .map((line) => line.replace(/^[-*•]\s+/, "").trim())
    .filter((line) => line.length > 20);
}

function scoreStructure(resume: string, sections: string[], wordCount: number): ResumeAuditMetric {
  const bulletLines = (resume.match(/^\s*[-*•]\s+/gm) ?? []).length;
  const allLines = resume.split("\n").filter((l) => l.trim().length > 0).length || 1;
  const bulletRatio = bulletLines / allLines;

  let score = 35;
  if (sections.length >= 4) score += 30;
  else if (sections.length >= 3) score += 20;
  else if (sections.length >= 2) score += 10;
  if (bulletRatio >= 0.2 && bulletRatio <= 0.75) score += 20;
  if (wordCount >= 220 && wordCount <= 900) score += 15;

  return {
    key: "structure",
    label: "ATS Parseability",
    score: clamp(score),
    note:
      sections.length >= 4
        ? "Section coverage and formatting are ATS-friendly."
        : "Resume needs cleaner structure for machine parsing.",
  };
}

function scoreStructureSafe(
  resume: string,
  sections: string[],
  wordCount: number
): ResumeAuditMetric {
  const bulletLines = (resume.match(/^\s*[-*•]\s+/gm) ?? []).length;
  const allLines = resume.split("\n").filter((line) => line.trim().length > 0).length || 1;
  const bulletRatio = bulletLines / allLines;

  let score = 35;
  if (sections.length >= 4) score += 30;
  else if (sections.length >= 3) score += 20;
  else if (sections.length >= 2) score += 10;
  if (bulletRatio >= 0.2 && bulletRatio <= 0.75) score += 20;
  if (wordCount >= 220 && wordCount <= 900) score += 15;

  return {
    key: "structure",
    label: "ATS Parseability",
    score: clamp(score),
    note:
      sections.length >= 4
        ? "Section coverage and formatting are ATS-friendly."
        : "Resume needs cleaner structure for machine parsing.",
  };
}

function scoreKeywordFit(resume: string, targetRole: string, targetDescription?: string): {
  metric: ResumeAuditMetric;
  missingKeywords: string[];
} {
  const roleTokens = getTokens(targetRole);
  const jdTokens = getTokens(targetDescription ?? "");
  const desired = Array.from(new Set([...roleTokens, ...jdTokens])).slice(0, 24);
  const resumeTokens = new Set(getTokens(resume));

  if (desired.length === 0) {
    return {
      metric: {
        key: "keyword_fit",
        label: "Role Keyword Fit",
        score: 55,
        note: "Add a target role for sharper keyword scoring.",
      },
      missingKeywords: [],
    };
  }

  const matched = desired.filter((t) => resumeTokens.has(t));
  const missing = desired.filter((t) => !resumeTokens.has(t));
  const ratio = matched.length / desired.length;
  const score = clamp(30 + ratio * 70);

  return {
    metric: {
      key: "keyword_fit",
      label: "Role Keyword Fit",
      score,
      note: `${matched.length}/${desired.length} high-signal target terms are present.`,
    },
    missingKeywords: missing.slice(0, 12),
  };
}

function scoreEvidence(resume: string): ResumeAuditMetric {
  const numberHits = (resume.match(/\b\d+(?:[.,]\d+)?(?:%|x|k|m|b)?\b/gi) ?? []).length;
  const currencyHits = (resume.match(/[$€£]\s?\d+/g) ?? []).length;
  const impactLines = (resume.match(/^\s*[-*•].*(\d|%|\$|€|£)/gim) ?? []).length;

  let score = 25;
  if (numberHits >= 8) score += 30;
  else if (numberHits >= 4) score += 18;
  if (currencyHits >= 2) score += 10;
  if (impactLines >= 4) score += 25;
  else if (impactLines >= 2) score += 15;

  return {
    key: "evidence",
    label: "Quantified Impact",
    score: clamp(score),
    note:
      impactLines >= 3
        ? "Achievements are backed with measurable outcomes."
        : "Add more outcomes with numbers, percentages, and business impact.",
  };
}

function scoreEvidenceSafe(resume: string): ResumeAuditMetric {
  const numberHits = (resume.match(/\b\d+(?:[.,]\d+)?(?:%|x|k|m|b)?\b/gi) ?? []).length;
  const currencyHits = (resume.match(/[$€£]\s?\d+/g) ?? []).length;
  const impactLines = (resume.match(/^\s*[-*•].*(\d|%|\$|€|£)/gim) ?? []).length;

  let score = 25;
  if (numberHits >= 8) score += 30;
  else if (numberHits >= 4) score += 18;
  if (currencyHits >= 2) score += 10;
  if (impactLines >= 4) score += 25;
  else if (impactLines >= 2) score += 15;

  return {
    key: "evidence",
    label: "Quantified Impact",
    score: clamp(score),
    note:
      impactLines >= 3
        ? "Achievements are backed with measurable outcomes."
        : "Add more outcomes with numbers, percentages, and business impact.",
  };
}

function scoreActionLanguage(resume: string): ResumeAuditMetric {
  const lowered = resume.toLowerCase();
  const hits = ACTION_VERBS.reduce(
    (sum, verb) => sum + (lowered.match(new RegExp(`\\b${verb}\\b`, "g"))?.length ?? 0),
    0
  );
  const score = clamp(35 + Math.min(50, hits * 4));

  return {
    key: "action_language",
    label: "Action Language",
    score,
    note:
      hits >= 8
        ? "Strong action-oriented wording across bullet points."
        : "Use stronger action verbs to improve AI screening confidence.",
  };
}

function scoreReadability(resume: string, wordCount: number): ResumeAuditMetric {
  const lines = resume.split("\n").filter((l) => l.trim().length > 0);
  const avgLineLength =
    lines.reduce((sum, line) => sum + line.length, 0) / Math.max(1, lines.length);

  let score = 45;
  if (wordCount >= 280 && wordCount <= 700) score += 25;
  else if (wordCount >= 180 && wordCount <= 900) score += 12;
  if (avgLineLength <= 95) score += 18;
  if (resume.includes("\n\n")) score += 8;

  return {
    key: "readability",
    label: "Readability",
    score: clamp(score),
    note:
      avgLineLength <= 95
        ? "Readable layout for both recruiters and AI parsers."
        : "Long dense lines reduce AI extraction quality.",
  };
}

function buildVerdict(score: number): string {
  if (score >= 85) return "High AI-readability. Resume is competitive for AI-first screening.";
  if (score >= 70) return "Good baseline. A few targeted edits can improve pass-through rates.";
  if (score >= 55) return "Mixed quality. Structure and keyword alignment need stronger optimization.";
  return "Low AI-readability. Resume likely underperforms in modern AI screening flows.";
}

function buildEngineScores(metrics: ResumeAuditMetric[]): ResumeEngineScore[] {
  const byKey = new Map(metrics.map((m) => [m.key, m.score]));
  const structure = byKey.get("structure") ?? 50;
  const keywordFit = byKey.get("keyword_fit") ?? 50;
  const evidence = byKey.get("evidence") ?? 50;
  const actionLanguage = byKey.get("action_language") ?? 50;
  const readability = byKey.get("readability") ?? 50;

  const linkedinScore = clamp(structure * 0.25 + keywordFit * 0.5 + readability * 0.25);
  const atsScore = clamp(structure * 0.45 + keywordFit * 0.35 + evidence * 0.2);
  const gpt4Score = clamp(
    evidence * 0.45 + actionLanguage * 0.25 + keywordFit * 0.2 + readability * 0.1
  );

  return [
    {
      key: "linkedin_ai_recruiter",
      label: "LinkedIn AI Recruiter Fit",
      score: linkedinScore,
      note: "Measures discoverability and match quality for AI talent search.",
    },
    {
      key: "gpt_ats_screening",
      label: "GPT-Driven ATS Fit",
      score: atsScore,
      note: "Measures parseability, role matching, and shortlist potential.",
    },
    {
      key: "gpt4_hiring_screen",
      label: "GPT-4 Hiring Screen Fit",
      score: gpt4Score,
      note: "Measures business impact clarity and evidence quality.",
    },
  ];
}

function buildRecommendations(
  metrics: ResumeAuditMetric[],
  missingSections: string[],
  missingKeywords: string[]
): string[] {
  const list: string[] = [];
  const lowMetrics = [...metrics].sort((a, b) => a.score - b.score).slice(0, 2);

  for (const metric of lowMetrics) {
    if (metric.key === "structure") {
      list.push("Rebuild the CV into clear sections: Summary, Experience, Skills, Education, Projects.");
    } else if (metric.key === "keyword_fit") {
      list.push("Mirror the target role vocabulary in your headline, summary, and recent achievement bullets.");
    } else if (metric.key === "evidence") {
      list.push("Rewrite at least 5 bullets as measurable outcomes (%, revenue, cost, speed, quality, conversion).");
    } else if (metric.key === "action_language") {
      list.push("Start bullets with action verbs and avoid passive wording like 'responsible for'.");
    } else if (metric.key === "readability") {
      list.push("Shorten long lines and break dense paragraphs into concise bullet blocks.");
    }
  }

  if (missingSections.length > 0) {
    list.push(`Missing sections to add now: ${missingSections.join(", ")}.`);
  }

  if (missingKeywords.length > 0) {
    list.push(`Priority missing keywords: ${missingKeywords.slice(0, 8).join(", ")}.`);
  }

  return Array.from(new Set(list)).slice(0, 6);
}

function buildPrompts(input: ResumeAuditInput, missingKeywords: string[]): string[] {
  const role = input.targetRole || "target role";
  const keywords = missingKeywords.slice(0, 10).join(", ");

  return [
    `Rewrite my resume for the role "${role}" in a concise US/UK format. Keep facts true, improve clarity, and front-load business impact. Add or strengthen these terms where relevant: ${keywords || "N/A"}.`,
    "Convert my experience bullets into achievement bullets with measurable outcomes. Use this structure: Action + Scope + Metric + Business Result. Do not invent numbers; mark missing numbers as [add metric].",
    `Act as an AI recruiter and output 1) match score for "${role}", 2) top 5 strengths, 3) top 5 blocking gaps, 4) exact edits by section. Keep output practical and direct.`,
  ];
}

function enhanceBulletLine(line: string): string {
  const cleaned = line.replace(/\s+/g, " ").trim();
  const withVerb = /^[A-Z]/.test(cleaned) ? cleaned : cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  if (/\d/.test(withVerb)) {
    return `${withVerb} while documenting business impact for recruiter and ATS screening.`;
  }
  return `${withVerb}; add a measurable metric (%, $, time saved, conversion, or volume) to strengthen screening confidence.`;
}

export function buildResumePaidPack(input: ResumeAuditInput, result: ResumeAuditResult): ResumePaidPack {
  const bullets = extractResumeBulletsSafe(input.resumeText);
  const rewrittenBullets = bullets.slice(0, 10).map(enhanceBulletLine);
  const keywordTail = result.missingKeywords.slice(0, 6).join(", ");

  const rewrittenSummary = `Results-driven candidate targeting ${input.targetRole}, with evidence of cross-functional execution, measurable outcomes, and strong ownership. Resume should emphasize impact-first bullets, ATS-friendly sectioning, and explicit alignment to role keywords (${keywordTail || "role-specific terms"}).`;

  return {
    rewrittenSummary,
    rewrittenBullets,
    implementationPlan: [
      "Replace your current top summary with the rewritten summary from this report.",
      "Update at least 6 bullets in your latest role using the rewritten bullet style.",
      "Inject missing role keywords naturally into Summary, Skills, and two most recent roles.",
      "Keep layout ATS-safe: single column, standard headings, no text boxes or tables.",
      "Run one final pass with Prompt 1 and Prompt 2 to polish tone and consistency.",
    ],
    interviewSnippets: [
      "I focus on measurable outcomes first: the problem, the action, and the business result.",
      "In my recent work, I optimized workflows and tracked impact with concrete KPIs rather than activity metrics.",
      "I can quickly translate business goals into execution plans and close the loop with data.",
    ],
  };
}

export function runResumeAudit(input: ResumeAuditInput): ResumeAuditResult {
  const resumeText = normalizeText(input.resumeText);
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const sections = detectSections(resumeText);
  const missingSections = ["summary", "experience", "skills", "education", "projects"].filter(
    (name) => !sections.includes(name)
  );

  const structure = scoreStructureSafe(resumeText, sections, wordCount);
  const keywordPack = scoreKeywordFit(resumeText, input.targetRole, input.targetJobDescription);
  const evidence = scoreEvidenceSafe(resumeText);
  const actionLanguage = scoreActionLanguage(resumeText);
  const readability = scoreReadability(resumeText, wordCount);

  const metrics = [structure, keywordPack.metric, evidence, actionLanguage, readability];
  const overallScore = clamp(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length);
  const verdict = buildVerdict(overallScore);
  const engineScores = buildEngineScores(metrics);
  const recommendations = buildRecommendations(metrics, missingSections, keywordPack.missingKeywords);
  const aiPrompts = buildPrompts(input, keywordPack.missingKeywords);

  const strengths = metrics
    .filter((m) => m.score >= 75)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((m) => `${m.label}: ${m.note}`);

  return {
    overallScore,
    verdict,
    wordCount,
    metrics,
    engineScores,
    missingSections,
    missingKeywords: keywordPack.missingKeywords,
    strengths,
    recommendations,
    aiPrompts,
  };
}
