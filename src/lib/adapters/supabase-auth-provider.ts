import { GoTrueClient, type Session } from "@supabase/auth-js";
import { env } from "@/lib/config/env";
import type { AuthProvider, AuthSession } from "@/lib/ports";

/**
 * `@supabase/auth-js` en vez de `@supabase/supabase-js` completo (issue
 * #69): el meta-paquete arrastra `realtime-js` (con un polyfill de Buffer
 * de Node) más `postgrest-js`, `storage-js` y `functions-js`, ninguno de
 * los cuales se usa acá — solo `.auth.*`. `auth-js` expone el mismo
 * `GoTrueClient` que `supabase-js` usa internamente para `.auth`.
 *
 * El `storageKey` se arma exactamente como lo hace `supabase-js`
 * (`sb-<primer-segmento-del-hostname>-auth-token`) a propósito: si se
 * usara un storageKey distinto, cualquier sesión que un visitante ya
 * tuviera guardada en `localStorage` de una visita anterior quedaría
 * huérfana y lo desloguearía sin aviso.
 */
function getClient(): GoTrueClient {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "En Vercel las inyecta la integración de Supabase; en local, copialas a .env.local.",
    );
  }

  const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];

  return new GoTrueClient({
    url: `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    storageKey: `sb-${projectRef}-auth-token`,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: typeof window !== "undefined",
  });
}

function toAuthSession(session: Session): AuthSession {
  if (!session.user.email) {
    throw new Error("La sesión de Supabase no tiene email — no debería pasar con login por password.");
  }
  return {
    user: { id: session.user.id, email: session.user.email },
    accessToken: session.access_token,
  };
}

/** Adaptador real del puerto AuthProvider sobre Supabase Auth (ver ADR-0002). */
export class SupabaseAuthProvider implements AuthProvider {
  async signUp(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await getClient().signUp({ email, password });
    if (error) throw error;
    if (!data.session) {
      throw new Error(
        "Supabase no devolvió una sesión activa tras el registro — probablemente requiere confirmación de email.",
      );
    }
    return toAuthSession(data.session);
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await getClient().signInWithPassword({ email, password });
    if (error) throw error;
    return toAuthSession(data.session);
  }

  async signOut(): Promise<void> {
    const { error } = await getClient().signOut();
    if (error) throw error;
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await getClient().getSession();
    if (error) throw error;
    return data.session ? toAuthSession(data.session) : null;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await getClient().resetPasswordForEmail(email);
    if (error) throw error;
  }
}
