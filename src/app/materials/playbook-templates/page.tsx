import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Playbook Templates - Offers, SOPs, and Prompt Workflows",
  description:
    "Execution-ready AI playbooks: offer templates, delivery SOPs, and practical prompts to run projects faster with better quality control.",
  alternates: {
    canonical: "/materials/playbook-templates",
  },
};

export default function PlaybookTemplatesPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-wider font-medium text-gray-500 mb-2">Materials</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">AI Playbook Templates</h1>
        <p className="text-sm text-gray-700 max-w-2xl">
          Reuse what works: offer outlines, discovery scripts, delivery SOPs, and
          prompt workflows for implementation teams.
        </p>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-bold text-amber-900 mb-2">Start from proven guides</h2>
          <p className="text-sm text-amber-800 mb-4">
            Use the freshest execution guides and adapt the workflows to your vertical.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/solo"
              className="inline-flex rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
            >
              Solo playbooks
            </Link>
            <Link
              href="/b2b"
              className="inline-flex rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
            >
              B2B case studies
            </Link>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/materials/roi-calculator" className="text-sm text-accent hover:text-amber-700">
            ROI Calculator &larr;
          </Link>
          <Link href="/materials/tool-selector" className="text-sm text-accent hover:text-amber-700">
            Tool Selector &larr;
          </Link>
        </div>
      </div>
    </section>
  );
}
