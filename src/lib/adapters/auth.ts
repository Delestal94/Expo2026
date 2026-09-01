import { env } from "@/lib/config/env";
import type { AuthProvider } from "@/lib/ports";
import { SupabaseAuthProvider } from "./supabase-auth-provider";

/**
 * Fábrica del adaptador de auth activo, seleccionado por AUTH_PROVIDER
 * (ver ADR-0002). El código de negocio llama a esto, nunca instancia
 * un adaptador concreto directamente.
 */
export function createAuthProvider(): AuthProvider {
  switch (env.AUTH_PROVIDER) {
    case "supabase":
      return new SupabaseAuthProvider();
    case "clerk":
    case "nextauth":
      throw new Error(`Adaptador de auth "${env.AUTH_PROVIDER}" todavía no está implementado.`);
  }
}
