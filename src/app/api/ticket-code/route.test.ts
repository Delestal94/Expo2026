import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signTicketCode } from "@/modules/visitor-access";

// Sin .env.local no hay Supabase configurado en test — se simula acá para
// poder probar el camino real (verificación del token) en vez de solo el
// 503 de "no configurado".
vi.mock("@/lib/config/env", () => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-de-prueba",
    TICKET_SIGNING_SECRET: undefined,
  },
}));

const { POST } = await import("./route");

function requestWithAuth(header: string | null) {
  const headers = new Headers();
  if (header) headers.set("authorization", header);
  return new NextRequest("http://localhost/api/ticket-code", { method: "POST", headers });
}

describe("POST /api/ticket-code", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("responde 401 sin header de Authorization", async () => {
    const res = await POST(requestWithAuth(null));
    expect(res.status).toBe(401);
  });

  it("responde 401 si Supabase rechaza el token", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 401 })));

    const res = await POST(requestWithAuth("Bearer token-invalido"));
    expect(res.status).toBe(401);
  });

  it("devuelve el código firmado del usuario real, no de uno inventado por el cliente", async () => {
    const realUserId = "8f14e45f-ceea-467e-a2b0-1e3f2c9d7a11";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ id: realUserId }), { status: 200 })),
    );

    const res = await POST(requestWithAuth("Bearer token-valido"));
    const body = (await res.json()) as { code: string };

    expect(res.status).toBe(200);
    expect(body.code).toBe(signTicketCode(realUserId));
  });
});
