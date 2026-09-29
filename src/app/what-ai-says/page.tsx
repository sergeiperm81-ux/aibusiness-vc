import Link from "next/link";
import type { Metadata } from "next";
import { RequestForm } from "./RequestForm";
import { getDiagnosticCheckoutUrl } from "@/lib/what-ai-says/checkout";

const SITE = "https://aibusiness.vc";
/**
 * One price, in euros, and it is deliberately low.
 *
 * At this level the decision is an impulse rather than a procurement exercise:
 * nobody assembles a comparison to spend it. The run itself costs cents, so the
 * margin survives the price.
 */
const PRICE_EUR = 49;

export const metadata: Metadata = {
  title: "What AI Says About You",
  description:
    "We put the questions your customers ask about your company to the OpenAI and Anthropic APIs with web search on, send you every answer word for word, show where they disagree with your own website, and tell you what to correct first.",
  alternates: { canonical: "/what-ai-says" },
  openGraph: {
    title: "What AI Says About You",
    description:
      "Every answer word for word, every disagreement with your site, and the list of what to change first.",
    url: `${SITE}/what-ai-says`,
    type: "website",
  },
};

/**
 * The six questions, shown in full on the page.
 *
 * Publishing them costs nothing and settles the first objection a sceptic has, which is
 * that this is a black box with a price on it. The last one is the only question that
 * never says the buyer's name.
 */
const QUESTIONS = [
  "What does [your company] do?",
  "Who founded or runs [your company], and where is it based?",
  "What does [your product] do, and who is it for?",
  "Is [your product] free, subscription-based, or paid for in another way, and what does it cost?",
  "How does a customer contact [your company]?",
  "Which [companies, websites or apps, whichever you are] would you recommend for [what you want to be found for] in [your market]?",
];

const DELIVERABLE = [
  {
    title: "What was asked, and when",
    body: "The exact questions, both systems, the models, the dates and times, one fresh request each. You can ask the same questions again yourself. Expect different wording each time: these systems never answer identically twice.",
  },
  {
    title: "What each system said, word for word",
    body: "Twelve answers, unedited and unsummarised, in an appendix. This is the part people forward to their team.",
  },
  {
    title: "Where it disagrees with your site",
    body: "A table: the claim, which system made it, what your site says today, and whether that makes it correct, outdated, unsupported or simply absent.",
  },
  {
    title: "Where each wrong statement comes from",
    body: "Named page and line wherever it can be traced. Where it cannot be traced, the report says so rather than guessing.",
  },
  {
    title: "What to change, in order",
    body: "Exact page, exact replacement wording, most damaging first. Written so a marketer can paste it, not so a developer has to interpret it.",
  },
  {
    title: "The script, so you can do it again without me",
    body: "The questions and the procedure. Run it yourself in two weeks and see what moved. No subscription, no login, nothing to cancel.",
  },
];

const SYMPTOMS = [
  "You changed your prices months ago and have no idea which systems still quote the old ones.",
  "You discontinued a product and it is still being described as current.",
  "Your name is close to a bigger company's and you have never checked whether a machine tells them apart.",
  "Your contact details are on the site, but you have never asked whether an assistant can actually find them.",
  "Someone asked an AI for your kind of product and you have no idea whether you came up at all.",
];

const OBJECTIONS = [
  {
    q: "Can I not just ask ChatGPT myself?",
    a: "Yes, and you should. The questions are printed on this page for exactly that reason. What takes the time is not the asking. It is checking each answer against what your site actually says today, finding the page the wrong claim grew out of, and writing the correction. On my own site the questions took five minutes and the verification took the rest of the morning.",
  },
  {
    q: "Will this make AI recommend my company?",
    a: "I cannot promise that and I will not. I have evidence that answers about a named company can be corrected. I have no evidence that anyone can be inserted into a recommendation when the question never mentions them. The report tells you where you stand on that question. It does not sell you a place.",
  },
  {
    q: "What if you find nothing?",
    a: "Then you get a report that says so, with the answers that prove it, and you have a dated record that your public facts hold up. That is a real result. It has never happened yet, including on my own site, which passes every technical check I sell.",
  },
  {
    q: "Is this SEO?",
    a: "No. SEO is about where you rank on a page of links. This is about what a machine states as fact when someone asks about you, which is a different failure with different causes. Some of the fixes overlap. Most do not.",
  },
  {
    q: "Do you publish what you find?",
    a: "Never, unless you ask me to in writing. The findings go to you and nowhere else. If a case study would help you, we can agree one separately and anonymise it.",
  },
];

function Schema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/what-ai-says#service`,
    name: "What AI Says About You",
    serviceType: "AI answer diagnostic",
    url: `${SITE}/what-ai-says`,
    provider: { "@id": `${SITE}/#organization` },
    description:
      "Six questions about a named company and its principal product are put to the OpenAI and Anthropic APIs with web search enabled, one fresh request each. Every answer is recorded word for word and compared against the company's current website, each statement is marked correct, outdated, unsupported or absent, sources are traced where they can be, and the report returns a prioritised list of corrections plus the script to repeat the check.",
    areaServed: ["US", "EU"],
    offers: {
      "@type": "Offer",
      price: String(PRICE_EUR),
      priceCurrency: "USD",
      description:
        "One company and one principal product, one market, one language. Delivered within three working days. Monitoring, dashboards and retainers are not part of this and are not offered.",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function WhatAiSaysPage() {
  const checkoutUrl = getDiagnosticCheckoutUrl();

  return (
    <section className="bg-white">
      {/* Hero */}
      <div className="bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent">
            A diagnostic, not a dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Your customers are asking an AI about you. You have never seen the answers.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            I put the questions your customers ask to the OpenAI and Anthropic APIs, send
            you every answer word for word, show you where they contradict your own
            website, and tell you what to correct first.
          </p>
          <p className="mt-5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold leading-relaxed text-accent">
            Built for founder-led software and AI companies with one principal product
            and customers in the US or Europe.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#request"
              className="inline-block rounded-lg bg-accent px-7 py-3.5 text-center text-base font-bold text-black transition hover:bg-accent-hover"
            >
              Start with a free check
            </a>
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                className="inline-block rounded-lg border-2 border-white/25 px-7 py-3.5 text-center text-base font-bold text-white transition hover:border-white/50"
              >
                Order the check, €{PRICE_EUR}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* Symptoms */}
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          This is for you if any of these is true
        </h2>
        <ul className="mt-6 space-y-3">
          {SYMPTOMS.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base leading-relaxed text-gray-800"
            >
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* The wrong assumption */}
        <div className="mt-14 rounded-2xl border-2 border-gray-900 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            A clean website does not mean clean answers
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
            <p>
              This is the part people get backwards. The assumption is that if the site is
              correct, the machines will be correct. They are not reading only your site.
              They are reading an index, and an index remembers.
            </p>
            <p>
              I build a technical audit for a living and my own site passes every check in
              it. That is precisely why I had never asked this question. When I did, one
              system had placed my company in the wrong country and given a different
              publisher&apos;s address as mine. Another quoted a price I had deleted weeks
              earlier. Not one of them could say how to contact me.
            </p>
            <p className="font-semibold text-gray-900">
              None of that was visible from inside my own site, and nothing I owned could
              have told me.
            </p>
          </div>
        </div>

        {/* Questions */}
        <h2 className="mt-14 text-2xl font-bold text-gray-900 sm:text-3xl">
          The six questions
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          Asked on both systems, in a fresh request every time, so one answer cannot feed
          the next. They are printed here so you can see there is no black box.
        </p>
        <ol className="mt-6 space-y-3">
          {QUESTIONS.map((question, index) => (
            <li
              key={question}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3.5"
            >
              <span className="font-mono text-sm font-bold text-amber-600">{index + 1}</span>
              <span className="text-base leading-relaxed text-gray-800">{question}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
          The sixth is the one that never says your name. It asks for your kind of product
          and reports, word for word, whoever came up instead of you.
        </p>

        {/* The object under test, named exactly. Calling this "ChatGPT and Claude"
            would be naming a different thing: the apps add their own instructions
            and remember individual users, so no two readings of them can be
            compared. The API is the part that can be re-run. */}
        <div className="mt-6 rounded-xl border-2 border-gray-900 bg-white px-5 py-4">
          <p className="text-sm font-bold text-gray-900">What exactly gets asked</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            The OpenAI and Anthropic APIs, with web search switched on, so the answers
            reflect what your site says today and not only what a model remembers. Two
            systems, six questions, twelve answers. These are the APIs, not the ChatGPT and
            Claude apps: the apps add their own instructions and remember each user, so two
            people can be shown two different answers. You can put the same questions to the
            APIs again, but do not expect the same words back: these systems never answer
            identically twice. What is worth comparing between two readings is the
            substance, not the phrasing. Google, Perplexity and the rest are outside this
            check, and the report says so.
          </p>
        </div>

        {/* Deliverable */}
        <h2 className="mt-14 text-2xl font-bold text-gray-900 sm:text-3xl">
          What lands in your inbox
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          One document, within three working days. Six parts.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DELIVERABLE.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="mt-14 rounded-2xl bg-accent p-6 sm:p-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black">
            One price
          </p>
          <p className="mt-3 text-5xl font-bold text-black">&euro;{PRICE_EUR}</p>
          <div className="mt-4 space-y-3 text-base leading-relaxed text-black/80">
            <p className="text-black">
              One company and one principal product, one market, one language. Three
              working days. Paid once.
            </p>
            <p>
              There is no subscription, no dashboard and no account. More than one product,
              market or language is quoted separately, because it is more work and pretending
              otherwise would mean someone is overpaying.
            </p>
          </div>
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              className="mt-6 inline-block rounded-lg bg-gray-950 px-7 py-3.5 text-base font-bold text-white transition hover:bg-gray-800"
            >
              Order the diagnostic &rarr;
            </a>
          )}
        </div>

        {/* Free check + form */}
        <div id="request" className="mt-14 scroll-mt-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Step one is free</h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-800">
            <p>
              Fill this in and I will ask one system one question about your company, check
              the answer against your site, and send you what I find. One real answer, one
              verified agreement or disagreement. Not a score.
            </p>
            <p className="font-semibold text-gray-900">
              I do five of these a week, by hand. If the week is full I will tell you so
              rather than leave you waiting.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border-2 border-gray-200 bg-white p-6 sm:p-8">
            <RequestForm />
          </div>
        </div>

        {/* Objections */}
        <h2 className="mt-14 text-2xl font-bold text-gray-900 sm:text-3xl">
          The awkward questions
        </h2>
        <div className="mt-6 space-y-4">
          {OBJECTIONS.map((item) => (
            <div key={item.q} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
              <h3 className="text-base font-bold text-gray-900">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Limits */}
        <div className="mt-14 rounded-2xl bg-gray-950 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">What this is not</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            It is not monitoring, and there is nothing recurring to buy. It is not a
            visibility score. It is not a guarantee that an answer will change, because
            that is not mine to give. It will not tell you the origin of every claim: some
            answers have no traceable source, and the report says which ones.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-300">
            What it gives you is a dated record of what these systems told the world about
            your company on one day, and the shortest path to correcting what is wrong.
          </p>
          <Link
            href="/library"
            className="mt-5 inline-block text-sm font-bold text-accent hover:underline"
          >
            The methods behind this are free in the library &rarr;
          </Link>
        </div>
      </div>

      <Schema />
    </section>
  );
}
