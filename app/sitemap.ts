import type { MetadataRoute } from "next";
import { docPages } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

// Resolved once per build rather than per request, so the published dates stay
// stable between deploys instead of moving on every fetch.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...docPages.map((page) => ({
      url: `${siteConfig.url}/docs/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.slug === "getting-started" ? 0.9 : 0.7,
    })),
  ];
}