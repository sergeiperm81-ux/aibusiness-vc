import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn AI — Best Courses, Books, Podcasts & Resources",
  description:
    "Curated collection of the best AI learning resources. Courses, books, podcasts, YouTube channels, and communities to help you master AI and start earning.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Learn AI
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          The best courses, books, podcasts, YouTube channels, and communities
          to master AI and start earning. Curated and regularly updated.
        </p>
      </div>

      <div className="border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          Learning resources section launching soon. Subscribe to our newsletter
          to get updates first.
        </p>
      </div>
    </div>
  );
}
