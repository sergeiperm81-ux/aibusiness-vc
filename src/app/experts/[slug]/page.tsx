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
          <Link href="/experts" className="text-xs text-gray-400 hover:text-accent">
            &larr; The register
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-accent text-2xl font-bold text-accent">
              {initials(expert.name)}
            </span>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {expert.name}
              </h1>
              <p className="mt-2 max-w-2xl text-lg leading-snug text-gray-300">
                {expert.headline}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-accent">
                {expert.location} &middot; {expert.region}
              </p>
              {expert.sample && (
                <p className="mt-4 inline-flex items-center rounded-md bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-300">
                  Sample entry, not a real person
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-gray-800">{expert.about}</p>

            <h2 className="mt-10 text-lg font-bold text-gray-900">What {expert.name.split(" ")[0]} does</h2>
            <ul className="mt-4 space-y-3">
              {expert.services.map((s) => (
                <li
                  key={s}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Expertise</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {expert.expertise.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {(expert.linkedin || expert.website) && (
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-5 text-sm">
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
              )}

              <p className="mt-6 border-t border-gray-200 pt-5 text-xs leading-relaxed text-gray-500">
                Identity and links confirmed. This is not a rating or a recommendation.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-accent p-6">
              <p className="text-base font-bold text-black">Do this work too?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-black/75">
                The register is open, free, and there is no ranking to buy.
              </p>
              <Link
                href="/experts/apply"
                className="mt-4 inline-block rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                Add yourself
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
