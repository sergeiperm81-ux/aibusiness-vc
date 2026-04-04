import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugsForSection, getArticlesBySection } from "@/lib/articles";
import { ArticlePageView } from "@/components/ArticlePage";
import { notFound } from "next/navigation";

const SECTION = "solo";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugsForSection(SECTION).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(SECTION, slug);
  if (!article) return { title: "Not Found" };
  return { title: article.title, description: article.description, keywords: article.keywords };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(SECTION, slug);
  if (!article) notFound();
  const related = getArticlesBySection(SECTION).filter((a) => a.slug !== slug).slice(0, 3);
  return <ArticlePageView article={article} relatedArticles={related} />;
}
