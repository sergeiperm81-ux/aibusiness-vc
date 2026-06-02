"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AITool } from "@/data/tools";

interface Props {
  tools: AITool[];
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export default function ToolsHubSearch({ tools }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return tools
      .map((tool) => {
        const haystack = [
          tool.name,
          tool.description,
          tool.category,
          tool.targetUser,
          getDomain(tool.url),
          tool.id,
        ]
          .map(normalize)
          .join(" ");
        const name = normalize(tool.name);
        let score = 0;
        for (const term of terms) {
          if (haystack.includes(term)) score += 1;
          if (name.includes(term)) score += 1;
        }
        return { tool, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
      .slice(0, 24)
      .map((entry) => entry.tool);
  }, [query, tools]);

  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <span className="block text-sm font-semibold text-gray-700 mb-2">
        Search AI tools
      </span>
      <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch gap-2">
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${tools.length} tools — name, use case, or audience…`}
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

      {hasQuery && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
            <p>
              <span className="font-semibold text-gray-800">{results.length}</span> match
              {results.length === 1 ? "" : "es"} for &ldquo;{query.trim()}&rdquo;
              {results.length === 24 ? " (showing first 24)" : ""}
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-accent hover:text-amber-700 font-semibold"
            >
              Clear
            </button>
          </div>

          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
              <p className="text-sm text-gray-600">
                No tools matched. Try a broader word, or browse the{" "}
                <Link href="/tools/directory" className="text-accent font-semibold hover:underline">
                  full directory
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/directory/${tool.id}`}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-accent/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                      {tool.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-amber-600 transition-colors truncate">
                        {tool.name}
                      </h3>
                      <p className="text-[11px] text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                  <span className="text-[11px] font-semibold text-accent mt-2 inline-block">
                    View review &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
