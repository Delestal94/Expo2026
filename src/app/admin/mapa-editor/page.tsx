import type { Metadata } from "next";
import { ZoneEditor } from "@/modules/interactive-map";

export const metadata: Metadata = {
  title: "Editor de mapa — ExpoJuy",
  robots: { index: false, follow: false },
};

export default function MapaEditorPage() {
  return (
    <main className="min-h-svh bg-ink px-6 py-10 text-paper sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-2xl font-medium">Editor de mapa del predio</h1>
        <p className="mt-2 max-w-2xl text-sm text-paper-dim">
          Herramienta interna, sin link desde el sitio público ni contraseña — no compartas
          esta URL. Los cambios se guardan en este navegador (localStorage); usá &quot;Exportar
          JSON&quot; para llevarlos al código cuando el layout esté listo para publicarse.
        </p>
        <div className="mt-8">
          <ZoneEditor />
        </div>
      </div>
    </main>
  );
}
