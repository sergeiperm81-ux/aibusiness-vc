import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materials — Articles, Podcasts, Videos & Books on AI",
  description:
    "Curated collection of the best AI content: articles, podcasts, video talks, books, and deep reads about artificial intelligence, its impact, and the future.",
};

export default function MaterialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-3">
          Materials
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          The best reads, watches, and listens about AI. Curated articles,
          podcasts, video talks, books, and deep dives into artificial
          intelligence and its impact on everything.
        </p>
      </div>

      <div className="bg-surface border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          Materials section launching soon. Subscribe to our newsletter to get
          curated picks.
        </p>
      </div>
    </div>
  );
}
