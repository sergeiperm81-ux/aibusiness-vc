import type { Metadata } from "next";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How aibusiness.vc collects, uses, and protects your data, including the AI Person Scan and AI Company Scan, and your rights under GDPR.",
  alternates: { canonical: "/privacy" },
};

const H2 = "text-xl font-bold text-gray-900";

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: September 22, 2026</p>
        <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
          <p>
            This policy explains what personal data <strong>AI Business</strong> (aibusiness.vc) collects, why, who
            processes it for us, how long we keep it, and the rights you have. We collect as little as we can and say
            plainly what we do with it.
          </p>

          <h2 className={H2}>Who is responsible</h2>
          <p>
            AI Business (aibusiness.vc) is an independent publication and service operated by Sergei Ponomarev, who acts
            as the data controller. For any privacy question or request, contact{" "}
            <ContactEmail className="text-amber-600 hover:underline" />.
          </p>

          <h2 className={H2}>Reading the site</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Analytics data</strong>: if you accept analytics cookies, we use Google Analytics (GA4) to see how
              the site is used: pages viewed, time on page, referral source, device type, approximate (city-level)
              location derived from your IP, and, for the scans, which step you reached (preview started or completed,
              checkout opened) with the kind of scan. No link, name or email is sent to analytics. This data is
              pseudonymous and we do not use it to identify you.
            </li>
            <li>
              <strong>Email address</strong>: only if you give it, for example when you email us or submit a story.
            </li>
          </ul>

          <h2 className={H2}>AI Person Scan and AI Company Scan</h2>
          <p>
            These two services show what AI assistants say about a person or an organisation. To run them we process
            the following.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>The link you enter</strong>: a public social profile address (AI Person Scan) or a website address
              (AI Company Scan). We do not log in to any account and do not read anything behind a login.
            </li>
            <li>
              <strong>The free preview</strong>: the link is sent to one AI provider (Perplexity) with web search on,
              which returns a name, a role, an organisation and a location as it finds them on public pages. We store
              that preview under a random id for 7 days, so the page can be reopened and a purchase can be tied to it.
            </li>
            <li>
              <strong>Your IP address</strong>: used only to limit how many free previews one address can run per day.
              It is stored as a hash for up to two days and is not linked to a preview or an order.
            </li>
            <li>
              <strong>Checkout and order</strong>: payment is taken by Lemon Squeezy, our merchant of record. We receive
              from them the order number, the email address you entered at checkout, whether a discount was applied,
              and the preview id; we never see card numbers.
            </li>
            <li>
              <strong>The report</strong>: the preview data is sent, as three questions, to five AI providers with web
              search on: OpenAI, Anthropic, Google (Gemini), Perplexity and xAI (Grok). Their answers and the pages they
              cite are stored with the order, summarised by an OpenAI model, checked by fixed rules, rendered as a PDF
              and emailed to the checkout address through Brevo. A copy of that email goes to the operator so that
              delivery problems can be fixed.
            </li>
            <li>
              <strong>Discount codes</strong>: a full-price purchase creates a personal discount code in Lemon Squeezy.
              The code is derived from the order number and is not linked to your name.
            </li>
          </ul>
          <p>
            The person or organisation a scan is about may not be the buyer. We process the public information the AI
            providers return about them on the basis of our and the buyer&rsquo;s legitimate interest in knowing what AI
            assistants say (GDPR Art. 6(1)(f)), we report what the models said without verifying it, and we hold back
            answers and sources that could not be tied to the profile given. A report is not a background check, and
            the Terms of Use forbid using it for decisions on employment, tenancy, credit or insurance. If a scan is about
            you and you want its data deleted, write to us with the profile or website address.
          </p>

          <h2 className={H2}>Cookies and consent</h2>
          <p>
            We load analytics cookies only after you accept them in our cookie banner. Until then, analytics runs in a
            cookieless, consent-denied mode (Google Consent Mode v2); if you decline, no scan events are sent at all. You
            can change or withdraw your choice at any time via the <strong>&ldquo;Cookie preferences&rdquo;</strong>{" "}
            link in the footer. Strictly necessary cookies needed for the site and the checkout to function may be set
            without consent.
          </p>

          <h2 className={H2}>Legal bases</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Contract</strong> (GDPR Art. 6(1)(b)): running the preview you request and making and delivering
              the report you paid for, including the discount code.
            </li>
            <li>
              <strong>Consent</strong> (Art. 6(1)(a)): analytics cookies. You can withdraw consent at any time.
            </li>
            <li>
              <strong>Legitimate interests</strong> (Art. 6(1)(f)): cookieless measurement, limiting abuse of the free
              preview, keeping order records to handle refunds and disputes, processing public information about the
              subject of a scan, and answering messages you send us.
            </li>
          </ul>

          <h2 className={H2}>Who processes data for us</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Perplexity, OpenAI, Anthropic, Google and xAI</strong>: AI providers that receive the link and the
              preview data as questions, through their APIs with web search on, and return answers. Each processes the
              request under its own API terms and privacy policy. Data may be processed in the United States.
            </li>
            <li>
              <strong>Lemon Squeezy</strong>: merchant of record for payments, receipts, taxes and refunds. Lemon Squeezy
              keeps its own records of your order and email under its own privacy policy.
            </li>
            <li>
              <strong>Upstash</strong>: the database that stores previews, orders, answers and reports, and the scheduler
              that wakes the report worker.
            </li>
            <li>
              <strong>Brevo</strong>: sends the report and service emails to the address you gave at checkout. Brevo is an
              EU-based provider.
            </li>
            <li>
              <strong>Vercel</strong>: hosting, content delivery and the functions that run the scans.
            </li>
            <li>
              <strong>Google (Google Analytics)</strong>: traffic measurement. Data may be processed in the US under the
              EU&ndash;US Data Privacy Framework and standard contractual clauses.
            </li>
          </ul>

          <h2 className={H2}>How long we keep it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Preview data</strong>: 7 days, then deleted automatically.
            </li>
            <li>
              <strong>Order data, answers and the report</strong>: 30 days, then deleted automatically. You can ask for
              earlier deletion at any time.
            </li>
            <li>
              <strong>Hashed IP for rate limiting</strong>: up to 2 days.
            </li>
            <li>
              <strong>Records held by Lemon Squeezy and Brevo</strong> (your order, receipt and the emails sent to you)
              follow those providers&rsquo; own retention rules and are not deleted by our automatic expiry; ask us and we
              will request deletion where their terms allow it.
            </li>
            <li>
              <strong>Analytics data</strong>: 14 months in Google Analytics.
            </li>
            <li>
              <strong>Email correspondence</strong>: kept until you ask us to delete it.
            </li>
          </ul>
          <p>We do not run ads, we do not sell your data, and we do not build advertising profiles.</p>

          <h2 className={H2}>Your rights</h2>
          <p>
            If you are in the EU/EEA or UK, you have the right to access, rectify, erase, restrict, or object to the
            processing of your personal data, to data portability, and to withdraw consent at any time. This applies
            equally to buyers and to people a scan is about. To exercise any of these, email{" "}
            <ContactEmail className="text-amber-600 hover:underline" />. You also have the right to lodge a complaint
            with your local data protection authority.
          </p>

          <h2 className={H2}>External links</h2>
          <p>
            We link to tools and services we review; some links may be affiliate links. Those sites have their own
            privacy policies, which we do not control.
          </p>

          <h2 className={H2}>Changes</h2>
          <p>
            We may update this policy as the site evolves. The &ldquo;last updated&rdquo; date above reflects the current
            version.
          </p>
        </div>
      </div>
    </section>
  );
}
