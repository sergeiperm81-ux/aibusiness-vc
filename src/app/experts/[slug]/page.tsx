import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERTS, getExpert, initials } from "../experts";
import { ExpertEmail } from "../ExpertEmail";

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
    };
}

export default async function ExpertPage({ params }: Props) {
  const { slug } = await params;
  const expert = getExpert(slug);
  if (!expert) notFound();

  return (
    <section className="bg-white">
      {/* The banner belongs to the section, not to the person: every profile
          opens under the same community header. */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent">
            The open community
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            AI governance experts
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300">
            The people who set the standards for AI, audit it, evaluate how it works and put it
            into practice. Listed one by one, not as firms.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Link href="/experts" className="text-sm font-semibold text-amber-600 hover:underline">
          &larr; All experts
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {/* The person */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              {expert.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={expert.photo}
                  alt={expert.name}
                  className="h-32 w-32 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gray-950 text-2xl font-bold text-accent">
                  {initials(expert.name)}
                </span>
              )}
              <div className="min-w-0">
                <h2 className="text-3xl font-bold leading-tight text-gray-900">{expert.name}</h2>
                <p className="mt-2 text-lg leading-snug text-gray-700">{expert.headline}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {expert.location} &middot; {expert.region}
                </p>
                {expert.sample && (
                  <p className="mt-3 inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Sample entry, not a real person
                  </p>
                )}
              </div>
            </div>

            <h3 className="mt-10 text-lg font-bold text-gray-900">About</h3>
            <p className="mt-3 text-base leading-relaxed text-gray-800">{expert.about}</p>

            <h3 className="mt-10 text-lg font-bold text-gray-900">Services offered</h3>
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

            <h3 className="mt-10 text-lg font-bold text-gray-900">Expertise</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {expert.expertise.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {s}
                </span>
              ))}
            </div>

            {(expert.linkedin || expert.website || expert.email || expert.phone) && (
              <>
                <h3 className="mt-10 text-lg font-bold text-gray-900">Contacts</h3>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {expert.linkedin && (
                    <a
                      href={expert.linkedin}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="font-semibold text-amber-600 hover:underline"
                    >
                      LinkedIn &rarr;
                    </a>
                  )}
                  {expert.website && (
                    <a
                      href={expert.website}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="font-semibold text-amber-600 hover:underline"
                    >
                      Website &rarr;
                    </a>
                  )}
                  {expert.email && (
                    <ExpertEmail
                      user={expert.email.user}
                      host={expert.email.host}
                      className="font-semibold text-amber-600 hover:underline"
                    />
                  )}
                  {expert.phone && <span className="font-semibold text-gray-800">{expert.phone}</span>}
                </div>
              </>
            )}

            <p className="mt-10 border-t border-gray-200 pt-5 text-xs leading-relaxed text-gray-500">
              Identity and links confirmed by AI Business. This is not a rating, an endorsement or
              a recommendation.
            </p>
          </div>

          {/* This column belongs to the site: our call, and room for what comes next. */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl bg-accent p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
                  Claim your place
                </p>
                <p className="mt-2 text-xl font-bold leading-tight text-black">
                  Do this work too? Be where clients look.
                </p>
                <p className="mt-2 text-sm leading-snug text-black/75">
                  Free, and the profile stays yours.
                </p>
                <Link
                  href="/experts/apply"
                  className="mt-4 block rounded-lg bg-gray-950 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Create your profile &rarr;
                </Link>
              </div>

              <div className="mt-4 rounded-2xl bg-gray-950 p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  From AI Business
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  Free methods for governing AI from the customer&apos;s side: policies, service
                  passports, receipts and the full test purchase method.
                </p>
                <Link
                  href="/library"
                  className="mt-3 inline-block text-sm font-bold text-accent hover:underline"
                >
                  Author&apos;s Library &rarr;
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
