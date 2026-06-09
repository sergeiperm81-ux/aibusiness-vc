import type { Metadata } from "next";
import { CopyBrief } from "@/components/CopyBrief";

const SUBMIT_EMAIL = "info@aibusiness.vc";
const MAILTO = `mailto:${SUBMIT_EMAIL}?subject=Submit%20Your%20Story%20%E2%80%94%20%5BYour%20company%5D`;

export const metadata: Metadata = {
  title: "Submit Your Story — Free Feature for AI Companies",
  description:
    "Building or implementing AI? Tell your story on AI Business and get featured for free. Answer 7 questions, email us, and we publish — with a link back to your project.",
  alternates: { canonical: "/submit-your-story" },
};

const BRIEF = `Answer these 7 questions as a written interview — in your own voice, first person.
We'll shape your answers into a published interview, so just reply naturally — no need to polish the writing.

1. Who you are — Company or project name, what you do in one line, who's behind it, and where you're based.

2. The problem you solve — What pain you tackle, for whom, and why it matters now.

3. Where AI sits at the core — How exactly AI powers what you do: which models, tech, or approach. Be specific. AI must be central to your story.

4. What makes you different — Your edge versus the alternatives; what you do that others don't.

5. Proof and traction — Real results: users, revenue, growth, pilots, partnerships, funding. Concrete numbers wherever you can share them.

6. A story or a lesson — One real moment, hard decision, or insight from building this. The human part — it's what makes a feature worth reading.

7. What's next, and how to engage — Your roadmap, what you're looking for (customers, partners, hires, investors), and your single project link.

RULES
- Write in English, ~600–900 words (about 2–3 pages).
- AI must be at the centre of your story — product, implementation, or research.
- One link to your project (no more).
- One photo, attached to the email (not huge — about 1200px wide is plenty). Tell us who to credit for it (photographer or source).
- Tell us the founder's or author's full name and role, so we credit you correctly.

Send your story to: ${SUBMIT_EMAIL}`;

const NOT_FOR = [
  "Gambling, casinos, betting.",
  "Alcohol, tobacco, vaping.",
  "Adult content.",
  "Weapons.",
  "Crypto token schemes, pump-and-dump, or “guaranteed returns” offers.",
  "Thinly disguised ads with no real substance.",
];

export default function SubmitYourStoryPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Submit Your Story
          </p>
          <h1 className="mb-4 text-3xl sm:text-4xl font-bold leading-tight text-white">
            Building or implementing AI? <span className="text-accent">Get featured — free.</span>
          </h1>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/70">
            AI Business publishes the stories of companies, startups, research labs, and media
            doing real work with AI. The format is a written interview: you answer a few questions
            in your own words, send them to us, and we shape your answers into a polished interview
            and publish it — at no cost, with a link to your project. The only hard rule: AI has to
            be at the heart of what you do.
          </p>
          <a
            href={MAILTO}
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
          >
            Email your story to {SUBMIT_EMAIL} &rarr;
          </a>

          {/* Audience / why it's worth it */}
          <div className="mt-8 rounded-xl border border-card-border bg-card-bg p-5">
            <p className="text-sm leading-relaxed text-white/80">
              <strong className="text-white">Why it's worth it:</strong> AI Business draws{" "}
              <strong className="text-accent">3,000+ visits a month and growing</strong>, with a
              focused audience of operators, founders, and investors. And the site is engineered for{" "}
              <strong className="text-white">SEO and AI-search (GEO)</strong> visibility — so your
              feature keeps earning search traffic and AI citations long after it's published, not
              just on day one.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* How it works */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><strong>1.</strong> Copy the questions below and answer them in your own words, first person — like a written interview. Just connected text, no form to fill in.</li>
              <li><strong>2.</strong> Email your answers, with one photo attached, to <a href={MAILTO} className="text-amber-600 font-semibold hover:underline">{SUBMIT_EMAIL}</a>.</li>
              <li><strong>3.</strong> We review and shape your answers into a clean interview, and may come back with a couple of follow-up questions to confirm details. We may decline pieces that don&rsquo;t fit our editorial policy.</li>
              <li><strong>4.</strong> We publish it as a <em>Partner Story</em> interview — crediting you and linking to your project. That&rsquo;s it.</li>
            </ol>
          </div>

          {/* Copyable brief */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Answer these 7 questions &mdash; we&rsquo;ll turn them into your interview</h2>
            <p className="text-sm text-gray-500 mb-4">
              Copy the whole brief in one click, paste it into your doc, and answer in your own words.
              We&rsquo;ll shape your answers into a published interview &mdash; no need to polish the writing yourself.
            </p>
            <CopyBrief text={BRIEF} />
          </div>

          {/* What we don't feature */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">What we don&rsquo;t feature</h2>
            <ul className="space-y-2">
              {NOT_FOR.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              We reserve the right to decline any submission at our editorial discretion.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-2">How Partner Stories are labelled</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every submission is published as a <strong>Partner Story</strong>, clearly marked. The
              views, claims, and figures belong to the featured company or contributor; AI Business
              does not independently verify them and does not endorse the company. No payment is
              exchanged. The link to the project is provided for readers&rsquo; convenience.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready?</h2>
            <p className="text-sm text-gray-600 mb-4">Send your story — or a quick hello with a question — to our editor.</p>
            <a
              href={MAILTO}
              className="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
            >
              Email {SUBMIT_EMAIL} &rarr;
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
