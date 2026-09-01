export interface ChargeInput {
  amountInCents: number;
  currency: "ARS";
  description: string;
  payerEmail: string;
}

export interface ChargeResult {
  id: string;
  status: "pending" | "approved" | "rejected";
  checkoutUrl: string;
}

/**
 * Puerto para cualquier pasarela de pago (ver ADR-0002).
 * El código de negocio depende solo de esta interfaz — nunca del SDK
 * concreto de Mercado Pago, Stripe, etc. — para poder cambiar de
 * proveedor cambiando un adaptador y una variable de entorno.
 */
export interface PaymentProvider {
  charge(input: ChargeInput): Promise<ChargeResult>;
  verify(chargeId: string): Promise<ChargeResult>;
}
