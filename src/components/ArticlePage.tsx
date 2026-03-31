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

const heroImages: Record<string, string> = {
  Solo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  Startups: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80",
  B2B: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
  Tools: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
  Materials: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
  Learn: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
};

export function ArticlePageView({ article }: { article: Article }) {
  const heroImg = heroImages[article.category] ?? heroImages.Solo;

  return (
    <>
      {/* Hero image */}
      <section className="relative h-56 sm:h-72 overflow-hidden">
        <img
          src={heroImg}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/${article.section}`}
                className="text-xs text-white/60 hover:text-white transition-colors capitalize"
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {article.title}
            </h1>
            <p className="text-sm text-white/60 mt-2">{article.date}</p>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <MarkdownContent content={article.content} />

          <div className="mt-12 pt-8 border-t border-black/10">
            <Link
              href={`/${article.section}`}
              className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
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
      closeOpen();
      html.push(`<h2 style="font-size:22px;font-weight:700;color:#000;margin:40px 0 16px;line-height:1.3">${fmt(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      closeOpen();
      html.push(`<h3 style="font-size:18px;font-weight:700;color:#000;margin:32px 0 12px;line-height:1.3">${fmt(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push('<ul style="margin:12px 0;padding-left:24px">'); inList = true; listTag = "ul"; }
      html.push(`<li style="color:#000;font-size:16px;line-height:1.8;margin:4px 0">${fmt(trimmed.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push('<ol style="margin:12px 0;padding-left:24px">'); inList = true; listTag = "ol"; }
      html.push(`<li style="color:#000;font-size:16px;line-height:1.8;margin:4px 0">${fmt(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
    } else if (trimmed.startsWith("|")) {
      if (!inTable) {
        html.push('<div style="overflow-x:auto;margin:24px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">');
        inTable = true;
      }
      if (trimmed.includes("---")) continue;
      const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
      const isHeader = !html.some((h) => h.includes("<tr>"));
      if (isHeader) {
        html.push(`<thead><tr>${cells.map((c) => `<th style="background:#000;color:#fff;padding:10px 14px;text-align:left;font-weight:600">${fmt(c)}</th>`).join("")}</tr></thead><tbody>`);
      } else {
        html.push(`<tr>${cells.map((c) => `<td style="padding:10px 14px;border-bottom:1px solid #eee;color:#000">${fmt(c)}</td>`).join("")}</tr>`);
      }
    } else if (trimmed === "") {
      closeOpen();
    } else {
      if (inList) { closeOpen(); }
      html.push(`<p style="color:#000;font-size:16px;line-height:1.8;margin:16px 0">${fmt(trimmed)}</p>`);
    }
  }
  closeOpen();

  function closeOpen() {
    if (inList) { html.push(`</${listTag}>`); inList = false; }
    if (inTable) { html.push("</tbody></table></div>"); inTable = false; }
  }

  return <div dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#000;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#d97706;text-decoration:none">$1</a>')
    .replace(/`(.+?)`/g, '<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;font-size:14px;color:#000">$1</code>');
}
