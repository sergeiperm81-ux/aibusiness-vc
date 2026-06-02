import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI ROI Calculator - Estimate Payback and Profitability",
  description:
    "Model the ROI of AI projects: estimate payback period, annual net impact, and break-even assumptions before implementation.",
  alternates: {
    canonical: "/materials/roi-calculator",
  },
};

export default function RoiCalculatorPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">Materials</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI ROI Calculator</h1>
        <p className="text-sm text-gray-700 max-w-2xl">
          Use this workflow to quantify expected value before rollout: implementation cost,
          team time saved, revenue uplift, and payback timeline.
        </p>

        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="text-lg font-bold text-emerald-900 mb-2">Use with AI Visibility Audit</h2>
          <p className="text-sm text-emerald-800 mb-4">
            Run an audit first to get concrete findings, then plug them into ROI assumptions.
          </p>
          <Link
            href="/audit"
            className="inline-flex rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Run AI Audit
          </Link>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/materials/tool-selector" className="text-sm text-accent hover:text-amber-700">
            Next: Tool Selector &rarr;
          </Link>
          <Link href="/materials/playbook-templates" className="text-sm text-accent hover:text-amber-700">
            Playbook Templates &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
