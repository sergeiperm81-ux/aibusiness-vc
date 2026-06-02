import { NextResponse, type NextRequest } from "next/server";

// Aggressive bots that ignore robots.txt and waste Vercel resources.
// NOTE: AI answer-engine crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
// are intentionally NOT blocked — they drive our GEO / AI-search visibility.
const BLOCKED_BOTS = [
  // SEO / backlink scrapers
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
  "MegaIndex",
  "BaiduSpider",
  "Exabot",
  "CCBot",
  "Barkrowler",
  "ImagesiftBot",
  "Diffbot",
  "Timpibot",
  "Amazonbot",
  // Headless browsers + automation clients — these fire GA as fake "Direct"
  // sessions that bounce in ~1s and pollute engagement metrics.
  "HeadlessChrome",
  "PhantomJS",
  "Puppeteer",
  "Playwright",
  "Selenium",
  "Scrapy",
  "python-requests",
  "python-urllib",
  "aiohttp",
  "Go-http-client",
  "libwww-perl",
  "Java/",
  "Apache-HttpClient",
  "masscan",
  "zgrab",
];

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  // Block aggressive bots at edge — zero compute cost
  if (BLOCKED_BOTS.some((bot) => ua.includes(bot))) {
    return new NextResponse("Blocked", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all pages except static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|og-image).*)",
  ],
};
