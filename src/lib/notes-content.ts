import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Founder's Notes — the author layer. Kept in its own loader on purpose: notes must
// never leak into the robot article/news feeds (getAllArticles, trending, related).
const notesDir = path.join(process.cwd(), "src/content/notes");

export interface Note {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  content: string;
}

function readNote(file: string): Note {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(notesDir, file), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "2026-01-01",
    author: data.author ?? "Sergei Ponomarev",
    content,
  };
}

export function getAllNotes(): Note[] {
  if (!fs.existsSync(notesDir)) return [];
  return fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith(".md"))
    .map(readNote)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteBySlug(slug: string): Note | null {
  const filePath = path.join(notesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readNote(`${slug}.md`);
}

export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(notesDir)) return [];
  return fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
