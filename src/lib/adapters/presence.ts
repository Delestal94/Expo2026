import { env } from "@/lib/config/env";
import type { PresenceProvider } from "@/lib/ports";
import { SupabasePresenceProvider } from "./supabase-presence-provider";

/**
 * Fábrica del adaptador de presencia activo, seleccionado por
 * REALTIME_PROVIDER (ver ADR-0002). El código de negocio llama a esto,
 * nunca instancia un adaptador concreto directamente.
 */
export function createPresenceProvider(): PresenceProvider {
  switch (env.REALTIME_PROVIDER) {
    case "supabase":
      return new SupabasePresenceProvider();
    case "pusher":
    case "ably":
      throw new Error(`Adaptador de presencia "${env.REALTIME_PROVIDER}" todavía no está implementado.`);
  }
}
