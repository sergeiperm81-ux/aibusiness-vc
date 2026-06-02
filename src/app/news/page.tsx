import type { Metadata } from "next";
import { getLatestNews } from "@/lib/supabase";
import { NewsPageClient } from "./news-client";

// No time-based revalidation. Page updates ONLY when cron calls revalidatePath("/news").
// Between cron runs, Vercel serves from CDN cache — zero compute.

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
