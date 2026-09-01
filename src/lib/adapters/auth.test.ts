import { describe, expect, it, vi } from "vitest";

const mockEnv: { AUTH_PROVIDER: string } = { AUTH_PROVIDER: "supabase" };

vi.mock("@/lib/config/env", () => ({
  env: mockEnv,
}));

vi.mock("./supabase-auth-provider", () => ({
  SupabaseAuthProvider: class SupabaseAuthProvider {},
}));

describe("createAuthProvider", () => {
  it("devuelve un SupabaseAuthProvider cuando AUTH_PROVIDER es supabase", async () => {
    mockEnv.AUTH_PROVIDER = "supabase";
    const { createAuthProvider } = await import("./auth");
    const { SupabaseAuthProvider } = await import("./supabase-auth-provider");

    expect(createAuthProvider()).toBeInstanceOf(SupabaseAuthProvider);
  });

  it.each(["clerk", "nextauth"])(
    "lanza un error claro para el adaptador todavía no implementado: %s",
    async (provider) => {
      mockEnv.AUTH_PROVIDER = provider;
      const { createAuthProvider } = await import("./auth");

      expect(() => createAuthProvider()).toThrow(/todavía no está implementado/);
    },
  );
});
