import type { Metadata } from "next";

const SUBMIT_EMAIL = "info@aibusiness.vc";
const MAILTO = `mailto:${SUBMIT_EMAIL}?subject=Submit%20Your%20Story%20%E2%80%94%20%5BYour%20company%5D`;

export const metadata: Metadata = {
  title: "Submit Your Story — Free Feature for AI Companies",
  description:
    "Building or implementing AI? Tell your story on AI Business and get featured for free. Answer 7 questions, email us, and we publish — with a link back to your project.",
  alternates: { canonical: "/submit-your-story" },
};

const QUESTIONS: { q: string; hint: string }[] = [
  {
    q: "1. Who you are",
    hint: "Company or project name, what you do in one line, who's behind it, and where you're based.",
  },
  {
    q: "2. The problem you solve",
    hint: "What pain you tackle, for whom, and why it matters now.",
  },
  {
    q: "3. Where AI sits at the core",
    hint: "How exactly AI powers what you do — what it does, which models, tech, or approach you use. Be specific. (This is the one non-negotiable: AI must be central to your story.)",
  },
  {
    q: "4. What makes you different",
    hint: "Your edge versus the alternatives — what you do that others don't.",
  },
  {
    q: "5. Proof and traction",
    hint: "Real results: users, revenue, growth, pilots, partnerships, funding. Concrete numbers wherever you can share them.",
  },
  {
    q: "6. A story or a lesson",
    hint: "One real moment, hard decision, or insight from building this. The human part — it's what makes a feature worth reading.",
  },
  {
    q: "7. What's next, and how to engage",
    hint: "Your roadmap, what you're looking for (customers, partners, hires, investors), and your single project link as the call to action.",
  },
];

const RULES = [
  "Write in English, roughly 600–900 words (about 2–3 pages).",
  "AI must be at the centre of your story — product, implementation, or research.",
  "Include exactly one link to your project (no more).",
  "Sign it: give us the author's full name and role for the byline.",
  "After we publish, share the article on your own channels with a link back to AI Business.",
];

const NOT_FOR = [
  "Agencies or dev shops selling AI build/implementation services for hire (“we'll build AI for you”). Tell your own story — don't advertise services.",
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
            doing real work with AI. Tell us yours, and we'll feature it — at no cost, with a link
            back to your project. The only hard rule: AI has to be at the heart of what you do.
          </p>
          <a
            href={MAILTO}
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-95"
          >
            Email your story to {SUBMIT_EMAIL} &rarr;
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* How it works */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><strong>1.</strong> Write your story as answers to the 7 questions below (just a connected text — no form to fill in).</li>
              <li><strong>2.</strong> Email it to <a href={MAILTO} className="text-amber-600 font-semibold hover:underline">{SUBMIT_EMAIL}</a>.</li>
              <li><strong>3.</strong> We review and lightly edit it. We may decline pieces that don't fit our editorial policy.</li>
              <li><strong>4.</strong> We publish it as a <em>Partner Story</em> — with your byline and your one link.</li>
              <li><strong>5.</strong> You share the published article on your channels with a link back to us. A simple, free exchange.</li>
            </ol>
          </div>

          {/* The 7 questions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Write your story around these 7 questions</h2>
            <p className="text-sm text-gray-500 mb-5">Cover all seven in your own words. No need to label them — a natural, readable flow is best.</p>
            <div className="space-y-4">
              {QUESTIONS.map((item) => (
                <div key={item.q} className="rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900">{item.q}</h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">A few simple rules</h2>
            <ul className="space-y-2">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {r}
                </li>
              ))}
            </ul>
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
              Every submission is published as a <strong>Partner Story</strong>, clearly marked and
              carrying the author&rsquo;s byline. The views, claims, and figures are the author&rsquo;s
              own; AI Business does not independently verify them and does not endorse the company.
              No payment is exchanged. The link to your project is provided for readers&rsquo;
              convenience.
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
