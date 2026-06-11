import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How aibusiness.vc collects, uses, and protects your data, and your rights under GDPR.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "info@aibusiness.vc";

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 11, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <p>
            This policy explains what personal data <strong>AI Business</strong> (aibusiness.vc)
            collects, why, and the rights you have. We aim to collect as little as possible and to
            be straight with you about it.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Who is responsible</h2>
          <p>
            AI Business (aibusiness.vc) is an independent publication operated by Sergei Ponomarev,
            who acts as the data controller. For any privacy question or request, contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <h2 className="text-xl font-bold text-gray-900">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Analytics data</strong> — if you accept analytics cookies, we use Google
              Analytics (GA4) to see how the site is used: pages viewed, time on page, referral
              source, device type, and approximate (city-level) location derived from your IP. This
              data is pseudonymous and we do not use it to identify you.
            </li>
            <li>
              <strong>Email address</strong> — only if you voluntarily give it, e.g. when you
              request a free AI-visibility (GEO) audit report or email us. For an audit we also
              process the website domain you submitted.
            </li>
          </ul>
          <p>
            We do not run ads, we do not sell your data, and we do not build advertising profiles.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Cookies &amp; consent</h2>
          <p>
            We load analytics cookies only after you accept them in our cookie banner. Until then,
            analytics runs in a cookieless, consent-denied mode (Google Consent Mode v2). You can
            change or withdraw your choice at any time via the{" "}
            <strong>&ldquo;Cookie preferences&rdquo;</strong> link in the footer. Strictly necessary
            cookies needed for the site to function may be set without consent.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Why we are allowed to (legal bases)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Consent</strong> (GDPR Art. 6(1)(a)) — for analytics cookies and for sending
              you the report and occasional emails. You can withdraw consent at any time.
            </li>
            <li>
              <strong>Legitimate interests</strong> (Art. 6(1)(f)) — for aggregated, cookieless
              measurement and for responding to messages you send us.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">Who processes data for us</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Google (Google Analytics)</strong> — traffic measurement. Data may be
              processed in the US under the EU&ndash;US Data Privacy Framework and standard
              contractual clauses.
            </li>
            <li>
              <strong>Brevo (Sendinblue)</strong> — stores your email and sends the audit report and
              any newsletters. Brevo is an EU-based provider.
            </li>
            <li>
              <strong>Vercel</strong> — hosting and content delivery.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900">How long we keep it</h2>
          <p>
            Analytics data is retained for 14 months in Google Analytics. Your email is kept until
            you unsubscribe or ask us to delete it, after which it is removed from our mailing
            provider.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Your rights</h2>
          <p>
            If you are in the EU/EEA or UK, you have the right to access, rectify, erase, restrict,
            or object to the processing of your personal data, to data portability, and to withdraw
            consent at any time. To exercise any of these, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-600 hover:underline">
              {CONTACT_EMAIL}
            </a>
            . You also have the right to lodge a complaint with your local data protection
            authority.
          </p>

          <h2 className="text-xl font-bold text-gray-900">External links</h2>
          <p>
            We link to tools and services we review; some links may be affiliate links. Those sites
            have their own privacy policies, which we do not control.
          </p>

          <h2 className="text-xl font-bold text-gray-900">Changes</h2>
          <p>
            We may update this policy as the site evolves. The &ldquo;last updated&rdquo; date above
            reflects the current version.
          </p>
        </div>
      </div>
    </section>
  );
}
