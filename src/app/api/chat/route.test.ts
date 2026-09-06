import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
    delete process.env.OPENROUTER_API_KEY;
  });

  it("responde 400 si falta el mensaje", async () => {
    const { POST } = await import("./route");
    const res = await POST(request({}));
    expect(res.status).toBe(400);
  });

  it("sin OPENROUTER_API_KEY, cae al mock sin llamar a fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const res = await POST(request({ message: "hola", locale: "es-AR" }));
    const body = (await res.json()) as { response: string };

    expect(res.status).toBe(200);
    expect(body.response).toMatch(/asistente oficial/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("inyecta contexto del sitio (RAG-lite, issue #9) cuando la pregunta coincide con la FAQ", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "respuesta del modelo" } }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    const res = await POST(request({ message: "¿cuánto sale la entrada?", locale: "es-AR" }));
    expect(res.status).toBe(200);

    const [, init] = fetchMock.mock.calls[0]!;
    const sentBody = JSON.parse((init as RequestInit).body as string);
    const systemMessages = sentBody.messages.filter((m: { role: string }) => m.role === "system");

    expect(systemMessages.length).toBeGreaterThanOrEqual(2);
    expect(systemMessages.some((m: { content: string }) => /entrada era paga/i.test(m.content))).toBe(true);
  });

  it("no agrega mensaje de contexto extra si no hay nada relevante en el corpus", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: "hola" } }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const { POST } = await import("./route");
    await POST(request({ message: "hola", locale: "es-AR" }));

    const [, init] = fetchMock.mock.calls[0]!;
    const sentBody = JSON.parse((init as RequestInit).body as string);
    const systemMessages = sentBody.messages.filter((m: { role: string }) => m.role === "system");

    expect(systemMessages.length).toBe(1);
  });
});
