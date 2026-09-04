import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";

interface Eje {
  n: string;
  key: "mineria" | "comercio" | "corredor" | "conocimiento";
  color: string;
}

const EJES: Eje[] = [
  { n: "01", key: "mineria", color: "var(--color-cyan)" },
  { n: "02", key: "comercio", color: "var(--color-violet)" },
  { n: "03", key: "corredor", color: "var(--color-magenta)" },
  { n: "04", key: "conocimiento", color: "var(--color-lavender)" },
];

export function Ejes() {
  const t = useTranslations("Landing.Ejes");

  return (
    <section id="ejes" className="relative px-6 pt-2 pb-16 sm:px-10 sm:pt-4 sm:pb-20 lg:px-16 lg:pt-2 lg:pb-20">
      <EntranceVein color="var(--color-violet)" />
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("eyebrow")}
      </span>

      {/* Mobile: tira con scroll horizontal y snap. Desktop: grilla compacta 2x2 con gap vertical reducido */}
      <div className="relative -mx-6 mt-8 sm:mx-0">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 lg:gap-y-5 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {EJES.map((eje) => (
            <article
              key={eje.n}
              className="group relative flex w-[82vw] shrink-0 snap-start flex-col gap-3.5 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-[#120f26]/95 via-ink to-[#0c0a1a] px-7 py-7 transition-all duration-300 hover:border-paper/25 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] motion-safe:hover:-translate-y-1 sm:w-auto sm:shrink"
            >
              {/* Resplandor mineral ambiental animado */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-15 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-35"
                style={{ backgroundColor: eje.color }}
              />

              {/* Vena de acento superior con degradé */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] opacity-50 transition-all duration-500 group-hover:h-[3px] group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${eje.color} 50%, transparent 100%)`,
                }}
              />

              {/* Marca de agua numeral con profundidad */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 bottom-0 select-none font-display text-[5.5rem] leading-none font-black tracking-tighter opacity-[0.06] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:opacity-20 sm:text-[6.5rem]"
                style={{ color: eje.color }}
              >
                {eje.n}
              </span>

              {/* Cabecera con indicador mineral pulsante */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full motion-safe:animate-pulse"
                    style={{ backgroundColor: eje.color, boxShadow: `0 0 10px ${eje.color}` }}
                  />
                  <span className="font-mono text-xs font-semibold tracking-[0.16em] text-paper-dim uppercase">
                    Eje {eje.n}
                  </span>
                </div>
                <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.18em] text-paper-dim/80 uppercase transition-colors group-hover:border-paper/30">
                  2026
                </span>
              </div>

              <h3 className="relative font-display text-xl font-medium text-paper sm:text-2xl">
                {t(`items.${eje.key}.title`)}
              </h3>
              <p className="relative text-balance text-sm leading-relaxed text-paper-dim sm:text-base">
                {t(`items.${eje.key}.description`)}
              </p>
            </article>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden"
        />
      </div>
    </section>
  );
}
