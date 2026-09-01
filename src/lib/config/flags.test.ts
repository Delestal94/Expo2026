import { describe, expect, it } from "vitest";
import { getFeatureFlags } from "./flags";

describe("getFeatureFlags", () => {
  it("mantiene visitorAccess activo por defecto", async () => {
    const flags = await getFeatureFlags();
    expect(flags.visitorAccess).toBe(true);
  });

  it("mantiene los módulos no esenciales apagados hasta activarlos a propósito", async () => {
    const flags = await getFeatureFlags();
    expect(flags.exhibitorPortal).toBe(false);
    expect(flags.businessRounds).toBe(false);
    expect(flags.aiAssistant).toBe(false);
    expect(flags.interactiveMap).toBe(false);
  });
});
