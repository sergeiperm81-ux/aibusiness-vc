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

/** Fetch latest news: RSS feeds + seed data, deduplicated by slug */
export async function getLatestNews(limit = 50): Promise<NewsRow[]> {
  try {
    // Fetch fresh RSS news
    const rssItems = await aggregateNews(30);
    const rssRows = rssItems.map(rssToRow);
    const seedRows = seedToRows();

    // Merge: RSS first (newer), then seed, deduplicate by slug
    const seen = new Set<string>();
    const merged: NewsRow[] = [];

    for (const row of [...rssRows, ...seedRows]) {
      if (!seen.has(row.slug)) {
        seen.add(row.slug);
        merged.push(row);
      }
    }

    return merged.slice(0, limit);
  } catch (err) {
    console.error("Failed to fetch RSS news, falling back to seed:", err);
    return seedToRows().slice(0, limit);
  }
}

/** Fetch single news by slug */
export async function getNewsBySlug(slug: string): Promise<NewsRow | null> {
  const all = await getLatestNews(100);
  return all.find((n) => n.slug === slug) ?? null;
}
