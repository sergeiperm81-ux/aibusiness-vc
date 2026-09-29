/**
 * Plain-language remediation guidance, shared by the emailed report and the PDF.
 *
 * Kept in one place so a customer who reads both never finds them disagreeing.
 */
import type { AuditMetric } from "@/lib/audit/mock";

export const FIXES: Record<string, string> = {
  "llms-txt":
    "Optional, and last on this list. llms.txt is a plain-text guide to your key pages at yourdomain.com/llms.txt. Some tools read it; the major assistants have not said they use it, and Google says it plays no part in its AI search. If you want to try it, the draft in your kit is a starting point: list your main pages with one line on each. It takes an hour, and it is an experiment, not a fix for visibility.",
  schema:
    "Search and AI engines read your pages far better when the key facts are labelled in a machine-readable way. Add JSON-LD structured data (Schema.org) across the site — Organization on the homepage, Article on posts, FAQPage for any Q&A, and a 'speakable' block. Give it to a developer, or do it yourself by asking ChatGPT / Claude Code: 'Write JSON-LD structured data (Organization, Article, FAQPage, speakable) for this page and tell me exactly where to paste it.'",
  "ai-crawlers":
    "AI answer engines can only quote you if their bots are allowed to read your site — and many sites block them by accident. Allow the answer-engine bots in your robots.txt: OAI-SearchBot (ChatGPT search), Claude-SearchBot (Claude search) and PerplexityBot. GPTBot, ClaudeBot and Google-Extended are training crawlers; letting them in is a separate decision about your content, not a visibility fix. robots.txt is permission only: a firewall or CDN rule can still block a bot, and that is checked separately by your host. It's a 5-minute change: ask your developer, or paste this to ChatGPT: 'Write a robots.txt that allows OAI-SearchBot, Claude-SearchBot and PerplexityBot, while keeping my admin pages blocked.'",
  citability:
    "AI lifts clear, factual sentences and ignores vague marketing copy. Restructure your top pages into a question-and-answer format with concrete numbers, dates and named sources, and add a short FAQ at the bottom — give the AI a clean sentence it can quote and attribute to you. Brief your content team, or ask ChatGPT / Claude: 'Rewrite this page into a clear Q&A format with concrete facts and a short FAQ, optimised to be quoted by AI search.'",
  "page-speed":
    "What was measured is one thing: how long your server took to send the homepage HTML to our checker, and how large that HTML is. A slow first response makes every visitor and every bot wait. Check server caching and a CDN first. Full page speed for people (Core Web Vitals, such as LCP) was not measured here; test it separately in PageSpeed Insights before changing images or scripts. Ask your developer, or Claude Code: 'Find why the first response of this homepage is slow and add caching.'",
  "javascript-dependency":
    "Some of your content may only appear after scripts run, and many AI crawlers don't run scripts — so they see a blank page. Make sure important text is in the raw HTML via server-side rendering or static generation (quick test: open a page with JavaScript disabled — if the content vanishes, that's the issue). Ask your developer, or tell Claude Code: 'Make this page render its main content server-side so it's visible without JavaScript.'",
  https:
    "Security and trust signals influence how search and AI systems weigh your site. Serve every page over HTTPS with a valid certificate and add standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy). Routine for a developer, or ask Claude Code: 'Force HTTPS and add HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy to my site.'",
  structure:
    "Clear page structure helps AI extract and quote you accurately instead of garbling your message. Give each page one clear H1 and logical H2/H3 sections, a one- or two-sentence summary under the title, short paragraphs, and an FAQ at the end. Mostly an editing pass: brief your team, or ask ChatGPT / Claude: 'Restructure this page with one H1, clear H2/H3 sections, a summary under the title, and an FAQ at the end.'",
};

export function fixFor(metric: AuditMetric): string {
  if (metric.key === "llms-txt" && metric.score > 0) {
    return (
      `Your llms.txt exists, but it still needs work: ${metric.shortHuman} ` +
      "If you keep it, list your key pages with a one-line description of each. " +
      "Treat llms.txt as an optional experiment, not a guarantee that an assistant will crawl, cite or recommend the site."
    );
  }
  return FIXES[metric.key] ?? `Improve "${metric.label}" — ${metric.shortHuman}`;
}
