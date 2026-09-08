import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("incluye las rutas reales del sitio con URLs absolutas", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://expojuy2026.vercel.app");
    expect(urls).toContain("https://expojuy2026.vercel.app/galeria");
    expect(entries[0].lastModified).toBeInstanceOf(Date);
  });

  it("incluye /cuenta cuando el flag visitorAccess está activo", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://expojuy2026.vercel.app/cuenta");
  });

  it("lista las 5 variantes de idioma de cada URL, con es-AR sin prefijo", async () => {
    const entries = await sitemap();
    const home = entries.find((entry) => entry.url === "https://expojuy2026.vercel.app");

    expect(home?.alternates?.languages).toMatchObject({
      "es-AR": "https://expojuy2026.vercel.app",
      en: "https://expojuy2026.vercel.app/en",
      pt: "https://expojuy2026.vercel.app/pt",
      zh: "https://expojuy2026.vercel.app/zh",
      fr: "https://expojuy2026.vercel.app/fr",
    });
  });
});
