import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "./guides";

const LINKEDIN_URL = "https://www.linkedin.com/in/sergei-ponomarev/";

export const metadata: Metadata = {
  title: "Library — Methods & Tools for an AI That Serves People",
  description:
    "Original methods and ready-to-use tools for governing AI from the human side — by Sergei Ponomarev, founder of aibusiness.vc. Free guides you can use today.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">Library</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
          Methods &amp; tools for an AI that serves people
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
          Original methods and ready-to-use tools for governing AI from the human side. Each guide
          takes one piece of the problem — how to judge an AI service, how to describe one, how to
          keep it accountable — and turns it into something you can use today. Built from twenty
          years of standards, quality assessment, and civic control, now applied to AI. New guides
          added regularly.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/library/${g.slug}`}
              className="group flex flex-col rounded-2xl border border-card-border bg-card-bg p-6 transition-colors hover:border-accent"
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
                {g.kicker}
              </p>
              <h2 className="mt-2 text-xl font-bold text-white transition-colors group-hover:text-accent">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/70">{g.cardBlurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Read &amp; download · {g.pages} pages →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">About the author</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            <span className="font-semibold text-white">Sergei Ponomarev, PhD</span> — founder of
            aibusiness.vc and a specialist in assessing service quality from the consumer&apos;s
            side. Twenty years across e-government, standards, nationwide quality monitoring,
            independent assessment and mystery shopping — now applied to AI. I help companies adopt
            artificial intelligence in the interests of their consumers.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            I&apos;m building a library of such practices and I&apos;m open to any kind of
            collaboration — I&apos;d be glad to hear your feedback, compare notes, or work together.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="mailto:info@aibusiness.vc" className="font-semibold text-accent hover:underline">
              info@aibusiness.vc
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
