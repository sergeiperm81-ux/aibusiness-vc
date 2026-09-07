import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArtifactTabs, type Artifact } from "@/components/ArtifactTabs";
import { TestPurchaseForm } from "@/components/TestPurchaseForm";
import { ContactEmail } from "@/components/ContactEmail";

export const metadata: Metadata = {
  title: "AI Agent Test Purchase: Independent Check",
  description:
    "Your logs show what the agent said. They do not show whether it matched what your company promised. An independent test purchase checks that gap, against requirements agreed with you in advance. Free screening first.",
  alternates: { canonical: "/service-check" },
  // Without these the page inherited the site-wide card, so every shared link
  // showed the homepage headline instead of the service.
  openGraph: {
    type: "article",
    url: "https://aibusiness.vc/service-check",
    siteName: "AI Business",
    title: "Your Transcripts Look Fine. That Is the Problem.",
    description:
      "The answers that cost you money are the ones that read perfectly. An independent test purchase puts what your agent said next to what your company promised and what your systems recorded.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Transcripts Look Fine. That Is the Problem.",
    description:
      "An independent test purchase puts what your agent said next to what your company promised.",
  },
};

const REPO = "https://github.com/neomundi-io/use-case-aibusiness-runtime-conformity";
const SITE = "https://aibusiness.vc";

/**
 * Structured data for search and AI answer engines. Mirrors visible text and
 * carries no prices: the price is quoted per service after a free screening,
 * and a figure frozen in a crawler's cache would be wrong for everyone.
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
        "An independent check of whether a company's AI service does what the company requires of it. The requirements, up to twenty of them, are agreed with the company in advance and frozen, then checked by an outsider working through the service as an ordinary customer. The company receives a report with evidence. The public registry records that the service is checked and when, and the company receives a numbered verification with a badge customers can scan. Screening is free and the price is quoted per service.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Test purchase services",
        itemListElement: [
          "Free screening: send a link and find out whether your service can be checked this way, and what checking it would involve",
          "Express test purchase: up to twenty agreed requirements checked, a private report with evidence, and a numbered verification recorded in the public registry",
          "Ongoing monitoring: the same agreed requirements re-run on a schedule, keeping the public record and the badge current",
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

/** Symptoms, lightest first. The reader should recognise himself without defending himself. */
const SYMPTOMS = [
  "You have never read a full week of your agent's conversations. Only the ones a customer complained about.",
  "Nobody in the company can write down, on a single page, what the agent is not allowed to do.",
  "Your agent explains your refund rules from memory, and nobody has put its answer next to the policy you actually publish.",
  "A corporate buyer asked how you prove the agent will not misinform their customers, and the honest answer was a paragraph of adjectives.",
  "If the agent gave a bad answer last night, you would hear about it from the customer, not from your own monitoring.",
];

const LAYERS = [
  "What your company promised.",
  "What the agent said.",
  "What your systems actually recorded.",
];

const GAINS = [
  {
    title: "You find out first",
    body: "What your agent promises on your behalf, item by item, with the evidence behind each one. Before a customer finds it, and before it is public.",
  },
  {
    title: "A record instead of a call",
    body: "“How do you prove your agent will not misinform our customers?” is now a standard question in security reviews. Answer it with a link.",
  },
  {
    title: "Proof instead of adjectives",
    body: "Every competitor calls their AI accurate, safe and reliable. You are the one who can show that somebody outside the company checked, and hand over the record.",
  },
];

const PACK = [
  "Up to twenty agreed requirements for your agent, checked by an outsider",
  "A report with the evidence and recommendations, yours either way",
  "A numbered verification recorded in the public registry",
  "A badge with a QR code for your site, so customers can check it themselves",
  "A certificate you can show to buyers, partners and investors",
  "Repeat checks reuse the requirements agreed the first time, so a second check costs less than the first",
];

const PROCESS = [
  {
    n: "01",
    title: "Send your link",
    body: "Within a few working days you get one of two answers: here is what I would check and what it would involve, or this service cannot be checked this way and here is why. Free, and no obligation.",
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

/** Said in the reader's own words, and harder than he would put it himself. */
const FAQS = [
  {
    q: "Who are you, and why would your record mean anything?",
    a: "It is not an accreditation and it does not pretend to be one. It means one thing: the method is published in full, the reference pilot sits in an open repository with its code, prompts and runs, and the person who walked your service does not work for you. You can check me in ten minutes. Nobody outside your company can check your internal testing at all.",
  },
  {
    q: "We already test our own bot.",
    a: "Then you will recognise most of the report. It is the part you do not recognise that you are paying for. Your tests start from the cases you imagined; this one starts from what your company promised in public and works back to whether the agent honours it.",
  },
  {
    q: "Why will you not name a price?",
    a: "Because one number for everyone has to be set high enough to cover the hard cases, and then the simple ones pay for that margin. A booking widget with four scripted answers and a bank's support agent with a hundred rules are not the same job. The screening is free, and the number comes before you owe anything.",
  },
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
    q: "What do you need from us?",
    a: "A link. That is all for an express check. Where paid access is needed, anything up to €50 is on me; more than that we agree in advance. I never use a test account you provide: that would tell you exactly who is checking.",
  },
];

/** This block earns more trust than any testimonial, so it stays. */
const NOT_FOR = [
  "Companies with no customer-facing agent yet. There is nothing to walk through, and the documents are the cheaper thing to do first.",
  "Enterprise rollouts behind a login that no member of the public can reach.",
  "Products where the only way in is a sales call. A demo script is not a service.",
  "Outbound voice campaigns. Different craft, different consent rules.",
  "Anyone who wants a mark of approval rather than a finding. If your agent does not hold, the report says so, and you paid for it.",
];

const LIMITS = [
  "A test purchase sees your service through a customer's eyes, not through your internals.",
  "One check proves a problem exists, not how often. Frequency needs a series.",
  "A full score means the agreed requirements held on the day, not that nothing will ever go wrong.",
  "Scores of different companies are not comparable: the requirements are different every time.",
  "This is a private, independent check. It is not an accredited conformity assessment.",
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

      {/* 1. Deny what the reader thought the problem was */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.5fr_auto] lg:px-8">
          <div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Tested by AI Business
            </p>
            <h1 className="mb-6 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your transcripts look fine. That is the problem.
            </h1>
            <div className="space-y-4 text-lg leading-relaxed text-white/70">
              <p className="text-white/90">
                The answers that cost you money are the ones that read perfectly. They
                only surface when somebody puts what your agent said next to what your
                company promised, and next to what your systems actually recorded.
              </p>
              <p>
                That is what an independent test purchase does. We agree the requirements
                for your agent in advance, then I walk through your service as an ordinary
                customer and hand you the evidence.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="inline-block rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-black transition hover:brightness-95"
              >
                Start with a free screening
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

      {/* 2. Recognition, lightest symptom first */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Any of this sound familiar?
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SYMPTOMS.map((s) => (
              <li key={s} className="flex gap-3 text-base leading-relaxed text-black/75">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Send the false cause away before offering anything */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            You already test it. Here is what that cannot reach.
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-white/70">
            <p>
              Your own tests, your evals and your prompt reviews all start in the same
              place: the cases you imagined the agent might meet. They are good at that,
              and they should keep being good at it. Nothing here replaces them.
            </p>
            <p className="text-white/90">
              A test purchase starts somewhere else. It starts from what your company
              promised, in public and in writing, and works backwards to whether the agent
              honours it. The findings that hurt were never in the scenarios you wrote.
              They are in the ones nobody thought to write.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The real gap, in three lines and a pause */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Three layers, and you hold two of them.
          </h2>
          <ol className="mt-8 space-y-3">
            {LAYERS.map((l, i) => (
              <li
                key={l}
                className="flex items-baseline gap-4 text-xl font-bold leading-snug text-black sm:text-2xl"
              >
                <span className="font-mono text-base text-black/40">{i + 1}</span>
                {l}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-lg leading-relaxed text-black/80">
            Your logs hold the second and the third, and comparing them is engineering you
            can do yourself. The gap that costs money is between the first and the second,
            and nobody inside the company is placed to see it. You wrote the promise. You
            cannot also be the stranger who tests it.
          </p>
        </div>
      </section>

      {/* 5. The moment of understanding, not the conclusion */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            From the reference pilot
          </p>
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What that gap looks like when you find it
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-white/70">
            <p>
              The method was run end to end with{" "}
              <a
                href="https://neomundi.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                NeoMundi
              </a>
              , a Swiss company working in AI metrology, in a controlled environment built
              for the purpose: an estate agency with a booking service, one model playing
              the seller and another the customer, real bookings with real identifiers and
              a log protected against backdating.
            </p>
            <p className="text-white/90">
              The agent completed the journey cleanly. In its closing receipt it gave the
              customer the email address of an employee who exists in no document of that
              company. The transcript showed nothing wrong. Reconciliation against the log
              found it in a second.
            </p>
            <p>
              Everything from that pilot is public:{" "}
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                code, prompts, runs and defects
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 6. Take the blame off the reader */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            This is not carelessness on your side.
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-black/75">
            <p>
              In the same pilot we tested the test. Two identical purchases: one with a
              genuine receipt, one with the record deliberately deleted. Both scored
              identically on the measurement platform.
            </p>
            <p className="text-black">
              If an instrument built for this cannot tell those two apart from behaviour
              alone, no amount of diligence inside your company will either. That is the
              line between measuring what a system does and checking what it promised, and
              it is a property of the setup rather than a comment on your team.
            </p>
          </div>
        </div>
      </section>

      {/* 7. What the reader walks away with */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            What you walk away with
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {GAINS.map((g) => (
              <div
                key={g.title}
                className="rounded-2xl border border-card-border bg-card-bg p-6"
              >
                <h3 className="text-lg font-bold text-white">{g.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">{g.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-card-border bg-card-bg p-7">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
              In the pack
            </p>
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {PACK.map((item) => (
                <p key={item} className="flex gap-3 text-base leading-relaxed text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              The registry records that your service is checked and when. The findings
              themselves stay between us:{" "}
              <Link href="/tested" className="font-semibold text-accent hover:underline">
                see the registry
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 8. How it works */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            How it works
          </h2>
          <p className="mb-8 text-base leading-relaxed text-black/60">
            About a week from start to finish, and you are in control of the only decision
            that matters.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-black/10 p-6">
                <span className="font-mono text-xs font-bold text-amber-600">{s.n}</span>
                <h3 className="mt-3 text-lg font-bold text-black">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-black/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Objections, said out loud */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Said out loud
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

      {/* 10. Who should not buy this */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Who this is not for
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {NOT_FOR.map((n) => (
              <li key={n} className="flex gap-3 text-base leading-relaxed text-black/75">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11. The offer: a free first step instead of a price */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Step one is free.
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-black/80">
            <p className="text-black">
              Send a link. Within a few working days you get one of two answers: here is
              what I would check and what it would involve, or this service cannot be
              checked this way and here is why.
            </p>
            <p>
              The price is set after that, for your service. A booking widget with four
              scripted answers and a bank&apos;s support agent with a hundred rules are
              not the same job, and pricing them the same would mean one of you is
              overpaying. Repeat checks and ongoing monitoring are quoted the same way,
              against requirements that already exist by then.
            </p>
          </div>
          <a
            href="#apply"
            className="mt-8 inline-block rounded-lg bg-black px-7 py-3.5 text-base font-bold text-white transition hover:bg-black/85"
          >
            Start with a free screening
          </a>
        </div>
      </section>

      {/* 12. The one form */}
      <section id="apply" className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            Send your application
          </h2>
          <p className="mt-2 mb-8 text-base leading-relaxed text-black/60">
            Three fields, and an honest answer within a few working days: either your
            service can be checked and we start, or I tell you why it cannot.
          </p>
          <TestPurchaseForm />
        </div>
      </section>

      {/* 13. For the ones who read this far: the method and who runs it */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The method is published. The reference pilot is open.
          </p>
          <h2 className="mb-10 flex flex-wrap items-center gap-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            <span>Built and tested with a Swiss AI metrology company</span>
            <SwissFlag />
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-card-border bg-card-bg p-6">
              <h3 className="text-lg font-bold text-white">The method is published</h3>
              <p className="mt-2 text-base leading-relaxed text-white/70">
                The full method behind this service is written up as a 35 page guide: the
                standard, the forms of a check, how results are scored, the ethics, and
                the limits. Free to read, no registration. Scheduled monitoring on
                NeoMundi&apos;s measurement infrastructure, and anything else beyond a
                standard check, is a conversation rather than a package.
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
                src="/images/sergei-desk.png"
                alt="Sergei Ponomarev"
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-white">Who runs them</h3>
                <p className="mt-2 text-base leading-relaxed text-white/70">
                  Sergei Ponomarev, PhD in political science. Before AI: hundreds of
                  independent quality assessments and test purchases of public services, a
                  monitoring programme run for seven years, and a standard of information
                  openness written for public authorities. The method is carried over, not
                  invented.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. If there is no reference standard to measure against */}
      <section id="documents" className="bg-[#ebebed]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-black sm:text-3xl">
            No reference standard? We can build yours.
          </h2>
          <p className="mb-8 text-base leading-relaxed text-black/65">
            By default the express check measures your service against a composite: the
            requirements we agree together, drawn from what you publish, what you tell me
            the agent must and must never do, and what regulators and customers reasonably
            expect. That works, but it is stitched together from the outside. A company
            that wants a reference standard of its own gets these three documents, written
            for it and kept. Arranged separately: write to{" "}
            <ContactEmail className="font-semibold text-amber-600 hover:underline" /> and
            tell me about your service.
          </p>
          <ArtifactTabs artifacts={ARTIFACTS} />
        </div>
      </section>

      {/* 15. A different reader entirely, kept short and kept late */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Funding the company rather than running it?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/70">
            A test purchase needs nobody&apos;s permission. I approach the service the way
            any customer would, using only what is available to anyone, and check it
            against what the company publishes. For an investor, an accelerator or a fund,
            that answers a question no pitch deck can: does the product do what the
            founders say it does, today, for a stranger with no special access and no demo
            script. The result goes to you alone. Nothing is published, and the company
            gets no registry record and no badge. This is diligence, not a mark of
            approval.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/60">
            By arrangement. Write to{" "}
            <ContactEmail className="font-bold text-accent hover:underline" /> with the
            service you want looked at.
          </p>
        </div>
      </section>

      {/* 16. Limits, then the last door */}
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
              One link, and you will know whether this can be checked at all.
            </p>
            <a
              href="#apply"
              className="shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              Start with a free screening
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
