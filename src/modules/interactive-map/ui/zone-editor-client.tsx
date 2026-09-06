"use client";

import dynamic from "next/dynamic";

/**
 * El editor arranca desde el borrador guardado en `localStorage`, que no existe
 * en el servidor: si se renderiza en SSR, el HTML del server (plano base) no
 * coincide con el primer render del cliente (borrador guardado) y React tira un
 * error de hidratación. Como es una herramienta interna sin necesidad de SSR ni
 * SEO, se carga solo en el cliente.
 */
const ZoneEditorImpl = dynamic(() => import("./zone-editor").then((m) => m.ZoneEditor), {
  ssr: false,
  loading: () => (
    <p className="rounded-2xl border border-line bg-[#121022] p-6 text-sm text-paper-dim">
      Cargando editor…
    </p>
  ),
});

export function ZoneEditorClient() {
  return <ZoneEditorImpl />;
}
