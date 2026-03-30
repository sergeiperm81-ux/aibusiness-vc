"use client";

import Link from "next/link";
import { useState } from "react";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
};

const categories = ["All", "Solo", "Startups", "B2B", "Tools"];

interface NewsData {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  image: string;
}

const newsData: NewsData[] = [
  {
    slug: "ai-agents-market-7b",
    title: "AI Agents Market Hits $7.6B — Individual Developers Are Building Custom Agents for $500-1,500 Each",
    excerpt: "The AI agents market reached $7.63 billion in 2025, projected to hit $183 billion by 2033. Solo builders are cashing in.",
    body: `<p>The AI agents market reached <strong>$7.63 billion</strong> in 2025 and is on track to reach <strong>$183 billion by 2033</strong>, growing at a staggering 49.6% CAGR.</p><p>What's making headlines isn't just the big companies — it's individual developers building custom AI agents for businesses at <strong>$500-1,500 per agent</strong>.</p><p>These agents handle everything from customer support to sales outreach to invoice processing. Unlike chatbots that just answer questions, AI agents take autonomous action: they book meetings, update CRMs, send emails, and process refunds without human intervention.</p><p><strong>Why businesses are buying:</strong> A customer support employee costs $4,000/month. An AI agent handling 70% of that workload costs $500-1,000/month. The math speaks for itself.</p><p>The tools making this possible — LangChain, CrewAI, OpenAI Assistants API, and the Claude Agent SDK — have matured to the point where a skilled developer can build a production-ready agent in days, not months.</p><p>McKinsey reports that 92% of companies plan to increase their AI automation investment in the next 12 months. The demand for custom agents is only accelerating.</p>`,
    category: "Solo",
    date: "March 30, 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  },
  {
    slug: "anthropic-raises-3-5b",
    title: "Anthropic Raises $3.5B at $61.5B Valuation — AI Safety Race Intensifies",
    excerpt: "Anthropic's latest funding round makes it the second most valuable AI startup after OpenAI.",
    body: `<p>Anthropic has closed a <strong>$3.5 billion</strong> funding round, valuing the AI safety company at <strong>$61.5 billion</strong>.</p><p>The company behind Claude is now the second most valuable AI startup globally, trailing only OpenAI's $157 billion valuation. The round was led by existing investors including Google, Salesforce, and several sovereign wealth funds.</p><p><strong>What the money is for:</strong> Anthropic plans to scale compute infrastructure, expand its research team, and accelerate next-generation models. The company grew from 500 to over 1,200 employees in 2025.</p><p><strong>The bigger picture:</strong> Total AI startup funding hit $72 billion in 2025 — more than double the previous year. The concentration of capital in a handful of frontier model companies is reshaping the tech landscape.</p><p>For builders and developers, more competition among model providers means better models, lower prices, and more options.</p>`,
    category: "Startups",
    date: "March 29, 2026",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
  },
  {
    slug: "openai-api-price-cut",
    title: "OpenAI Slashes API Prices by 40% — Startups See Immediate Margin Boost",
    excerpt: "GPT-4o API costs drop significantly, making AI products cheaper to build and run.",
    body: `<p>OpenAI has reduced API pricing for GPT-4o by <strong>40%</strong>, bringing input costs down to <strong>$1.50 per million tokens</strong> and output to <strong>$6.00 per million tokens</strong>.</p><p>For AI startups that rely on OpenAI's API, this translates to immediate margin improvements. A startup processing 10 million tokens per day saves approximately <strong>$3,600 per month</strong>.</p><p><strong>Why it matters for builders:</strong> Lower API costs make previously marginal AI products viable. Use cases that were too expensive — like AI customer support for small businesses or AI tutoring — are now economically feasible.</p><p><strong>The competitive context:</strong> DeepSeek V3 offers comparable performance at $0.27 per million input tokens. Google's Gemini 2.0 Flash is priced aggressively. The trend is clear: frontier AI capabilities are getting cheaper fast.</p>`,
    category: "Startups",
    date: "March 28, 2026",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
  },
  {
    slug: "cursor-top-coding-tool",
    title: "Cursor Becomes #1 AI Coding Tool — Developers Are Switching in Droves",
    excerpt: "The AI-first code editor surpasses GitHub Copilot in developer satisfaction surveys.",
    body: `<p>Cursor has officially overtaken GitHub Copilot as the most popular AI coding tool. <strong>68% of developers</strong> who tried Cursor report it as their primary coding tool in the 2026 Stack Overflow Developer Survey.</p><p>The AI-first code editor, valued at <strong>$9 billion</strong>, combines VS Code's familiar interface with deeply integrated AI — inline generation, multi-file editing, and natural language chat.</p><p><strong>What makes it different:</strong> Unlike Copilot which adds AI to an existing editor, Cursor was built from the ground up around AI interaction. Developers report <strong>40-55% faster coding speed</strong> compared to vanilla VS Code.</p><p><strong>The vibe coding connection:</strong> Cursor is central to the "vibe coding" movement — building apps by describing what you want in natural language. Non-traditional developers are shipping products that would have required months of traditional coding.</p><p>At $20/month for the Pro plan, it's one of the highest-ROI tools for any developer.</p>`,
    category: "Tools",
    date: "March 27, 2026",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
  },
  {
    slug: "eu-ai-act-enforcement",
    title: "EU AI Act Enforcement Begins — Companies Face Up to 7% Revenue Penalties",
    excerpt: "The world's first comprehensive AI law starts enforcing compliance requirements across Europe.",
    body: `<p>The European Union's AI Act has entered its enforcement phase. Non-compliance can result in fines of up to <strong>7% of global annual revenue</strong> — or <strong>€35 million</strong>, whichever is higher.</p><p><strong>What's now required:</strong></p><ul><li>AI systems classified as "unacceptable risk" are <strong>banned</strong> (social scoring, real-time biometric surveillance)</li><li>High-risk AI must undergo conformity assessments</li><li>Generative AI providers must disclose AI-generated content</li><li>Training data documentation required</li></ul><p><strong>Who's affected:</strong> Any company deploying AI in the EU market, regardless of headquarters location.</p><p><strong>What businesses should do now:</strong> Conduct an AI inventory audit, classify systems by risk level, and begin documentation. Proactive compliance takes 2-4 months.</p><p>The EU AI Act is the template for global regulation. Similar legislation is advancing in Canada, Brazil, and South Korea.</p>`,
    category: "B2B",
    date: "March 26, 2026",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
  },
  {
    slug: "deepseek-cost-efficiency",
    title: "DeepSeek V3 Proves You Don't Need Billions to Build Frontier AI",
    excerpt: "The Chinese open-source model matches GPT-4 performance at 1/10th the API cost.",
    body: `<p>DeepSeek V3 delivers <strong>GPT-4-class performance</strong> at just <strong>$0.27 per million input tokens</strong> — roughly <strong>10x cheaper</strong> than GPT-4o.</p><p><strong>The numbers:</strong> MMLU 87.1, HumanEval 82.6, Chatbot Arena ELO 1280. All from a team that spent a fraction of what OpenAI or Anthropic invest.</p><p><strong>Why it matters:</strong></p><ul><li>Startups can build AI products with dramatically lower API costs</li><li>Open-source license means self-hosting for even lower costs</li><li>Algorithmic efficiency can compensate for compute budgets</li></ul><p>DeepSeek's success is forcing every API provider to justify their pricing. OpenAI's recent 40% price cut was partly a response to this competitive pressure.</p><p>For solo developers and bootstrapped startups, this means AI-powered products that were economically impossible a year ago are now viable.</p>`,
    category: "Startups",
    date: "March 25, 2026",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
  },
  {
    slug: "enterprise-ai-58-percent",
    title: "Enterprise AI Adoption Hits 58% — What Separates Winners from Failures",
    excerpt: "More than half of enterprises now use AI in production, but 42% of projects fail to deliver ROI.",
    body: `<p><strong>58% of enterprises</strong> now use AI in at least one business function, up from 35% in 2023, according to McKinsey's 2025 Global AI Survey. But the uncomfortable truth: <strong>42% of AI projects fail</strong> to deliver expected ROI.</p><p><strong>What winners do differently:</strong></p><ul><li>Start with one specific, measurable problem (not "implement AI everywhere")</li><li>Choose high-volume, repetitive processes first</li><li>Measure ROI weekly, not quarterly</li><li>Invest in change management alongside technology</li></ul><p><strong>The biggest failure pattern:</strong> 67% of failed projects were "organization-wide AI transformations" — trying to boil the ocean instead of winning small first.</p><p>Companies that start with a single well-defined use case see positive ROI within <strong>3-6 months</strong>. Average return: <strong>300-400% over 18 months</strong> for well-implemented projects.</p><p>92% of companies plan to increase AI investment in the next 12 months.</p>`,
    category: "B2B",
    date: "March 24, 2026",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = activeCategory === "All"
    ? newsData
    : newsData.filter((n) => n.category === activeCategory);

  function shareUrl(slug: string) {
    return `https://aibusiness.vc/news/${slug}`;
  }

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <p className="text-sm text-gray-400">Home / News</p>
          <h1 className="text-4xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
            AI BUSINESS NEWS
          </h1>
          <p className="text-gray-500 mb-6">
            Funding, launches, tools & everything AI money
          </p>
          <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded mb-4" />

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setExpandedSlug(null); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News feed + sidebar */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Main feed */}
            <div className="lg:col-span-8">
              {filtered.map((item) => {
                const isExpanded = expandedSlug === item.slug;
                return (
                  <div key={item.slug} className="border-b border-gray-100 pb-1 mb-1">
                    {/* Collapsed card */}
                    <div
                      className="flex gap-4 py-4 cursor-pointer group"
                      onClick={() => setExpandedSlug(isExpanded ? null : item.slug)}
                    >
                      <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[item.category] ?? "bg-gray-500 text-white"}`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded body */}
                    {isExpanded && (
                      <div className="pb-6 pl-0 lg:pl-52">
                        <div
                          className="prose prose-gray max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 prose-li:text-gray-600 text-[15px]"
                          dangerouslySetInnerHTML={{ __html: item.body }}
                        />

                        {/* Share bar */}
                        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                          <span className="text-xs text-gray-400">Source: AI Business</span>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-xs text-gray-400">{item.date}</span>
                          <div className="ml-auto flex gap-2">
                            <a
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl(item.slug))}&text=${encodeURIComponent(item.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-colors text-xs font-bold"
                              title="Share on X"
                            >
                              𝕏
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl(item.slug))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors"
                              title="Share on Facebook"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                            </a>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(item.title + " " + shareUrl(item.slug))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white transition-colors"
                              title="Share on WhatsApp"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                            </a>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(shareUrl(item.slug)); }}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-amber-500 hover:text-white transition-colors"
                              title="Copy link"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                            </button>
                          </div>
                        </div>

                        {/* Permalink for SEO */}
                        <div className="mt-3">
                          <Link href={`/news/${item.slug}`} className="text-xs text-amber-600 hover:underline">
                            Permalink &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Trending topics */}
              <div className="bg-gray-900 rounded-xl p-5 mb-4">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Hot Right Now</h3>
                {newsData.slice(0, 5).map((n) => (
                  <div key={n.slug} className="flex items-start gap-2 py-2 border-b border-gray-800 last:border-0">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${catColors[n.category] ?? "bg-gray-500 text-white"}`}>
                      {n.category.slice(0, 4)}
                    </span>
                    <p className="text-xs text-gray-300 leading-snug line-clamp-2 cursor-pointer hover:text-white"
                      onClick={() => setExpandedSlug(n.slug)}>
                      {n.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Market stats */}
              <div className="bg-amber-500 rounded-xl p-5 mb-4">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3">AI Market 2026</h3>
                <div className="space-y-2">
                  <div><span className="text-2xl font-black text-black">$2.52T</span><p className="text-xs text-black/60">Global AI spending</p></div>
                  <div><span className="text-2xl font-black text-black">49.6%</span><p className="text-xs text-black/60">AI agents CAGR</p></div>
                  <div><span className="text-2xl font-black text-black">58%</span><p className="text-xs text-black/60">Businesses using AI</p></div>
                </div>
              </div>

              {/* Top tools */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Trending Tools</h3>
                {["Cursor", "Make.com", "Claude", "Semrush"].map((t, i) => (
                  <Link key={t} href={`/tools/directory/${t.toLowerCase().replace(/[.\s]/g, "-")}`}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded">
                    <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                    <span className="w-7 h-7 rounded bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold">{t[0]}</span>
                    <span className="text-sm font-medium text-gray-900">{t}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
