import { aggregateNews, type AggregatedNewsItem } from "./news-aggregator";
import { newsData as seedNews } from "@/data/news";

/**
 * News system without any external database.
 * Fetches fresh news from RSS feeds, merges with seed data.
 * ISR (revalidate=3600) handles caching — no DB needed.
 */

export interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  badge_color: string;
  date: string;
  image: string | null;
  source_url: string | null;
  source_name: string | null;
  published_at: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  VC: "bg-rose-500 text-white",
  Government: "bg-cyan-500 text-white",
};

export function badgeColorForCategory(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "bg-gray-500 text-white";
}

/** Convert seed news to NewsRow format */
function seedToRows(): NewsRow[] {
  return seedNews.map((n, i) => ({
    id: `seed-${i}`,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    body: n.body,
    category: n.category,
    badge_color: n.badgeColor,
    date: n.date,
    image: n.image,
    source_url: null,
    source_name: "AIBusiness.vc",
    published_at: new Date(n.date).toISOString() || new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));
}

/** Convert aggregated RSS item to NewsRow */
function rssToRow(item: AggregatedNewsItem, i: number): NewsRow {
  return {
    id: `rss-${i}`,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    category: item.category,
    badge_color: item.badge_color,
    date: item.date,
    image: item.image,
    source_url: item.source_url,
    source_name: item.source_name,
    published_at: item.published_at,
    created_at: new Date().toISOString(),
  };
}

/** How many feed items make the feed trustworthy on its own. Under this, the seed fills the gaps. */
const ENOUGH_FRESH_ITEMS = 10;
/** Nothing older than this appears in the list. A July item under a September one reads as a broken site. */
const MAX_AGE_DAYS = 45;

/** Every item we have, freshest first: feed items, then the seed, deduplicated by slug. */
async function allNews(): Promise<{ rows: NewsRow[]; fresh: number }> {
  try {
    const rssRows = (await aggregateNews(60)).map(rssToRow);
    const seen = new Set<string>();
    const merged: NewsRow[] = [];
    for (const row of [...rssRows, ...seedToRows()]) {
      if (!seen.has(row.slug)) {
        seen.add(row.slug);
        merged.push(row);
      }
    }
    merged.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return { rows: merged, fresh: rssRows.length };
  } catch (err) {
    console.error("Failed to fetch RSS news, falling back to seed:", err);
    return {
      rows: seedToRows().sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
      fresh: 0,
    };
  }
}

/**
 * The news list: fresh feed items only, newest first. The hand-written seed
 * items are months old by now; they show only when the feeds fail, so the
 * page is never empty.
 */
export async function getLatestNews(limit = 50): Promise<NewsRow[]> {
  const { rows, fresh } = await allNews();
  if (fresh < ENOUGH_FRESH_ITEMS) return rows.slice(0, limit);
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  return rows.filter((row) => new Date(row.published_at).getTime() >= cutoff).slice(0, limit);
}

/** Fetch single news by slug */
export async function getNewsBySlug(slug: string): Promise<NewsRow | null> {
  const { rows } = await allNews();
  return rows.find((n) => n.slug === slug) ?? null;
}
