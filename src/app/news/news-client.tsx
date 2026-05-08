"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { NewsRow } from "@/lib/supabase";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  VC: "bg-rose-500 text-white",
  Government: "bg-cyan-500 text-white",
};

const categories = ["All", "Solo", "Startups", "B2B", "VC", "Tools", "Government"];

interface Props {
  news: NewsRow[];
}

export function NewsPageClient({ news }: Props) {
  return (
    <Suspense>
      <NewsPageInner news={news} />
    </Suspense>
  );
}

function NewsPageInner({ news }: Props) {
  const searchParams = useSearchParams();
  const openSlug = searchParams.get("open");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(openSlug);

  useEffect(() => {
    if (openSlug) {
      setExpandedSlug(openSlug);
      setTimeout(() => {
        document.getElementById(`news-${openSlug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [openSlug]);

  const filtered =
    activeCategory === "All"
      ? news
      : news.filter((n) => n.category === activeCategory);

  return (
    <>
      {/* Header */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            News
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Business <span className="text-accent">News</span>
          </h1>
          <p className="text-sm text-muted">
            Funding, launches, tools & everything AI money — updated daily
          </p>
        </div>
      </section>

      {/* Category pills */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedSlug(null);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-black"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-accent hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content — 2 column */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* News feed — left column */}
            <div className="lg:col-span-8">
              {filtered.length === 0 && (
                <p className="py-10 text-center text-gray-400">No news in this category yet.</p>
              )}
              {filtered.map((item) => {
                const isExpanded = expandedSlug === item.slug;
                const shareUrl = `https://aibusiness.vc/news/${item.slug}`;

                return (
                  <div
                    key={item.slug}
                    id={`news-${item.slug}`}
                    className="border border-gray-200 rounded-xl mb-4 overflow-hidden transition-all"
                  >
                    {/* Collapsed state */}
                    <div
                      className="flex cursor-pointer"
                      onClick={() =>
                        setExpandedSlug(isExpanded ? null : item.slug)
                      }
                    >
                      {/* Image */}
                      {item.image && (
                        <div className="w-56 flex-shrink-0 relative hidden sm:block">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover min-h-[160px]"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1">
                            <span className="text-[11px] text-white font-medium">
                              {item.source_name ?? "AI BUSINESS"}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Text content */}
                      <div className="flex-1 p-5 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[item.category] ?? "bg-gray-500 text-white"}`}
                          >
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {item.date}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-black leading-snug">
                          {item.title}
                        </h2>
                        <p className="text-sm text-black/80 mt-2 line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center px-4">
                        <svg
                          className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded body */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-6 py-6">
                        <div
                          style={{ color: "#000" }}
                          className="max-w-none [&_p]:leading-[1.8] [&_p]:mb-3 [&_p]:text-black [&_strong]:text-black [&_strong]:font-bold [&_li]:text-black [&_ul]:mt-2 [&_ul]:mb-3 [&_ul]:pl-5 [&_li]:mb-1"
                          dangerouslySetInnerHTML={{ __html: item.body }}
                        />

                        {/* Source + share bar */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              Source
                            </span>
                            {item.source_url ? (
                              <a
                                href={item.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-amber-600 flex items-center gap-1"
                              >
                                {item.source_name ?? "Original"}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-sm text-gray-600">AI Business</span>
                            )}
                            <span className="text-sm text-gray-400 ml-2">
                              {item.date}
                            </span>
                          </div>

                          {/* Share buttons */}
                          <div className="flex gap-2">
                            <a
                              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(item.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-colors text-xs font-bold"
                            >
                              𝕏
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                              </svg>
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(shareUrl);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              {/* Hot Right Now */}
              <div className="bg-red-500 rounded-t-xl px-5 py-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hot Right Now
                </h3>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl mb-5">
                {news.slice(0, 5).map((n) => (
                  <div
                    key={n.slug}
                    className="flex items-start gap-3 px-5 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedSlug(n.slug)}
                  >
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${catColors[n.category] ?? "bg-gray-500 text-white"}`}
                    >
                      {n.category.slice(0, 5)}
                    </span>
                    <p className="text-sm text-gray-700 leading-snug line-clamp-2 font-medium">
                      {n.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Market Stats */}
              <div className="bg-amber-500 rounded-t-xl px-5 py-3">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                  AI Market Stats
                </h3>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl p-5 mb-5">
                <div className="space-y-4">
                  {[
                    { label: "Global AI Spending", value: "$2.52T" },
                    { label: "AI Agents CAGR", value: "49.6%" },
                    { label: "Businesses Using AI", value: "58%" },
                    { label: "AI Worker Premium", value: "+28%" },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-baseline border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-lg font-black text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Tools */}
              <div className="bg-emerald-500 rounded-t-xl px-5 py-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Trending Tools
                </h3>
                <Link href="/tools/directory" className="text-xs text-white/70 hover:text-white">
                  View all &rarr;
                </Link>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl">
                {[
                  { name: "Cursor", cat: "Coding", slug: "cursor", rank: 1 },
                  { name: "Make.com", cat: "Automation", slug: "make", rank: 2 },
                  { name: "Claude", cat: "AI Assistant", slug: "claude", rank: 3 },
                  { name: "Semrush", cat: "SEO", slug: "semrush", rank: 4 },
                  { name: "ElevenLabs", cat: "Audio", slug: "elevenlabs", rank: 5 },
                ].map((t) => (
                  <Link
                    key={t.name}
                    href={`/tools/directory/${t.slug}`}
                    className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <span className="text-sm font-bold text-gray-300 w-5">{t.rank}</span>
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.cat}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
