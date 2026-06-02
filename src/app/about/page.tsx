import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AI Business",
  description:
    "AI Business editorial team, mission, and methodology for publishing outcome-first AI business analysis with real-world numbers.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">About</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About AI Business</h1>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          AI Business is an outcome-first publication about making money with AI.
          We focus on practical execution, measurable economics, and operating reality
          rather than hype.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Our editorial standard prioritizes concrete numbers, clear assumptions, and
          usable frameworks across solo, startup, B2B, VC, government, learning, and
          materials workflows.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Primary editor attribution across the site: <strong>Sergei P.</strong>
        </p>
      </div>
    </section>
  );
}
