import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CopyBrief } from "@/components/CopyBrief";
import { ContactEmail } from "@/components/ContactEmail";
import { getAllArticles } from "@/lib/articles";

const SUBMIT_EMAIL = "info [at] aibusiness.vc";
const SUBMIT_SUBJECT = "Submit Your Story: [your company]";

/**
 * The published Partner Stories, newest first.
 *
 * They are identified by the label every one of them carries in its opening
 * line rather than by a list kept here, so a new story appears in this block
 * the moment it is published and nothing has to be edited twice.
 */
function recentPartnerStories(limit: number) {
  return getAllArticles()
    .filter((meta) => meta.story === "partner")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

function fmtStoryDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

8. How did you hear about us? (optional, not published) — Who recommended that you submit a story, or where did you come across AI Business? If a founder we have featured sent you here, give us their name: we credit them on your story page with a link to theirs.

RULES
- Write in English, ~600–1,000 words (about 2–3 pages).
- AI must be at the centre of your story — product, implementation, or research.
- Your project link must publicly show the AI you describe. If your site doesn't mention the AI features you're telling us about, send us a page, screenshot, or demo that does — we can't point readers to a link where they'll find no AI.
- Be specific about the technology: which models, services, or approach do the actual work. One concrete paragraph beats a page of "AI-powered".
- One link to your project (no more).
- One photo, attached to the email (not huge — about 1200px wide is plenty). Tell us who to credit for it (photographer or source).
- Tell us the founder's or author's full name and role, so we credit you correctly.

Send your story to: ${SUBMIT_EMAIL}`;

const FORWARD = `Subject: Free feature for [company] on AI Business

Hi [Name],

Came across this and thought of you. AI Business runs free written interviews with founders building AI products. You answer seven questions in your own words, email them in, and they publish it with a link to your project. No payment, no catch. They just want real AI stories.

I think [company] would fit. Here is the brief: https://aibusiness.vc/submit-your-story

If they ask who sent you, say it was me.

[Your name]`;

const QUESTIONS = [
  ["01", "Who you are", "Company or project name, what you do in one line, who's behind it, and where you're based."],
  ["02", "The problem you solve", "What pain you tackle, for whom, and why it matters now."],
  ["03", "Where AI sits at the core", "How exactly AI powers what you do: which models, tech, or approach. Be specific — AI must be central."],
  ["04", "What makes you different", "Your edge versus the alternatives; what you do that others don't."],
  ["05", "Proof and traction", "Real results: users, revenue, growth, pilots, partnerships, funding. Concrete numbers wherever you can."],
  ["06", "A story or a lesson", "One real moment, hard decision, or insight from building this. The human part — it's what makes a feature worth reading."],
  ["07", "What's next", "Your roadmap, what you're looking for (customers, partners, hires, investors), and your single project link."],
];

const STEPS = [
  ["1", "Answer in your own words", "Copy the questions below and reply first person, like a written interview. Just connected text — no form to fill in."],
  ["2", "Email it to us", `Send your answers with one photo attached to ${SUBMIT_EMAIL}.`],
  ["3", "We shape and check it", "We turn your answers into a clean interview and may come back with a couple of follow-ups to confirm details."],
  ["4", "We publish it", "As a Partner Story interview — crediting you and linking to your project. That's it."],
];

const RULES = [
  ["English, ~600–1,000 words", "About two to three pages. Long enough to say something, short enough to be read."],
  ["AI at the centre", "Product, implementation, or research — but AI has to be the heart of it, not a mention."],
  [
    "Your link must show the AI",
    "If your site doesn't mention the AI features you describe, send a page, screenshot, or demo that does. We can't point readers to a link where they'll find no AI.",
  ],
  [
    "Be specific about the tech",
    "Which models, services, or approach do the actual work. One concrete paragraph beats a page of “AI-powered”.",
  ],
  ["One project link", "No more. It goes in the piece for readers' convenience."],
  ["One photo", "Attached to the email, ~1200px wide is plenty. Tell us who to credit — photographer or source."],
  ["Your full name and role", "So we credit the founder or author correctly."],
];

const NOT_FOR = [
  "Gambling, casinos, betting.",
  "Alcohol, tobacco, vaping.",
  "Adult content.",
  "Weapons.",
  "Crypto token schemes, pump-and-dump, or “guaranteed returns” offers.",
  "Thinly disguised ads with no real substance.",
];

export default function SubmitYourStoryPage() {
  const stories = recentPartnerStories(3);
  return (
    <>
      {/* Black header */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Submit Your Story
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Building or implementing AI?{" "}
            <span className="text-accent">Get featured — free.</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            AI Business publishes the stories of companies, startups, research labs, and media doing
            real work with AI. The format is a written interview: you answer a few questions in your
            own words, send them to us, and we shape your answers into a polished interview and
            publish it — at no cost, with a link to your project. The only hard rule: AI has to be at
            the heart of what you do.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent" />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <p className="text-2xl font-bold text-accent">Free</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                No charge, no payment accepted. Editorial decision only.
              </p>
            </div>
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <p className="text-2xl font-bold text-accent">5,000+</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                Visits a month and growing — operators, founders, investors.
              </p>
            </div>
            <div className="rounded-xl border border-card-border bg-card-bg p-5">
              <p className="text-2xl font-bold text-accent">GEO + SEO</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                You build AI. We make sure AI notices you: every story carries machine-readable
                data that ChatGPT and Perplexity can quote.
              </p>
            </div>
          </div>

          <ContactEmail
            subject={SUBMIT_SUBJECT}
            className="mt-8 inline-flex items-center rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-95"
          >
            Email your story to {SUBMIT_EMAIL} &rarr;
          </ContactEmail>
        </div>
      </section>

      {/* White body */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* How it works */}
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-gray-950">
                  {n}
                </span>
                <h3 className="mt-3 text-base font-bold text-gray-900">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{d}</p>
              </div>
            ))}
          </div>

          {/* The GEO layer: the strongest reason to be featured here */}
          <div className="mt-14 rounded-2xl bg-gray-950 p-6 sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
              The GEO layer
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
              You build AI. We make sure AI notices you.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
              Buyers increasingly ask ChatGPT and Perplexity what to use instead of searching.
              Those answers come from pages AI systems can read, parse and trust. Every story we
              publish ships with a citation layer most websites do not have:
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold text-accent">Your company as an entity</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  The article&rsquo;s structured data states, in machine-readable form: this story
                  is about your company, at your URL, with your founder&rsquo;s name. An AI engine
                  reading the page does not guess who you are. It is told.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold text-accent">A place in our llms.txt</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  The file AI crawlers read first on this site lists every featured company by
                  name, founder and website. Your story is on the map that machines navigate by.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold text-accent">Pages AI can actually read</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  Fast static HTML, clean headings, full schema markup. No JavaScript needed to
                  read your story, which is exactly how AI crawlers see the web.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-base font-bold text-accent">It already works</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  Readers arrive at this site from ChatGPT and Perplexity every week, and they
                  stay longer than visitors from any search engine. When AI answers a question
                  about your market, a citable interview is what gets quoted.
                </p>
              </div>
            </div>
          </div>

          {/* The 7 questions */}
          <h2 className="mt-14 text-2xl font-bold text-gray-900">
            The 7 questions we&rsquo;ll turn into your interview
          </h2>
          <p className="mt-2 max-w-3xl text-base text-gray-500">
            Answer in your own voice, first person. We shape your answers into a published interview
            — no need to polish the writing yourself.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {QUESTIONS.map(([n, t, d]) => (
              <div key={n} className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <span className="font-mono text-base font-bold text-amber-500">{n}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-gray-600">{d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Question 8: optional, never published */}
          <div className="mt-5 flex gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-5">
            <span className="font-mono text-base font-bold text-amber-500">08</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                How did you hear about us?{" "}
                <span className="text-sm font-semibold text-gray-500">(optional, not published)</span>
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-gray-600">
                Who recommended that you submit a story, or where did you come across AI Business?
                If a founder we have featured sent you here, give us their name: we credit them on
                your story page with a link to theirs.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-base font-semibold text-gray-700">
              Copy the whole brief in one click and paste it into your doc:
            </p>
            <CopyBrief text={BRIEF} />
          </div>

          {/* Rules */}
          <h2 className="mt-14 text-2xl font-bold text-gray-900">The rules, in short</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RULES.map(([t, d]) => (
              <div key={t} className="rounded-xl bg-gray-50 p-5">
                <h3 className="text-base font-bold text-gray-900">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{d}</p>
              </div>
            ))}
          </div>

          {/* What we don't feature */}
          <h2 className="mt-14 text-2xl font-bold text-gray-900">What we don&rsquo;t feature</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {NOT_FOR.map((r) => (
              <div key={r} className="flex items-start gap-2.5 text-base text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                {r}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            We reserve the right to decline any submission at our editorial discretion.
          </p>

          {/* Disclaimer */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-bold text-gray-900">How Partner Stories are labelled</h2>
            <p className="mt-2 text-base leading-relaxed text-gray-600">
              Every submission is published as a <strong>Partner Story</strong>, clearly marked. The
              views, claims, and figures belong to the featured company or contributor; AI Business
              does not independently verify them and does not endorse the company. No payment is
              exchanged. The link to the project is provided for readers&rsquo; convenience.{" "}
              <Link href="/about" className="font-semibold text-amber-600 hover:underline">
                Our editorial standards &rarr;
              </Link>
            </p>
          </div>

          {/* Proof: this actually gets published */}
          {stories.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-950">
                Recently published
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-black/70">
                This is what a Partner Story looks like once it is written up. All
                published free of charge, all read before publication by the company
                itself.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {stories.map((story) => (
                  <Link
                    key={`${story.section}/${story.slug}`}
                    href={`/${story.section}/${story.slug}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-accent"
                  >
                    {story.image && (
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={story.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-amber-600">
                        Partner Story &middot; {fmtStoryDate(story.date)}
                      </p>
                      <h3 className="mt-2 text-base font-bold leading-snug text-gray-950 group-hover:underline">
                        {story.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pass it on: a ready message for a founder the reader knows */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900">Know a founder who should be here?</h2>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-gray-600">
              Not your story to tell, but you know someone building with AI who deserves a feature?
              Copy the message below, put in their name, and send it. Thirty seconds. If they mention
              you when they submit, we credit you on their story page.
            </p>
            <div className="mt-5">
              <CopyBrief text={FORWARD} label="Message to forward" />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-accent p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-950">Ready?</h2>
            <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-black/75">
              Send your story — or just a quick hello with a question — to our editor. Every
              submission gets read.
            </p>
            <ContactEmail
              subject={SUBMIT_SUBJECT}
              className="mt-5 inline-flex items-center rounded-lg bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Email {SUBMIT_EMAIL} &rarr;
            </ContactEmail>
          </div>
        </div>
      </section>
    </>
  );
}
