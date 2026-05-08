import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for aibusiness.vc",
};

export default function TermsPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 12, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Acceptance</h2>
          <p>By accessing aibusiness.vc you agree to these terms. If you do not agree, please do not use the site.</p>

          <h2 className="text-xl font-bold text-gray-900">Content</h2>
          <p>All content on aibusiness.vc is provided for informational purposes only. We strive for accuracy but make no guarantees about the completeness or reliability of any information. Revenue figures, pricing, and tool details may change without notice.</p>

          <h2 className="text-xl font-bold text-gray-900">Not Financial Advice</h2>
          <p>Nothing on this site constitutes financial, investment, or business advice. Income figures referenced in articles are examples and not guarantees. Always do your own research before making business or investment decisions.</p>

          <h2 className="text-xl font-bold text-gray-900">Intellectual Property</h2>
          <p>All original content, design, and branding on aibusiness.vc is owned by AI Business. You may share articles with attribution but may not republish full content without permission.</p>

          <h2 className="text-xl font-bold text-gray-900">Third-Party Links</h2>
          <p>We link to external tools, services, and resources. We are not responsible for the content, availability, or practices of third-party sites.</p>

          <h2 className="text-xl font-bold text-gray-900">Limitation of Liability</h2>
          <p>AI Business is not liable for any damages arising from your use of this site or reliance on its content.</p>
        </div>
      </div>
    </section>
  );
}
