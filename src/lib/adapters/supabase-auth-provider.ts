import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/config/env";
import type { AuthProvider, AuthSession } from "@/lib/ports";

function getClient(): SupabaseClient {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "En Vercel las inyecta la integración de Supabase; en local, copialas a .env.local.",
    );
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
    const { data, error } = await getClient().auth.signUp({ email, password });
    if (error) throw error;
    if (!data.session) {
      throw new Error(
        "Supabase no devolvió una sesión activa tras el registro — probablemente requiere confirmación de email.",
      );
    }
    return toAuthSession(data.session);
  }

  async signIn(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return toAuthSession(data.session);
  }

  async signOut(): Promise<void> {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  }

  async getSession(): Promise<AuthSession | null> {
    const { data, error } = await getClient().auth.getSession();
    if (error) throw error;
    return data.session ? toAuthSession(data.session) : null;
  }
}
