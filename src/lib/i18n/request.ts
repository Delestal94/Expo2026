import { getRequestConfig } from "next-intl/server";
import esAR from "./messages/es-AR.json";

/**
 * Único locale disponible hoy — el quinto idioma todavía no está decidido
 * (ver issue #4). Cuando se sume uno nuevo, este archivo pasa a resolver
 * el locale real (por ruta, cookie, etc.) en vez de devolver un valor fijo;
 * el resto del código (dictionaries, provider, `useTranslations`/
 * `getTranslations`) no cambia.
 */
export const locale = "es-AR" as const;

export default getRequestConfig(async () => ({
  locale,
  messages: esAR,
}));
