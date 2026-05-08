import Link from "next/link";
import type { Metadata } from "next";
import { getNewsBySlug, getLatestNews } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: "News Not Found" };
  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.image ? [news.image] : [],
    },
  };
}

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  VC: "bg-rose-500 text-white",
  Government: "bg-cyan-500 text-white",
};

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  const shareUrl = `https://aibusiness.vc/news/${slug}`;
  const allNews = await getLatestNews(10);
  const others = allNews.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="relative h-64 sm:h-72 overflow-hidden">
        {news.image && (
          <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${catColors[news.category] ?? "bg-gray-500 text-white"}`}>
                {news.category}
              </span>
              <span className="text-xs text-white/60">{news.date}</span>
              {news.source_name && (
                <span className="text-xs text-white/40">via {news.source_name}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {news.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="prose prose-gray max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 prose-li:text-gray-600 prose-a:text-amber-600"
            dangerouslySetInnerHTML={{ __html: news.body }}
          />

          {news.source_url && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <a
                href={news.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-600 hover:underline flex items-center gap-1"
              >
                Read full article on {news.source_name ?? "source"}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
            <span className="text-sm text-gray-400">Share:</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-colors text-xs font-bold">𝕏</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6">More News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {others.map((item) => (
                <Link key={item.slug} href={`/news/${item.slug}`} className="group bg-background rounded-xl overflow-hidden hover:ring-2 hover:ring-accent/40 transition-all hover:-translate-y-1">
                  {item.image && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[item.category] ?? "bg-gray-500 text-white"}`}>{item.category}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-accent transition-colors">{item.title}</h3>
                    <p className="text-xs text-muted mt-1">{item.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
