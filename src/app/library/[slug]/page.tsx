import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartHereRail } from "@/components/StartHereRail";
import { GUIDES, getGuide } from "../guides";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    // The site template already appends "| AI Business".
    title: `${guide.title} — Library`,
    description: guide.cardBlurb,
    alternates: { canonical: `/library/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.cardBlurb,
      url: `https://aibusiness.vc/library/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <section className="bg-white">
      {/* Black / gold banner */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <Link
            href="/library"
            className="text-xs text-gray-400 transition-colors hover:text-amber-400"
          >
            ← Library
          </Link>
          <p className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            {guide.kicker}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
            {guide.title}
          </h1>
          {guide.audience && (
            <span className="mt-3 inline-flex items-center rounded-md bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-950">
              {guide.audience}
            </span>
          )}
          <p className="mt-3 text-lg text-gray-300">{guide.tagline}</p>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* White body */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="text-base leading-relaxed text-gray-700">{guide.description}</p>

            {guide.review && (
              <blockquote className="mt-8 rounded-xl border-l-4 border-amber-400 bg-amber-50/60 p-5">
                <p className="text-base italic leading-relaxed text-gray-800">
                  &ldquo;{guide.review.quote}&rdquo;
                </p>
                <footer className="mt-3 text-sm font-semibold text-gray-600">
                  — {guide.review.author}
                </footer>
              </blockquote>
            )}

            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                What&apos;s inside · {guide.pages} {guide.pagesLabel ?? "pages"}
              </p>
              <ul className="space-y-2.5">
                {guide.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-6">
              <h3 className="mb-1 text-xl font-bold text-gray-900">
                Download the {guide.fileLabel ?? "PDF"} — free
              </h3>
              <p className="mb-5 text-sm text-gray-600">
                No email, no registration. Just take it and use it today.
              </p>
              <a
                href={guide.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-amber-400"
              >
                Download {guide.title} →
              </a>
            </div>

            <div className="mt-8">
              <Link href="/library" className="text-sm font-semibold text-amber-600 hover:underline">
                ← All guides in the library
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <StartHereRail exclude="/library" />
          </aside>
        </div>
      </div>
    </section>
  );
}
