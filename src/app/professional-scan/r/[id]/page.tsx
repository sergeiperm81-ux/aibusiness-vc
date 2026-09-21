import type { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import { PERSON_PROVIDER_IDS } from "@/lib/audit/answer-providers";
import { redisKv } from "@/lib/audit/durable-kv";
import { kickWorker } from "@/lib/audit/professional-kick";
import { loadPreview, type Preview } from "@/lib/audit/professional-preview";
import { providerConfigured } from "@/lib/audit/professional-runtime";
import { checkoutAvailability, type Availability } from "@/lib/audit/provider-health";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Person Scan: your free preview",
  robots: { index: false, follow: false },
};

/**
 * The free preview, the page where the sale is made.
 *
 * The reader has just seen themselves found, so they know the product and
 * need one reason to go on (Schwartz, level 4). The belief to move: "one
 * model found me, that is enough; I can ask the rest myself." So the page
 * shows what the other four and the report add, in their words, with the
 * one-click fact up front, and the bonus as something to give. It is never
 * blurred fake data: every card describes what the report really contains.
 *
 * Laid out to the site's own edges (the header's max-w-7xl), black band on
 * top for the find, white below for the offer.
 */
const GETS: readonly { title: string; body: string }[] = [
  {
    title: "Four more AI models",
    body: "OpenAI, Anthropic, Gemini and Grok answer about you too, each searching the web live. One click, not four accounts.",
  },
  {
    title: "Who you are, to AI",
    body: "Your background, education and certificates, what you are known for, and how people can reach you.",
  },
  {
    title: "What you do, to AI",
    body: "The role AI gives you today, the companies and projects it ties you to, and your latest posts, with dates.",
  },
  {
    title: "Red flags, checked",
    body: "Disputes, complaints, warnings and reviews: what each model found about you, and where it found it.",
  },
  {
    title: "Who AI confuses you with",
    body: "People with your name, with links to them, and every point where the models contradict each other.",
  },
  {
    title: "Recommendations",
    body: "5 to 7 steps, each saying exactly what to write and where, so the next person who asks is told the right things.",
  },
];

const CLOSED_MESSAGE: Readonly<Record<string, string>> = {
  provider_down: "One of the five AI models is not answering right now. The full report is paused so you do not pay for an incomplete one. Please try again in an hour.",
  daily_limit: "Today's reports are all taken. Please come back tomorrow.",
  storage_unavailable: "The full report is paused for a moment. Please try again in a few minutes.",
  not_configured: "The full report is not open yet. Please try again later.",
};

async function load(id: string): Promise<{ preview: Preview | null; gate: Availability } | "storage_unavailable"> {
  try {
    const preview = await loadPreview(redisKv, id);
    const gate = await checkoutAvailability(redisKv, PERSON_PROVIDER_IDS, providerConfigured);
    return { preview, gate };
  } catch {
    return "storage_unavailable";
  }
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ unavailable?: string }>;
}) {
  const { id } = await params;
  const { unavailable } = await searchParams;
  const loaded = await load(id);
  after(kickWorker);

  if (loaded === "storage_unavailable") {
    return (
      <Message title="We cannot open your preview right now">It is saved. Please reload this page in a few minutes.</Message>
    );
  }
  const { preview, gate } = loaded;

  if (!preview) {
    return (
      <Message title="This preview has expired">
        Previews are kept for 7 days.{" "}
        <Link href="/professional-scan" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
          Run the free check again
        </Link>
        .
      </Message>
    );
  }

  if (!preview.found) {
    return (
      <Message title="We could not tell who this is from this link">
        The AI model we asked could not say whose profile this is. We only offer the full report when we know who it is
        about, so there is nothing to pay for here.{" "}
        <Link href="/professional-scan" className="font-bold text-black underline decoration-accent decoration-4 underline-offset-4">
          Try your LinkedIn profile link
        </Link>
        : it works best.
      </Message>
    );
  }

  const closedReason = unavailable ?? (gate.open ? null : gate.reason);
  const details = [preview.role, preview.company, preview.location].filter(Boolean).join(" · ");

  return (
    <>
      {/* The find, on a black band. One screen for the whole page: compact on purpose. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-3 text-base font-bold uppercase tracking-wider text-accent">Free preview · AI Person Scan</p>
            <h1 className="text-5xl font-bold leading-none tracking-[-0.04em] text-white">We found you.</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              One AI model already knows who you are. Four more are ready to answer about you.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-base font-semibold text-white/70">Not you?</span>
              <Link
                href="/professional-scan"
                className="rounded-xl border-2 border-white/40 px-4 py-1.5 text-base font-bold text-white hover:border-white"
              >
                Check another link
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-accent p-6">
            <p className="text-base font-bold text-black/70">Perplexity, asked whose {preview.network} profile this is:</p>
            <p className="mt-1 text-3xl font-bold leading-tight tracking-tight text-black">{preview.name}</p>
            {details && <p className="mt-1 text-lg font-semibold text-black">{details}</p>}
          </div>
        </div>
      </section>

      {/* The offer, on white. */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            One click. Five AI models. <span className="underline decoration-accent decoration-4 underline-offset-8">One report about you.</span>
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-black/75">
            What a client, a partner or a recruiter is told when they ask AI about you, found, compared and turned into steps.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GETS.map((item) => (
              <li key={item.title} className="rounded-2xl bg-black px-6 py-5">
                <p className="text-xl font-bold text-accent">{item.title}</p>
                <p className="mt-1.5 text-base leading-relaxed text-white/85">{item.body}</p>
              </li>
            ))}
            {/* The bonus is one more thing you get, so it looks like the other cards. Only the button is yellow. */}
            <li className="flex flex-wrap items-center gap-4 rounded-2xl bg-black px-6 py-4 md:col-span-2 lg:col-span-3">
              <span className="rounded-full bg-accent px-4 py-1.5 text-base font-bold uppercase tracking-wider text-black">Bonus</span>
              <p className="text-lg font-bold text-white">
                A promo code for 7 more checks at <span className="text-accent">50% off</span>, yours to give away to friends,
                family and partners.
              </p>
            </li>
          </ul>

          <div className="mt-6">
            {closedReason ? (
              <p className="rounded-2xl border-2 border-black px-6 py-4 text-lg font-semibold text-black">
                {CLOSED_MESSAGE[closedReason] ?? CLOSED_MESSAGE.not_configured}
              </p>
            ) : (
              <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
                <a
                  href={`/api/professional-scan/checkout?preview=${encodeURIComponent(preview.id)}`}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-10 py-6 text-3xl font-bold text-black transition hover:bg-accent-hover"
                >
                  Get my full report, &euro;14.97
                  <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <p className="text-xl font-semibold text-black/75">PDF by email in about 5 minutes · refund if it does not arrive</p>
              </div>
            )}
          </div>

          <p className="mt-10 text-sm leading-relaxed text-black/60">
            AI Person Scan is not a background check, and aibusiness.vc is not a consumer reporting agency. Do not use it
            to decide on employment, tenancy, credit or insurance. It shows what AI models say, which can be wrong or about a
            different person.
          </p>
        </div>
      </section>
    </>
  );
}

function Message({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="mb-4 text-base font-bold uppercase tracking-wider text-black/60">AI Person Scan · free preview</p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-black sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-relaxed text-black/75">{children}</p>
      </div>
    </section>
  );
}
