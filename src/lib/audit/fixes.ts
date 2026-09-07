/**
 * Plain-language remediation guidance, shared by the emailed report and the PDF.
 *
 * Kept in one place so a customer who reads both never finds them disagreeing.
 */
import type { AuditMetric } from "@/lib/audit/mock";

export const FIXES: Record<string, string> = {
  "llms-txt":
    "Right now AI assistants have no 'map' of your site, so they skip or misread it. Create an llms.txt file at your domain root (yourdomain.com/llms.txt) listing your most important pages with a one-line description of each, plus a fuller llms-full.txt — a menu you hand to ChatGPT, Perplexity and Claude so they cite the right pages. Hand it to a developer (about half a day), or do it yourself by asking Claude Code / ChatGPT: 'Generate an llms.txt and llms-full.txt for my site from these top pages and a short description of what we do.'",
  schema:
    "Search and AI engines read your pages far better when the key facts are labelled in a machine-readable way. Add JSON-LD structured data (Schema.org) across the site — Organization on the homepage, Article on posts, FAQPage for any Q&A, and a 'speakable' block. Give it to a developer, or do it yourself by asking ChatGPT / Claude Code: 'Write JSON-LD structured data (Organization, Article, FAQPage, speakable) for this page and tell me exactly where to paste it.'",
  "ai-crawlers":
    "AI answer engines can only quote you if their bots are allowed to read your site — and many sites block them by accident. Allow the AI crawlers in your robots.txt. It's a 5-minute change: ask your developer, or paste this to ChatGPT: 'Write a robots.txt that allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and OAI-SearchBot, while keeping my admin pages blocked.'",
  citability:
    "AI lifts clear, factual sentences and ignores vague marketing copy. Restructure your top pages into a question-and-answer format with concrete numbers, dates and named sources, and add a short FAQ at the bottom — give the AI a clean sentence it can quote and attribute to you. Brief your content team, or ask ChatGPT / Claude: 'Rewrite this page into a clear Q&A format with concrete facts and a short FAQ, optimised to be quoted by AI search.'",
  "page-speed":
    "Slow pages get crawled less and frustrate visitors, hurting both ranking and AI visibility. Improve Core Web Vitals — compress and lazy-load images, strip unused JavaScript, enable caching and a CDN — aiming for a load time (LCP) under 2.5 seconds. Hand it to a developer, or ask Claude Code: 'Audit this page's Core Web Vitals and apply fixes — image compression, lazy loading, removing unused JS, and caching.'",
  "javascript-dependency":
    "Some of your content may only appear after scripts run, and many AI crawlers don't run scripts — so they see a blank page. Make sure important text is in the raw HTML via server-side rendering or static generation (quick test: open a page with JavaScript disabled — if the content vanishes, that's the issue). Ask your developer, or tell Claude Code: 'Make this page render its main content server-side so it's visible without JavaScript.'",
  https:
    "Security and trust signals influence how search and AI systems weigh your site. Serve every page over HTTPS with a valid certificate and add standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy). Routine for a developer, or ask Claude Code: 'Force HTTPS and add HSTS, X-Content-Type-Options, X-Frame-Options and a Content-Security-Policy to my site.'",
  structure:
    "Clear page structure helps AI extract and quote you accurately instead of garbling your message. Give each page one clear H1 and logical H2/H3 sections, a one- or two-sentence summary under the title, short paragraphs, and an FAQ at the end. Mostly an editing pass: brief your team, or ask ChatGPT / Claude: 'Restructure this page with one H1, clear H2/H3 sections, a summary under the title, and an FAQ at the end.'",
};

export function fixFor(metric: AuditMetric): string {
  return FIXES[metric.key] ?? `Improve "${metric.label}" — ${metric.shortHuman}`;
}
