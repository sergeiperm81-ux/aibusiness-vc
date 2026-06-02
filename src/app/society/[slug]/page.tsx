import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugsForSection, getArticlesBySection } from "@/lib/articles";
import { ArticlePageView } from "@/components/ArticlePage";
import { notFound, permanentRedirect } from "next/navigation";

const SECTION = "society";

interface Props { params: Promise<{ slug: string }> }

const LEGACY_MATERIAL_REDIRECTS: Record<string, string> = {
  "roi-calculator": "/materials/roi-calculator",
  "tool-selector": "/materials/tool-selector",
  "playbook-templates": "/materials/playbook-templates",
};

export async function generateStaticParams() {
  return getAllSlugsForSection(SECTION).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (LEGACY_MATERIAL_REDIRECTS[slug]) {
    return {
      title: "Redirecting...",
      robots: { index: false, follow: true },
    };
  }
  const article = getArticleBySlug(SECTION, slug);
  if (!article) return { title: "Not Found" };
  return { title: article.title, description: article.description, keywords: article.keywords };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const redirectTo = LEGACY_MATERIAL_REDIRECTS[slug];
  if (redirectTo) {
    permanentRedirect(redirectTo);
  }
  const article = getArticleBySlug(SECTION, slug);
  if (!article) notFound();
  const related = getArticlesBySection(SECTION).filter((a) => a.slug !== slug).slice(0, 3);
  return <ArticlePageView article={article} relatedArticles={related} />;
}
