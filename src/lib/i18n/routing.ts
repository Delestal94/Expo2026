import { defineRouting } from "next-intl/routing";

/**
 * Los 5 idiomas del sitio: español, inglés, portugués y mandarín son la
 * decisión de arquitectura original de la Memoria Descriptiva (§6),
 * priorizados por la audiencia real del evento (Corredor Bioceánico,
 * inversión minera). Francés se suma como quinto idioma (issue #4 del
 * repo) — cubre la audiencia de Francia/África francófona y a los socios
 * europeos del Corredor Bioceánico.
 *
 * `localePrefix: "as-needed"` deja el español sin prefijo (mismas URLs
 * que hoy: `/`, `/galeria`, `/cuenta`) y solo antepone `/en`, `/pt`, `/zh`
 * o `/fr` para los demás — así no se rompe ningún link ya compartido.
 */
export const routing = defineRouting({
  locales: ["es-AR", "en", "pt", "zh", "fr"],
  defaultLocale: "es-AR",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
