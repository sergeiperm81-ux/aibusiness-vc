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
  author: string;
  category: string;
  keywords: string[];
  image: string;
  /** Set when the piece came in through /submit-your-story. */
  story?: StoryKind;
  /** The featured company, when the piece is about one — feeds the GEO entity layer. */
  partner?: PartnerInfo;
  /**
   * Frontmatter `unlisted: true` keeps a published page reachable by its direct
   * URL while removing it from every listing, the sitemap and the search index.
   * Used to show a finished piece to the company it is about before it goes public.
   */
  unlisted?: boolean;
}

/**
 * Machine-readable identity of the company a Partner Story is about.
 *
 * This is what lets an AI engine reading the page bind "this article" to
 * "that company at that URL" instead of guessing from prose. Declared in the
 * story's frontmatter under `partner:`; founder is optional because some
 * stories deliberately leave the person unnamed.
 */
export interface PartnerInfo {
  company: string;
  url: string;
  founder?: string;
}

export type StoryKind = "partner" | "submitted";

/**
 * Stories sent in by their subject are labelled in the body: a Partner Story opens
 * with a "*Partner Story ..." note, anything else routed through the programme just
 * links to /submit-your-story. Nothing in the frontmatter carries this, so read it
 * off the body rather than asking every author to remember a new field.
 */
function detectStory(content: string): StoryKind | undefined {
  if (/^\s*\*+\s*Partner Story\b/m.test(content)) return "partner";
  if (content.includes("/submit-your-story")) return "submitted";
  return undefined;
}

/**
 * Reads the optional `partner:` frontmatter block. Malformed or incomplete
 * blocks are dropped rather than half-rendered: an entity with no name or no
 * URL is worse for GEO than no entity at all.
 */
function readPartner(data: Record<string, unknown>): PartnerInfo | undefined {
  const raw = data.partner;
  if (typeof raw !== "object" || raw === null) return undefined;
  const block = raw as Record<string, unknown>;
  const company = typeof block.company === "string" ? block.company.trim() : "";
  const url = typeof block.url === "string" ? block.url.trim() : "";
  if (!company || !/^https?:\/\//.test(url)) return undefined;
  const founder = typeof block.founder === "string" ? block.founder.trim() : "";
  return founder ? { company, url, founder } : { company, url };
}

export interface Article extends ArticleMeta {
  content: string;
}

const sections = ["solo", "startups", "b2b", "vc", "government", "tools", "society", "learn", "robots"];

function readArticlesFromDir(section: string): ArticleMeta[] {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        section,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "2026-03-30",
        author: data.author ?? "Sergei Ponomarev",
        category: data.category ?? section,
        keywords: data.keywords ?? [],
        image: data.image ?? "",
        story: detectStory(content),
        unlisted: data.unlisted === true,
        partner: readPartner(data),
      };
    });
}

export function getAllArticles(): ArticleMeta[] {
  return sections
    .flatMap(readArticlesFromDir)
    .filter((a) => !a.unlisted)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticlesBySection(section: string): ArticleMeta[] {
  return readArticlesFromDir(section)
    .filter((a) => !a.unlisted)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    author: data.author ?? "Sergei Ponomarev",
    category: data.category ?? section,
    keywords: data.keywords ?? [],
    image: data.image ?? "",
    story: detectStory(content),
    unlisted: data.unlisted === true,
    partner: readPartner(data),
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
