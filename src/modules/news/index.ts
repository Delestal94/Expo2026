/**
 * Punto de entrada público del módulo de noticias.
 * Nada fuera de este módulo puede importar un archivo interno de acá
 * (ver reglas de eslint-plugin-boundaries en eslint.config.mjs) — todo
 * lo que otro módulo necesite se exporta explícitamente desde aquí.
 */
export { NewsSection } from "./ui/news-section";
