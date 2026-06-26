import Link from "next/link";
import Image from "next/image";
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
    <section className="bg-white">
      {/* Black / gold banner */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
                Library
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Methods &amp; tools for an AI that serves people
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-300">
                Original methods and ready-to-use tools for governing AI from the human side —
                free, and built to be used today.
              </p>
              <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
            </div>
            <Image
              src="/images/sergei-ponomarev.jpg"
              alt="Sergei Ponomarev, founder of AI Business"
              width={180}
              height={194}
              priority
              className="h-auto w-[120px] shrink-0 rounded-xl border-2 border-amber-400/50 sm:w-[160px]"
            />
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <p className="max-w-2xl text-base leading-relaxed text-gray-700">
          Each guide takes one piece of the problem — how to judge an AI service, how to describe
          one, how to keep it accountable — and turns it into something you can use today. Built
          from twenty years of standards, quality assessment, and civic control, now applied to AI.
          New guides added regularly.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/library/${g.slug}`}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-amber-600">
                {g.kicker}
              </p>
              <h2 className="mt-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-amber-700">
                {g.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{g.cardBlurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                Read &amp; download · {g.pages} pages →
              </span>
            </Link>
          ))}
        </div>

        {/* About the author */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Image
              src="/images/sergei-ponomarev.jpg"
              alt="Sergei Ponomarev"
              width={180}
              height={194}
              className="h-auto w-[120px] shrink-0 rounded-xl border border-gray-200"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">About the author</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-900">Sergei Ponomarev, PhD</span> —
                founder of aibusiness.vc and a specialist in assessing service quality from the
                consumer&apos;s side. Twenty years across e-government, standards, nationwide
                quality monitoring, independent assessment and mystery shopping — now applied to AI.
                I help companies adopt artificial intelligence in the interests of their consumers.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                I&apos;m building a library of such practices and I&apos;m open to any kind of
                collaboration — I&apos;d be glad to hear your feedback, compare notes, or work
                together.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a
                  href="mailto:info@aibusiness.vc"
                  className="font-semibold text-amber-600 hover:underline"
                >
                  info@aibusiness.vc
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-600 hover:underline"
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
