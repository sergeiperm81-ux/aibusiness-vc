import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/articles"
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Articles
            </Link>
            <span className="text-xs text-muted">/</span>
            <span className="text-xs text-accent">{article.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-muted">
            {article.date} &middot; {article.category}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-gray-50 prose-th:p-3 prose-td:p-3">
            <MarkdownContent content={article.content} />
          </article>
        </div>
      </section>

      <ArticleSchemaOrg article={article} slug={slug} />
    </>
  );
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown to HTML — handles headers, bold, lists, tables, links
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      html.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push("<ol>"); inList = true; }
      html.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (trimmed.startsWith("|")) {
      if (!inTable) {
        html.push("<table><tbody>");
        inTable = true;
      }
      if (trimmed.includes("---")) continue; // skip separator
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      const tag = !html.some((h) => h.includes("<tr>")) ? "th" : "td";
      html.push(`<tr>${cells.map((c) => `<${tag}>${formatInline(c)}</${tag}>`).join("")}</tr>`);
    } else if (trimmed === "") {
      if (inList) { html.push("</ul>"); inList = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<p>${formatInline(trimmed)}</p>`);
    }
  }

  if (inList) html.push("</ul>");
  if (inTable) html.push("</tbody></table>");

  return <div dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function ArticleSchemaOrg({
  article,
  slug,
}: {
  article: { title: string; description: string; date: string };
  slug: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "AI Business",
      url: "https://aibusiness.vc",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Business",
      url: "https://aibusiness.vc",
    },
    mainEntityOfPage: `https://aibusiness.vc/articles/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
