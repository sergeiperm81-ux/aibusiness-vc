/**
 * Which directory cards are allowed into the search index.
 *
 * Search Console, 92 days to 18 Aug 2026: the 325 directory cards drew 183,641
 * impressions and 101 clicks — a click-through rate of 0.05%. One card alone,
 * SE Ranking, accounted for 115,426 of those impressions and a single click,
 * because people searching for a competitor's brand name reach a thin card on
 * page four and never open it. Editorial pages over the same window: 148,255
 * impressions, 1,504 clicks, a rate twenty times higher.
 *
 * A page that is shown constantly and chosen never is a poor signal for the
 * whole domain, so the thin cards leave the index. They stay on the site,
 * stay linked, and stay useful to a reader browsing the catalogue; they simply
 * stop competing for queries they cannot win.
 *
 * A card earns a place in the index one of two ways: it carries real editorial
 * work (the enriched fields on AITool), or it has demonstrated that people
 * click it. Everything else is noindex, follow.
 */

/** Cards rewritten to answer the query that reaches them, or written by hand. */
export const EDITORIAL_TOOL_IDS: readonly string[] = [
  "neomundi-controltower",
  "factbutcher",
  "sundial",
  // Rewritten 24 Aug 2026 against the query that actually reaches them, with
  // prices read off each vendor's own pricing page that day.
  "seranking",
  "semrush",
  "vectorizer-ai",
  "hex",
  "zep",
  "retool-ai",
  "captions-app",
  "coframe",
];

/** Cards with two or more clicks in the 92-day Search Console window. */
export const PROVEN_TOOL_IDS: readonly string[] = [
  "askui",
  "character-ai",
  "coframe",
  "create-xyz",
  "crowdstrike-charlotte",
  "cursor",
  "freshpaint",
  "luma-ai",
  "nightcafe",
  "nosto",
  "personal-ai",
  "play-ht",
  "scispace",
  "slidesgo-ai",
  "soundraw",
  "tembo-ai",
  "tldraw-ai",
  "vectorizer-ai",
  "wiz-io",
];

const INDEXABLE = new Set<string>([...EDITORIAL_TOOL_IDS, ...PROVEN_TOOL_IDS]);

export function isToolIndexable(id: string): boolean {
  return INDEXABLE.has(id);
}
