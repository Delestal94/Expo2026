import type { MetadataRoute } from "next";
import { getFeatureFlags } from "@/lib/config/flags";

const SITE_URL = "https://expojuy2026.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const flags = await getFeatureFlags();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/galeria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  if (flags.visitorAccess) {
    entries.push({
      url: `${SITE_URL}/cuenta`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
