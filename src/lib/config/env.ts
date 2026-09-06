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
    // "paid" es la decisión de trabajo (ver ADR-0003): se asume el mismo
    // esquema pago de la edición 2024 hasta que la Cámara confirme el de
    // 2026. El checkout real sigue sin credenciales de Mercado Pago (issue
    // #3) — ver PAYMENT_PROVIDER y MERCADOPAGO_ACCESS_TOKEN más abajo.
    ADMISSION_MODE: z.enum(["free", "paid"]).default("paid"),
    // Firma HMAC del código de admisión (issue #57) — nunca se expone al
    // cliente. Sin esto configurado, cae a un secreto fijo de desarrollo
    // (marcado como inseguro): alcanza para no romper `npm run dev` sin
    // .env.local, pero en producción hace falta un valor real en Vercel.
    TICKET_SIGNING_SECRET: z.string().min(16).optional(),
    // Credencial del adaptador de Mercado Pago (issue #3/#7) — todavía no
    // configurada: no existe una cuenta de Mercado Pago para el proyecto.
    // El adaptador (`mercadopago-payment-provider.ts`) ya está escrito y
    // testeado con fetch mockeado; falta este valor real para que
    // `charge()`/`verify()` puedan pegarle a la API real de Mercado Pago.
    MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  },
  client: {
    // Opcionales a propósito: los inyecta la integración de Supabase en
    // Vercel (producción/staging/preview), pero CI y un checkout local
    // sin .env.local no las tienen — no deben tirar abajo el build.
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
