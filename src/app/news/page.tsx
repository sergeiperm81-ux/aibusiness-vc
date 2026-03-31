"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { newsData } from "@/data/news";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
};

const categories = ["All", "Solo", "Startups", "B2B", "Tools"];

export default function NewsPage() {
  return (
    <Suspense>
      <NewsPageInner />
    </Suspense>
  );
}

function NewsPageInner() {
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
      ? newsData
      : newsData.filter((n) => n.category === activeCategory);

  return (
    <>
      {/* Header — black, matching site style */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-accent font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            News
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            AI Business <span className="text-accent">News</span>
          </h1>
          <p className="text-sm text-muted">
            Funding, launches, tools & everything AI money
          </p>
        </div>
      </section>

      {/* Category pills */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2">
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
              {filtered.map((item) => {
                const isExpanded = expandedSlug === item.slug;
                const shareUrl = `https://aibusiness.vc/news/${item.slug}`;

                return (
                  <div
                    key={item.slug}
                    id={`news-${item.slug}`}
                    className="border border-gray-200 rounded-xl mb-4 overflow-hidden transition-all"
                  >
                    {/* Collapsed state — image left, text right */}
                    <div
                      className="flex cursor-pointer"
                      onClick={() =>
                        setExpandedSlug(isExpanded ? null : item.slug)
                      }
                    >
                      {/* Image */}
                      <div className="w-56 flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover min-h-[160px]"
                        />
                        {/* Source label at bottom of image */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1">
                          <span className="text-[11px] text-white font-medium">
                            AI BUSINESS
                          </span>
                        </div>
                      </div>

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
                          className="prose prose-gray max-w-none prose-p:text-black prose-p:leading-[1.8] prose-strong:text-black prose-li:text-black prose-ul:mt-2"
                          dangerouslySetInnerHTML={{ __html: item.body }}
                        />

                        {/* Source + share bar */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              Source
                            </span>
                            <Link
                              href={`/news/${item.slug}`}
                              className="text-sm text-gray-600 hover:text-amber-600 flex items-center gap-1"
                            >
                              AI Business
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </Link>
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
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                              </svg>
                            </a>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(item.title + " " + shareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                              </svg>
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(shareUrl);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
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

            {/* Sidebar — right column */}
            <div className="lg:col-span-4">
              {/* Hot Right Now */}
              <div className="bg-red-500 rounded-t-xl px-5 py-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hot Right Now
                </h3>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl mb-5">
                {newsData.slice(0, 5).map((n) => (
                  <div
                    key={n.slug}
                    className="flex items-start gap-3 px-5 py-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedSlug(n.slug)}
                  >
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0 ${catColors[n.category]}`}
                    >
                      {n.category.slice(0, 5)}
                    </span>
                    <p className="text-sm text-gray-700 leading-snug line-clamp-2 font-medium">
                      {n.title}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                      {n.date.split(" ").slice(0, 2).join(" ")}
                    </span>
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
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">
                      Global AI Spending
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      $2.52T
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">
                      AI Agents CAGR
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      49.6%
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <span className="text-sm text-gray-500">
                      Businesses Using AI
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      58%
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">
                      AI Worker Premium
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      +28%
                    </span>
                  </div>
                </div>
              </div>

              {/* Trending Tools */}
              <div className="bg-emerald-500 rounded-t-xl px-5 py-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Trending Tools
                </h3>
                <Link
                  href="/tools/directory"
                  className="text-xs text-white/70 hover:text-white"
                >
                  View all &rarr;
                </Link>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-xl">
                {[
                  { name: "Cursor", cat: "Coding", rank: 1 },
                  { name: "Make.com", cat: "Automation", rank: 2 },
                  { name: "Claude", cat: "AI Assistant", rank: 3 },
                  { name: "Semrush", cat: "SEO", rank: 4 },
                  { name: "ElevenLabs", cat: "Audio", rank: 5 },
                ].map((t) => (
                  <Link
                    key={t.name}
                    href={`/tools/directory/${t.name.toLowerCase().replace(/[.\s]/g, "-")}`}
                    className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <span className="text-sm font-bold text-gray-300 w-5">
                      {t.rank}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
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
