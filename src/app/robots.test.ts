import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("permite a todos los crawlers y linkea el sitemap real", () => {
    const result = robots();

    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe("https://expojuy2026.vercel.app/sitemap.xml");
  });
});
