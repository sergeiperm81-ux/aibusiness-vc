import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UrlAuditForm } from "@/components/audit/UrlAuditForm";

/**
 * The scan's landing page, built step by step on Maria Wendt's checkout-page
 * checklist (see Продажи/Методика_продаж_Вендт_aibusiness_2026-09-15.md, part 7).
 *
 * Her order, kept: product name as the headline, a practical pain line, the
 * product shown as pixels, what you get and the price, one action; then
 * "requires no", how it works, the most common question, everything inside
 * counted, the second question, a preview, a comparison, the author, a full
 * FAQ, a one-line outcome, and the same single action again.
 *
 * Skipped on purpose: testimonials (we have none, none are invented), a
 * "why now" line (no honest one), a purchase ticker (no real events yet),
 * and any "regular price" theatre. Every count comes from what
 * src/lib/audit/fulfillment.ts actually sends. No alarm colours: the pain is
 * named in words, not painted red.
 */

const TITLE = "Is your site blocked for AI?";

export const metadata: Metadata = {
  // Kept working for existing links, but out of the index until it is reshaped like the two scans.
  robots: { index: false, follow: true },
  title: "AI Website Scan: Is Your Site Blocked for AI? Free Scan, AI Fix Kit €49",
  description:
    "Free 30-second scan: find out whether the ChatGPT and Claude crawlers can read your site, what the OpenAI and Anthropic models say about you from memory, and what to fix first.",
  alternates: { canonical: "/audit" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/audit",
    siteName: "AI Business",
    title: TITLE,
    description:
      "AI Website Scan: 30 seconds to see what ChatGPT and Claude can read on your site. Free. AI Fix Kit €49.",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "What ChatGPT and Claude can read on your site. Free scan, 30 seconds.",
  },
};

/** What the €49 package contains, counted. Mirrors src/lib/audit/fulfillment.ts. */
const INCLUDED: readonly { count: string; title: string; body: string }[] = [
  { count: "8", title: "scores in a PDF report", body: "Every signal measured on your domain, with the number we found." },
  { count: "1", title: "task spreadsheet", body: "Your fixes in priority order: one row per problem, with priority, owner and hours." },
  { count: "8", title: "ready prompts", body: "For Claude Code, Cursor or ChatGPT, each carrying your measured numbers." },
  { count: "3", title: "schema templates", body: "Organization, WebSite and FAQ markup, ready to fill in and paste." },
  { count: "1", title: "llms.txt draft", body: "Written for your domain, ready to adapt and publish." },
  { count: "1", title: "Agent Card", body: "Your company on one machine-readable page, drafted from your homepage." },
  { count: "1", title: "implementation guide", body: "Step by step, in Word, for whoever does the work." },
  { count: "1", title: "three-session work plan", body: "The whole job split into three sittings." },
  { count: "10", title: "QA checks", body: "Plus a target for every weak signal, so you know when it is fixed." },
];


/** The scan reads the site from outside, so none of these are needed. All true. */
const REQUIRES_NO: readonly string[] = [
  "access to your site or CMS",
  "plugin or script to install",
  "account or login",
  "call or meeting",
  "subscription",
];

const WHO_FOR: readonly string[] = [
  "Founders with a live company site",
  "Marketing leads asked “how do we show up in ChatGPT?”",
  "Agencies checking a client’s site before a pitch",
  "Developers handed the task with no spec",
  "Anyone who has asked ChatGPT about their own company and got nothing",
];

/** Each signal with a one-line account of how it is actually measured. */
const SCAN_METRICS: readonly { name: string; how: string }[] = [
  { name: "AI crawler permission in robots.txt", how: "Whether robots.txt lets in the search bots behind ChatGPT (OAI-SearchBot), Claude (Claude-SearchBot) and Perplexity. The training crawlers GPTBot, ClaudeBot and Google-Extended are reported separately and do not affect the score: allowing them is your decision. This checks permission only; a firewall or CDN rule is not tested." },
  { name: "What an AI actually sees", how: "Your page loaded without JavaScript, as most crawlers read it." },
  { name: "llms.txt", how: "Whether the plain-text summary for AI exists and is useful." },
  { name: "Schema markup", how: "Structured data that tells machines who you are and what you sell." },
  { name: "Citation readiness", how: "Direct answers and concrete facts an assistant can quote." },
  { name: "Content structure", how: "Headings and sections that extraction handles well." },
  { name: "Page speed", how: "How fast your server answers a crawler." },
  { name: "HTTPS and security", how: "Certificate and security headers on a live request." },
];

/**
 * A price ladder, cheapest first. Subscription prices are the published
 * entry tiers in September 2026 (Peec AI $95/mo, Profound $99/mo for ChatGPT
 * only, Semrush AI Visibility Toolkit $99/mo per domain); real setups with
 * more prompts, seats or engines run $300 a month and up. Agency audit
 * prices are the ranges published in 2026 pricing guides (llmreach.ai,
 * bizwhiz.ai, avantevisibility.com): one-time audits $1,500–$7,500, deeper
 * engagements $8,000–$25,000.
 */
const COMPARISON: readonly { option: string; cost: string; verdict: string; us?: boolean }[] = [
  {
    option: "Free SEO tools",
    cost: "€0, your time",
    verdict: "They check Google’s view of your site. They do not check whether AI crawlers are let in, and nobody writes the fixes.",
  },
  {
    option: "Asking ChatGPT or Claude yourself",
    cost: "€0, your time",
    verdict: "You get one answer, but not why, and nothing is measured on your site.",
  },
  {
    option: "AI Website Scan + AI Fix Kit",
    cost: "€49 once",
    verdict: "8 signals measured live on your domain in 30 seconds, then the fixes written for your developer, by email within minutes.",
    us: true,
  },
  {
    option: "AI visibility subscriptions",
    cost: "$95–$99 a month, $300+ in practice",
    verdict: "Peec AI, Profound, Semrush AI Toolkit and the like track how often assistants mention you. Monitoring, billed monthly; the fixing is still on you.",
  },
  {
    option: "An agency GEO audit",
    cost: "from $1,500, often more",
    verdict: "One-time GEO audits in 2026 are quoted from $1,500, and broader engagements run into the thousands and take weeks. A deeper scope than this scan: a full report, then a proposal for the implementation.",
  },
];

/**
 * Real scans (16 September 2026), run with the owners' agreement. Every number
 * is the score the scan produced that day; nothing is rounded up. The
 * "after" scores are added only once the fixes are live and re-measured.
 */
const PROVEN_ON: readonly {
  domain: string;
  logo?: string;
  who: string;
  score: number;
  found: readonly string[];
}[] = [
  {
    domain: "vntblack.com",
    logo: "/images/audit/vntblack.png",
    who: "A partner\u2019s site",
    score: 66,
    found: [
      "No structured data on the homepage: key facts not machine-readable (30/100).",
      "No llms.txt: the address answers with the homepage instead of the file (0/100).",
      "No robots.txt either, same reason. Neither model had any memory of the brand.",
    ],
  },
  {
    domain: "mylo.family",
    logo: "/images/audit/mylo-family.png",
    who: "Our own project",
    score: 83,
    found: [
      "Heading hierarchy and section sizes need work (59/100).",
      "llms.txt lists too few pages with descriptions (77/100).",
      "robots.txt names 2 of the 3 answer-engine bots; Claude-SearchBot is not addressed (87/100).",
    ],
  },
  {
    domain: "super.tennis",
    logo: "/images/audit/super-tennis.png",
    who: "A partner\u2019s site",
    score: 91,
    found: [
      "Content readable without a browser: 935 words of plain text (96/100).",
      "robots.txt names 2 of the 3 answer-engine bots; Claude-SearchBot is missing (87/100).",
      "llms.txt too short: expand to 10+ priority pages (77/100).",
      "An earlier answer check found assistants confusing it with the unrelated supertennis.tv.",
    ],
  },
];

const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "What do I get for free?",
    a: "Your site readiness score out of 100, what the OpenAI and Anthropic models say about your company from memory, word for word, your two weakest signals explained, and how many critical issues were found.",
  },
  {
    q: "What if you cannot reach my site?",
    a: "You get no score, and we show the reason instead. A site that blocks our scanner often blocks AI crawlers too.",
  },
  {
    q: "Is it a subscription?",
    a: "No. The scan is free. The report is €49 once, sent by email within minutes, with a 14-day refund, no questions asked.",
  },
  {
    q: "Do I need a developer to use the report?",
    a: "For most fixes, yes, but the report is written for them: a task list with hours, prompts they can paste into Claude Code or Cursor, and templates ready to fill in. You hand it over and the work starts the same day.",
  },
  {
    q: "Is my data safe?",
    a: "The scan reads only what any visitor or crawler can already see. Nothing is installed, and no login is asked for.",
  },
  {
    q: "Can I scan a client’s site?",
    a: "Yes. Any public domain. Agencies use the free result before a pitch and the report as the brief.",
  },
  {
    q: "How long does the report take to arrive?",
    a: "Minutes. Payment triggers a fresh measurement of your domain, and the PDF plus the implementation kit are sent to the email you give at checkout.",
  },
  {
    q: "What if my score is already high?",
    a: "Then the kit is short and the task list is small. You still get every score, the templates and the llms.txt draft, and you know nothing is silently blocking you. If it tells you nothing new, use the 14-day refund.",
  },
  {
    q: "Does the scan read the whole site?",
    a: "It reads the homepage, robots.txt and llms.txt on a live request, the way a crawler starting from your domain does. Deep pages are not crawled; the homepage is the standard starting point of this express scan.",
  },
  {
    q: "How is this different from the AI Test Purchase?",
    a: "This scan checks whether machines can read your site. The Test Purchase checks whether your own chatbot or AI service does what you promise to customers. Different product, different page.",
  },
  {
    q: "What is GEO?",
    a: "GEO (Generative Engine Optimization) means making your site readable and quotable for AI answer engines such as ChatGPT and Claude. SEO works on ranked links; GEO works on being the source an assistant quotes.",
  },
];

const SITE_URL = "https://aibusiness.vc";

/** FAQPage + Service structured data, mirroring only content present on this page. */
const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Website Scan: is your site blocked for AI?",
    serviceType: "Generative Engine Optimization audit",
    url: `${SITE_URL}/audit`,
    provider: { "@type": "Organization", name: "AI Business", url: SITE_URL },
    description:
      "Free scan of whether AI crawlers can read a website, measuring 8 signals live on the domain, with a paid report of prioritised fixes.",
    offers: { "@type": "Offer", price: "49", priceCurrency: "EUR" },
    areaServed: "Worldwide",
  },
];

export default function AuditLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Steps 1–6: name, the pain in one line, the product as pixels, what you get, price, one action. */}
      <section className="bg-background">
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle at 78% 40%, rgba(245, 158, 11, 0.13), transparent 30%)",
          }}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            <div>
              <h1 className="mb-6 max-w-xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                {TITLE}
              </h1>
              <p className="mb-3 max-w-lg text-xl leading-relaxed text-white/80">
                If your site is live, ChatGPT and Claude should be able to read it and
                describe your company. If they can&rsquo;t, you are not in their answers.
              </p>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/60">
                The scan checks 8 signals on your domain in 30 seconds and shows you what
                the OpenAI and Anthropic models say about your company from memory today.
              </p>

              <UrlAuditForm />

              <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="text-lg font-bold text-white">
                  Scan: <span className="text-accent">free</span>
                </span>
                <span className="text-lg font-bold text-white">
                  AI Fix Kit: <span className="text-accent">&euro;49</span> once
                </span>
                <span className="flex items-center gap-1.5 text-base text-white/60">
                  <Check className="text-accent" />
                  14-day money-back guarantee
                </span>
              </div>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">
                The kit fixes your site so machines can read it. It cannot rewrite what a
                model already remembers about you; that follows from what gets written about
                you once the site is readable.
              </p>
            </div>

            <PackageMockup />
          </div>
        </div>
      </section>

      {/* Step 13: everything inside, counted. Where the sale is made. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            What&rsquo;s in the AI Fix Kit (&euro;49): 9 deliverables from 8 measured signals
          </h2>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-black/60">
            Everything measured on your domain, sent by email within minutes of payment.
          </p>

          <ul className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-xl font-bold text-accent">
                  {item.count}
                </span>
                <div>
                  <p className="text-lg font-bold text-black">{item.title}</p>
                  <p className="mt-0.5 text-base leading-relaxed text-black/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl bg-black p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold leading-relaxed text-white">
              Built so your developer can start on the most damaging problem the day it
              arrives.
            </p>
            <a
              href="/audit-kit/Sample-AI-Fix-Kit-Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg border-2 border-accent px-5 py-2.5 text-base font-bold text-accent transition hover:bg-accent hover:text-black"
            >
              Open a real sample report
            </a>
          </div>
        </div>
      </section>

      {/* Steps 10 and 4: who it is for, and what it does not require. */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black">Who it is for</h2>
            <ul className="space-y-3">
              {WHO_FOR.map((who) => (
                <li key={who} className="flex items-start gap-3 text-lg text-black/75">
                  <Check className="mt-1.5 h-5 w-5 text-black" />
                  {who}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black">
              It requires <span className="underline decoration-accent decoration-4 underline-offset-4">no</span>
            </h2>
            <ul className="space-y-3">
              {REQUIRES_NO.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-black/75">
                  <Cross className="mt-1.5 h-5 w-5 text-black/40" />
                  <span>
                    <span className="font-bold text-black">No</span> {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base text-black/55">
              The scan reads your site from outside, the same way an AI crawler does.
            </p>
          </div>
        </div>
      </section>

      {/* Step 11: how it works, from above, three steps. */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-4xl font-bold tracking-tight text-white sm:text-5xl">How it works</h2>
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Step n="1" title="Enter your domain">
              In 30 seconds you see your score, what the OpenAI and Anthropic models say
              about your company from memory, and your two weakest signals. Free.
            </Step>
            <Step n="2" title="Get the AI Fix Kit">
              Pay &euro;49 once. The PDF and the implementation kit arrive by email within
              minutes, measured on your domain.
            </Step>
            <Step n="3" title="Hand it to your developer">
              They take the tasks in order, paste the prompts, fill in the templates and tick
              the 10 checks. The site becomes readable to AI.
            </Step>
          </ol>
        </div>
      </section>

      {/* Step 12: the question everyone asks. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-black">
            &ldquo;My site ranks in Google. Why would AI be blocked?&rdquo;
          </h2>
          <p className="text-lg leading-relaxed text-black/75">
            Because Google and AI crawlers read sites differently. A robots.txt rule written
            years ago can turn OAI-SearchBot and Claude-SearchBot away while Googlebot walks in. Text that
            loads through JavaScript reaches a browser and Google, but not most AI crawlers.
            You will not see either problem by opening your own site. The scan does, on a
            live request.
          </p>
        </div>
      </section>

      {/* What is actually measured: the 8 signals, in the open. */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-black">The 8 signals the scan measures</h2>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
            {SCAN_METRICS.map((metric, i) => (
              <li key={metric.name} className="flex items-start gap-4">
                <span className="w-6 shrink-0 pt-0.5 text-base font-bold text-black/35">{i + 1}</span>
                <p className="text-base leading-relaxed text-black/70">
                  <span className="font-semibold text-black">{metric.name}.</span> {metric.how}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Step 15: the second question, answered straight. */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-black">
            &ldquo;Will this get me recommended by ChatGPT?&rdquo;
          </h2>
          <p className="text-lg leading-relaxed text-black/75">
            No one can promise that, and we don&rsquo;t. What the scan shows is what stops
            machines from reading your site at all. Fixing that is the necessary first step.
            It is not a guarantee of anything after it, and anyone who sells it as one is
            selling something else. Two things are measured here and they are different: the
            readiness score is about your site; what the models say from memory is about
            their training, which no site fix rewrites directly.
          </p>
        </div>
      </section>

      {/* Step 19: against the alternatives. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-black">Compared with the alternatives</h2>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {COMPARISON.map((row) => (
              <div
                key={row.option}
                className={`grid grid-cols-1 gap-1 py-5 sm:grid-cols-[220px_190px_1fr] sm:gap-6 ${
                  row.us ? "-mx-4 rounded-2xl bg-accent px-4" : ""
                }`}
              >
                <p className={`text-lg font-bold ${row.us ? "text-black" : "text-black/60"}`}>{row.option}</p>
                <p className={`text-base font-semibold ${row.us ? "text-black" : "text-black/60"}`}>{row.cost}</p>
                <p className={`text-base leading-relaxed ${row.us ? "font-semibold text-black" : "text-black/65"}`}>
                  {row.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps 7–8: proof of competence from real scans, with the numbers they produced. */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Recently scanned
          </h2>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/65">
            The last three sites through the scan, what it found, and the score before the
            fixes. The after-scores go here once the fixes are live.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PROVEN_ON.map((site) => (
              <div
                key={site.domain}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex h-12 items-center">
                  {site.logo ? (
                    <Image
                      src={site.logo}
                      alt={site.domain}
                      width={200}
                      height={48}
                      className="h-12 w-auto rounded-md"
                    />
                  ) : (
                    <span className="text-2xl font-bold tracking-tight text-white">{site.domain}</span>
                  )}
                </div>
                <p className="mt-3 text-base text-white/60">
                  {site.domain} &middot; {site.who}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">{site.score}</span>
                  <span className="text-lg text-white/40">/100 before fixes</span>
                </div>
                <p className="mt-5 text-base font-bold text-accent">What the scan found</p>
                <ul className="mt-3 space-y-2.5">
                  {site.found.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-base leading-relaxed text-white/80">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base text-white/60">
            Scanned with the owners&rsquo; agreement, methodology v1, the same 8 checks you get.
            Each domain can be re-run live at any time from the form above. What the owners
            say about the result is added here in their own words once the fixes are live.
          </p>
        </div>
      </section>

      {/* Step 20: the author. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr]">
            <Image
              src="/images/sergei-desk.png"
              alt="Sergei Ponomarev"
              width={224}
              height={224}
              className="h-56 w-56 rounded-3xl object-cover"
            />
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black">Who built this</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/75">
                <span className="font-bold text-black">Sergei Ponomarev</span> runs aibusiness.vc,
                a site read by ChatGPT and Claude every day, and built this scan to answer one
                question about it: can the assistants actually read us? The same 8 checks run
                on aibusiness.vc after every change.
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <li className="rounded-2xl bg-black p-4">
                  <p className="text-2xl font-bold text-accent">7 years</p>
                  <p className="mt-1 text-base text-white/70">of service standards, evaluation and test purchases</p>
                </li>
                <li className="rounded-2xl bg-black p-4">
                  <p className="text-2xl font-bold text-accent">8 signals</p>
                  <p className="mt-1 text-base text-white/70">measured live on your domain</p>
                </li>
                <li className="rounded-2xl bg-black p-4">
                  <p className="text-2xl font-bold text-accent">Founder</p>
                  <p className="mt-1 text-base text-white/70">of AI Business, and answers the email himself</p>
                </li>
              </ul>
              <Link href="/sergei-ponomarev" className="mt-6 inline-block text-base font-semibold text-black underline decoration-accent decoration-2 underline-offset-4">
                About Sergei
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step 21: the full FAQ, open, where the sale closes. */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">Questions people ask before they buy</h2>
          <p className="mb-12 text-xl text-black/60">Every one we have been asked, answered straight.</p>
          <dl className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="border-t border-black/10 pt-5">
                <dt className="text-xl font-bold text-black">{f.q}</dt>
                <dd className="mt-3 text-base leading-relaxed text-black/70">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Steps 24 and 6 again: one outcome, the same single action. */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Check your site in 30 seconds.
          </h2>
          <p className="mb-8 text-xl text-white/70">
            Free result now. The AI Fix Kit is &euro;49 once, with a 14-day refund, no questions asked.
          </p>
          <UrlAuditForm />
        </div>
      </section>
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-bold text-black">
        {n}
      </span>
      <p className="mt-4 text-xl font-bold text-white">{title}</p>
      <p className="mt-2 text-base leading-relaxed text-white/65">{children}</p>
    </li>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.2 3L13 4.5" />
    </svg>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/**
 * The paid package shown as what actually lands in the inbox: the PDF and the
 * archive with its real file names, for a placeholder domain.
 */
function PackageMockup() {
  const kit: readonly string[] = [
    "Task list with hours",
    "8 ready prompts",
    "3 schema templates",
    "llms.txt draft",
    "Agent Card",
    "Implementation guide",
    "10 QA checks",
  ];
  return (
    <div className="rounded-3xl bg-accent p-7 shadow-2xl shadow-black/60">
      <p className="text-sm font-bold uppercase tracking-wider text-black/70">AI Fix Kit</p>
      <p className="mt-1 text-3xl font-bold leading-tight text-black">What you get for yourcompany.com</p>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl bg-black px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">The report, PDF</p>
          <p className="mt-1 text-lg font-bold text-white">8 scores, measured on your domain</p>
        </div>
        <div className="rounded-2xl bg-black px-5 py-4">
          <p className="text-sm font-bold uppercase tracking-wider text-accent">The implementation kit, ZIP</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {kit.map((item) => (
              <li key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-base font-semibold text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
