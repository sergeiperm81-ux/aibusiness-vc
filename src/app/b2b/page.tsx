import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B — AI Implementation for Businesses",
  description:
    "How businesses implement AI successfully (and unsuccessfully). Case studies, ROI analysis, implementation guides, and lessons learned from real AI deployments.",
};

export default function B2BPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-3">
          B2B: AI for Business
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Real stories of AI implementation in businesses — the wins and the
          failures. ROI analysis, implementation playbooks, and lessons from
          companies that did it right (and wrong).
        </p>
      </div>

      <div className="bg-surface border border-card-border rounded-xl p-8 text-center">
        <p className="text-muted">
          B2B case studies launching soon. Subscribe to our newsletter to get
          the first articles.
        </p>
      </div>
    </div>
  );
}
