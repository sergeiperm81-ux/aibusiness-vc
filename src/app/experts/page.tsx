import Link from "next/link";
import type { Metadata } from "next";
import { ExpertsBrowser } from "./ExpertsBrowser";
import { REGISTER_BENEFITS } from "./experts";

export const metadata: Metadata = {
  title: "AI Governance Experts — The Open Community",
  description:
    "An open community of the people who set the standards for AI, audit it, evaluate it and put it to work. Individuals, not firms. Free to join, free to search.",
  alternates: { canonical: "/experts" },
  // Kept out of search while the community is being built and holds no real entries.
  robots: { index: false, follow: false },
};

export default function ExpertsPage() {
  return (
    <section className="bg-white">
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent">
            The open community
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            AI governance experts
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300">
            The people who set the standards for AI, audit it, evaluate how it works and put it
            into practice. Listed one by one, not as firms.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/experts/apply"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:bg-accent-hover"
            >
              Join the community
            </Link>
            <span className="text-sm text-gray-400">
              Free, two minutes, and the profile stays yours
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ExpertsBrowser />

        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong className="font-bold">Under construction.</strong> The entries above are
          placeholders that show the layout. No real person is listed yet, so you can be among the
          first.
        </div>

        <div className="mt-14 rounded-2xl bg-gray-950 p-8 sm:p-10">
          <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            Why be in it
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {REGISTER_BENEFITS.map((b) => (
              <div key={b.title}>
                <h3 className="text-base font-bold text-accent">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{b.body}</p>
              </div>
            ))}
          </div>
          <Link
            href="/experts/apply"
            className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:bg-accent-hover"
          >
            Join the community
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Who belongs here</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              People working on governance, compliance, assurance, evaluation, data protection,
              policy and responsible adoption of AI, plus specialists who know one industry from
              the inside. Builders are welcome when the work itself is governance, safety or
              evaluation.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">What we check</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              That the person exists, that the links are theirs, and that the organisation is
              real. We confirm identity and sources. We do not rate anyone&apos;s professional
              quality, and a listing is not a recommendation.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">What it costs</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Nothing, and there is no paid tier and no sponsored placement. The profile stays
              yours: ask, and it is changed or removed the same week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
