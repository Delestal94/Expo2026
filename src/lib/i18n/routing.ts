import { defineRouting } from "next-intl/routing";

/**
 * Los 4 idiomas que la Memoria Descriptiva declara como decisión de
 * arquitectura (§6): español, inglés, portugués y mandarín, priorizados
 * por la audiencia real del evento (Corredor Bioceánico, inversión
 * minera) — no una lista genérica de "idiomas más hablados".
 *
 * `localePrefix: "as-needed"` deja el español sin prefijo (mismas URLs
 * que hoy: `/`, `/galeria`, `/cuenta`) y solo antepone `/en`, `/pt` o
 * `/zh` para los demás — así no se rompe ningún link ya compartido.
 */
export const routing = defineRouting({
  locales: ["es-AR", "en", "pt", "zh"],
  defaultLocale: "es-AR",
  localePrefix: "as-needed",
});
