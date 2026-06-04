import type { Metadata } from "next";
import { getArticlesBySection } from "@/lib/articles";
import SectionArticleExplorer from "@/components/SectionArticleExplorer";

export const metadata: Metadata = {
  title: "Robots: Who Makes Money on Humanoid Robots",
  description:
    "The money behind robots: China's $16K humanoids, Tesla Optimus, Figure, and the warehouse ROI math. Robots are AI with a body — here's who's cashing in.",
  keywords: [
    "humanoid robots",
    "China robots",
    "Unitree",
    "make money with robots",
    "robot business",
    "robot stocks",
    "Tesla Optimus",
  ],
  alternates: { canonical: "https://aibusiness.vc/robots" },
  openGraph: {
    type: "website",
    url: "https://aibusiness.vc/robots",
    title: "Robots — Who's Making Money on Humanoid Robots",
    description:
      "China's $16K humanoids, Tesla Optimus, Figure, and the warehouse ROI math. Robots are AI with a body — here's who's cashing in.",
    images: [{ url: "/images/articles/robot-hero-1.jpg", width: 1200, height: 630, alt: "Robots — who makes money on humanoid robots" }],
  },
};

export default function RobotsPage() {
  const articles = getArticlesBySection("robots");

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Robots — Who Makes Money on Humanoid Robots",
    description:
      "The money behind robots: China's cheap humanoids, Tesla Optimus, Figure, warehouse ROI, robot stocks, and how to earn from the robot boom.",
    url: "https://aibusiness.vc/robots",
    isPartOf: { "@type": "WebSite", name: "AI Business", url: "https://aibusiness.vc" },
    about: [
      { "@type": "Thing", name: "Humanoid robots" },
      { "@type": "Thing", name: "China robotics" },
      { "@type": "Thing", name: "Physical AI" },
    ],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://aibusiness.vc/robots/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-orange-400 font-mono text-xs font-medium mb-2 tracking-wider uppercase">
            Robots
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Robots — <span className="text-accent">The Economics of Physical AI</span>
          </h1>
          <p className="text-sm text-white/70 max-w-2xl">
            A robot is just AI that learned to touch the world — built cheapest and shipped
            fastest in China. We cover the business of it: what humanoids cost, who&apos;s buying,
            and where the real opportunities are.
          </p>
        </div>
      </section>

      <SectionArticleExplorer articles={articles} section="robots" totalLabel="articles" />
    </>
  );
}
