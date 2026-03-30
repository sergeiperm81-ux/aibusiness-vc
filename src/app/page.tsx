import Link from "next/link";
import type { Metadata } from "next";
import { TrendingBar } from "@/components/TrendingBar";

export const metadata: Metadata = {
  title: "AI Business — How to Make Money with AI in 2026",
  description:
    "The definitive guide to making money with AI. News, tools, strategies for solo earners, startups, and enterprises.",
};

const latestNews = [
  {
    title: "AI Agents Market Hits $7.6B — Solo Builders Are Cashing In",
    excerpt: "The AI agents market reached $7.63 billion in 2025 and is projected to hit $183B by 2033...",
    category: "Solo",
    badgeColor: "bg-amber-500 text-black",
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    href: "/news/ai-agents-market-7b",
  },
  {
    title: "Anthropic Raises $3.5B at $61.5B Valuation",
    excerpt: "Anthropic's latest funding round makes it the second most valuable AI startup after OpenAI.",
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    time: "4h ago",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
    href: "/news/anthropic-raises-3-5b",
  },
  {
    title: "OpenAI Slashes API Prices by 40%",
    excerpt: "GPT-4o API costs drop significantly, making AI products cheaper to build and run.",
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    time: "6h ago",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    href: "/news/openai-api-price-cut",
  },
  {
    title: "Cursor Becomes #1 AI Coding Tool",
    excerpt: "The AI-first code editor surpasses GitHub Copilot in developer satisfaction surveys.",
    category: "Tools",
    badgeColor: "bg-emerald-500 text-white",
    time: "8h ago",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
    href: "/news/cursor-top-coding-tool",
  },
  {
    title: "EU AI Act Enforcement Begins — Up to 7% Revenue Penalties",
    excerpt: "The world's first comprehensive AI law starts enforcing compliance across Europe.",
    category: "B2B",
    badgeColor: "bg-blue-500 text-white",
    time: "12h ago",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    href: "/news/eu-ai-act-enforcement",
  },
  {
    title: "DeepSeek V3: Frontier AI at 1/10th the Cost",
    excerpt: "The Chinese open-source model matches GPT-4 performance at $0.27 per million tokens.",
    category: "Startups",
    badgeColor: "bg-purple-500 text-white",
    time: "1d ago",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
    href: "/news/deepseek-cost-efficiency",
  },
];

const earnCategories = [
  {
    title: "AI Freelancing",
    description: "Offer AI-powered services: writing, design, video, coding",
    income: "$2K-$25K/mo",
    difficulty: "Beginner",
    href: "/solo/ai-freelancing",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
  },
  {
    title: "AI Automation Agency",
    description: "Build and sell AI workflows to businesses. Hottest model of 2026",
    income: "$10K-$100K/mo",
    difficulty: "Intermediate",
    href: "/solo/ai-automation-agency",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
  },
  {
    title: "AI Digital Products",
    description: "Create once, sell forever: prompts, templates, courses",
    income: "$500-$50K/mo",
    difficulty: "Beginner",
    href: "/solo/ai-digital-products",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
  },
  {
    title: "AI Content Creation",
    description: "YouTube, blogs, newsletters monetized with AI tools",
    income: "$500-$80K/mo",
    difficulty: "Beginner",
    href: "/solo/ai-content-creation",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  },
  {
    title: "AI SaaS & Agents",
    description: "Build software products powered by AI. Highest ceiling",
    income: "$1K-$500K/mo",
    difficulty: "Advanced",
    href: "/solo/ai-saas-agents",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
  },
  {
    title: "AI Careers & Jobs",
    description: "Highest-paying AI roles and how to land them",
    income: "$101K-$893K/yr",
    difficulty: "Varies",
    href: "/solo/ai-careers",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO — compact black */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-3xl">
            <p className="text-accent font-mono text-xs font-medium mb-1.5 tracking-wider uppercase">
              The AI Gold Rush is here
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] mb-2 text-white">
              How to Make Money <span className="text-accent">with AI</span> in 2026
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-3 max-w-xl">
              50+ proven methods, honest income numbers, the best tools reviewed,
              and real case studies from people who actually did it.
            </p>
            <div className="flex gap-3">
              <Link
                href="/solo"
                className="px-4 py-1.5 text-sm font-semibold bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors"
              >
                Explore Earning Methods
              </Link>
              <Link
                href="/tools"
                className="px-4 py-1.5 text-sm font-medium border border-card-border text-white rounded-lg hover:bg-card-bg transition-colors"
              >
                Browse AI Tools
              </Link>
            </div>
          </div>
        </div>
        <TrendingBar />
      </section>

      {/* LATEST NEWS — white bg, 6 black cards, 2 rows of 3 */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Latest News</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestNews.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${item.badgeColor}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-1.5 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-accent">
                      Read more &rarr;
                    </span>
                    <span className="text-[10px] text-muted">{item.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Big bright button */}
          <div className="mt-6 text-center">
            <Link
              href="/news"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-bold bg-accent text-background rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-amber-500/25"
            >
              View All News &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* HOW PEOPLE EARN — white bg, black cards */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              How People Make Money with AI
            </h2>
            <p className="text-gray-500 max-w-2xl">
              From beginner-friendly side hustles to advanced business models.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {earnCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                      {category.difficulty}
                    </span>
                    <span className="text-xs font-mono text-success">
                      {category.income}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-accent transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS — light gray bg */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Best AI Tools for Making Money
              </h2>
              <p className="text-gray-500 text-sm">
                Honest reviews with real ROI analysis.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm text-gray-400 hover:text-accent transition-colors"
            >
              All tools &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: "Cursor", cat: "Coding" },
              { name: "Make.com", cat: "Automation" },
              { name: "Semrush", cat: "SEO" },
              { name: "Copy.ai", cat: "Writing" },
              { name: "Synthesia", cat: "Video" },
              { name: "Notion AI", cat: "Productivity" },
            ].map((tool) => (
              <Link
                key={tool.name}
                href={`/tools/${tool.name.toLowerCase().replace(/[.\s]/g, "-")}`}
                className="group bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 mx-auto mb-2 flex items-center justify-center text-amber-600 font-bold">
                  {tool.name[0]}
                </div>
                <p className="font-medium text-xs text-gray-900 group-hover:text-accent transition-colors">
                  {tool.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{tool.cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REAL INCOME STORIES — white bg, black cards */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Real Income Stories
            </h2>
            <p className="text-gray-500">
              Not theory. Real people, real numbers, real timelines.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "From $0 to $10K/mo with an AI Automation Agency",
                income: "$10,200/mo",
                timeline: "6 months",
                method: "AI Automation",
                badgeColor: "bg-amber-500 text-black",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80",
              },
              {
                title: "AI Copywriting: 9 Clients, $16K/mo",
                income: "$16,200/mo",
                timeline: "8 months",
                method: "Freelancing",
                badgeColor: "bg-emerald-500 text-white",
                image: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&q=80",
              },
              {
                title: "Faceless YouTube: $5K/mo with AI Video",
                income: "$5,100/mo",
                timeline: "12 months",
                method: "Content",
                badgeColor: "bg-rose-500 text-white",
                image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&q=80",
              },
            ].map((study) => (
              <div
                key={study.title}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${study.badgeColor}`}
                  >
                    {study.method}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-success">
                      {study.income}
                    </span>
                    <span className="text-[11px] text-muted">
                      in {study.timeline}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">
                    {study.title}
                  </h3>
                  <span className="text-xs font-medium text-accent">
                    Read story &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
