import { env } from "@/lib/config/env";
import type { ChargeInput, ChargeResult, PaymentProvider } from "@/lib/ports";

const MP_API_BASE = "https://api.mercadopago.com";

function requireAccessToken(): string {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error(
      "Falta MERCADOPAGO_ACCESS_TOKEN. Todavía no existe una cuenta de Mercado Pago para " +
        "el proyecto (issue #3/#7) — copiá un access token real (sandbox alcanza) a .env.local.",
    );
  }
  return env.MERCADOPAGO_ACCESS_TOKEN;
}

interface MpPreferenceResponse {
  id: string;
  init_point: string;
}

interface MpPaymentResponse {
  id: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process";
}

function toChargeStatus(mpStatus: MpPaymentResponse["status"]): ChargeResult["status"] {
  if (mpStatus === "approved") return "approved";
  if (mpStatus === "rejected" || mpStatus === "cancelled" || mpStatus === "refunded") return "rejected";
  return "pending";
}

/**
 * Adaptador real del puerto PaymentProvider sobre la API de Mercado Pago
 * (ver ADR-0002 y issue #3/#7). Usa `fetch` directo contra la REST API en
 * vez del SDK oficial — evita sumar una dependencia nueva y hace que el
 * adaptador sea testeable con `fetch` mockeado, igual que `api/chat/route.ts`.
 *
 * Sin `MERCADOPAGO_ACCESS_TOKEN` configurado (todavía no hay cuenta real
 * para el proyecto), `charge()`/`verify()` fallan con un error explícito
 * en vez de silenciarlo — mejor un 500 claro que un pago fantasma.
 */
export class MercadoPagoPaymentProvider implements PaymentProvider {
  async charge(input: ChargeInput): Promise<ChargeResult> {
    const accessToken = requireAccessToken();

    const response = await fetch(`${MP_API_BASE}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: input.description,
            quantity: 1,
            currency_id: input.currency,
            unit_price: input.amountInCents / 100,
          },
        ],
        payer: { email: input.payerEmail },
      }),
    });

    if (!response.ok) {
      throw new Error(`Mercado Pago rechazó la preferencia de pago (HTTP ${response.status}).`);
    }

    const preference = (await response.json()) as MpPreferenceResponse;
    return { id: preference.id, status: "pending", checkoutUrl: preference.init_point };
  }

  async verify(chargeId: string): Promise<ChargeResult> {
    const accessToken = requireAccessToken();

    const response = await fetch(`${MP_API_BASE}/v1/payments/${chargeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Mercado Pago no encontró el pago ${chargeId} (HTTP ${response.status}).`);
    }

    const payment = (await response.json()) as MpPaymentResponse;
    return {
      id: String(payment.id),
      status: toChargeStatus(payment.status),
      checkoutUrl: "",
    };
  }
}
