import type { Metadata } from "next";
import { getLatestNews } from "@/lib/supabase";
import { NewsPageClient } from "./news-client";

// Time-based ISR: the page is statically regenerated at most once an hour, in the
// background, on the serverless runtime — so RSS is re-fetched hourly and news stays
// fresh without depending on the daily cron. force-static keeps the uncached RSS
// fetches from turning this into a slow per-request SSR page; visitors always get the
// cached static HTML instantly, and hand-curated seed items always render.
export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Business News — Funding, Launches & Money Moves (2026)",
  description:
    "Daily AI business news: startup funding, tool launches, enterprise deals, and ways to earn with AI. Updated every morning.",
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function NewsPage() {
  const news = await getLatestNews(50);
  return <NewsPageClient news={news} />;
}
