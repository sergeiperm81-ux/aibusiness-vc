import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Affiliate disclosure for aibusiness.vc",
};

export default function AffiliateDisclosurePage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Affiliate Disclosure</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 12, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <p>aibusiness.vc participates in affiliate programs. Some links on this site are affiliate links, meaning we may earn a commission if you make a purchase through them at no extra cost to you.</p>

          <h2 className="text-xl font-bold text-gray-900">How It Works</h2>
          <p>When we review AI tools, some include affiliate links. If you click and purchase, we earn a small commission. This does not affect the price you pay. We only recommend tools we have evaluated and believe provide genuine value.</p>

          <h2 className="text-xl font-bold text-gray-900">Editorial Independence</h2>
          <p>Affiliate relationships do not influence our reviews, ratings, or recommendations. We review tools based on features, pricing, ROI, and real user feedback. Tools without affiliate programs receive the same honest coverage as those with programs.</p>

          <h2 className="text-xl font-bold text-gray-900">Why We Use Affiliate Links</h2>
          <p>Affiliate income helps us maintain the site, research new tools, and publish free content. It allows us to keep aibusiness.vc accessible to everyone without paywalls or subscriptions.</p>

          <h2 className="text-xl font-bold text-gray-900">FTC Compliance</h2>
          <p>This disclosure is provided in accordance with the Federal Trade Commission (FTC) guidelines on endorsements and testimonials.</p>
        </div>
      </div>
    </section>
  );
}
