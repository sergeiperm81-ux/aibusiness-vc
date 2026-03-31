import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content");

export interface ArticleMeta {
  slug: string;
  section: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
}

export interface Article extends ArticleMeta {
  content: string;
}

const sections = ["solo", "startups", "b2b", "tools", "materials", "learn"];

function readArticlesFromDir(section: string): ArticleMeta[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        section,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "2026-03-30",
        category: data.category ?? section,
        keywords: data.keywords ?? [],
      };
    });
}

export function getAllArticles(): ArticleMeta[] {
  return sections
    .flatMap(readArticlesFromDir)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticlesBySection(section: string): ArticleMeta[] {
  return readArticlesFromDir(section).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(section: string, slug: string): Article | null {
  const filePath = path.join(contentDir, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    section,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "2026-03-30",
    category: data.category ?? section,
    keywords: data.keywords ?? [],
    content,
  };
}

export function getAllSlugsForSection(section: string): string[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
