import Link from "next/link";
import type { Metadata } from "next";
import { ExpertsBrowser } from "./ExpertsBrowser";

export const metadata: Metadata = {
  title: "AI Experts — The Open Community",
  description:
    "An open community of people who work with AI: building it, putting it into businesses, governing it, testing it and keeping it accountable. Individuals, not firms. Free to join, free to search.",
  alternates: { canonical: "/experts" },
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
            AI experts
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-300">
            People who build AI, put it into a business, govern it and check that it works.
            Listed one by one, not as firms.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ExpertsBrowser />

        <p className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-600">
          The community is just getting started. New people are added as they join.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Who belongs here</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Anyone who works with AI professionally: engineers and data scientists, the people
              who adopt it inside a business, and the people who govern, test, audit and secure
              it. One profile per person.
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
              Nothing. Joining and being listed is free. The profile stays yours: ask, and it is
              changed or removed the same week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
