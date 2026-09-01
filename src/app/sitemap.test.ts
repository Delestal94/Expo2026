import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("incluye la única ruta real del sitio con una URL absoluta", () => {
    const entries = sitemap();

    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe("https://expojuy2026.vercel.app");
    expect(entries[0].lastModified).toBeInstanceOf(Date);
  });
});
