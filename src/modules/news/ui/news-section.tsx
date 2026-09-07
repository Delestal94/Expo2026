"use client";

import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { Reveal } from "@/lib/ui/reveal";
import { useSectionReveal } from "@/lib/ui/use-section-reveal";
import { NEWS_ITEMS } from "./news-data";

/** Enlace interno (ancla de la misma página) vs. nota de prensa externa. */
function isInternal(href: string) {
  return href.startsWith("#");
}

/** 4 colores de marca correspondientes a los 4 estratos minerales de ExpoJuy */
const CARD_COLORS = [
  "var(--color-cyan)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "var(--color-lavender)",
];

const SECTION_WASH = {
  background: [
    "radial-gradient(ellipse 800px 480px at 10% 0%, color-mix(in srgb, var(--color-cyan) 8%, transparent), transparent 65%)",
    "radial-gradient(ellipse 750px 480px at 90% 100%, color-mix(in srgb, var(--color-violet) 8%, transparent), transparent 65%)",
  ].join(", "),
};

/**
 * Desplazamiento lateral de entrada de cada tarjeta: las de los extremos
 * llegan desde más afuera que las del centro, así la grilla se cierra hacia
 * adentro en vez de aparecer en bloque. Se anulan en una sola columna
 * (mobile), donde no hay "afuera" que justifique el gesto.
 */
const CARD_ENTRANCE_X = [-45, -15, 15, 45];

export function NewsSection() {
  const t = useTranslations("News");
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>();

  return (
    <section
      id="noticias"
      ref={sectionRef}
      className="relative overflow-x-clip border-t border-line px-6 py-20 sm:px-10 lg:px-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SECTION_WASH} />
      <EntranceVein color="var(--color-cyan)" />

      <Reveal revealed={revealed} y={35} scale={1} className="relative">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>
      </Reveal>

      <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {NEWS_ITEMS.map((item, index) => {
          const color = CARD_COLORS[index % CARD_COLORS.length]!;

          return (
            <Reveal
              key={item.id}
              revealed={revealed}
              // 90ms entre hermanas: la grilla se arma, no aparece. El
              // encabezado abre y la última tarjeta cierra a los ~970ms.
              delay={160 + index * 90}
              x={CARD_ENTRANCE_X[index] ?? 0}
              y={50}
              scale={0.94}
              className="max-sm:[--reveal-x:0px]"
            >
            <article
              className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-b from-surface via-surface/95 to-surface/85 p-6 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-2 hover:border-paper/35 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Resplandor ambiental de acento en hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ backgroundColor: color }}
              />

              {/* Vena superior con degradé al color mineral del card */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] origin-top opacity-40 transition-[transform,opacity] duration-300 motion-reduce:transition-none group-hover:scale-y-150 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                }}
              />

              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full motion-safe:animate-pulse"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    <span
                      className="font-mono text-[0.65rem] font-semibold tracking-[0.15em] uppercase"
                      style={{ color }}
                    >
                      {t(`items.${item.id}.tag`)}
                    </span>
                  </div>
                  <span className="font-mono text-[0.65rem] text-paper-dim/80">{item.date}</span>
                </div>

                <h3 className="font-display text-lg leading-snug font-medium text-paper transition-colors duration-200 group-hover:text-paper">
                  {t(`items.${item.id}.title`)}
                </h3>

                <p className="text-sm leading-relaxed text-paper-dim">{t(`items.${item.id}.excerpt`)}</p>
              </div>

              <div className="relative pt-2">
                <a
                  href={item.href}
                  target={isInternal(item.href) ? undefined : "_blank"}
                  rel={isInternal(item.href) ? undefined : "noopener noreferrer"}
                  className="group/link inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-paper/90 transition-colors duration-200 hover:text-accent"
                >
                  <span className="underline underline-offset-4 decoration-line transition-colors group-hover/link:decoration-accent">
                    {isInternal(item.href) ? t("readOnSite") : t("readOnSource", { source: item.source })}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
                  >
                    {isInternal(item.href) ? "→" : "↗"}
                  </span>
                </a>
              </div>
            </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
