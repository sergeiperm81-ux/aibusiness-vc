import Link from "next/link";
import type { Metadata } from "next";
import { TrendingBar } from "@/components/TrendingBar";
import { getAllArticles } from "@/lib/articles";
import { getLatestNews } from "@/lib/supabase";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export const metadata: Metadata = {
  title: "AI Business — How to Make Money with AI in 2026",
  description:
    "The definitive guide to making money with AI. News, tools, strategies for solo earners, startups, and enterprises.",
};

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Materials: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
};

export const revalidate = 3600;

export default async function HomePage() {
  const allArticles = getAllArticles();
  const newsData = await getLatestNews(6);
  const soloArticles = allArticles.filter((a) => a.category === "Solo").slice(0, 3);
  const b2bArticles = allArticles.filter((a) => a.category === "B2B").slice(0, 3);
  const toolsArticles = allArticles.filter((a) => a.category === "Tools").slice(0, 3);
  const signatureToolCtas = [
    {
      href: "/materials/roi-calculator",
      title: "AI ROI Calculator",
      description: "Estimate payback, annual net impact, and profitability uplift.",
    },
    {
      href: "/materials/tool-selector",
      title: "AI Tool Selector",
      description: "Build a revenue stack by goal, budget, and team setup.",
    },
    {
      href: "/materials/playbook-templates",
      title: "Playbook Templates",
      description: "Copy ready offers, sales scripts, SOPs, and pricing frameworks.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-3xl">
            <p className="text-accent font-mono text-xs font-medium mb-1.5 tracking-wider uppercase">
              The AI Gold Rush is here
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.15] mb-2 text-white">
              How to Make Money <span className="text-accent">with AI</span> in 2026
            </h1>
            <p className="text-sm text-white/70 leading-relaxed mb-3 max-w-xl">
              50+ proven methods, honest income numbers, the best tools reviewed,
              and real case studies from people who actually did it.
            </p>
            <div className="flex gap-3 flex-wrap">
              <TrackedLink
                href="/solo"
                eventName="click_home_cta"
                eventParams={{ cta: "explore_earning_methods" }}
                className="px-4 py-1.5 text-sm font-semibold bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors"
              >
                Explore Earning Methods
              </TrackedLink>
              <TrackedLink
                href="/tools/directory"
                eventName="click_home_cta"
                eventParams={{ cta: "browse_ai_tools" }}
                className="px-4 py-1.5 text-sm font-medium border border-card-border text-white rounded-lg hover:bg-card-bg transition-colors"
              >
                Browse AI Tools
              </TrackedLink>
              <TrackedLink
                href="/materials/roi-calculator"
                eventName="click_home_cta"
                eventParams={{ cta: "calculate_ai_roi" }}
                className="px-4 py-1.5 text-sm font-medium border border-emerald-500/40 text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                Calculate AI ROI
              </TrackedLink>
            </div>
          </div>
        </div>
        <TrendingBar />
      </section>

      {/* SIGNATURE TOOLS */}
      <section className="bg-white border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-black">Signature Tools</h2>
            <Link href="/materials" className="text-sm text-black/50 hover:text-accent transition-colors">
              See all materials &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signatureToolCtas.map((tool) => (
              <TrackedLink
                key={tool.href}
                href={tool.href}
                eventName="click_home_cta"
                eventParams={{ cta: tool.title.toLowerCase().replace(/\s+/g, "_") }}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <h3 className="font-bold text-white group-hover:text-accent transition-colors">{tool.title}</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed">{tool.description}</p>
                <span className="text-xs font-medium text-accent mt-3 inline-block">Open tool &rarr;</span>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS — from /news */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Latest News</h2>
            <Link href="/news" className="text-sm text-black/50 hover:text-accent transition-colors">
              All news &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsData.slice(0, 6).map((item) => (
              <Link
                key={item.slug}
                href={`/news?open=${item.slug}`}
                className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1"
              >
                <div className="relative h-36 overflow-hidden bg-gray-800">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${catColors[item.category] ?? "bg-amber-500 text-black"}`}>
                    {item.category}
                  </span>
                </div>
                <div className="px-4 py-3">
                  <h3 className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-1.5 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-accent">Read more &rarr;</span>
                    <span className="text-[10px] text-white/50">{item.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/news" className="inline-flex items-center justify-center px-8 py-3 text-base font-bold bg-accent text-background rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-amber-500/25">
              View All News &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SOLO ARTICLES */}
      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Solo: Make Money with AI</h2>
            <Link href="/solo" className="text-sm text-black/50 hover:text-accent transition-colors">
              All solo guides &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {soloArticles.map((a) => (
              <Link key={a.slug} href={`/${a.section}/${a.slug}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-500 text-black">Solo</span>
                <h3 className="font-bold text-white text-sm mt-3 mb-2 group-hover:text-accent transition-colors leading-snug">{a.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2">{a.description}</p>
                <span className="text-xs font-medium text-accent mt-3 inline-block">Read guide &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B2B ARTICLES */}
      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">B2B: AI for Business</h2>
            <Link href="/b2b" className="text-sm text-black/50 hover:text-accent transition-colors">
              All B2B articles &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {b2bArticles.map((a) => (
              <Link key={a.slug} href={`/${a.section}/${a.slug}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-blue-500/40 transition-all hover:-translate-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-500 text-white">B2B</span>
                <h3 className="font-bold text-white text-sm mt-3 mb-2 group-hover:text-accent transition-colors leading-snug">{a.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2">{a.description}</p>
                <span className="text-xs font-medium text-accent mt-3 inline-block">Read case study &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS ARTICLES */}
      <section className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Tools & Reviews</h2>
            <Link href="/tools/directory" className="text-sm text-black/50 hover:text-accent transition-colors">
              All tools &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toolsArticles.map((a) => (
              <Link key={a.slug} href={`/${a.section}/${a.slug}`}
                className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-emerald-500/40 transition-all hover:-translate-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-500 text-white">Tools</span>
                <h3 className="font-bold text-white text-sm mt-3 mb-2 group-hover:text-accent transition-colors leading-snug">{a.title}</h3>
                <p className="text-xs text-white/70 line-clamp-2">{a.description}</p>
                <span className="text-xs font-medium text-accent mt-3 inline-block">Read review &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
