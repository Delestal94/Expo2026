import { createHmac } from "node:crypto";
import { env } from "@/lib/config/env";

/**
 * Secreto de desarrollo, público a propósito: sin esto, `npm run dev` y
 * los tests se rompen para cualquiera que clone el repo sin configurar
 * `.env.local`. NO es un control de seguridad — en producción, Vercel
 * inyecta `TICKET_SIGNING_SECRET` real y este valor nunca se usa.
 */
const DEV_FALLBACK_SECRET = "expojuy2026-dev-only-insecure-secret-do-not-use-in-prod";

const TICKET_PREFIX = "EXPOJUY26-";

/**
 * Código de ingreso mostrado en el QR de admisión (ver ADR-0003: en modo
 * `free`, el QR se emite al completar el registro, sin pasar por cobro).
 *
 * Antes se derivaba truncando el UUID del usuario a 8 hex, sin firma —
 * cualquiera que conociera el formato podía construir un código con pinta
 * válida sin haberse registrado (issue #57). Ahora es un HMAC-SHA256 del
 * id de usuario con un secreto que solo vive en el servidor
 * (`TICKET_SIGNING_SECRET`): sin ese secreto, no se puede forjar un
 * código que pase la verificación futura del gate de acceso.
 *
 * Solo se debe llamar desde código de servidor (la ruta
 * `/api/ticket-code`, nunca desde un componente `"use client"`) — de eso
 * se encarga el propio import de `node:crypto`, que no existe en el
 * bundle de browser.
 */
export function signTicketCode(userId: string): string {
  const secret = env.TICKET_SIGNING_SECRET ?? DEV_FALLBACK_SECRET;
  const signature = createHmac("sha256", secret).update(userId).digest("hex");
  return `${TICKET_PREFIX}${signature.slice(0, 8).toUpperCase()}`;
}
