import type { MetadataRoute } from "next";
import { models } from "@/data/models";
import { tools } from "@/data/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aibusiness.vc";
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/solo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/startups`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/b2b`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/models`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/learn`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/materials`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
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

  return [...staticPages, ...modelPages, ...toolPages];
}
