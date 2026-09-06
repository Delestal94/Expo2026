import { RealtimeClient } from "@supabase/realtime-js";
import { env } from "@/lib/config/env";
import type { PresenceProvider } from "@/lib/ports";

/**
 * Adaptador real del puerto PresenceProvider sobre Supabase Realtime (ver
 * ADR-0002 e issue #10: "estado de sesiones en vivo" sobre el plano del
 * predio). Usa `@supabase/realtime-js` directo, no `@supabase/supabase-js`
 * completo — mismo criterio que el swap de auth del issue #69, aunque acá
 * agregar la funcionalidad implica sumar de vuelta un cliente de Realtime.
 *
 * Nunca se pudo probar contra un proyecto de Supabase real en este
 * entorno (no hay `.env.local` con credenciales) — se verifica una vez
 * desplegado, donde Vercel sí inyecta las credenciales reales.
 */
export class SupabasePresenceProvider implements PresenceProvider {
  private client: RealtimeClient | null = null;

  private getClient(): RealtimeClient | null {
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // Sin credenciales no hay presencia en vivo — el mapa sigue
      // funcionando igual, solo sin el contador de gente conectada.
      return null;
    }
    if (!this.client) {
      const wsUrl = `${env.NEXT_PUBLIC_SUPABASE_URL.replace(/^http/, "ws")}/realtime/v1`;
      this.client = new RealtimeClient(wsUrl, {
        params: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
      });
    }
    return this.client;
  }

  joinChannel(channelName: string, onCountChange: (count: number) => void): () => void {
    const client = this.getClient();
    if (!client) return () => {};

    const presenceKey = Math.random().toString(36).slice(2, 10);
    const channel = client.channel(channelName, { config: { presence: { key: presenceKey } } });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        onCountChange(Object.keys(state).length);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }
}
