import type esAR from "./messages/es-AR.json";

// Habilita autocompletado y chequeo en build de las claves de traducción
// usadas con `useTranslations`/`getTranslations` (ver next-intl#type-safety).
declare module "use-intl" {
  interface AppConfig {
    Locale: "es-AR";
    Messages: typeof esAR;
  }
}
