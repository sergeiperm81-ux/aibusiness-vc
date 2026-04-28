"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArticleMeta } from "@/lib/articles";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Materials: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
  VC: "bg-rose-500 text-white",
  Government: "bg-red-500 text-white",
};

const defaultImages: Record<string, string> = {
  solo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  b2b: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  startups: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
  tools: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
  materials: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  learn: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
  vc: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80",
  government: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
};

type SortMode = "newest" | "oldest";

interface Props {
  articles: ArticleMeta[];
  section: string;
  totalLabel?: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function labelizeKeyword(keyword: string): string {
  const compact = keyword.trim().replace(/\s+/g, " ");
  return compact.length > 28 ? `${compact.slice(0, 28)}...` : compact;
}

export default function SectionArticleExplorer({ articles, section, totalLabel }: Props) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const fallbackImg = defaultImages[section] ?? defaultImages.solo;

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const article of articles) {
      for (const keyword of article.keywords ?? []) {
        const normalized = normalize(keyword);
        if (!normalized) continue;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12)
      .map(([value]) => value);
  }, [articles]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return articles
      .filter((article) => {
        if (activeTopic === "all") return true;
        const topicMatch = (article.keywords ?? []).some((keyword) => normalize(keyword) === activeTopic);
        return topicMatch;
      })
      .filter((article) => {
        if (!q) return true;
        const haystack = [article.title, article.description, ...(article.keywords ?? [])]
          .map((entry) => normalize(entry))
          .join(" ");
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const delta = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortMode === "newest" ? delta : -delta;
      });
  }, [activeTopic, articles, query, sortMode]);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);
  const hasFilters = query.trim().length > 0 || activeTopic !== "all" || sortMode !== "newest";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <label className="block md:col-span-2">
              <span className="block text-xs font-medium text-gray-600 mb-1">Search articles</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, keyword, or topic"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-600 mb-1">Sort</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTopic("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeTopic === "all"
                    ? "bg-accent text-black"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent"
                }`}
              >
                All Topics
              </button>
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTopic === topic
                      ? "bg-accent text-black"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent"
                  }`}
                >
                  {labelizeKeyword(topic)}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of {articles.length} articles
              {totalLabel ? ` (${totalLabel})` : ""}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveTopic("all");
                  setSortMode("newest");
                }}
                className="text-accent hover:text-amber-700 font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <h2 className="text-base font-semibold text-gray-900">No articles match this filter</h2>
            <p className="text-sm text-gray-600 mt-1">Try broader keywords or reset filters.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {featured.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.section}/${a.slug}`}
                    className="group relative rounded-xl overflow-hidden h-64 sm:h-72"
                  >
                    <img
                      src={a.image || fallbackImg}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[a.category] ?? "bg-amber-500 text-black"}`}
                      >
                        {a.category}
                      </span>
                      <h2 className="font-bold text-white text-lg mt-2 leading-snug group-hover:text-accent transition-colors">
                        {a.title}
                      </h2>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.section}/${a.slug}`}
                    className="group rounded-xl overflow-hidden border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={a.image || fallbackImg}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-black text-sm leading-snug group-hover:text-amber-600 transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-xs text-black/60 mt-2 line-clamp-2 leading-relaxed">{a.description}</p>
                      <span className="text-xs font-semibold text-amber-600 mt-3 inline-block">Read Article &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
