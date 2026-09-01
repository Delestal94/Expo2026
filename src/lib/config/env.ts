import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Selección de adaptador por puerto (ver ADR-0002) y modo de acceso
 * (ver ADR-0003). Falla al arrancar la app si algo tiene un valor
 * inválido, en vez de romper a mitad de una compra en producción.
 *
 * Las credenciales reales de cada proveedor se agregan a este schema
 * a medida que se implementa su adaptador — hoy no existen todavía.
 */
export const env = createEnv({
  server: {
    PAYMENT_PROVIDER: z.enum(["mercadopago", "stripe", "modo"]).default("mercadopago"),
    CMS_PROVIDER: z.enum(["sanity", "payload", "contentful"]).default("sanity"),
    AUTH_PROVIDER: z.enum(["supabase", "clerk", "nextauth"]).default("supabase"),
    AI_PROVIDER: z.enum(["claude", "openai"]).default("claude"),
    EMAIL_PROVIDER: z.enum(["resend", "postmark", "ses"]).default("resend"),
    STORAGE_PROVIDER: z.enum(["r2", "s3", "supabase"]).default("r2"),
    REALTIME_PROVIDER: z.enum(["supabase", "pusher", "ably"]).default("supabase"),
    ADMISSION_MODE: z.enum(["free", "paid"]).default("free"),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {},
});
