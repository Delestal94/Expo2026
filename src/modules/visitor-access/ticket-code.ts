/**
 * Código de ingreso mostrado en el QR de admisión (ver ADR-0003: en modo
 * `free`, el QR se emite al completar el registro, sin pasar por cobro).
 * Se deriva del id de usuario de Supabase — ya es único por visitante,
 * así que alcanza con un prefijo legible y un recorte para mostrarlo
 * corto en pantalla.
 */
export function admissionTicketCode(userId: string): string {
  const suffix = userId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `EXPOJUY26-${suffix}`;
}
