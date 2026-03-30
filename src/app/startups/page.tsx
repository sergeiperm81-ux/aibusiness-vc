import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Startups — Funding, Launches, and Innovations",
  description:
    "AI startup news, funding rounds, product launches, and the companies shaping the future of artificial intelligence. Stay ahead of the AI startup ecosystem.",
};

export default function StartupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-3">
          AI Startups
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Funding rounds, product launches, and the companies building the
          future of AI. Track the startups that matter.
        </p>
      </div>

      <div className="bg-surface border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          Startup coverage launching soon. Subscribe to our newsletter to get
          the first articles.
        </p>
      </div>
    </div>
  );
}
