import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/config/env", () => ({
  env: { MERCADOPAGO_ACCESS_TOKEN: undefined as string | undefined },
}));

const envModule = await import("@/lib/config/env");
const env = envModule.env as { MERCADOPAGO_ACCESS_TOKEN: string | undefined };
const { MercadoPagoPaymentProvider } = await import("./mercadopago-payment-provider");

const CHARGE_INPUT = {
  amountInCents: 1_500_00,
  currency: "ARS" as const,
  description: "Entrada ExpoJuy 2026",
  payerEmail: "visitante@expojuy.test",
};

describe("MercadoPagoPaymentProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    env.MERCADOPAGO_ACCESS_TOKEN = undefined;
  });

  it("charge() falla con un error explícito si no hay MERCADOPAGO_ACCESS_TOKEN configurado", async () => {
    const provider = new MercadoPagoPaymentProvider();
    await expect(provider.charge(CHARGE_INPUT)).rejects.toThrow(/MERCADOPAGO_ACCESS_TOKEN/);
  });

  it("charge() crea una preferencia y devuelve su checkout URL", async () => {
    env.MERCADOPAGO_ACCESS_TOKEN = "test-token";
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: "pref-123", init_point: "https://mp.example/checkout/pref-123" }), {
        status: 201,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new MercadoPagoPaymentProvider();
    const result = await provider.charge(CHARGE_INPUT);

    expect(result).toEqual({
      id: "pref-123",
      status: "pending",
      checkoutUrl: "https://mp.example/checkout/pref-123",
    });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.mercadopago.com/checkout/preferences");
    expect((init!.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
  });

  it("charge() propaga un error legible si Mercado Pago rechaza la solicitud", async () => {
    env.MERCADOPAGO_ACCESS_TOKEN = "test-token";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 400 })));

    const provider = new MercadoPagoPaymentProvider();
    await expect(provider.charge(CHARGE_INPUT)).rejects.toThrow(/400/);
  });

  it("verify() traduce los estados de Mercado Pago al vocabulario del puerto", async () => {
    env.MERCADOPAGO_ACCESS_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ id: 999, status: "approved" }), { status: 200 })),
    );

    const provider = new MercadoPagoPaymentProvider();
    const result = await provider.verify("999");

    expect(result.status).toBe("approved");
    expect(result.id).toBe("999");
  });
});
