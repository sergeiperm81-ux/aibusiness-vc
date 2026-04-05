import type { MetadataRoute } from "next";
import { models } from "@/data/models";
import { tools, toolCategories } from "@/data/tools";
import { getAllArticles } from "@/lib/articles";
import { getAllComparisons } from "@/data/comparisons";
import { salaries } from "@/data/salaries";
import { newsData } from "@/data/news";
import { regulations } from "@/data/regulations";
import { getAllToolComparisons, getAllProfessionSlugs } from "@/lib/tool-comparisons";

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aibusiness.vc";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/solo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/startups`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/b2b`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/vc`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/government`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/models`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tools/best-for`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/learn`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/materials`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const modelPages: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${baseUrl}/models/${m.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${baseUrl}/tools/directory/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Tool comparison pages (within-category pairs)
  const toolComparisonPages: MetadataRoute.Sitemap = getAllToolComparisons().map((c) => ({
    url: `${baseUrl}/tools/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Best-for profession pages
  const bestForPages: MetadataRoute.Sitemap = getAllProfessionSlugs().map((slug) => ({
    url: `${baseUrl}/tools/best-for/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Tool category pages
  const categoryPages: MetadataRoute.Sitemap = toolCategories.map((cat) => ({
    url: `${baseUrl}/tools/category/${slugify(cat)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: `${baseUrl}/${a.section}/${a.slug}`,
    lastModified: a.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const salaryPages: MetadataRoute.Sitemap = salaries.map((s) => ({
    url: `${baseUrl}/salaries/${s.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const regulationPages: MetadataRoute.Sitemap = regulations.map((r) => ({
    url: `${baseUrl}/regulation/${r.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const newsPages: MetadataRoute.Sitemap = newsData.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: n.date,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...modelPages,
    ...toolPages,
    ...toolComparisonPages,
    ...bestForPages,
    ...categoryPages,
    ...articlePages,
    ...comparisonPages,
    ...salaryPages,
    ...regulationPages,
    ...newsPages,
  ];
}
