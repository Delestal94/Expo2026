import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { getFeatureFlags } from "@/lib/config/flags";
import { EntranceVein } from "@/lib/ui/entrance-vein";
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
  const [flags, t] = await Promise.all([getFeatureFlags(), getTranslations("Exhibitors.Portal")]);

  return (
    <section id="expositores" className="relative border-t border-line px-6 py-24 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-cyan)" />
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>

      <div className="mt-10">
        <Directory />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <SectionDisclosure eyebrow={t("howItWorksEyebrow")} title={t("howItWorksTitle")}>
          <MatchingPreview />
        </SectionDisclosure>

        {flags.businessRounds && (
          <SectionDisclosure eyebrow={t("agendaEyebrow")} title={t("agendaTitle")}>
            <AgendaPreview />
          </SectionDisclosure>
        )}
      </div>

      <p className="mt-8 text-sm text-paper-dim">
        {t.rich("footerNote", {
          link: (chunks) => (
            <a href="#acceso" className="text-accent underline underline-offset-2 hover:brightness-110">
              {chunks}
            </a>
          ),
        })}
      </p>
    </section>
  );
}
