import { describe, expect, it } from "vitest";
import esAR from "./messages/es-AR.json";
import en from "./messages/en.json";
import pt from "./messages/pt.json";
import zh from "./messages/zh.json";

/**
 * es-AR es el diccionario canónico (ver types.d.ts) — si un idioma
 * nuevo se queda atrás de una clave, `useTranslations` no rompe el
 * build (usa `unknown`), rompe en producción al pedir esa clave. Este
 * test es lo único que lo detecta antes de eso.
 */
function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return [prefix];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

const canonicalKeys = collectKeys(esAR).sort();

describe("paridad de mensajes entre idiomas", () => {
  it.each([
    ["en", en],
    ["pt", pt],
    ["zh", zh],
  ])("%s tiene exactamente las mismas claves que es-AR", (_locale, messages) => {
    const keys = collectKeys(messages).sort();
    const missing = canonicalKeys.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !canonicalKeys.includes(k));

    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });
});
