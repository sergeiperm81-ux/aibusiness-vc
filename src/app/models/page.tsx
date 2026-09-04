import type { Metadata } from "next";
import { models } from "@/data/models";
import ModelsExplorer from "@/components/ModelsExplorer";

const MODEL_COUNT = models.length;
const RANKED_COUNT = models.filter((m) => m.elo !== null).length;

/**
 * The newest release month present in the data, and the models that share it.
 *
 * Both the title and the intro used to name the July 2026 wave by hand, which
 * turned into a stale claim the moment nothing was added for a month. Deriving
 * the wave from the data means the page describes whatever it actually holds.
 */
const LATEST_MONTH = models.reduce(
  (latest, m) => (m.released > latest ? m.released : latest),
  ""
);

const LATEST_MODELS = models
  .filter((m) => m.released === LATEST_MONTH)
  .map((m) => m.name);

function monthLabel(value: string): string {
  const [year, month] = value.split("-");
  const name = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][Number(month) - 1];
  return name ? `${name} ${year}` : value;
}

const LATEST_LABEL = monthLabel(LATEST_MONTH);
const LATEST_LIST = LATEST_MODELS.slice(0, 5).join(", ");

export const metadata: Metadata = {
  title: `AI Model Pricing 2026: ${MODEL_COUNT} LLMs Compared on Price and Context`,
  description:
    `Compare ${MODEL_COUNT} AI models on price per million tokens, context window and release date, with public ELO shown for the ${RANKED_COUNT} that have it. Newest additions from ${LATEST_LABEL}: ${LATEST_LIST}.`,
  keywords: [
    "AI model pricing 2026",
    "LLM price comparison",
    "AI model comparison",
    "best LLM 2026",
    "Claude vs GPT vs Gemini",
    "LLM context window comparison",
  ],
  alternates: {
    canonical: "/models",
  },
};

export default function ModelsPage() {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Leaderboard
          </p>
          <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            What the AI Models <span className="text-accent">Cost</span> in 2026
          </h1>
          <p className="max-w-2xl text-sm text-muted">
            {MODEL_COUNT} models compared on price per million tokens, context window and release
            date. Public arena ELO is shown for the {RANKED_COUNT} models that have one; the rest
            are listed by release date, because a model without enough arena votes has no honest
            rank to give. Newest here: {LATEST_LABEL}.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ModelsExplorer models={models} />
        </div>
      </section>
    </>
  );
}
