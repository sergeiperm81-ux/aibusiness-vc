import Link from "next/link";
import type { Metadata } from "next";
import { ContactEmail } from "@/components/ContactEmail";
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
        <ExpertsBrowser />

        <p className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-600">
          Under construction: the cards above are placeholders showing the layout. No real person
          is listed yet.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl bg-accent p-8 sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
              Claim your place
            </p>
            <h2 className="mt-2 max-w-xl text-3xl font-bold leading-tight text-black">
              Somebody is looking for exactly what you do. Right now they cannot find you.
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {REGISTER_BENEFITS.map((b) => (
                <div key={b.title}>
                  <p className="text-sm font-bold text-black">{b.title}</p>
                  <p className="mt-0.5 text-sm leading-snug text-black/75">{b.body}</p>
                </div>
              ))}
            </div>
            <Link
              href="/experts/apply"
              className="mt-8 inline-block rounded-lg bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Claim your expertise &rarr;
            </Link>
            <p className="mt-2 text-xs text-black/70">
              Free. No paid tier. The profile stays yours.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-950 p-8 sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Need an expert?
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white">
              Tell us the task, get three names.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Send what you are trying to solve. We reply with the people who actually fit, and
              nothing about your request is ever published.
            </p>
            <ContactEmail
              className="mt-4 inline-block text-sm font-bold text-accent underline underline-offset-2"
              subject="Looking for an AI governance expert"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Who belongs here</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              People working on governance, compliance, assurance, evaluation, data protection,
              policy and responsible adoption of AI, including the ones who design how AI fits an
              actual business process.
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
