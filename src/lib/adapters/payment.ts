import { env } from "@/lib/config/env";
import type { PaymentProvider } from "@/lib/ports";
import { MercadoPagoPaymentProvider } from "./mercadopago-payment-provider";

/**
 * Fábrica del adaptador de pago activo, seleccionado por PAYMENT_PROVIDER
 * (ver ADR-0002). El código de negocio llama a esto, nunca instancia un
 * adaptador concreto directamente.
 */
export function createPaymentProvider(): PaymentProvider {
  switch (env.PAYMENT_PROVIDER) {
    case "mercadopago":
      return new MercadoPagoPaymentProvider();
    case "stripe":
    case "modo":
      throw new Error(`Adaptador de pago "${env.PAYMENT_PROVIDER}" todavía no está implementado.`);
  }
}
