import type { MetadataRoute } from "next";

const BASE_URL = "https://aibusiness.vc";

/** Internal routes no crawler should fetch: endpoints, logins, owner pages. */
const PRIVATE_PATHS = ["/materials/leads", "/materials/leads/login", "/api/", "/stats"];

/**
 * AI crawlers and assistants we want reading the site. They drive traffic and
 * decide what assistants say about us.
 *
 * Each gets its own group, and a named group replaces the `*` group for that
 * bot rather than adding to it. A group with only `allow: "/"` would therefore
 * quietly permit these bots into /api/ as well. The private paths are repeated
 * in every group so the exclusion survives the override.
 */
const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

/** Aggressive SEO crawlers: thousands of requests a day, no traffic in return. */
const BLOCKED_AGENTS = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "DataForSeoBot",
  "serpstatbot",
  "Bytespider",
  "PetalBot",
  "ZoominfoBot",
  "Sogou",
  "YandexBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE_PATHS })),
      ...BLOCKED_AGENTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
