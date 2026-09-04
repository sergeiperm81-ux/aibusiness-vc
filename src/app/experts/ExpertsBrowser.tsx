"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EXPERTISE, EXPERTS, REGIONS, initials } from "./experts";

export function ExpertsBrowser() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [skill, setSkill] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERTS.filter((e) => {
      if (region && e.region !== region) return false;
      if (skill && !e.expertise.includes(skill)) return false;
      if (!q) return true;
      const haystack = [e.name, e.headline, e.location, e.about, ...e.expertise, ...e.services]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, region, skill]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, skill, service or country"
          aria-label="Search experts"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Filter by region"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          aria-label="Filter by expertise"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <option value="">All expertise</option>
          {EXPERTISE.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {results.length} {results.length === 1 ? "person" : "people"}
        {(region || skill || query) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setRegion("");
              setSkill("");
            }}
            className="ml-3 font-semibold text-amber-600 hover:underline"
          >
            Reset filters
          </button>
        )}
      </p>

      {results.length === 0 ? (
        <p className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          Nobody matches that yet. Try a wider region, or{" "}
          <Link href="/experts/apply" className="font-semibold text-amber-600 hover:underline">
            add yourself to the register
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((e) => (
            <Link
              key={e.slug}
              href={`/experts/${e.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-amber-400">
                  {initials(e.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900 group-hover:text-amber-700">
                    {e.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">{e.location}</p>
                </div>
              </div>

              {e.sample && (
                <span className="mt-3 inline-flex w-fit items-center rounded-md bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-700">
                  Sample entry
                </span>
              )}

              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">{e.headline}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {e.expertise.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
