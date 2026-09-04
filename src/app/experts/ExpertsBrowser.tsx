"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EXPERTS,
  FRAMEWORKS,
  INDUSTRIES,
  PRACTICE_AREAS,
  REGIONS,
  REGISTER_BENEFITS,
  initials,
  type Expert,
} from "./experts";

type SortKey = "name" | "region" | "practice";

const SORTERS: Record<SortKey, (a: Expert, b: Expert) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  region: (a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name),
  practice: (a, b) =>
    (a.practiceAreas[0] ?? "").localeCompare(b.practiceAreas[0] ?? "") ||
    a.name.localeCompare(b.name),
};

/** How many cards come before the join block. */
const BEFORE_CTA = 8;

function ExpertCard({ expert: e }: { expert: Expert }) {
  return (
    <Link
      href={`/experts/${e.slug}`}
      className="group flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      {e.photo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={e.photo}
          alt={e.name}
          className="mx-auto h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-950 text-xl font-bold text-accent">
          {initials(e.name)}
        </span>
      )}
      <p className="mt-4 text-base font-bold text-gray-900">{e.name}</p>
      <p className="mt-0.5 text-xs text-gray-500">{e.location}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">{e.headline}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {e.practiceAreas.slice(0, 2).map((s) => (
          <span
            key={s}
            className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-black"
          >
            {s}
          </span>
        ))}
        {e.practiceAreas.length > 2 && (
          <span className="rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-semibold text-white">
            +{e.practiceAreas.length - 2}
          </span>
        )}
      </div>

    </Link>
  );
}

const CONTROL =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

export function ExpertsBrowser() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [practice, setPractice] = useState("");
  const [framework, setFramework] = useState("");
  const [industry, setIndustry] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERTS.filter((e) => {
      if (region && e.region !== region) return false;
      if (practice && !e.practiceAreas.includes(practice)) return false;
      if (framework && !(e.frameworks ?? []).includes(framework)) return false;
      if (industry && !(e.industries ?? []).includes(industry)) return false;
      if (!q) return true;
      const haystack = [
        e.name,
        e.headline,
        e.location,
        e.about,
        e.organisation ?? "",
        ...e.practiceAreas,
        ...(e.frameworks ?? []),
        ...(e.industries ?? []),
        ...(e.languages ?? []),
        ...(e.services ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }).sort(SORTERS[sort]);
  }, [query, region, practice, framework, industry, sort]);

  const filtered = Boolean(region || practice || framework || industry || query);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, practice, industry or place"
        aria-label="Search experts"
        className={`${CONTROL} placeholder:text-gray-400`}
      />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select value={practice} onChange={(e) => setPractice(e.target.value)} aria-label="Practice area" className={CONTROL}>
          <option value="">All practice areas</option>
          {PRACTICE_AREAS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={framework} onChange={(e) => setFramework(e.target.value)} aria-label="Framework" className={CONTROL}>
          <option value="">All frameworks</option>
          {FRAMEWORKS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Industry" className={CONTROL}>
          <option value="">All industries</option>
          {INDUSTRIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region" className={CONTROL}>
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
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
          <option value="practice">Sort: by practice area</option>
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
              setPractice("");
              setFramework("");
              setIndustry("");
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
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.slice(0, BEFORE_CTA).map((e) => (
              <ExpertCard key={e.slug} expert={e} />
            ))}
          </div>

          {/* The call sits inside the list, not under it: with a hundred people
              below, anything after the grid would never be seen. */}
          <div className="mt-6 rounded-2xl bg-gray-950 p-8 sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Claim your place
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
              Somebody is looking for exactly what you do. Right now they cannot find you.
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REGISTER_BENEFITS.map((b) => (
                <div key={b.title}>
                  <p className="text-sm font-bold text-accent">{b.title}</p>
                  <p className="mt-0.5 text-sm leading-snug text-gray-300">{b.body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/experts/apply"
              className="mt-7 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:bg-accent-hover"
            >
              Create your profile &rarr;
            </Link>
            <p className="mt-2 text-xs text-gray-400">
              Free, and the profile stays yours.
            </p>
          </div>

          {results.length > BEFORE_CTA && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.slice(BEFORE_CTA).map((e) => (
                <ExpertCard key={e.slug} expert={e} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
