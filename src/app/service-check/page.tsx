import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArtifactTabs, type Artifact } from "@/components/ArtifactTabs";
import { TestPurchaseForm } from "@/components/TestPurchaseForm";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata: Metadata = {
  title: "AI Agent Test Purchase: Independent Check",
  description:
    "An independent test purchase of your AI service: up to twenty agreed requirements for your agent, checked by an outsider, with a verification your customers can scan.",
  alternates: { canonical: "/service-check" },
  // Without these the page inherited the site-wide card, so every shared link
  // showed the homepage headline instead of the service.
  openGraph: {
    type: "article",
    url: "https://aibusiness.vc/service-check",
    siteName: "AI Business",
    title: "Prove Your AI Does What It Promises",
    description:
      "Anyone can claim their AI is accurate and safe. An independent test purchase proves it, and gives you a verification customers can check for themselves.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prove Your AI Does What It Promises",
    description:
      "Anyone can claim their AI is accurate and safe. An independent test purchase proves it.",
  },
};

const REPO = "https://github.com/neomundi-io/use-case-aibusiness-runtime-conformity";
const SITE = "https://aibusiness.vc";

/**
 * Structured data for search and AI answer engines. Mirrors visible text and
 * carries no prices: the offer changes, and a figure frozen in a crawler's
 * cache is worse than none.
 */
function structuredData(faqs: readonly { q: string; a: string }[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Test Purchases of AI Agents",
      alternateName: "AI agent test purchase, independent AI service verification",
      serviceType: "Independent verification of customer-facing AI services",
      url: `${SITE}/service-check`,
      areaServed: "Worldwide",
      provider: {
        "@type": "Person",
        name: "Sergei Ponomarev",
        jobTitle: "AI service assurance methodologist",
        url: `${SITE}/sergei-ponomarev`,
        affiliation: {
          "@type": "Organization",
          name: "NeoMundi",
          url: "https://neomundi.io",
        },
      },
      description:
        "An independent check of whether a company's AI service does what the company requires of it. The requirements, up to twenty of them, are agreed with the company in advance and frozen, then checked by an outsider working through the service as an ordinary customer. They may come from what the company publishes, or from rules that were never published but matter to the business. The company receives a report with evidence. The public registry records that the service is checked and when, and the company receives a numbered verification with a badge customers can scan.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Test purchase services",
        itemListElement: [
          "Express test purchase: up to twenty agreed requirements checked, a private report with evidence, and a numbered verification recorded in the public registry",
          "AI Monitoring: a subscription of two checks a month against the agreed requirements, keeping the public record and the badge current",
          "Documents for your AI: AI Policy, Service Passport, AI Receipt template and operating rules, written for the service and delivered as a project",
          "Diligence test purchase for investors, accelerators and funds: an independent consumer-side check of a company you are funding, reported privately and never published",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

const GAINS = [
  {
    title: "Proof instead of adjectives",
    body: "Every competitor calls their AI accurate, safe and reliable. You will be the one who can show an outsider checked, and hand over the record.",
  },
  {
    title: "Shorter procurement",
    body: "“How do you prove your agent will not misinform our customers?” is now a standard question in security reviews. Answer it with a link instead of a call.",
  },
  {
    title: "Sleep at night",
    body: "You stop wondering what the bot says at two in the morning. Somebody has walked the whole journey and written down what happened.",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Send your link",
    body: "I look at your service and tell you within two working days whether it can be checked this way. Free, and no obligation.",
  },
  {
    n: "02",
    title: "We agree what to check",
    body: "I draft the requirements for your agent, up to twenty of them, from what you publish and from what you tell me matters. You add or swap items, then the list is frozen. The wording of each probe stays with me.",
  },
  {
    n: "03",
    title: "I buy like a customer",
    body: "You get two quiet days to try everything yourself. Then, at some point that week, I walk through your service as an ordinary customer.",
  },
  {
    n: "04",
    title: "You get the report",
    body: "Every item, with the evidence behind it and recommendations on what to fix. The report is yours: what you do with it is your business.",
  },
];

const ARTIFACTS: readonly Artifact[] = [
  {
    id: "policy",
    tab: "AI Policy",
    title: "Company AI Policy",
    lead: "One public document for the whole company: by what rules does this company use AI, written for the customer rather than for lawyers.",
    answers: [
      "What the AI does and how it identifies itself",
      "What happens to customer data",
      "Which decisions the AI may not take",
      "How to reach a human",
      "Who is personally responsible, and where to complain",
    ],
    footnote: "Public, on your website. One document for the whole company.",
  },
  {
    id: "passport",
    tab: "AI Service Passport",
    title: "AI Service Passport",
    lead: "One document per service. The policy sets general rules; the passport sets the norm for a specific service.",
    answers: [
      "What the service is and what stages it has",
      "What data it needs, and what it does not",
      "What the agent may do alone, and what it may never do",
      "What counts as a result",
      "When a human must step in",
    ],
    footnote:
      "The central document of a full assessment. Most items are measured against it.",
  },
  {
    id: "receipt",
    tab: "AI Receipt",
    title: "AI Receipt",
    lead: "One document per interaction. As a till receipt confirms a purchase, this confirms the exchange.",
    answers: [
      "Who spoke with whom, and when",
      "Whether AI involvement was disclosed",
      "What data was passed, and with what consent",
      "What actions were taken, under which identifiers",
      "How it ended, and where to turn in case of disagreement",
    ],
    footnote:
      "The agent's own account of events. Its truthfulness is reconciled against your operations log.",
  },
];

const LIMITS = [
  "A test purchase sees your service through a customer's eyes, not through your internals.",
  "One check proves a problem exists, not how often. Frequency needs a series.",
  "A full score means the agreed requirements held on the day, not that nothing will ever go wrong.",
  "Scores of different companies are not comparable: the requirements are different every time.",
  "This is a private, independent check. It is not an accredited conformity assessment.",
  "Not everything can be checked this way: enterprise rollouts, sales-call-only access and outbound voice campaigns are out of scope.",
];

const FAQS = [
  {
    q: "What if the result is bad?",
    a: "Then you are the only one who sees it. The findings go to you and nowhere else: I do not publish what a check found. The registry records that your service is checked and when, not how it scored on any given item.",
  },
  {
    q: "Why would I pay someone to find problems?",
    a: "Because your customers and your corporate buyers will find them anyway, and later, and in public. The report comes with recommendations, so the cheapest moment to learn about a problem is from someone who is not shouting about it.",
  },
  {
    q: "You tell me what you will check. Doesn't that make it easy?",
    a: "It makes it fair. You agree the subjects, never the questions, the scenario, the account or the moment. If your agent does what you require of it, being told the subjects in advance changes nothing. If it does not, no amount of warning will save it.",
  },
  {
    q: "Will this disrupt our service?",
    a: "No. The volume is that of an ordinary customer. Real orders are never taken to the irreversible step, and no real personal data is used.",
  },
  {
    q: "Isn't this just red teaming?",
    a: "No. Red teaming attacks the model to find what it can be made to do. A test purchase checks whether your agent meets the requirements you set for it, as an ordinary customer would experience them.",
  },
  {
    q: "We don't have a bot yet.",
    a: "Then there is nothing to test-purchase, but there is a cheaper moment to fix things: before it is built. The service standard (a policy, a service passport and a receipt template) can be written first and handed to your developers as requirements.",
  },
  {
    q: "What do you need from us?",
    a: "A link. That is all for an express check. Where paid access is needed, anything up to €50 is on me; more than that we agree in advance. I never use a test account you provide: that would tell you exactly who is checking.",
  },
];

/** The Swiss flag, drawn rather than fetched. */
function SwissFlag() {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-label="Switzerland"
      role="img"
      className="inline-block h-7 w-7 shrink-0 rounded-[4px]"
    >
      <rect width="32" height="32" fill="#D52B1E" />
      <rect x="13" y="6" width="6" height="20" fill="#fff" />
      <rect x="6" y="13" width="20" height="6" fill="#fff" />
    </svg>
  );
}

export default function ServiceCheckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(FAQS)) }}
      />

      {/* 1. The problem, in the customer's words */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.5fr_auto] lg:px-8">
          <div>
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Tested by AI Business
          </p>
          <h1 className="mb-6 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Prove your AI does what it promises.
          </h1>
          <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/70">
            <p className="text-white/90">
              An independent test purchase: we agree the requirements for your agent, then
              I walk through your service as an ordinary customer and give you evidence
              your customers and buyers can check for themselves.
            </p>
            <p>
              Trust is the hardest thing to earn for an AI product. A claim earns none of
              it. A verification with a date, a method and a public record does.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#order"
              className="inline-block rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-black transition hover:brightness-95"
            >
              Order a test purchase
            </a>
          </div>
          </div>

          <Image
            src="/images/ai-tested-badge.png"
            alt="AI Tested badge with a QR code leading to the public registry"
            width={280}
            height={280}
            priority
            className="mx-auto h-auto w-48 lg:mx-0 lg:w-64"
          />
        </div>
      </section>

      {/* 2. What you get out of it */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            What it buys you
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {GAINS.map((g) => (
              <div key={g.title} className="rounded-2xl border border-black/10 p-6">
                <h3 className="text-lg font-bold text-black">{g.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-black/70">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            How it works
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/60">
            About a week from start to finish, and you are in control of the only decision
            that matters.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-card-border bg-card-bg p-6"
              >
                <span className="font-mono text-xs font-bold text-accent">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For the people funding it, not running it */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Funding the company rather than running it?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-black/80">
                A test purchase needs nobody&apos;s permission. I approach the service the
                way any customer would, using only what is available to anyone, and check
                it against what the company publishes. For an investor, an accelerator or
                a fund, that answers a question no pitch deck can: does the product do
                what the founders say it does, today, for a stranger with no special
                access and no demo script.
              </p>
            </div>
            <div className="rounded-2xl bg-background p-6">
              <p className="text-base leading-relaxed text-white/80">
                The result goes to you alone. Nothing is published, and the company gets
                no registry record or badge. This is diligence, not a mark of approval.
              </p>
              <p className="mt-4 text-sm font-semibold text-white/60">
                By arrangement. Write to{" "}
                <ContactEmail className="font-bold text-accent hover:underline" /> with
                the service you want looked at.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prices */}
      <section id="order" className="border-b border-black/10 bg-[#ebebed]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-black bg-white p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-black/50">
                  Express test purchase
                </p>
                <div className="mt-3 flex items-end gap-4">
                  <p className="text-6xl font-bold text-black">&euro;199</p>
                  <p className="pb-2 text-3xl font-bold text-black/30 line-through">
                    &euro;399
                  </p>
                </div>
                <p className="mt-2 text-sm font-semibold text-black/55">
                  Introductory price for the first companies in the registry.
                </p>
              </div>
              <a
                href="#apply"
                className="shrink-0 rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-black transition hover:brightness-95"
              >
                Order a test purchase
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-black/10 pt-6 sm:grid-cols-2">
              {[
                "Up to twenty agreed requirements for your agent, checked by an outsider",
                "A report with evidence and recommendations, yours either way",
                "A numbered verification recorded in the public registry",
                "A badge with a QR code for your site, so customers can check it",
                "A certificate you can show to buyers, partners and investors",
                "50% off your next check, valid three months",
              ].map((item) => (
                <p key={item} className="flex gap-3 text-base leading-relaxed text-black/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm text-black/50">
              The registry records that your service is checked and when. The findings
              themselves stay between us:{" "}
              <Link href="/tested" className="font-semibold text-amber-600 hover:underline">
                see the registry
              </Link>
              .
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-accent/70 bg-white p-6">
              <h3 className="text-lg font-bold text-black">AI Monitoring</h3>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                One check proves a service worked that day. Two checks a month keep it
                proven: the same agreed requirements, re-run twice monthly, with the
                registry record and the date on your badge updating themselves. You hear
                about any deviation before anyone else does.
              </p>
              <p className="mt-3 text-sm font-semibold text-black/60">
                <span className="text-xl font-bold text-black">&euro;49</span> / month,
                after a first test purchase.
              </p>
            </div>
            <div className="rounded-2xl border border-black/15 bg-white p-6">
              <h3 className="text-lg font-bold text-black">Documents for your AI</h3>
              <p className="mt-2 text-base leading-relaxed text-black/70">
                The full package, written for your service and yours to keep: an AI
                Policy, a Service Passport, an AI Receipt template and the operating
                rules, with the acceptance checks that verify them later. A project
                rather than a purchase.
              </p>
              <p className="mt-3 text-sm font-semibold text-black/60">
                By arrangement.{" "}
                <a href="#documents" className="font-bold text-amber-600 hover:underline">
                  What is in the package &rarr;
                </a>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/55">
                No form for this one: write to <ContactEmail className="font-semibold text-amber-600 hover:underline" /> and
                tell me about your service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Send your application
          </h2>
          <p className="mt-2 mb-8 text-base leading-relaxed text-black/60">
            Three fields, two working days, an honest answer: either your service can be
            checked and we start, or I tell you why it cannot.
          </p>
          <TestPurchaseForm />
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Common questions
          </h2>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-bold text-white">{f.q}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Who runs this, and on what method */}
      <section className="border-b border-card-border bg-card-bg/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The method is published. The reference pilot is open.
          </p>
          <h2 className="mb-10 flex flex-wrap items-center gap-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            <span>Built and tested with a Swiss AI metrology company</span>
            <SwissFlag />
          </h2>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h3 className="text-xl font-bold text-white">The reference pilot</h3>
              <p className="mt-3 text-base leading-relaxed text-white/70">
                The method is not theory. It was run end to end in partnership with{" "}
                <a
                  href="https://neomundi.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent hover:underline"
                >
                  NeoMundi
                </a>
                , a Swiss company working in AI metrology, in a controlled environment
                built for the purpose: an estate agency with a booking service, one model
                playing the seller and another the customer, real bookings with real
                identifiers and a log protected against backdating.
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/70">
                The agent completed the journey cleanly and, in its closing receipt, gave
                the customer the email address of an employee who exists in no document.
                The transcript showed nothing. Reconciliation against the log found it in a
                second.
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/90">
                Then we tested the test: two identical purchases, one with a genuine
                receipt and one with a record deliberately deleted. Both scored identically
                on the measurement platform. That is the boundary between measuring
                behaviour and checking a promise, established experimentally rather than
                asserted.
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/70">
                Scheduled monitoring on their measurement infrastructure, and anything else
                beyond a standard check, is a conversation rather than a package.
              </p>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
              >
                Open the repository: code, prompts, runs, defects
              </a>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-card-border bg-card-bg p-6">
                <h3 className="text-lg font-bold text-white">The method is published</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">
                  The full method behind this service is written up as a 35 page guide: the
                  standard, the forms of a check, how results are scored, the ethics, and
                  the limits. Free to read, no registration.
                </p>
                <Link
                  href="/library/ai-agent-test-purchase"
                  className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
                >
                  Read the method in the library &rarr;
                </Link>
              </div>
              <div className="flex gap-5 rounded-2xl border border-card-border bg-card-bg p-6">
                <Image
                  src="/images/sergei-ponomarev.jpg"
                  alt="Sergei Ponomarev"
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Who runs them</h3>
                  <p className="mt-2 text-base leading-relaxed text-white/70">
                    Sergei Ponomarev, PhD in political science. Before AI: hundreds of
                    independent quality assessments and test purchases of public services,
                    a monitoring programme run for seven years, and a standard of
                    information openness written for public authorities. The method is
                    carried over, not invented.
                  </p>
                  <Link
                    href="/sergei-ponomarev"
                    className="mt-4 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
                  >
                    More about me &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Going deeper: the three documents */}
      <section id="documents" className="border-b border-card-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            No reference standard? We can build yours.
          </h2>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/60">
            By default the express check measures your service against a composite: the
            requirements we agree together, drawn from what you publish, what you tell me
            the agent must and must never do, and what regulators and customers reasonably
            expect.
            That works, but it is stitched together from the outside. A company that wants
            a real reference standard of its own gets these three documents, written for
            it and kept. Arranged separately.
          </p>
          <ArtifactTabs artifacts={ARTIFACTS} />
        </div>
      </section>

      {/* 10. Limits */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            What this does not do
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {LIMITS.map((l) => (
              <li key={l} className="flex gap-3 text-base leading-relaxed text-black/70">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-black p-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-bold text-white sm:text-xl">
              Ready to find out what your agent actually says?
            </p>
            <a
              href="#apply"
              className="shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              Order a test purchase
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
