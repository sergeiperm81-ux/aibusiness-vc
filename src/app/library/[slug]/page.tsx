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
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link href="/library" className="text-xs text-muted transition-colors hover:text-accent">
          ← Library
        </Link>

        <p className="mt-6 font-mono text-xs font-medium uppercase tracking-wider text-accent">
          {guide.kicker}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{guide.title}</h1>
        <p className="mt-3 text-lg text-white/70">{guide.tagline}</p>

        <p className="mt-6 text-sm leading-relaxed text-white/80">{guide.description}</p>

        <div className="mt-8 rounded-xl border border-card-border bg-card-bg p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
            What&apos;s inside · {guide.pages} pages
          </p>
          <ul className="space-y-2">
            {guide.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
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
