import type { MetadataRoute } from "next";
import { getCategorySets } from "@/lib/static-photos";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://example.com";
  const now = new Date();

  const staticRoutes = ["", "/about", "/blog", "/discover", "/travel"].map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const galleryRoutes = getCategorySets().map((category) => ({
    url: `${appUrl}/gallery/${category.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...galleryRoutes];
}
