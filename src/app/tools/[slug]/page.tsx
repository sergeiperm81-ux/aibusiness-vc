import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugsForSection, getArticlesBySection } from "@/lib/articles";
import { ArticlePageView } from "@/components/ArticlePage";
import { notFound } from "next/navigation";

const SECTION = "tools";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugsForSection(SECTION).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(SECTION, slug);
  if (!article) return { title: "Not Found" };
  const url = `https://aibusiness.vc/tools/${slug}`;
  const image = article.image || "/og-image.jpg";
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author, url: "https://aibusiness.vc/sergei-ponomarev" }],
    alternates: { canonical: url },
    // An unlisted piece is reachable by its direct link but must not enter the
    // search index until the company it is about has signed off on it.
    ...(article.unlisted ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(SECTION, slug);
  if (!article) notFound();
  const related = getArticlesBySection(SECTION).filter((a) => a.slug !== slug).slice(0, 3);
  return <ArticlePageView article={article} relatedArticles={related} />;
}
