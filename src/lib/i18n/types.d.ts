import type esAR from "./messages/es-AR.json";

// Habilita autocompletado y chequeo en build de las claves de traducción
// usadas con `useTranslations`/`getTranslations` (ver next-intl#type-safety).
// es-AR es el diccionario canónico: los otros cuatro (en/pt/zh/fr) deben
// tener exactamente las mismas claves, verificado por `messages-parity.test.ts`.
declare module "use-intl" {
  interface AppConfig {
    Locale: "es-AR" | "en" | "pt" | "zh" | "fr";
    Messages: typeof esAR;
  }
}
