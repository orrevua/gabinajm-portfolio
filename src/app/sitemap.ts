import { MetadataRoute } from "next";
import { getSanityDataService } from "@/src/services";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://gabinajm.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const dataService = getSanityDataService();
    const slugs = await dataService.getAllProjectSlugs();

    const projectPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
      url: `${BASE_URL}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
