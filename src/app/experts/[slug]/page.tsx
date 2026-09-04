import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERTS, getExpert, initials } from "../experts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXPERTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const expert = getExpert(slug);
  if (!expert) return { title: "Not found" };
  return {
    title: `${expert.name} — AI governance expert`,
    description: expert.headline,
    alternates: { canonical: `/experts/${expert.slug}` },
    robots: { index: false, follow: false },
  };
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params;
  const expert = getExpert(slug);
  if (!expert) notFound();

  return (
    <section className="bg-white">
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link href="/experts" className="text-xs text-gray-400 hover:text-amber-400">
            &larr; The register
          </Link>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-xl font-bold text-gray-950">
              {initials(expert.name)}
            </span>
            <div>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {expert.name}
              </h1>
              <p className="mt-2 text-lg text-gray-300">{expert.headline}</p>
              <p className="mt-2 text-sm text-gray-400">
                {expert.city ? `${expert.city}, ` : ""}
                {expert.country} &middot; {expert.region}
                {expert.remote ? " · remote" : ""} &middot; {expert.languages.join(", ")}
              </p>
            </div>
          </div>
          {expert.sample && (
            <p className="mt-6 inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
              Sample entry, not a real person
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">About</h2>
            <p className="mt-3 text-base leading-relaxed text-gray-700">{expert.about}</p>

            <h2 className="mt-10 text-lg font-bold text-gray-900">Services offered</h2>
            <ul className="mt-3 space-y-2">
              {expert.services.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                  {s}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-lg font-bold text-gray-900">Expertise</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {expert.expertise.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                How {expert.name.split(" ")[0]} works
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {expert.workTypes.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 text-sm">
                {expert.linkedin && (
                  <a
                    href={expert.linkedin}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block font-semibold text-amber-600 hover:underline"
                  >
                    LinkedIn &rarr;
                  </a>
                )}
                {expert.website && (
                  <a
                    href={expert.website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block font-semibold text-amber-600 hover:underline"
                  >
                    Website &rarr;
                  </a>
                )}
              </div>
              <p className="mt-5 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
                Identity and links confirmed. This is not a rating or a recommendation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
