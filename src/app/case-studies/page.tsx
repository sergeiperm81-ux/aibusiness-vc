import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Income Case Studies — Real People, Real Numbers",
  description:
    "Real income case studies from people making money with AI. Verified numbers, detailed timelines, tools used, and lessons learned.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          AI Income Case Studies
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Real people, real numbers, real timelines. Not theory — verified
          income reports from people who are actually making money with AI.
        </p>
      </div>

      <div className="border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          Case studies launching soon. Have a story to share? Reach out to be
          featured.
        </p>
      </div>
    </div>
  );
}
