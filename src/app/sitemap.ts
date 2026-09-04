import type { MetadataRoute } from "next";
import { models } from "@/data/models";
import { getAllArticles } from "@/lib/articles";
import { salaries } from "@/data/salaries";
import { regulations } from "@/data/regulations";
import { GUIDES } from "@/app/library/guides";
import { getAllNotes } from "@/lib/notes-content";

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
    { url: `${baseUrl}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/society`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/robots`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/notes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/service-check`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/audit`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/benchmarks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/sergei-ponomarev`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/submit-your-story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // /privacy, /terms, /affiliate-disclosure exist but low SEO value
  ];

  // Founder's Notes — author layer
  const notePages: MetadataRoute.Sitemap = getAllNotes().map((n) => ({
    url: `${baseUrl}/notes/${n.slug}`,
    lastModified: n.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Library guides — flagship original content
  const libraryPages: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${baseUrl}/library/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Models — individual profile pages
  const modelPages: MetadataRoute.Sitemap = models.map((m) => ({
    url: `${baseUrl}/models/${m.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
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
    ...notePages,
    ...libraryPages,
    ...modelPages,
    ...articlePages,
    ...salaryPages,
    ...regulationPages,
  ];
}
