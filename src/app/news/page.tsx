import type { Metadata } from "next";
import { getLatestNews } from "@/lib/supabase";
import { NewsPageClient } from "./news-client";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "AI Business News — Funding, Launches & Money Moves (2026)",
  description:
    "Daily AI business news: startup funding, tool launches, enterprise deals, and ways to earn with AI. Updated every morning.",
};

export default async function NewsPage() {
  const news = await getLatestNews(50);
  return <NewsPageClient news={news} />;
}
