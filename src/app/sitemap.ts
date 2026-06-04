import type { MetadataRoute } from "next";
import { models } from "@/data/models";
import { tools, toolCategories } from "@/data/tools";
import { getAllArticles } from "@/lib/articles";
import { salaries } from "@/data/salaries";
import { regulations } from "@/data/regulations";
import { getAllToolComparisons, getAllProfessionSlugs, getToolsForProfession } from "@/lib/tool-comparisons";

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aibusiness.vc";
  const now = new Date().toISOString();

  // Only include URLs that actually return 200 OK
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/solo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/startups`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/b2b`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/vc`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/government`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/models`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/best-for`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/society`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/robots`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // /privacy, /terms, /affiliate-disclosure exist but low SEO value
  ];

  // Models — individual profile pages
  const modelPages: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${baseUrl}/models/${m.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Tool directory pages (356 tools)
  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${baseUrl}/tools/directory/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Tool comparison pages (within-category pairs, ~280)
  const toolComparisonPages: MetadataRoute.Sitemap = getAllToolComparisons().map((c) => ({
    url: `${baseUrl}/tools/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Best-for profession pages (only substantial collections)
  const bestForPages: MetadataRoute.Sitemap = getAllProfessionSlugs()
    .filter((slug) => getToolsForProfession(slug).length >= 4)
    .map((slug) => ({
      url: `${baseUrl}/tools/best-for/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Tool category pages (only categories with enough tools)
  const categoryPages: MetadataRoute.Sitemap = toolCategories
    .filter((cat) => tools.filter((tool) => tool.category === cat).length >= 3)
    .map((cat) => ({
      url: `${baseUrl}/tools/category/${slugify(cat)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // Articles — all sections (solo, b2b, startups, vc, government, tools, learn, society)
  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${baseUrl}/${a.section}/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Salary pages
  const salaryPages: MetadataRoute.Sitemap = salaries.map((s) => ({
    url: `${baseUrl}/salaries/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Regulation pages
  const regulationPages: MetadataRoute.Sitemap = regulations.map((r) => ({
    url: `${baseUrl}/regulation/${r.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // REMOVED from sitemap:
  // - /news/[slug] — these are redirects to /news?open=slug, not real pages
  // - /materials/* — renamed to /society, old URLs are 308 redirects
  // - /compare/[models] — old model comparison routes, many 404
  // - /danny-postma-headshotpro and other orphaned routes

  return [
    ...staticPages,
    ...modelPages,
    ...toolPages,
    ...toolComparisonPages,
    ...bestForPages,
    ...categoryPages,
    ...articlePages,
    ...salaryPages,
    ...regulationPages,
  ];
}
