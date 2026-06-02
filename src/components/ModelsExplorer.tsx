"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AIModel } from "@/data/models";
import { getModelExternalLinks } from "@/lib/model-links";

interface Props {
  models: AIModel[];
}

function releaseKey(released: string): number {
  const [year, month = "01"] = released.split("-");
  return Number(year) * 100 + Number(month);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export default function ModelsExplorer({ models }: Props) {
  const [query, setQuery] = useState("");

  const { ranked, unranked, sorted } = useMemo(() => {
    const q = normalize(query);
    const matches = (m: AIModel) => {
      if (!q) return true;
      const haystack = [m.name, m.developer, m.description ?? "", m.id]
        .map(normalize)
        .join(" ");
      return q
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => haystack.includes(term));
    };

    const ranked = models
      .filter((m) => m.elo !== null && matches(m))
      .sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0));
    const unranked = models
      .filter((m) => m.elo === null && matches(m))
      .sort((a, b) => releaseKey(b.released) - releaseKey(a.released));

    return { ranked, unranked, sorted: [...ranked, ...unranked] };
  }, [models, query]);

  const hasQuery = query.trim().length > 0;
  const total = ranked.length + unranked.length;

  return (
    <>
      {/* Search bar */}
      <div className="mb-6">
        <span className="block text-sm font-semibold text-gray-700 mb-2">
          Search models
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
              placeholder="Model or developer — e.g. Claude, GPT, Gemini, DeepSeek…"
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
                <span className="font-semibold text-gray-800">{total}</span> model
                {total === 1 ? "" : "s"} for &ldquo;{query.trim()}&rdquo;
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-800">{models.length}</span> models — ranked
                by ELO, newest first
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

      {total === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <h2 className="text-base font-semibold text-gray-900">No models matched your search</h2>
          <p className="text-sm text-gray-600 mt-1">Try a different name, or clear the search to see all models.</p>
        </div>
      ) : (
        <>
          {!hasQuery && (
            <div className="mb-4">
              <p className="text-xs text-gray-600">
                Ranked list shows models with public ELO data. New models without enough Arena votes
                are listed separately below.
              </p>
            </div>
          )}

          {/* Ranked table */}
          {ranked.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="pb-3 pr-3 font-bold text-gray-900 w-8">#</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Model</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Developer</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900 text-right">ELO</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900 text-right">MMLU</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Context</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Price (Input)</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Model ID</th>
                    <th className="pb-3 pr-4 font-bold text-gray-900">Official</th>
                    <th className="pb-3 font-bold text-gray-900">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((model, i) => {
                    const links = getModelExternalLinks(model);
                    return (
                      <tr key={model.id} className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <span
                            className={`text-sm font-bold ${
                              i === 0 ? "text-amber-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-gray-300"
                            }`}
                          >
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <Link href={`/models/${model.id}`} className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                            {model.name}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">{model.developer}</td>
                        <td className="py-3 pr-4 text-right">
                          <span className="font-mono font-bold text-emerald-600">{model.elo ?? "-"}</span>
                        </td>
                        <td className="py-3 pr-4 text-right font-mono text-gray-600">{model.mmlu ?? "-"}</td>
                        <td className="py-3 pr-4 text-gray-500 text-xs">{model.contextWindow}</td>
                        <td className="py-3 pr-4 text-gray-500 text-xs">{model.inputPrice}</td>
                        <td className="py-3 pr-4">
                          <span className="font-mono text-[11px] text-gray-700">{model.id}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <a href={links.docsUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-[11px] font-medium text-emerald-700 hover:underline">
                            {links.docsLabel} {"->"}
                          </a>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${model.openSource ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {model.openSource ? "Open" : "Closed"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Unranked table */}
          {unranked.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 mt-10 mb-4">
                New Models (Awaiting Public ELO)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="pb-3 pr-4 font-bold text-gray-900">Model</th>
                      <th className="pb-3 pr-4 font-bold text-gray-900">Developer</th>
                      <th className="pb-3 pr-4 font-bold text-gray-900">Released</th>
                      <th className="pb-3 pr-4 font-bold text-gray-900">Context</th>
                      <th className="pb-3 pr-4 font-bold text-gray-900">Price (Input)</th>
                      <th className="pb-3 pr-4 font-bold text-gray-900">Official</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unranked.map((model) => {
                      const links = getModelExternalLinks(model);
                      return (
                        <tr key={model.id} className="border-b border-gray-100 hover:bg-amber-50/50 transition-colors">
                          <td className="py-3 pr-4">
                            <Link href={`/models/${model.id}`} className="font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                              {model.name}
                            </Link>
                          </td>
                          <td className="py-3 pr-4 text-gray-500">{model.developer}</td>
                          <td className="py-3 pr-4 text-gray-500">{model.released}</td>
                          <td className="py-3 pr-4 text-gray-500 text-xs">{model.contextWindow}</td>
                          <td className="py-3 pr-4 text-gray-500 text-xs">{model.inputPrice ?? "-"}</td>
                          <td className="py-3 pr-4">
                            <a href={links.docsUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-[11px] font-medium text-emerald-700 hover:underline">
                              {links.docsLabel} {"->"}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Profile cards */}
          <h2 className="text-lg font-bold text-gray-900 mt-12 mb-6">Model Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((model, i) => {
              const links = getModelExternalLinks(model);
              return (
                <div key={model.id} className="group bg-background rounded-xl p-5 hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-accent">#{i + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${model.openSource ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                      {model.openSource ? "Open Source" : "Proprietary"}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg group-hover:text-accent transition-colors">{model.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{model.developer}</p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{model.description}</p>
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-card-border">
                    <div>
                      <p className="text-lg font-bold text-emerald-400">{model.elo ?? "-"}</p>
                      <p className="text-[10px] text-muted">ELO</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{model.contextWindow}</p>
                      <p className="text-[10px] text-muted">Context</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{model.inputPrice}</p>
                      <p className="text-[10px] text-muted">per 1M tokens</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between gap-3">
                    <Link href={`/models/${model.id}`} className="text-xs font-semibold text-accent hover:underline">
                      Full profile {"->"}
                    </Link>
                    <a href={links.docsUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-xs font-semibold text-emerald-400 hover:underline">
                      Official docs {"->"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
