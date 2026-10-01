import type { MetadataRoute } from "next";
import { docPages } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...docPages.map((page) => ({
      url: `${siteConfig.url}/docs/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.slug === "getting-started" ? 0.9 : 0.7,
    })),
  ];
}