import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Society — How AI is Changing Work, Life, and the Economy",
  description:
    "Thoughtful analysis of AI's impact on society, jobs, creativity, and the economy. Book reviews, podcast recommendations, and essays on what AI means for humanity.",
};

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          AI & Society
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Beyond the money. How AI is reshaping work, creativity, and the
          economy. Thoughtful essays, book reviews, podcast picks, and
          analysis of what the AI revolution means for all of us.
        </p>
      </div>

      <div className="border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          Impact section launching soon. This is where we explore the deeper
          questions about AI and humanity.
        </p>
      </div>
    </div>
  );
}
