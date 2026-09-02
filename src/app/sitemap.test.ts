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
});
