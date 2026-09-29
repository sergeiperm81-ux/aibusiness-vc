import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UrlAuditForm } from "@/components/audit/UrlAuditForm";
import { ModelLogos } from "@/components/professional/ModelLogos";

/**
 * The AI Website Visibility landing page.
 *
 * One belief to shift: "my site ranks in Google, so AI can read it too".
 * It cannot always. The page says so in one line, shows what the check does,
 * counts what the kit contains, and asks for one action. Short on purpose:
 * every paragraph runs the full width of the page and nothing is longer
 * than a buyer would read standing up. Same black, white and yellow as the
 * two scans.
 */

const TITLE = "Is your site blocked for AI?";

export const metadata: Metadata = {
  title: "AI Website Visibility: Can AI Read Your Site? Free Check, AI Fix Kit €49",
  description:
    "Free check: can AI crawlers read a homepage. AI Fix Kit €49: what five AI models find when they look up the site with live search, and the fixes in order.",
  alternates: { canonical: "/audit" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/audit",
    siteName: "AI Business",
    title: TITLE,
    description: "Five AI models look up a site live. A site they cannot read loses in their answers. Free check, AI Fix Kit €49.",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "Five AI models look up a site live. A site they cannot read loses in their answers.",
  },
};

/** What the €49 kit contains, counted. Nine items, so the grid is three full rows. Mirrors src/lib/audit/fulfillment.ts. */
const INCLUDED: readonly { count: string; title: string; body: string }[] = [
  { count: "5", title: "AI models, live search", body: "ChatGPT, Claude, Gemini, Perplexity and Grok look up the site. What each found, and whether it cited your pages or other sites." },
  { count: "1", title: "PDF report", body: "Every technical sign measured on the homepage, with the number we found." },
  { count: "1", title: "task spreadsheet", body: "The fixes in order: one row per problem, with priority, owner and hours." },
  { count: "8", title: "ready prompts", body: "For Claude Code, Cursor or ChatGPT, each carrying your measured numbers." },
  { count: "3", title: "schema templates", body: "Organization, WebSite and FAQ markup, ready to fill in and paste." },
  { count: "1", title: "Agent Card", body: "Your company on one machine-readable page, drafted from your homepage." },
  { count: "1", title: "implementation guide", body: "Step by step, in Word, split into three sittings, for whoever does the work." },
  { count: "10", title: "QA checks", body: "A target for every weak sign, so you know when it is fixed." },
  { count: "1", title: "llms.txt draft", body: "Optional. Written for your domain, ready to try." },
];

/** The eight technical signs of the free check. Names only: the number is what the check shows. */
const SIGNALS: readonly string[] = [
  "AI crawler permission in robots.txt",
  "What an AI sees without JavaScript",
  "Schema markup",
  "Citation readiness",
  "Content structure",
  "Initial response",
  "HTTPS and security",
  "llms.txt (shown, not scored)",
];

const WHO_FOR: readonly string[] = [
  "You asked ChatGPT about your company and got nothing, or someone else",
  "Your site ranks in Google and you assumed AI reads it too",
  "A client or your boss asked “how do we show up in ChatGPT?”",
  "You are a developer handed the task with no spec",
];

/** Cheapest first. Subscription prices are the published entry tiers in September 2026 (Peec AI $95, Profound $99, Semrush AI Toolkit $99). */
const COMPARISON: readonly { option: string; cost: string; verdict: string; us?: boolean }[] = [
  {
    option: "Free SEO tools, or asking ChatGPT yourself",
    cost: "€0, your time",
    verdict: "Google’s view of the site, or one answer with no reason. Nothing measured, nothing written down to fix.",
  },
  {
    option: "AI Website Visibility + AI Fix Kit",
    cost: "€49 once",
    verdict: "Five AI models look the site up live, the homepage is measured, and the fixes are written for your developer. By email within minutes.",
    us: true,
  },
  {
    option: "AI visibility subscriptions",
    cost: "$95–$99 a month",
    verdict: "Peec AI, Profound, Semrush and the like track how often assistants mention you. Monthly, and the fixing is still on you.",
  },
];

/** Real checks, run with the owners’ agreement. Every number is the score the check produced that day. */
const PROVEN_ON: readonly { domain: string; logo?: string; who: string; checked: string; score: number; found: readonly string[] }[] = [
  {
    domain: "super.tennis",
    logo: "/images/audit/super-tennis.png",
    who: "A partner’s site",
    checked: "29 September 2026, with the five models",
    score: 92,
    found: [
      "4 of 5 AI models cited its own pages. Gemini described the Italian TV channel supertennis.tv instead.",
      "Claude also mixed in Nintendo’s Super Tennis game from Wikipedia.",
      "robots.txt misses Claude-SearchBot (87/100). This is the sample report above.",
    ],
  },
  {
    domain: "mylo.family",
    logo: "/images/audit/mylo-family.png",
    who: "A partner’s project",
    checked: "16 September 2026",
    score: 83,
    found: ["Heading hierarchy and section sizes need work (59/100).", "robots.txt names 2 of the 3 answer-engine bots (87/100).", "Neither model had any memory of the brand."],
  },
  {
    domain: "vntblack.com",
    logo: "/images/audit/vntblack.png",
    who: "A partner’s site",
    checked: "16 September 2026",
    score: 66,
    found: ["No structured data on the homepage (30/100).", "No robots.txt: the address answers with the homepage.", "Neither model had any memory of the brand."],
  },
];

/** The objections, said out loud, answered in two or three lines. */
const FAQS: readonly { q: string; a: string }[] = [
  {
    q: "My site ranks in Google. Why would AI be blocked?",
    a: "Google and AI crawlers read sites differently. A robots.txt rule from years ago can turn OAI-SearchBot and Claude-SearchBot away while Googlebot walks in, and text that loads through JavaScript reaches Google but not most AI crawlers. You cannot see either by opening your own site. The check can.",
  },
  {
    q: "Will this get me recommended by ChatGPT?",
    a: "No one can promise that, and we don’t. The check shows what stops AI from reading the site at all. Fixing that is the first step, not a guarantee of anything after it.",
  },
  {
    q: "What do I get for free?",
    a: "A readiness score, what two AI models remember about the site without search, your two weakest signs explained, and how many need work. The five live models are in the paid report.",
  },
  {
    q: "Do I need a developer?",
    a: "For most fixes, yes, and the kit is written for them: tasks with hours, prompts to paste into Claude Code or Cursor, templates to fill in. Hand it over and the work starts the same day.",
  },
  {
    q: "Can I check a client’s or a competitor’s site?",
    a: "Yes. Any public domain. The check reads only what any visitor or crawler can already see. Nothing is installed, no login is asked for.",
  },
  {
    q: "Is it a subscription? What if it tells me nothing new?",
    a: "No subscription. The check is free, the kit is €49 once, by email within minutes. If it tells you nothing new, use the 14-day refund, no questions asked. Every full-price kit comes with a code for 50% off up to 7 more checks: AI Person Scan, AI Company Scan or another site.",
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
    name: "AI Website Visibility: is your site blocked for AI?",
    serviceType: "Generative Engine Optimization audit",
    url: `${SITE_URL}/audit`,
    provider: { "@type": "Organization", name: "AI Business", url: SITE_URL },
    description:
      "Free check of whether AI crawlers can read a website, with a paid report in which five AI models look the site up with live search and the fixes are listed in order.",
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

      {/* Name, the belief to shift in two lines, one field, the price, the sample. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-4 text-base font-bold uppercase tracking-wider text-accent">AI Website Visibility</p>
          <h1 className="mb-6 text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {TITLE}
          </h1>
          <p className="mb-3 text-2xl font-bold leading-snug text-white">
            ChatGPT, Claude, Gemini, Perplexity and Grok answer with what they can read.{" "}
            <span className="text-accent">A site they cannot read loses in their answers.</span>
          </p>
          <p className="mb-8 text-xl leading-relaxed text-white/80">
            Free: whether AI crawlers can read the homepage. €49: what five AI models find when they look the site up live, and the fixes in order.
          </p>
          <UrlAuditForm />
          <p className="mt-6 text-lg font-bold text-white">
            Check <span className="text-accent">free</span> · AI Fix Kit <span className="text-accent">&euro;49</span> once ·{" "}
            <span className="text-accent">14-day</span> refund, no questions asked
          </p>
          <p className="mt-2 text-lg font-bold text-white/85">
            Bonus: <span className="text-accent">50% off</span> up to 7 more checks, AI Person Scan, AI Company Scan or another site, with every full-price kit.
          </p>
          <a
            href="/audit-kit/Sample-AI-Website-Visibility-Report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-lg font-bold text-white underline decoration-accent decoration-4 underline-offset-4 hover:text-accent"
          >
            See a sample report (PDF)
          </a>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <p className="mb-5 text-2xl font-bold text-white">
            Five AI models look the site up, <span className="text-accent">each searching the web live</span>
          </p>
          <ModelLogos />
          <p className="mb-5 mt-12 text-2xl font-bold text-white">
            The free check measures <span className="text-accent">8 technical signs</span> on the homepage
          </p>
          <ul className="flex flex-wrap gap-3">
            {SIGNALS.map((signal) => (
              <li key={signal} className="rounded-full border-2 border-white/20 px-4 py-2 text-base font-semibold text-white/85">
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Everything inside the kit, counted. Nine items, three full rows. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">What&rsquo;s in the AI Fix Kit</h2>
          <p className="mb-10 text-xl leading-relaxed text-black/65">
            Measured on your own domain and sent by email within minutes of payment. Built so your developer can start on the most damaging problem the day it arrives.
          </p>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((item) => (
              <li key={item.title} className="rounded-3xl bg-black p-7">
                <p className="text-xl font-bold text-accent">
                  {item.count} {item.title}
                </p>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-4xl font-bold tracking-tight text-black sm:text-5xl">How it works</h2>
          <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ["1", "Enter a website address", "Free: the readiness score, what two AI models remember about the site, and its two weakest signs."],
              ["2", "Get the AI Fix Kit", "€49 once. Five AI models look the site up with live search. The PDF and the kit arrive by email within minutes."],
              ["3", "Hand it to your developer", "They take the tasks in order, paste the prompts, fill in the templates and tick the 10 checks."],
            ].map(([n, title, body]) => (
              <li key={n} className="rounded-3xl bg-black p-7">
                <p className="text-4xl font-bold text-accent">{n}</p>
                <p className="mt-3 text-xl font-bold text-white">{title}</p>
                <p className="mt-2 text-lg leading-relaxed text-white/80">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* "Sound familiar?": the reader finds themself in one line. Yellow on black so it reads. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Sound familiar?</h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {WHO_FOR.map((who) => (
              <li key={who} className="rounded-2xl bg-accent px-6 py-5 text-xl font-bold leading-snug text-black">
                {who}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg text-white/70">
            No access to your site or CMS, nothing to install, no account, no call. The check reads the site from outside, the same way an AI crawler does.
          </p>
        </div>
      </section>

      {/* Real checks with the numbers they produced. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">Recently checked</h2>
          <p className="mb-10 text-xl leading-relaxed text-black/65">
            Three sites, what the check found, and the score before the fixes. Checked with the owners&rsquo; agreement.
          </p>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {PROVEN_ON.map((site) => (
              <div key={site.domain} className="flex flex-col rounded-3xl bg-black p-7">
                <div className="flex h-12 items-center">
                  {site.logo ? (
                    <Image src={site.logo} alt={site.domain} width={200} height={48} className="h-12 w-auto rounded-md" />
                  ) : (
                    <span className="text-2xl font-bold tracking-tight text-white">{site.domain}</span>
                  )}
                </div>
                <p className="mt-3 text-base text-white/60">
                  {site.domain} &middot; {site.who} &middot; {site.checked}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-accent">{site.score}</span>
                  <span className="text-lg text-white/50">/100 before fixes</span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {site.found.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-lg leading-relaxed text-white/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-black sm:text-4xl">Compared with the alternatives</h2>
          <ul className="grid grid-cols-1 gap-5">
            {COMPARISON.map((row) => (
              <li
                key={row.option}
                className={`grid grid-cols-1 gap-2 rounded-2xl px-6 py-5 md:grid-cols-[300px_180px_1fr] md:gap-6 ${row.us ? "bg-accent" : "bg-black"}`}
              >
                <p className={`text-xl font-bold ${row.us ? "text-black" : "text-accent"}`}>{row.option}</p>
                <p className={`text-lg font-bold ${row.us ? "text-black" : "text-white"}`}>{row.cost}</p>
                <p className={`text-lg leading-relaxed ${row.us ? "font-semibold text-black" : "text-white/80"}`}>{row.verdict}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The objections, out loud, on white, full width. Plain text reads; a wall of black cards does not. */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-black sm:text-4xl">Questions</h2>
          <dl className="divide-y divide-black/10">
            {FAQS.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="text-2xl font-bold text-black">{item.q}</dt>
                <dd className="mt-3 text-xl leading-relaxed text-black/75">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-lg text-black/70">
            Checking what AI says about a company or a person instead?{" "}
            <Link href="/company-scan" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              AI Company Scan
            </Link>
            ,{" "}
            <Link href="/professional-scan" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              AI Person Scan
            </Link>
            . All tools:{" "}
            <Link href="/ai-tools" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
              AI Tools
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-black sm:text-4xl">Check a site before AI answers for it</h2>
          <UrlAuditForm variant="yellow" />
        </div>
      </section>
    </>
  );
}
