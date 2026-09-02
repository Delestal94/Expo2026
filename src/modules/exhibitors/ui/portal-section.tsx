import { getFeatureFlags } from "@/lib/config/flags";
import { AgendaPreview } from "@/modules/business-rounds";
import { Directory } from "./directory";
import { MatchingPreview } from "./matching-preview";

export async function PortalSection() {
  const flags = await getFeatureFlags();

  return (
    <section className="border-t border-line px-6 py-24 sm:px-10 lg:px-16">
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        Portal de expositores
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        No es un directorio — es quien conecta las rondas de negocios
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">
        Perfiles de ejemplo para este prototipo, organizados por eje. El
        sistema sugiere con quién reunirse según rubro y objetivo comercial en
        común.
      </p>

      <div className="mt-10">
        <Directory />
      </div>

      <div className="mt-10">
        <MatchingPreview />
      </div>

      {flags.businessRounds && (
        <div className="mt-10">
          <AgendaPreview />
        </div>
      )}

      <p className="mt-8 text-sm text-paper-dim">
        Estos son perfiles de ejemplo — el alta real de tu empresa se hace por
        la convocatoria oficial de la Cámara, no desde este portal (
        <a href="#acceso" className="text-accent underline underline-offset-2 hover:brightness-110">
          ver cómo postularte
        </a>
        ).
      </p>
    </section>
  );
}
