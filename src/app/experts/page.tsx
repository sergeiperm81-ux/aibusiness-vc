import Link from "next/link";
import type { Metadata } from "next";
import { ExpertsBrowser } from "./ExpertsBrowser";

export const metadata: Metadata = {
  title: "AI Governance Experts — The Open Register of the Profession",
  description:
    "An open register of the people working in AI governance, assurance and responsible adoption. Individuals, not firms. Free to join, free to search.",
  alternates: { canonical: "/experts" },
  // Kept out of search while the register is being built and holds no real entries.
  robots: { index: false, follow: false },
};

export default function ExpertsPage() {
  return (
    <section className="bg-white">
      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            The open register
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            AI governance experts
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300">
            The people who govern, check and question AI, listed one by one. Other directories
            list firms; this one lists individuals. Free to join, free to search, and open to
            anyone who does the work.
          </p>
          <div className="mt-6">
            <Link
              href="/experts/apply"
              className="inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:bg-accent-hover"
            >
              Add yourself to the register
            </Link>
          </div>
          <div className="mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong className="font-bold">Under construction.</strong> The entries below are
          placeholders that show the layout. No real person is listed yet.
        </div>

        <ExpertsBrowser />

        <div className="mt-14 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Who belongs here</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              People working on governance, compliance, assurance, evaluation, data governance
              and responsible adoption of AI, plus specialists who know one industry from the
              inside. Builders are welcome when the work itself is governance, safety or
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
              Nothing, and there is no paid tier. The profile stays yours: ask and it is removed.
              Looking for someone specific?{" "}
              <Link href="/experts/apply" className="font-semibold text-amber-600 hover:underline">
                Tell us what you need
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
