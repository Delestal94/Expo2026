import type { ReactNode } from "react";
import { getFeatureFlags } from "@/lib/config/flags";
import { AgendaPreview } from "@/modules/business-rounds";
import { Directory } from "./directory";
import { MatchingPreview } from "./matching-preview";

/**
 * El directorio (arriba) es la acción principal de la sección — se ve
 * siempre. El resto (cómo funciona el matching, agenda de ejemplo) es
 * contexto de apoyo: queda plegado por defecto para no duplicar el peso
 * visual del directorio y evitar que la sección domine el largo de la
 * página. <details> nativo: accesible por teclado y lector de pantalla
 * sin JS adicional.
 */
function SectionDisclosure({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-line open:bg-[#121022]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <span>
          <span className="block font-mono text-xs tracking-[0.2em] text-accent uppercase">
            {eyebrow}
          </span>
          <span className="mt-1 block font-display text-lg text-paper">{title}</span>
        </span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="shrink-0 text-paper-dim transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        >
          <path
            d="M3 6l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="px-6 pb-8">{children}</div>
    </details>
  );
}

export async function PortalSection() {
  const flags = await getFeatureFlags();

  return (
    <section id="expositores" className="border-t border-line px-6 py-24 sm:px-10 lg:px-16">
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

      <div className="mt-6 flex flex-col gap-4">
        <SectionDisclosure eyebrow="Cómo funciona" title="Cómo sugiere reuniones el sistema">
          <MatchingPreview />
        </SectionDisclosure>

        {flags.businessRounds && (
          <SectionDisclosure eyebrow="Ejemplo" title="Agenda de reuniones">
            <AgendaPreview />
          </SectionDisclosure>
        )}
      </div>

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
