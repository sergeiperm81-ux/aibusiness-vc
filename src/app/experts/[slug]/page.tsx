import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERTS, getExpert, initials, type Expert } from "../experts";
import { ExpertEmail } from "../ExpertEmail";

const SITE = "https://aibusiness.vc";

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
    openGraph: {
      title: `${expert.name} — AI governance expert`,
      description: expert.headline,
      url: `${SITE}/experts/${expert.slug}`,
      type: "profile",
    },
  };
}

/**
 * Structured data for one member.
 *
 * A ProfilePage wrapping a Person is what lets a search engine or an assistant
 * answer "who works on this" with a name instead of a paragraph. Only the fields
 * the person chose to publish end up here.
 */
function ExpertSchema({ expert }: { expert: Expert }) {
  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${SITE}/experts/${expert.slug}#person`,
    name: expert.name,
    description: expert.about,
    jobTitle: expert.headline,
    url: `${SITE}/experts/${expert.slug}`,
    knowsAbout: [
      ...expert.practiceAreas,
      ...(expert.frameworks ?? []),
      ...(expert.industries ?? []),
    ],
  };
  if (expert.photo) person.image = `${SITE}${expert.photo}`;
  if (expert.languages?.length) person.knowsLanguage = expert.languages;
  if (expert.organisation) person.worksFor = { "@type": "Organization", name: expert.organisation };
  if (expert.location) {
    person.address = { "@type": "PostalAddress", addressLocality: expert.location };
  }
  if (expert.email) person.email = `${expert.email.user}@${expert.email.host}`;
  if (expert.phone) person.telephone = expert.phone;
  const sameAs = [expert.linkedin, expert.website].filter(Boolean);
  if (sameAs.length) person.sameAs = sameAs;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE}/experts/${expert.slug}`,
    name: `${expert.name} — AI governance expert`,
    isPartOf: { "@type": "WebSite", name: "AI Business", url: SITE },
    about: person,
    mainEntity: person,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function Tags({ title, items, dark }: { title: string; items: string[]; dark?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6 first:mt-0">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((s) => (
          <span
            key={s}
            className={
              dark
                ? "rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white"
                : "rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black"
            }
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
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
                {(expert.role || expert.organisation) && (
                  <p className="mt-1 text-sm text-gray-600">
                    {[expert.role, expert.organisation].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {expert.location} &middot; {expert.region}
                  {expert.languages?.length ? ` · ${expert.languages.join(", ")}` : ""}
                </p>
                {expert.availability && (
                  <p className="mt-3 inline-flex items-center rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
                    {expert.availability}
                  </p>
                )}
              </div>
            </div>

            <h3 className="mt-10 text-lg font-bold text-gray-900">About</h3>
            <p className="mt-3 text-base leading-relaxed text-gray-800">{expert.about}</p>

            {expert.services && expert.services.length > 0 && (
              <>
                <h3 className="mt-10 text-lg font-bold text-gray-900">What they do</h3>
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
              </>
            )}

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
                  {expert.phone && (
                    <span className="font-semibold text-gray-800">{expert.phone}</span>
                  )}
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
              <div className="rounded-2xl border-2 border-gray-200 p-6">
                <Tags title="Practice areas" items={expert.practiceAreas} />
                <Tags title="Frameworks" items={expert.frameworks ?? []} dark />
                <Tags title="Industries" items={expert.industries ?? []} dark />
                {expert.jurisdictions && (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Jurisdictions
                    </p>
                    <p className="mt-1 text-sm text-gray-800">{expert.jurisdictions}</p>
                  </div>
                )}
                {expert.workFormats?.length ? (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Open to
                    </p>
                    <p className="mt-1 text-sm text-gray-800">{expert.workFormats.join(", ")}</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-2xl bg-accent p-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
                  Claim your place
                </p>
                <p className="mt-2 text-xl font-bold leading-tight text-black">
                  Do this work too? Be where clients look.
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

      <ExpertSchema expert={expert} />
    </section>
  );
}
