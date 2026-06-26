import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "../guides";
import { LibraryDownloadGate } from "../LibraryDownloadGate";

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
    title: `${guide.title} — AI Business Library`,
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
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
          <p className="mt-3 text-lg text-gray-300">{guide.tagline}</p>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>

      {/* White body */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <p className="text-base leading-relaxed text-gray-700">{guide.description}</p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            What&apos;s inside · {guide.pages} pages
          </p>
          <ul className="space-y-2">
            {guide.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <LibraryDownloadGate slug={guide.slug} title={guide.title} pdf={guide.pdf} />
        </div>
      </div>
    </section>
  );
}
