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
  Society: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
  VC: "bg-rose-500 text-white",
  Government: "bg-red-500 text-white",
  Robots: "bg-orange-500 text-white",
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

interface Props {
  articles: ArticleMeta[];
  section: string;
  totalLabel?: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export default function SectionArticleExplorer({ articles, section, totalLabel }: Props) {
  const [query, setQuery] = useState("");
  const fallbackImg = defaultImages[section] ?? defaultImages.solo;

  const filtered = useMemo(() => {
    const q = normalize(query);
    const sorted = [...articles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (!q) return sorted;

    const terms = q.split(/\s+/).filter(Boolean);
    return sorted
      .map((article) => {
        const haystack = [article.title, article.description, ...(article.keywords ?? [])]
          .map((entry) => normalize(entry))
          .join(" ");
        // Score: how many of the typed words appear. Title matches count double.
        const title = normalize(article.title);
        let score = 0;
        for (const term of terms) {
          if (haystack.includes(term)) score += 1;
          if (title.includes(term)) score += 1;
        }
        return { article, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.article);
  }, [articles, query]);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);
  const hasQuery = query.trim().length > 0;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <span className="block text-sm font-semibold text-gray-700 mb-2">
            Search articles
          </span>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex items-stretch gap-2"
          >
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type what you're looking for…"
                className="w-full rounded-xl border-2 border-gray-300 bg-white pl-11 pr-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 sm:px-6 py-3 text-sm font-bold text-black shadow-sm hover:brightness-95 active:brightness-90 transition"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span>Search</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
            <p>
              {hasQuery ? (
                <>
                  <span className="font-semibold text-gray-800">{filtered.length}</span> result
                  {filtered.length === 1 ? "" : "s"} for &ldquo;{query.trim()}&rdquo;
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-800">{articles.length}</span>{" "}
                  {totalLabel ?? "articles"}
                </>
              )}
            </p>
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-accent hover:text-amber-700 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <h2 className="text-base font-semibold text-gray-900">Nothing matched your search</h2>
            <p className="text-sm text-gray-600 mt-1">Try a different word, or clear the search to see everything.</p>
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
