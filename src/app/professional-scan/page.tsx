import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ModelLogos } from "@/components/professional/ModelLogos";
import { ProfileScanForm } from "@/components/professional/ProfileScanForm";

/**
 * AI Person Scan, built on Maria Wendt's checkout-page checklist
 * (Продажи/Методика_продаж_Вендт_aibusiness_2026-09-15.md) and the page plan
 * (Продажи/План_страницы_AI_Professional_Scan_2026-09-21.md).
 *
 * Her order, kept. Where we differ, on purpose: the H1 is the question, with
 * the product name above it, as on /audit, because the name alone does not
 * say what you get; a free preview comes before the payment, so nobody pays
 * for a report about the wrong person; no testimonials until there are real
 * ones; no purchase ticker; no invented regular price. Every count on this
 * page is what the code sends.
 */

const TITLE = "What does AI say about you?";

export const metadata: Metadata = {
  title: "AI Person Scan: What Does AI Say About You? 5 AI Models, €14.97",
  description:
    "Paste your LinkedIn, X, Instagram or Facebook link. Five AI models with live web search answer three questions about you, including red flags. Free preview, full PDF report €14.97.",
  alternates: { canonical: "/professional-scan" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/professional-scan",
    siteName: "AI Business",
    title: TITLE,
    description: "Before a meeting, people ask ChatGPT about you. See what five AI models tell them.",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Five AI models, three questions, one PDF. Free preview.",
  },
};

/**
 * What the report contains, section by section, in the order of the PDF.
 * Mirrors src/lib/audit/person-report-pdf.ts.
 */
type IconName = "person" | "work" | "flag" | "split" | "steps" | "link";

const INCLUDED: readonly { icon: IconName; title: string; body: string }[] = [
  {
    icon: "person",
    title: "Who you are",
    body: "Where you are based, your background, education and certificates, what you are known for, how to reach you.",
  },
  {
    icon: "work",
    title: "What you do",
    body: "Your role today, the companies and projects you are tied to, and your latest posts and articles, with dates.",
  },
  {
    icon: "flag",
    title: "Red flags",
    body: "Disputes, complaints, warnings and reviews: what each model found, where it found it, and what it looked for.",
  },
  {
    icon: "split",
    title: "Contradictions and namesakes",
    body: "Where the models disagree about you, and the people with your name they mix you up with, with links.",
  },
  {
    icon: "steps",
    title: "Recommendations",
    body: "3 to 5 recommendations, most important first, each with concrete steps: what to write, and where.",
  },
  {
    icon: "link",
    title: "Every answer, with sources",
    body: "All 15 answers word for word, every source linked, social networks and websites listed apart.",
  },
];

/** Codex's wording, 21.09: only what is literally true. */
const REQUIRES_NO: readonly string[] = [
  "login or password",
  "access to your accounts",
  "sign-up",
  "questionnaire",
  "email for the free preview",
];

const WHO_FOR: readonly string[] = [
  "Consultants and experts whose clients check them first",
  "Founders about to meet an investor or a journalist",
  "Anyone job hunting, before the recruiter asks ChatGPT",
  "People with a common name, who get mixed up",
  "Anyone about to work with someone new, who wants to know what AI says about them",
];

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "Which AI models do you ask?",
    a: "Five: OpenAI (gpt-4.1-mini), Anthropic (claude-haiku-4.5), Google (gemini-3.5-flash-lite), Perplexity (sonar) and xAI (grok-4.3). Each is asked through its API with live web search on.",
  },
  {
    q: "Is this what I would see in the ChatGPT app?",
    a: "Not exactly. The apps add their own instructions and remember their users, so two people can see two different answers. The API is the version that can be asked the same way for everyone, and the report says so.",
  },
  {
    q: "Why would the answers differ between models, or from day to day?",
    a: "These are generative models: they write a new answer every time, and each searches the web its own way. The report is a snapshot on the date it was made. That the models disagree is often the most useful finding.",
  },
  {
    q: "Do you log into my LinkedIn?",
    a: "No. Nothing is read with a login. The link only tells the models which person you are, so they do not answer about someone else with your name.",
  },
  {
    q: "What if the free check cannot tell who I am?",
    a: "Then we do not offer the report, and you pay nothing. Try your LinkedIn link: it works best.",
  },
  {
    q: "What if the models know very little about me?",
    a: "The free check has already found you, so the report is about you. If most models know little, the report shows exactly what they could and could not find, and the recommendations say where to start.",
  },
  {
    q: "What if it finds the wrong person?",
    a: "The free preview shows who was found before you pay. In the report, people with your name are listed apart, with links, and each red flag says when it may be about someone else.",
  },
  {
    q: "What if a model says something bad?",
    a: "The report shows which model said it and where it says it got it from. We repeat what the models said. We do not claim it is true.",
  },
  {
    q: "Which social networks work?",
    a: "Personal profiles on LinkedIn, X, Instagram and Facebook. Not websites, company pages or YouTube channels. For a company, use the AI Company Scan.",
  },
  {
    q: "Can I check someone else?",
    a: "Yes: a colleague, a business partner, someone you are about to work with. Not for decisions on hiring, tenancy, credit or insurance: see the note at the bottom of this page.",
  },
  {
    q: "How long does it take?",
    a: "Most reports arrive by email in about five minutes. Processing starts immediately after payment. If an AI provider is slow, we email you and retry automatically. You do not need to refresh.",
  },
  {
    q: "What if one of the five models is down?",
    a: "We keep retrying for up to an hour. If one model is still silent after that, you get the report from the other four: the cover says which model is missing, and you get a free check on top. If two or more are silent, nothing is sent until they answer. If the report cannot be made, you get your money back in full.",
  },
  {
    q: "What do you keep?",
    a: "The free preview for 7 days. For a paid report, the answers for 30 days so it can be sent again if it gets lost. Then everything is deleted. Write to info@aibusiness.vc to have it deleted sooner.",
  },
  {
    q: "Refunds?",
    a: "If your report does not arrive, or is about a different person than the free preview showed, you get your money back in full. Write to info@aibusiness.vc.",
  },
  {
    q: "In which language is the report?",
    a: "English. Names in other alphabets, such as Cyrillic or Greek, print as written.",
  },
];

/**
 * The alternatives, cheapest first, each with a published 2026 price:
 * Taplio from $49 a month (autoposting.ai 2026 review of LinkedIn tools);
 * an expert LinkedIn profile review with a video critique, $95 (Sandy
 * Jones-Kaminski, sandyjk.gumroad.com); a written LinkedIn profile makeover,
 * $229-$499 (resumeyourway.com).
 */
const COMPARISON: readonly { option: string; cost: string; verdict: string; us?: boolean }[] = [
  {
    option: "Asking one AI yourself",
    cost: "€0, your time",
    verdict: "One model, one answer. Nothing to compare it with, and the sources are not checked against each other.",
  },
  {
    option: "AI Person Scan",
    cost: "€14.97 once",
    verdict: "5 models, 3 questions, 15 answers side by side, a red-flag check, namesakes and contradictions, and recommendations with steps.",
    us: true,
  },
  {
    option: "A LinkedIn growth tool",
    cost: "from $49 a month",
    verdict: "Taplio and the like track your posts and reach on LinkedIn. None of them asks an AI assistant what it says about you.",
  },
  {
    option: "An expert profile review",
    cost: "from $95 once",
    verdict: "A person looks at your profile and records what to change. One view, from inside LinkedIn, not from ChatGPT or Gemini.",
  },
  {
    option: "A profile rewrite",
    cost: "$229–$499 once",
    verdict: "A writer rewrites your headline and About section. Useful after this report, which shows what needs rewriting.",
  },
];

const SITE_URL = "https://aibusiness.vc";

const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Person Scan: what AI says about a person",
    url: `${SITE_URL}/professional-scan`,
    provider: { "@type": "Organization", name: "AI Business", url: SITE_URL },
    description:
      "Five AI models with live web search answer three questions about a person from their social profile link. Free preview, full PDF report with red-flag check and recommendations.",
    offers: { "@type": "Offer", price: "14.97", priceCurrency: "EUR" },
    areaServed: "Worldwide",
  },
];

export default function ProfessionalScanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />

      {/* Steps 1–6 on black: name, the pain in one line, the product as pixels, the price, one action. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-accent">AI Person Scan</p>
            <h1 className="mb-6 max-w-xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              {TITLE}
            </h1>
            <p className="mb-8 max-w-lg text-xl leading-relaxed text-white/80">
              Before a meeting, a deal or an interview, people ask ChatGPT about you. See what five AI models tell them.
            </p>
            <ProfileScanForm />
            <p className="mt-6 text-lg font-bold text-white">
              Preview <span className="text-accent">free</span> · Full report <span className="text-accent">&euro;14.97</span> once
            </p>
            <a
              href="/samples/ai-person-scan-sample-report.pdf"
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-lg font-bold text-white underline decoration-accent decoration-4 underline-offset-4 hover:text-accent"
            >
              See a sample report (PDF)
            </a>
          </div>
          <ReportMockup />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="mb-5 text-2xl font-bold text-white">
            Five AI models check you, <span className="text-accent">each searching the web live</span>
          </p>
          <ModelLogos />
        </div>
      </section>

      {/* Step 13 on white: everything inside, section by section. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">What&rsquo;s in the report</h2>
          <p className="mb-10 max-w-2xl text-xl leading-relaxed text-black/65">One PDF by email. Most reports arrive in about five minutes; processing starts immediately after payment.</p>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <li key={item.title} className="rounded-3xl bg-black p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-black">
                  <Icon name={item.icon} />
                </span>
                <p className="mt-5 text-xl font-bold text-white">{item.title}</p>
                <p className="mt-2 text-base leading-relaxed text-white/75">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Step 11 on yellow: how it works, three steps. */}
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-4xl font-bold tracking-tight text-black sm:text-5xl">How it works</h2>
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Step n="1" title="Paste your profile link">
              LinkedIn, X, Instagram or Facebook. Nothing else to fill in.
            </Step>
            <Step n="2" title="See who AI thinks you are">
              Free, in about 20 seconds: the name, role and company an AI model finds from your link.
            </Step>
            <Step n="3" title="Get the full report">
              &euro;14.97 once. Most reports arrive by email in about five minutes; if a model is slow, we email you and retry.
            </Step>
          </ol>
        </div>
      </section>

      {/* Step 10 on black: who it is for, and what it does not require. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">Who it is for</h2>
            <ul className="space-y-4">
              {WHO_FOR.map((who) => (
                <li key={who} className="flex items-start gap-3 text-lg text-white/85">
                  <Check className="mt-1.5 h-5 w-5 text-accent" />
                  {who}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">
              It requires <span className="text-accent">no</span>
            </h2>
            <ul className="space-y-4">
              {REQUIRES_NO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-white/85">
                  <Cross className="mt-1.5 h-5 w-5 text-accent" />
                  <span>
                    <span className="font-bold text-white">No</span> {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Steps 12 and 15 on white: the two questions everyone asks, side by side. */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Question q="“I’m not famous. Will AI find anything?”">
            Often more than you expect: an old job, a talk, a comment, a person with your name. The free preview shows first
            whether AI can tell who you are. If the models know little, the report shows what they could and could not find,
            and what to publish so the next person who asks is told the right things.
          </Question>
          <Question q="“Why not just ask ChatGPT myself?”">
            You can, and you get one model&rsquo;s answer. Here five models answer the same three questions with one click,
            their answers are put side by side, and you see where they disagree, who they mix you up with and which pages
            they read.
          </Question>
        </div>
      </section>

      {/*
        Step 14 on black: the bonus, framed as something to give. People recommend what lets them be the one who
        "got it for you": the code is worth more handed to a friend than kept.
      */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-accent px-5 py-2 text-lg font-bold uppercase tracking-wider text-black">
            Bonus
          </span>
          <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                7 more checks at half price. <span className="text-accent">Yours to give away.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-white/80">
                Every full-price purchase includes a code for 50% off up to 7 additional AI Person or AI Company Scans. Use it
                yourself, or hand it to the people you know: they get a check for half the price, and you are the one who got
                it for them. An order paid with a code does not create a new code.
              </p>
            </div>
            <div className="rounded-3xl bg-accent px-10 py-8 text-center">
              <p className="text-6xl font-bold tracking-tight text-black">50% off</p>
              <p className="mt-2 text-lg font-bold text-black/70">up to 7 more scans</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-3xl border-2 border-accent p-7">
              <p className="text-2xl font-bold text-accent">Give it away</p>
              <p className="mt-3 text-lg leading-relaxed text-white/85">
                To friends, family, colleagues and partners, so they can see what AI says about them. Up to 7 people.
              </p>
            </div>
            <div className="rounded-3xl border-2 border-white/25 p-7">
              <p className="text-2xl font-bold text-white">Use it yourself</p>
              <p className="mt-3 text-lg leading-relaxed text-white/85">
                Check a partner before you sign, or a supplier before you pay. Up to 7 scans of people or companies, whoever
                uses the code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 19 on white: against the alternatives, cheapest first. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-4xl font-bold tracking-tight text-black sm:text-5xl">Compared with the alternatives</h2>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {COMPARISON.map((row) => (
              <Row key={row.option} option={row.option} cost={row.cost} verdict={row.verdict} us={row.us} />
            ))}
          </div>
        </div>
      </section>

      {/* Step 20 on black: the author. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[auto_1fr] lg:px-8">
          <Image src="/images/sergei-desk.png" alt="Sergei Ponomarev" width={224} height={224} className="h-56 w-56 rounded-3xl object-cover" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Who built this</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
              <span className="font-bold text-white">Sergei Ponomarev</span> runs aibusiness.vc and tests AI agents the way a
              mystery shopper tests a shop. The same engine checks what AI assistants say about a company in the AI Company
              Scan. This scan points it at people.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li className="rounded-2xl bg-accent p-5">
                <p className="text-3xl font-bold text-black">7 years</p>
                <p className="mt-1 text-base font-semibold text-black/75">of service standards, evaluation and test purchases</p>
              </li>
              <li className="rounded-2xl bg-accent p-5">
                <p className="text-3xl font-bold text-black">5 models</p>
                <p className="mt-1 text-base font-semibold text-black/75">asked about every person, side by side</p>
              </li>
              <li className="rounded-2xl bg-accent p-5">
                <p className="text-3xl font-bold text-black">Founder</p>
                <p className="mt-1 text-base font-semibold text-black/75">of AI Business, and answers the email himself</p>
              </li>
            </ul>
            <Link href="/sergei-ponomarev" className="mt-6 inline-block text-lg font-bold text-accent underline underline-offset-4">
              About Sergei
            </Link>
          </div>
        </div>
      </section>

      {/* Step 21 on white: the full FAQ, open. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-4xl font-bold tracking-tight text-black sm:text-5xl">Questions people ask before they buy</h2>
          <dl className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="border-t-2 border-black pt-5">
                <dt className="text-xl font-bold text-black">{f.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-black/75">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Steps 24 and 6 again, on yellow, then the note. */}
      <section className="bg-accent">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 max-w-3xl text-4xl font-bold tracking-tight text-black sm:text-5xl">
            See what AI tells people about you.
          </h2>
          <ProfileScanForm tone="yellow" />
          <p className="mt-6 text-lg font-bold text-black">Preview free · Full report &euro;14.97 once</p>
          <p className="mt-14 max-w-3xl text-sm leading-relaxed text-black/65">
            AI Person Scan is not a background check, and aibusiness.vc is not a consumer reporting agency. Do not use
            it to decide on employment, tenancy, credit or insurance. It shows what AI models say, which can be wrong or
            about a different person.
          </p>
        </div>
      </section>
    </>
  );
}

function Question({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-black p-8">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-black">{q}</h2>
      <p className="text-lg leading-relaxed text-black/75">{children}</p>
    </div>
  );
}

function Row({ option, cost, verdict, us = false }: { option: string; cost: string; verdict: string; us?: boolean }) {
  return (
    <div className={`grid grid-cols-1 gap-1 py-5 sm:grid-cols-[220px_170px_1fr] sm:gap-6 ${us ? "-mx-4 rounded-2xl bg-accent px-4" : ""}`}>
      <p className={`text-lg font-bold ${us ? "text-black" : "text-black/65"}`}>{option}</p>
      <p className={`text-lg font-bold ${us ? "text-black" : "text-black/65"}`}>{cost}</p>
      <p className={`text-base leading-relaxed ${us ? "font-semibold text-black" : "text-black/70"}`}>{verdict}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-3xl bg-black p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg font-bold text-black">{n}</span>
      <p className="mt-5 text-xl font-bold text-white">{title}</p>
      <p className="mt-2 text-base leading-relaxed text-white/75">{children}</p>
    </li>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={`h-4 w-4 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/**
 * The report's three questions as a yellow sheet with black blocks, for a
 * placeholder name. Big type only: small print on a mockup reads as noise.
 * Replaced by real pages of the sample report once it is made.
 */
function ReportMockup() {
  const questions = [
    "Who is [Name]?",
    "What does [Name] do as a professional?",
    "Are there red flags about working with [Name]?",
  ];
  return (
    <div className="rounded-3xl bg-accent p-7 shadow-2xl shadow-black/60">
      <p className="text-sm font-bold uppercase tracking-wider text-black/70">AI Person Scan</p>
      <p className="mt-1 text-3xl font-bold leading-tight text-black">What AI says about [Name]</p>
      <div className="mt-6 space-y-3">
        {questions.map((q, i) => (
          <div key={q} className="rounded-2xl bg-black px-5 py-4">
            <p className="text-sm font-bold uppercase tracking-wider text-accent">Question {i + 1}</p>
            <p className="mt-1 text-lg font-bold leading-snug text-white">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Line icons for the report sections, drawn in the current text colour. */
function Icon({ name }: { name: IconName }) {
  const paths: Readonly<Record<IconName, React.ReactNode>> = {
    person: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </>
    ),
    work: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
      </>
    ),
    flag: <path d="M5 21V4m0 0h11l-2 4 2 4H5" />,
    split: <path d="M6 3v6a6 6 0 006 6h0a6 6 0 006-6V3M12 15v6M9 21h6" />,
    steps: <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />,
    link: <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />,
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
