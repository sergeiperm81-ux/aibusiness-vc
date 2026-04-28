import Link from "next/link";
import type { Article, ArticleMeta } from "@/lib/articles";
import { Breadcrumbs, getBreadcrumbsForArticle } from "./Breadcrumbs";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Materials: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
};

const heroImages: Record<string, string> = {
  Solo: "/images/articles/team-laptop-1.jpg",
  Startups: "/images/articles/startup-funding-1.jpg",
  B2B: "/images/articles/meeting-business-1.jpg",
  Tools: "/images/articles/code-screen-1.jpg",
  Materials: "/images/articles/podcast-mic-1.jpg",
  Learn: "/images/articles/study-education-1.jpg",
};

// Cross-section discovery links
const CROSS_LINKS = [
  { href: "/solo", label: "Solo Earners", section: "solo" },
  { href: "/tools", label: "AI Tools (356)", section: "tools" },
  { href: "/startups", label: "AI Startups", section: "startups" },
  { href: "/b2b", label: "B2B / Enterprise", section: "b2b" },
  { href: "/vc", label: "VC & Funding", section: "vc" },
  { href: "/government", label: "Government AI", section: "government" },
  { href: "/models", label: "LLM Models (36)", section: "models" },
  { href: "/news", label: "Daily News", section: "news" },
  { href: "/learn", label: "Learn AI", section: "learn" },
  { href: "/materials", label: "Resources", section: "materials" },
];

// Top-performing articles for cross-promotion (based on GA4 data)
const POPULAR_ARTICLES = [
  { href: "/solo/make-money-with-claude-ai", title: "How to Make Money with Claude AI in 2026", category: "Solo" },
  { href: "/startups/ai-startup-ideas-2026", title: "AI Startup Ideas Worth Building in 2026", category: "Startups" },
  { href: "/solo/ai-automation-agency-guide", title: "Start an AI Automation Agency ($10K-$100K/Month)", category: "Solo" },
  { href: "/solo/ai-dropshipping-2026", title: "AI-Powered Dropshipping: Find Winners at Scale", category: "Solo" },
  { href: "/tools/chatgpt-vs-claude-vs-gemini", title: "ChatGPT vs Claude vs Gemini: Which Earns More?", category: "Tools" },
  { href: "/b2b/klarna-ai-replaces-700-agents", title: "Klarna AI Replaces 700 Customer Service Agents", category: "B2B" },
  { href: "/solo/ai-digital-product-ideas", title: "AI Digital Product Ideas That Actually Sell", category: "Solo" },
  { href: "/learn/prompt-engineering-career-guide", title: "Prompt Engineering Career: $100K+ Writing Prompts", category: "Learn" },
];

// Section navigation
const SECTION_LINKS = [
  { href: "/solo", label: "Solo Earners" },
  { href: "/startups", label: "Startups" },
  { href: "/b2b", label: "B2B" },
  { href: "/tools", label: "AI Tools" },
  { href: "/news", label: "News" },
  { href: "/models", label: "Models" },
];

// Sidebar sections (like mylo.family "Choose your legacy area")
const SIDEBAR_SECTIONS = [
  { href: "/solo", label: "Solo Earners", description: "Side hustles & freelancing", icon: "💰", section: "solo" },
  { href: "/tools", label: "AI Tools", description: "356 tools reviewed", icon: "🛠", section: "tools" },
  { href: "/startups", label: "Startups", description: "Funding & revenue data", icon: "🚀", section: "startups" },
  { href: "/b2b", label: "B2B Enterprise", description: "AI implementation ROI", icon: "🏢", section: "b2b" },
  { href: "/vc", label: "VC & Funding", description: "Investment & exits", icon: "📊", section: "vc" },
  { href: "/government", label: "Government AI", description: "Policy & contracts", icon: "🏛", section: "government" },
  { href: "/news", label: "Daily News", description: "Auto-updated from RSS", icon: "📰", section: "news" },
  { href: "/learn", label: "Learn AI", description: "Courses & careers", icon: "🎓", section: "learn" },
  { href: "/models", label: "LLM Models", description: "36 models compared", icon: "🤖", section: "models" },
];

interface ArticlePageProps {
  article: Article;
  relatedArticles?: ArticleMeta[];
}

export function ArticlePageView({ article, relatedArticles = [] }: ArticlePageProps) {
  const heroImg = article.image || (heroImages[article.category] ?? heroImages.Solo);
  const shareUrl = `https://aibusiness.vc/${article.section}/${article.slug}`;
  const showMonetizationCta = ["solo", "b2b", "startups"].includes(article.section);

  return (
    <>
      {/* Hero image */}
      <section className="relative h-56 sm:h-72 overflow-hidden">
        <img src={heroImg} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <Breadcrumbs items={getBreadcrumbsForArticle(article.section, article.title, article.slug)} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-white/60 mt-2">{article.date}</p>
          </div>
        </div>
      </section>

      {/* Article body — 2-column: content + sidebar */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
            {/* Main content — 2/3 width */}
            <article className="lg:col-span-2 min-w-0">
              <MarkdownContent content={article.content} />

          {showMonetizationCta && (
            <div className="mt-10 p-5 rounded-xl border border-amber-200 bg-amber-50">
              <p className="text-xs uppercase tracking-wider font-semibold text-amber-800 mb-2">Tools for action</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Turn this insight into execution</h3>
              <p className="text-sm text-gray-700 mb-4">
                Use the calculator, stack selector, and playbooks to estimate value and launch faster.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TrackedLink
                  href="/materials/roi-calculator"
                  eventName="click_article_cta"
                  eventParams={{ section: article.section, cta: "roi_calculator", source: article.slug }}
                  className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:border-emerald-300 transition-colors"
                >
                  Calculate ROI &rarr;
                </TrackedLink>
                <TrackedLink
                  href="/materials/tool-selector"
                  eventName="click_article_cta"
                  eventParams={{ section: article.section, cta: "tool_selector", source: article.slug }}
                  className="rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-300 transition-colors"
                >
                  Pick your stack &rarr;
                </TrackedLink>
                <TrackedLink
                  href="/materials/playbook-templates"
                  eventName="click_article_cta"
                  eventParams={{ section: article.section, cta: "playbook_templates", source: article.slug }}
                  className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-700 hover:border-amber-400 transition-colors"
                >
                  Copy templates &rarr;
                </TrackedLink>
              </div>
            </div>
          )}

          {/* Share buttons */}
          <div className="mt-10 pt-6 border-t border-black/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/40">Share this article:</span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:bg-black hover:text-white transition-colors text-xs font-bold"
                  title="Share on X"
                >
                  𝕏
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:bg-blue-700 hover:text-white transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:bg-blue-600 hover:text-white transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/40 hover:bg-green-500 hover:text-white transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Explore More Topics — cross-section internal links */}
          <div className="mt-10 pt-6 border-t border-black/10">
            <h3 className="text-sm font-bold text-black mb-3">Explore More Topics</h3>
            <div className="flex flex-wrap gap-2">
              {CROSS_LINKS
                .filter((l) => l.section !== article.section)
                .slice(0, 6)
                .map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-black/10 text-black/70 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                  >
                    {l.label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6">
            <Link
              href={`/${article.section}`}
              className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              &larr; Back to {article.section}
            </Link>
          </div>
        </article>

        {/* Sidebar — 1/3 width, sticky */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {/* Explore sections — dark card */}
            <div className="bg-background rounded-2xl p-6">
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-1">Explore</p>
              <p className="text-white font-bold text-lg mb-5">Choose a topic</p>
              <div className="space-y-2">
                {SIDEBAR_SECTIONS
                  .filter((s) => s.section !== article.section)
                  .slice(0, 5)
                  .map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-accent text-sm">{s.icon}</span>
                        <div>
                          <p className="text-white text-sm font-medium leading-tight">{s.label}</p>
                          <p className="text-white/40 text-xs">{s.description}</p>
                        </div>
                      </div>
                      <span className="text-white/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all text-sm">&rarr;</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Related reading — light card */}
            {relatedArticles.length > 0 && (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Related reading</p>
                <div className="space-y-3">
                  {relatedArticles.slice(0, 4).map((a) => (
                    <Link
                      key={a.slug}
                      href={`/${a.section}/${a.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      {a.image && (
                        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={a.image}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${catColors[a.category] ?? "bg-amber-500 text-black"}`}>
                          {a.category}
                        </span>
                        <p className="text-sm font-semibold text-black group-hover:text-amber-600 transition-colors mt-1 leading-snug line-clamp-2">
                          {a.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular articles */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-4">Popular</p>
              <div className="space-y-3">
                {POPULAR_ARTICLES
                  .filter((p) => p.href !== `/${article.section}/${article.slug}`)
                  .slice(0, 3)
                  .map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="block group"
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${catColors[p.category] ?? "bg-amber-500 text-black"}`}>
                        {p.category}
                      </span>
                      <p className="text-sm font-semibold text-black group-hover:text-amber-600 transition-colors mt-1 leading-snug line-clamp-2">
                        {p.title}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
        </div>
      </section>

      {/* Related Articles — same section */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 border-t border-black/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-black mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedArticles.slice(0, 3).map((a) => (
                <Link
                  key={a.slug}
                  href={`/${a.section}/${a.slug}`}
                  className="group rounded-xl overflow-hidden border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1 bg-white"
                >
                  {a.image && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[a.category] ?? "bg-amber-500 text-black"}`}>
                      {a.category}
                    </span>
                    <h3 className="font-bold text-black text-sm mt-2 leading-snug group-hover:text-amber-600 transition-colors">
                      {a.title}
                    </h3>
                    <span className="text-xs font-semibold text-amber-600 mt-2 inline-block">
                      Read Article &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular on AIBusiness — cross-section discovery */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-lg font-bold text-white mb-6">Popular on <span className="text-accent">AI Business</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ARTICLES
              .filter((p) => p.href !== `/${article.section}/${article.slug}`)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group bg-card-bg rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
                >
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[p.category] ?? "bg-amber-500 text-black"}`}>
                    {p.category}
                  </span>
                  <h3 className="font-semibold text-white text-sm mt-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {p.title}
                  </h3>
                  <span className="text-[11px] font-medium text-accent mt-2 inline-block">
                    Read &rarr;
                  </span>
                </Link>
              ))}
          </div>

          {/* Section quick links */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-card-border">
            {SECTION_LINKS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-card-bg text-white/80 hover:text-accent hover:bg-accent/10 transition-all"
              >
                {s.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            image: heroImg.startsWith("/") ? `https://aibusiness.vc${heroImg}` : heroImg,
            datePublished: article.date,
            dateModified: article.date,
            author: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
            publisher: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
            mainEntityOfPage: shareUrl,
          }),
        }}
      />
    </>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;
  let listTag = "ul";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      closeOpen();
      // Skip H1 if it matches the article title (avoid duplicate)
      continue;
    } else if (trimmed.startsWith("## ")) {
      closeOpen();
      html.push(`<h2 style="font-size:22px;font-weight:700;color:#000;margin:40px 0 16px;line-height:1.3">${fmt(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      closeOpen();
      html.push(`<h3 style="font-size:18px;font-weight:700;color:#000;margin:32px 0 12px;line-height:1.3">${fmt(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push('<ul style="margin:12px 0;padding-left:24px">'); inList = true; listTag = "ul"; }
      html.push(`<li style="color:#000;font-size:16px;line-height:1.8;margin:4px 0">${fmt(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push('<ol style="margin:12px 0;padding-left:24px">'); inList = true; listTag = "ol"; }
      html.push(`<li style="color:#000;font-size:16px;line-height:1.8;margin:4px 0">${fmt(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (trimmed.startsWith("|")) {
      if (!inTable) {
        html.push('<div style="overflow-x:auto;margin:24px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">');
        inTable = true;
      }
      if (trimmed.includes("---")) continue;
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      const isHeader = !html.some((h) => h.includes("<tr>"));
      if (isHeader) {
        html.push(`<thead><tr>${cells.map((c) => `<th style="background:#000;color:#fff;padding:10px 14px;text-align:left;font-weight:600">${fmt(c)}</th>`).join("")}</tr></thead><tbody>`);
      } else {
        html.push(`<tr>${cells.map((c) => `<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#000">${fmt(c)}</td>`).join("")}</tr>`);
      }
    } else if (trimmed === "") {
      closeOpen();
    } else {
      if (inList) { closeOpen(); }
      html.push(`<p style="color:#000;font-size:16px;line-height:1.8;margin:16px 0">${fmt(trimmed)}</p>`);
    }
  }
  closeOpen();

  function closeOpen() {
    if (inList) { html.push(`</${listTag}>`); inList = false; }
    if (inTable) { html.push("</tbody></table></div>"); inTable = false; }
  }

  return <div dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#000;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#d97706;text-decoration:none">$1</a>')
    .replace(/`(.+?)`/g, '<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;font-size:14px;color:#000">$1</code>');
}
