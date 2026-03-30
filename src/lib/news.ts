import fs from "fs";
import path from "path";
import matter from "gray-matter";

const newsDir = path.join(process.cwd(), "src/content/news");

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  image: string;
}

export function getAllNews(): NewsItem[] {
  const files = fs.readdirSync(newsDir).filter((f) => f.endsWith(".md"));
  const news = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(newsDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      body: content,
      category: data.category ?? "News",
      date: data.date ?? "2026-03-30",
      image: data.image ?? "",
    };
  });
  return news.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(newsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    body: content,
    category: data.category ?? "News",
    date: data.date ?? "2026-03-30",
    image: data.image ?? "",
  };
}

export function getAllNewsSlugs(): string[] {
  return fs
    .readdirSync(newsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
