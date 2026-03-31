import Link from "next/link";
import type { Article } from "@/lib/articles";

const catColors: Record<string, string> = {
  Solo: "bg-amber-500 text-black",
  Startups: "bg-purple-500 text-white",
  B2B: "bg-blue-500 text-white",
  Tools: "bg-emerald-500 text-white",
  Materials: "bg-pink-500 text-white",
  Learn: "bg-cyan-500 text-white",
};

export function ArticlePageView({ article }: { article: Article }) {
  return (
    <>
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Link
              href={`/${article.section}`}
              className="text-xs text-white/50 hover:text-accent transition-colors capitalize"
            >
              {article.section}
            </Link>
            <span className="text-xs text-white/30">/</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${catColors[article.category] ?? "bg-amber-500 text-black"}`}
            >
              {article.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-white/50">{article.date}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <article className="prose prose-lg max-w-none prose-headings:text-black prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-black prose-p:leading-relaxed prose-li:text-black prose-strong:text-black prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-black prose-th:text-white prose-th:p-3 prose-td:p-3 prose-td:text-black">
            <MarkdownContent content={article.content} />
          </article>

          <div className="mt-10 pt-6 border-t border-black/10">
            <Link
              href={`/${article.section}`}
              className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
            >
              &larr; Back to {article.section}
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            dateModified: article.date,
            author: { "@type": "Organization", name: "AI Business", url: "https://aibusiness.vc" },
            mainEntityOfPage: `https://aibusiness.vc/${article.section}/${article.slug}`,
          }),
        }}
      />
    </>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;
  let listTag = "ul";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      if (inList) { html.push(`</${listTag}>`); inList = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
      html.push(`<h2>${fmt(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      if (inList) { html.push(`</${listTag}>`); inList = false; }
      html.push(`<h3>${fmt(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push("<ul>"); inList = true; listTag = "ul"; }
      html.push(`<li>${fmt(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push("<ol>"); inList = true; listTag = "ol"; }
      html.push(`<li>${fmt(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (trimmed.startsWith("|")) {
      if (!inTable) { html.push("<table><tbody>"); inTable = true; }
      if (trimmed.includes("---")) continue;
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      const tag = !html.some((h) => h.includes("<tr>")) ? "th" : "td";
      html.push(`<tr>${cells.map((c) => `<${tag}>${fmt(c)}</${tag}>`).join("")}</tr>`);
    } else if (trimmed === "") {
      if (inList) { html.push(`</${listTag}>`); inList = false; }
      if (inTable) { html.push("</tbody></table>"); inTable = false; }
    } else {
      if (inList) { html.push(`</${listTag}>`); inList = false; }
      html.push(`<p>${fmt(trimmed)}</p>`);
    }
  }
  if (inList) html.push(`</${listTag}>`);
  if (inTable) html.push("</tbody></table>");

  return <div dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, "<code>$1</code>");
}
