import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Tool Selector - Pick the Right Stack by Goal and Budget",
  description:
    "Select AI tools by use case, budget, and team size. Build a practical stack with clear execution priorities.",
  alternates: {
    canonical: "/materials/tool-selector",
  },
};

export default function ToolSelectorPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">Materials</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI Tool Selector</h1>
        <p className="text-sm text-gray-700 max-w-2xl">
          Choose tools by business goal first, not by hype. Start from one bottleneck,
          then build the minimum viable stack around it.
        </p>

        <div className="mt-8 rounded-xl border border-cyan-200 bg-cyan-50 p-5">
          <h2 className="text-lg font-bold text-cyan-900 mb-2">Browse full tool coverage</h2>
          <p className="text-sm text-cyan-800 mb-4">
            Compare pricing, fit, and tradeoffs across categories and professions.
          </p>
          <Link
            href="/tools"
            className="inline-flex rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 transition-colors"
          >
            Open Tools Directory
          </Link>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/materials/roi-calculator" className="text-sm text-accent hover:text-amber-700">
            ROI Calculator &larr;
          </Link>
          <Link href="/materials/playbook-templates" className="text-sm text-accent hover:text-amber-700">
            Next: Playbook Templates &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
