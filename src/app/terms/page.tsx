import type { Metadata } from "next";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use",
  description: "Terms of use for aibusiness.vc, including the AI Person Scan and AI Company Scan.",
};

const H2 = "text-xl font-bold text-gray-900";

export default function TermsPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: September 22, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <h2 className={H2}>Acceptance</h2>
          <p>
            By using aibusiness.vc, or buying a report from it, you agree to these terms. If you do not agree, please do
            not use the site. The site and its services are operated by Sergei Ponomarev, AI Business.
          </p>

          <h2 className={H2}>Content</h2>
          <p>
            All articles on aibusiness.vc are provided for information only. We strive for accuracy but make no guarantees
            about the completeness or reliability of any information. Revenue figures, pricing and tool details may
            change without notice. Nothing on this site is financial, investment, legal or business advice.
          </p>

          <h2 className={H2}>AI Person Scan and AI Company Scan</h2>
          <p>
            <strong>What the service is.</strong> You give one public link: a social profile for AI Person Scan, a
            website for AI Company Scan. A free preview shows whom or what one AI model finds behind that link. The paid
            report asks five AI models the same three questions with live web search, records their answers with the
            pages they cite, summarises them, marks where they disagree, and gives recommendations.
          </p>
          <p>
            <strong>What it is not.</strong> A report is a snapshot of what AI models said on one day. It is not a
            background check, a credit report, a registry extract, a legal opinion or due diligence, and aibusiness.vc
            is not a consumer reporting agency. We do not verify what the models say and do not claim it is true. Models
            can be wrong, out of date, or describe a different person or organisation with the same name; where they
            disagree, the report shows it. AI Company Scan covers the organisation represented by a website, whatever
            its legal form, not its legal ownership or company registration.
          </p>
          <p>
            <strong>Permitted use.</strong> You may use a report to see what AI assistants say about yourself, your
            organisation, or a person or organisation you are about to deal with, and to decide what to publish or check
            further. You must not use a report as the basis for a decision on employment, housing, credit, insurance or
            any other purpose regulated by the US Fair Credit Reporting Act or similar laws, for harassment, for
            discrimination, or to make a contract, payment or investment decision without your own checks. You must
            have a lawful reason to look up another person.
          </p>
          <p>
            <strong>Delivery.</strong> Processing starts when your payment is confirmed. Most reports arrive by email at
            the address you gave at checkout within about five minutes; we do not guarantee a delivery time. If one of
            the five AI providers does not answer, we retry for about an hour and email you if the report will take
            longer; if one provider is still silent after that, we send the report from the other four, say so on the
            cover, and add a code for one free scan. If two or more providers are silent, we keep trying rather than
            send an incomplete report.
          </p>
          <p>
            <strong>Refunds.</strong> You get a full refund if the report does not reach you, if it is about a different
            person or organisation than the preview showed, or if we cannot make it. Because a report is produced and
            delivered on demand from paid AI requests, we do not refund a report that was delivered as described because
            you disagree with what the models said. To claim a refund, email{" "}
            <ContactEmail className="text-amber-600 hover:underline" /> from the address you paid with.
          </p>
          <p>
            <strong>Bonus code.</strong> Every full-price purchase includes one code for 50% off up to seven further AI
            Person or AI Company Scans. The code may be used by you or given to others, has no cash value, and is not
            issued for a purchase made with a discount code. If the code cannot be created at the time of delivery, it is
            sent in a separate email as soon as it exists.
          </p>
          <p>
            <strong>Payments.</strong> Purchases are processed by Lemon Squeezy as merchant of record; their terms and
            taxes apply to the payment. Prices are shown in euro; any tax due is handled by Lemon Squeezy at checkout.
          </p>

          <h2 className={H2}>Intellectual property</h2>
          <p>
            All original content, design and branding on aibusiness.vc is owned by AI Business. You may share articles
            with attribution but may not republish full content without permission. A report you bought is yours to
            keep and share; the sample reports on the site may be quoted with attribution.
          </p>

          <h2 className={H2}>Third-party links and services</h2>
          <p>
            We link to external tools, services and resources, and the scans rely on third-party AI providers. We are
            not responsible for the content, availability or practices of third-party sites or for the answers those
            providers give.
          </p>

          <h2 className={H2}>Limitation of liability</h2>
          <p>
            To the extent the law allows, AI Business is not liable for any loss or damage arising from your use of this
            site, from reliance on its content or on a report, or from what an AI model said. Our total liability for a
            report is limited to the price you paid for it.
          </p>

          <h2 className={H2}>Changes</h2>
          <p>We may update these terms as the site evolves. The date above is the current version.</p>
        </div>
      </div>
    </section>
  );
}
