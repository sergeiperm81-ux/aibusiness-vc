import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Materials: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
};

const defaultImages: Record<string, string> = {
  solo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  b2b: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  startups: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
  tools: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80",
  materials: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  learn: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
};

interface SectionPageProps {
  articles: ArticleMeta[];
  section: string;
  totalLabel?: string;
}

export function SectionArticleGrid({ articles, section, totalLabel }: SectionPageProps) {
  const featured = articles.slice(0, 2);
  const rest = articles.slice(2);
  const fallbackImg = defaultImages[section] ?? defaultImages.solo;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {totalLabel && (
          <p className="text-sm text-black/40 mb-6">{articles.length} articles</p>
        )}

        {/* Featured — 2 large cards */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {featured.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.section}/${a.slug}`}
                className="group relative rounded-xl overflow-hidden h-64 sm:h-72"
              >
                <img
                  src={a.image || fallbackImg}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[a.category] ?? "bg-amber-500 text-black"}`}
                  >
                    {a.category}
                  </span>
                  <h2 className="font-bold text-white text-lg mt-2 leading-snug group-hover:text-accent transition-colors">
                    {a.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Grid — 3 columns with photos */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.section}/${a.slug}`}
                className="group rounded-xl overflow-hidden border border-black/5 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={a.image || fallbackImg}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-black text-sm leading-snug group-hover:text-amber-600 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-black/60 mt-2 line-clamp-2 leading-relaxed">
                    {a.description}
                  </p>
                  <span className="text-xs font-semibold text-amber-600 mt-3 inline-block">
                    Read Article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
