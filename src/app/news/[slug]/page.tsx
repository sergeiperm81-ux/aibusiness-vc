import Link from "next/link";
import type { Metadata } from "next";
import { getAllNewsSlugs, getNewsBySlug, getAllNews } from "@/lib/news";
import { notFound } from "next/navigation";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return { title: "Not Found" };
  return {
    title: item.title,
    description: item.excerpt,
  };
}

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
};

export default async function NewsItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const allNews = getAllNews();
  const related = allNews.filter((n) => n.slug !== slug).slice(0, 3);

  const lines = item.body.split("\n");
  const html = lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return `<h2>${fmt(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("- ") || trimmed.startsWith("* "))
        return `<li>${fmt(trimmed.slice(2))}</li>`;
      return `<p>${fmt(trimmed)}</p>`;
    })
    .join("\n");

  function fmt(t: string): string {
    return t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-amber-600 hover:underline">$1</a>');
  }

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/news" className="text-xs text-muted hover:text-accent">News</Link>
            <span className="text-xs text-muted">/</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${catColors[item.category] ?? "bg-gray-500 text-white"}`}>
              {item.category}
            </span>
            <span className="text-xs text-muted">{item.date}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {item.title}
          </h1>
        </div>
      </section>

      {item.image && (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <img src={item.image} alt={item.title} className="w-full h-56 sm:h-72 object-cover rounded-xl" />
        </div>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <article
            className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-amber-600"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">More News</h2>
            <div className="space-y-3">
              {related.map((n) => (
                <Link key={n.slug} href={`/news/${n.slug}`}
                  className="group flex gap-4 bg-background rounded-xl p-4 hover:ring-2 hover:ring-accent/40 transition-all">
                  {n.image && (
                    <img src={n.image} alt={n.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] text-muted">{n.date}</p>
                    <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors">{n.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: item.title,
            description: item.excerpt,
            datePublished: item.date,
            author: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
            publisher: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
          }),
        }}
      />
    </>
  );
}
