import { Directory } from "./directory";
import { MatchingPreview } from "./matching-preview";

export function PortalSection() {
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
    </section>
  );
}
