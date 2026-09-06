"use client";

import { useEffect, useState } from "react";
import { SupabasePresenceProvider } from "@/lib/adapters/supabase-presence-provider";

/**
 * Va directo al adaptador de Supabase, no a `createPresenceProvider()`
 * (la fábrica que switchea por `REALTIME_PROVIDER`): esa variable está
 * declarada `server`-only en `env.ts`, y este hook corre en el navegador
 * — llamarla desde acá tira "Attempted to access a server-side
 * environment variable on the client" (@t3-oss/env-core), incluso en
 * producción, no solo en tests. Mismo problema latente que ya tenía
 * `createAuthProvider()` en `access-form.tsx` con `AUTH_PROVIDER`, que no
 * se toca en este cambio por quedar fuera de alcance (ver comentario en
 * el PR). Si en algún momento hace falta elegir proveedor de Realtime en
 * runtime desde el cliente, la variable tendría que pasar a
 * `NEXT_PUBLIC_REALTIME_PROVIDER`.
 */
export function useMapPresence(channelName = "mapa-predio"): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const provider = new SupabasePresenceProvider();
    const leave = provider.joinChannel(channelName, setCount);
    return leave;
  }, [channelName]);

  return count;
}
