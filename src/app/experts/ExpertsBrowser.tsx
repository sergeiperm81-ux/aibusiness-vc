"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EXPERTISE, EXPERTS, REGIONS, initials, type Expert } from "./experts";

type SortKey = "name" | "region" | "expertise";

const SORTERS: Record<SortKey, (a: Expert, b: Expert) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  region: (a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name),
  expertise: (a, b) =>
    (a.expertise[0] ?? "").localeCompare(b.expertise[0] ?? "") || a.name.localeCompare(b.name),
};

const CONTROL =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

export function ExpertsBrowser() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

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
    }).sort(SORTERS[sort]);
  }, [query, region, skill, sort]);

  const filtered = Boolean(region || skill || query);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, skill, service or place"
        aria-label="Search experts"
        className={`${CONTROL} placeholder:text-gray-400`}
      />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region" className={CONTROL}>
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={skill} onChange={(e) => setSkill(e.target.value)} aria-label="Expertise" className={CONTROL}>
          <option value="">All expertise</option>
          {EXPERTISE.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort"
          className={CONTROL}
        >
          <option value="name">Sort: by name</option>
          <option value="region">Sort: by region</option>
          <option value="expertise">Sort: by expertise</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {results.length} {results.length === 1 ? "person" : "people"}
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setRegion("");
              setSkill("");
            }}
            className="ml-3 font-semibold text-amber-600 hover:underline"
          >
            Reset
          </button>
        )}
      </p>

      {results.length === 0 ? (
        <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          Nobody matches that yet. Widen the region, or{" "}
          <Link href="/experts/apply" className="font-semibold text-amber-600 hover:underline">
            be the first
          </Link>
          .
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((e) => (
            <Link
              key={e.slug}
              href={`/experts/${e.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400 hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-accent">
                  {initials(e.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900 group-hover:text-amber-700">
                    {e.name}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">{e.location}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-gray-700">{e.headline}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {e.expertise.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="truncate rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
              {e.sample && (
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Sample
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
