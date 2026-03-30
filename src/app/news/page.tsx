import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Money News — Latest AI Business Opportunities",
  description:
    "Stay updated on the latest AI money-making opportunities. New tools, funding rounds, market trends, and earning strategies updated weekly.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          AI Money News
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          The latest AI business opportunities, tool launches, market trends,
          and earning strategies. Updated weekly.
        </p>
      </div>

      <div className="border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          News section launching soon. Subscribe to our newsletter to get
          updates first.
        </p>
      </div>
    </div>
  );
}
