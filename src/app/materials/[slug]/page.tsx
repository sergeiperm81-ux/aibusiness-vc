import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugsForSection } from "@/lib/articles";
import { ArticlePageView } from "@/components/ArticlePage";
import { notFound } from "next/navigation";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllSlugsForSection("materials").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("materials", slug);
  if (!article) return { title: "Not Found" };
  return { title: article.title, description: article.description, keywords: article.keywords };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug("materials", slug);
  if (!article) notFound();
  return <ArticlePageView article={article} />;
}
