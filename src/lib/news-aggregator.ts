import { XMLParser } from "fast-xml-parser";
import { badgeColorForCategory, type NewsRow } from "./supabase";

// ─── RSS Feed Sources ───────────────────────────────────────────────

interface FeedSource {
  url: string;
  name: string;
}

const RSS_FEEDS: FeedSource[] = [
  // Tier 1: Major tech/AI news (high volume)
  { url: "https://techcrunch.com/category/artificial-intelligence/feed/", name: "TechCrunch" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", name: "The Verge" },
  { url: "https://news.crunchbase.com/feed/", name: "Crunchbase" },
  { url: "https://www.technologyreview.com/feed/", name: "MIT Tech Review" },
  { url: "https://siliconangle.com/category/artificial-intelligence/feed/", name: "SiliconAngle" },
  // Tier 2: Business/Finance + AI
  { url: "https://www.cnbc.com/id/100727362/device/rss/rss.html", name: "CNBC Tech" },
  { url: "https://feeds.bloomberg.com/technology/news.rss", name: "Bloomberg Tech" },
  { url: "https://www.wired.com/feed/tag/ai/latest/rss", name: "Wired AI" },
  { url: "https://arstechnica.com/tag/artificial-intelligence/feed/", name: "Ars Technica" },
  // Tier 3: Startup/VC focused
  { url: "https://www.businessinsider.com/sai/rss", name: "Business Insider" },
  { url: "https://feeds.feedburner.com/TheHackersNews", name: "Hacker News Security" },
  { url: "https://www.artificialintelligence-news.com/feed/", name: "AI News" },
];

// ─── AI + Money Keyword Filter ──────────────────────────────────────

const MONEY_KEYWORDS = [
  "funding", "revenue", "valuation", "acquisition", "acquire", "ipo",
  "profit", "earnings", "million", "billion", "startup", "invest",
  "raise", "series a", "series b", "series c", "series d", "seed",
  "deal", "contract", "market cap", "growth", "arr", "pricing",
  "cost", "saves", "worth", "salary", "freelance", "income",
  "business", "enterprise", "roi", "monetiz", "commercial",
  "$", "percent", "workforce", "layoff", "hire", "unicorn",
  "merger", "partner", "license", "subscription", "saas",
  "customer", "scale", "market", "trillion",
  // Broader business keywords to catch more relevant news
  "company", "launch", "product", "developer", "app", "platform",
  "data", "cloud", "compute", "chip", "gpu", "nvidia", "microsoft",
  "google", "apple", "meta", "amazon", "tesla", "open source",
  "regulation", "ban", "policy", "government", "defense", "military",
  "test", "release", "update", "feature", "api", "tool",
  "industry", "sector", "economy", "job", "career", "work",
];

const AI_KEYWORDS = [
  "ai", "artificial intelligence", "machine learning", "llm",
  "gpt", "claude", "gemini", "openai", "anthropic", "deepseek",
  "neural", "deep learning", "chatbot", "generative", "copilot",
  "automation", "model", "transformer", "robot", "autonomous",
  "agent", "prompt", "compute", "inference", "training",
  "hugging face", "mistral", "llama", "perplexity", "midjourney",
  "stable diffusion", "cursor", "github copilot",
];

function hasMoneyAngle(text: string): boolean {
  const lower = text.toLowerCase();
  const hasAI = AI_KEYWORDS.some((kw) => lower.includes(kw));
  const hasMoney = MONEY_KEYWORDS.some((kw) => lower.includes(kw));
  return hasAI && hasMoney;
}

// ─── Category Classification ────────────────────────────────────────

function classifyCategory(title: string, description: string): string {
  const text = (title + " " + description).toLowerCase();

  if (/\b(freelanc|solo|side hustle|passive income|creator|one-person|solopreneur|gig)\b/.test(text))
    return "Solo";
  if (/\b(vc|venture capital|series [a-d]|seed round|fundrais|valuation|ipo|unicorn|angel invest)\b/.test(text))
    return "VC";
  if (/\b(government|federal|pentagon|defense|regulation|eu ai act|policy|congress|senate|nato|military)\b/.test(text))
    return "Government";
  if (/\b(tool|app|software|saas|platform|product launch|release|update|feature)\b/.test(text))
    return "Tools";
  if (/\b(startup|found|launch|pivot|y combinator|accelerator|incubator)\b/.test(text))
    return "Startups";

  return "B2B"; // default for enterprise/business news
}

// ─── Slug Generator ─────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// ─── HTML Sanitizer ─────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

// ─── Date Formatter ─────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}

// ─── Image Extraction ───────────────────────────────────────────────

function extractImage(item: Record<string, unknown>): string | null {
  // Try media:content
  const media = item["media:content"] as Record<string, unknown> | undefined;
  if (media) {
    const url = (media["@_url"] ?? media.url) as string | undefined;
    if (url) return url;
  }
  // Try enclosure
  const enc = item["enclosure"] as Record<string, unknown> | undefined;
  if (enc) {
    const url = (enc["@_url"] ?? enc.url) as string | undefined;
    if (url && String(enc["@_type"] ?? enc.type ?? "").startsWith("image")) return url;
  }
  // Try og:image in description
  const desc = String(item.description ?? item.content ?? "");
  const imgMatch = desc.match(/src=["']([^"']+(?:\.jpg|\.png|\.webp)[^"']*)/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

// ─── Fallback Images (local, by category) ───────────────────────────

const FALLBACK_IMAGES: Record<string, string[]> = {
  Solo: [
    "/images/articles/remote-work-1.jpg",
    "/images/articles/desk-laptop-1.jpg",
    "/images/articles/coffee-meeting-1.jpg",
    "/images/articles/creative-desk-1.jpg",
  ],
  Startups: [
    "/images/articles/startup-funding-1.jpg",
    "/images/articles/startup-whiteboard-1.jpg",
    "/images/articles/startup-garage-1.jpg",
    "/images/articles/brainstorm-1.jpg",
  ],
  B2B: [
    "/images/articles/boardroom-1.jpg",
    "/images/articles/business-handshake-1.jpg",
    "/images/articles/dashboards-1.jpg",
    "/images/articles/conference-1.jpg",
  ],
  Tools: [
    "/images/articles/code-screen-1.jpg",
    "/images/articles/code-colorful-1.jpg",
    "/images/articles/chip-hardware-1.jpg",
    "/images/articles/ai-brain-1.jpg",
  ],
  VC: [
    "/images/articles/money-cash-1.jpg",
    "/images/articles/charts-screen-1.jpg",
    "/images/articles/analytics-chart-1.jpg",
    "/images/articles/business-suit-1.jpg",
  ],
  Government: [
    "/images/articles/neon-city-1.jpg",
    "/images/articles/ai-network-1.jpg",
    "/images/articles/cybersecurity-1.jpg",
    "/images/articles/big-data-1.jpg",
  ],
};

function getFallbackImage(category: string, index: number): string {
  const images = FALLBACK_IMAGES[category] ?? FALLBACK_IMAGES.B2B;
  return images[index % images.length];
}

// ─── RSS Feed Parser ────────────────────────────────────────────────

interface ParsedArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  image: string | null;
  sourceName: string;
}

async function fetchFeed(source: FeedSource): Promise<ParsedArticle[]> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "AIBusiness.vc News Aggregator/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xml);

    // Handle RSS 2.0 and Atom formats
    const items: Record<string, unknown>[] =
      parsed?.rss?.channel?.item ??
      parsed?.feed?.entry ??
      [];

    const list = Array.isArray(items) ? items : [items];

    return list.map((item) => ({
      title: stripHtml(String(item.title ?? "")),
      description: stripHtml(
        String(item.description ?? item.summary ?? item["content:encoded"] ?? "")
      ),
      link: String(
        (item.link as Record<string, unknown>)?.["@_href"] ?? item.link ?? ""
      ),
      pubDate: String(item.pubDate ?? item.published ?? item.updated ?? ""),
      image: extractImage(item),
      sourceName: source.name,
    }));
  } catch (err) {
    console.error(`Failed to fetch ${source.name}:`, err);
    return [];
  }
}

// ─── Main Aggregation Function ──────────────────────────────────────

export interface AggregatedNewsItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  badge_color: string;
  date: string;
  image: string | null;
  source_url: string;
  source_name: string;
  published_at: string;
}

/**
 * Generate a richer news body from RSS excerpt.
 * RSS feeds only give 1-2 sentence descriptions. We expand with
 * context about the category and a clear call-to-action to read the source.
 */
function generateNewsBody(article: ParsedArticle, category: string): string {
  const desc = article.description;
  const source = article.sourceName;
  const link = article.link;

  // Category-specific context lines
  const contextLines: Record<string, string> = {
    Solo: "For solo earners and freelancers, this signals a shift in how individuals can leverage AI to generate income.",
    Startups: "This development reshapes the AI startup landscape and could affect how founders approach fundraising and product-market fit.",
    B2B: "Enterprise buyers and decision-makers should pay attention — this could impact AI procurement and implementation strategies across industries.",
    Tools: "For builders and developers, this changes the calculus on which AI tools deliver the best ROI for their workflows.",
    VC: "Investors and founders alike should note the implications for AI company valuations and deal flow in 2026.",
    Government: "Public sector AI spending and regulation continue to create both opportunities and compliance requirements for tech companies.",
  };

  const context = contextLines[category] ?? contextLines.B2B;

  // Build a substantive body
  const parts = [
    `<p>${desc}</p>`,
    `<p style="margin-top:12px;">${context}</p>`,
    `<p style="margin-top:12px;"><strong>Why it matters for your wallet:</strong> Every major AI industry move creates earning opportunities — from new tools to invest in, skills to learn, or markets to enter. Tracking these developments is how you stay ahead.</p>`,
    `<p style="margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;">`,
    `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color:#d97706;text-decoration:underline;font-weight:600;">Read the full story on ${source} &rarr;</a>`,
    `</p>`,
  ];

  return parts.join("\n");
}

export async function aggregateNews(maxItems = 10): Promise<AggregatedNewsItem[]> {
  // Fetch all feeds in parallel
  const allArticles = (await Promise.all(RSS_FEEDS.map(fetchFeed))).flat();

  // Filter for AI + Money angle
  const relevant = allArticles.filter((a) =>
    hasMoneyAngle(a.title + " " + a.description)
  );

  // Sort by date (newest first)
  relevant.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Take top N
  const top = relevant.slice(0, maxItems);

  // Transform to news items
  return top.map((article, index) => {
    const category = classifyCategory(article.title, article.description);
    const excerpt = truncate(article.description, 200);

    const body = generateNewsBody(article, category);

    return {
      slug: slugify(article.title),
      title: article.title,
      excerpt,
      body,
      category,
      badge_color: badgeColorForCategory(category),
      date: formatDate(article.pubDate),
      image: article.image || getFallbackImage(category, index),
      source_url: article.link,
      source_name: article.sourceName,
      published_at: article.pubDate
        ? new Date(article.pubDate).toISOString()
        : new Date().toISOString(),
    };
  });
}
