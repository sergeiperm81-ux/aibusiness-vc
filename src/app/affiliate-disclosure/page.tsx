import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — How AI Business Earns Revenue",
  description:
    "Full transparency on how aibusiness.vc earns money through affiliate partnerships. Which tools we promote, how commissions work, and our editorial policy.",
};

export default function AffiliateDisclosurePage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Affiliate Disclosure
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Last updated: May 27, 2026
        </p>

        <div className="prose prose-gray max-w-none text-gray-700 space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-sm text-gray-800 leading-relaxed">
              <strong>Short version:</strong> Some links on AI Business are
              affiliate links. If you click one and buy something, we earn a
              commission — typically 20-30% of the subscription price. You pay
              the same amount either way. This income keeps the site free and
              ad-free.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            How affiliate links work on this site
          </h2>
          <p>
            When we review or mention an AI tool, the link to that tool may be
            an affiliate link. This means the tool maker knows you came from us.
            If you sign up for a paid plan, we receive a percentage of the sale —
            usually between 20% and 45% depending on the program. The price you
            pay is identical whether you use our link or go directly.
          </p>
          <p>
            Affiliate links on AI Business are marked with a small disclosure
            note near the link. We use them in tool review pages, comparison
            articles, and &ldquo;make money with&rdquo; guides where specific tools are
            recommended.
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Which programs we participate in
          </h2>
          <p>
            We partner with AI tool companies that have public affiliate
            programs. These currently include (or may include in the future):
          </p>
          <ul>
            <li>Jasper AI (content writing)</li>
            <li>Surfer SEO (SEO optimization)</li>
            <li>ElevenLabs (voice and audio)</li>
            <li>Copy.ai (copywriting)</li>
            <li>Synthesia (video generation)</li>
            <li>Descript (video/audio editing)</li>
            <li>Writesonic (content writing)</li>
            <li>Make.com (automation)</li>
            <li>HubSpot (CRM and marketing)</li>
          </ul>
          <p>
            This list changes as we add or remove partnerships. Not every tool
            mentioned on the site has an affiliate link — most of our 356 tool
            reviews contain no affiliate relationship at all.
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            What we will never do
          </h2>
          <ul>
            <li>
              <strong>Recommend a tool because it pays us.</strong> If a tool is
              bad, we say so — even if they have a generous affiliate program.
            </li>
            <li>
              <strong>Hide that a link is an affiliate link.</strong> We mark
              affiliate links clearly.
            </li>
            <li>
              <strong>Change a review based on commission rates.</strong> Our
              reviews are based on features, pricing, user feedback, and our own
              testing. The affiliate relationship is disclosed but does not
              influence the conclusion.
            </li>
            <li>
              <strong>Rank tools by commission instead of quality.</strong>{" "}
              Many tools with no affiliate program appear higher in our
              recommendations than tools that pay us.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">
            Why this matters to you
          </h2>
          <p>
            Affiliate income is what allows AI Business to exist without
            paywalls, pop-up ads, or sponsored content. Every article, tool
            review, and comparison on this site is free — and affiliate
            partnerships are what make that possible.
          </p>
          <p>
            If you find a tool through our site and decide to buy it, using our
            link is a way to support our work at zero cost to you. If you prefer
            to go directly to the tool&apos;s website, that&apos;s fine too — we
            appreciate you reading either way.
          </p>

          <h2 className="text-xl font-bold text-gray-900">FTC compliance</h2>
          <p>
            This disclosure is provided in accordance with the Federal Trade
            Commission (FTC) 16 CFR Part 255 guidelines on endorsements and
            testimonials. We are required to disclose material connections
            between AI Business and the companies whose products we review.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions about our affiliate relationships?{" "}
              <Link
                href="/privacy"
                className="text-amber-600 hover:underline"
              >
                See our privacy policy
              </Link>{" "}
              or contact us at the email listed on our site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
