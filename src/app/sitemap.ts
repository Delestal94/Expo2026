import type { MetadataRoute } from "next";
import { getFeatureFlags } from "@/lib/config/flags";
import { routing } from "@/lib/i18n/routing";

const SITE_URL = "https://expojuy2026.vercel.app";

/**
 * URL de una ruta para cada idioma, respetando `localePrefix: "as-needed"`
 * (es-AR sin prefijo, el resto con `/en`, `/pt`, `/zh`, `/fr`).
 *
 * Antes el sitemap solo listaba la URL en español: sin las variantes de
 * idioma, un buscador no tenía forma de descubrir `/en`, `/pt`, `/zh` ni
 * `/fr` — cinco idiomas configurados y cuatro invisibles para el rastreo.
 */
function localeUrls(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      locale === routing.defaultLocale
        ? `${SITE_URL}${path}`
        : `${SITE_URL}/${locale}${path}`,
    ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const flags = await getFeatureFlags();
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: localeUrls("") },
    },
    {
      url: `${SITE_URL}/galeria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: localeUrls("/galeria") },
    },
  ];

  if (flags.visitorAccess) {
    entries.push({
      url: `${SITE_URL}/cuenta`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: localeUrls("/cuenta") },
    });
  }

  return entries;
}
