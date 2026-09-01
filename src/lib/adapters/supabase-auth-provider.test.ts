import { beforeEach, describe, expect, it, vi } from "vitest";
import { SupabaseAuthProvider } from "./supabase-auth-provider";

const mockAuth = {
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({ auth: mockAuth })),
}));

vi.mock("@/lib/config/env", () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  },
}));

const FAKE_SESSION = {
  access_token: "token-123",
  user: { id: "user-1", email: "visitante@example.com" },
};

describe("SupabaseAuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mapea una sesión exitosa de signIn al formato del puerto AuthProvider", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({ data: { session: FAKE_SESSION }, error: null });

    const session = await new SupabaseAuthProvider().signIn("visitante@example.com", "secreto123");

    expect(session).toEqual({
      user: { id: "user-1", email: "visitante@example.com" },
      accessToken: "token-123",
    });
  });

  it("propaga el error de Supabase si el login falla", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error("Credenciales inválidas"),
    });

    await expect(
      new SupabaseAuthProvider().signIn("visitante@example.com", "mal"),
    ).rejects.toThrow("Credenciales inválidas");
  });

  it("signUp lanza un error claro si Supabase no devuelve sesión (confirmación de email pendiente)", async () => {
    mockAuth.signUp.mockResolvedValue({ data: { session: null }, error: null });

    await expect(
      new SupabaseAuthProvider().signUp("nuevo@example.com", "secreto123"),
    ).rejects.toThrow(/confirmación de email/);
  });

  it("getSession devuelve null si no hay sesión activa", async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    await expect(new SupabaseAuthProvider().getSession()).resolves.toBeNull();
  });
});
