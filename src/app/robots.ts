import type { MetadataRoute } from "next";

const BASE_URL = "https://aibusiness.vc";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all, block internal routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/materials/leads", "/materials/leads/login", "/api/", "/stats"],
      },
      // AI search engines — explicitly allowed (these drive traffic)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // Block aggressive SEO crawlers that waste server resources
      // These generate thousands of requests/day but don't send traffic
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
      { userAgent: "BLEXBot", disallow: "/" },
      { userAgent: "DataForSeoBot", disallow: "/" },
      { userAgent: "serpstatbot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "PetalBot", disallow: "/" },
      { userAgent: "ZoominfoBot", disallow: "/" },
      { userAgent: "Sogou", disallow: "/" },
      { userAgent: "YandexBot", disallow: "/" },
    ],
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
