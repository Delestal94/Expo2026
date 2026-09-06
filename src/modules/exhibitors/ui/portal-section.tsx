import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { getFeatureFlags } from "@/lib/config/flags";
import { AgendaPreview } from "@/modules/business-rounds";
import { Directory } from "./directory";
import { MatchingPreview } from "./matching-preview";
import { PortalEntrance } from "./portal-entrance";

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
    <details className="group rounded-2xl border border-line/80 bg-gradient-to-br from-[#100e22]/90 via-ink to-[#090716]/90 transition-colors duration-300 open:bg-[#121022] hover:border-paper/20">
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
          className="shrink-0 text-paper-dim transition-transform duration-300 group-open:rotate-180 group-open:text-accent motion-reduce:transition-none"
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
      <div className="px-6 pb-8 motion-safe:animate-[strata-settle_0.3s_cubic-bezier(0.16,1,0.3,1)]">{children}</div>
    </details>
  );
}

export async function PortalSection() {
  const [flags, t] = await Promise.all([getFeatureFlags(), getTranslations("Exhibitors.Portal")]);

  return (
    <PortalEntrance
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
    >
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
    </PortalEntrance>
  );
}

