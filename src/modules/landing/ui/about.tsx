"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";

const STATS = [
  { key: "edition", value: "17ª", color: "var(--color-cyan)" },
  { key: "days", value: "4", color: "var(--color-violet)" },
  { key: "stands", value: "+200", color: "var(--color-magenta)" },
  { key: "dates", value: "9 al 12 OCT", color: "var(--color-lavender)" },
] as const;

/** Cada banda corta distinto, como un afloramiento real — no una grilla prolija. */
const BAND_WIDTH = [
  "w-full",
  "w-full sm:w-[91%]",
  "w-full sm:w-[98%]",
  "w-full sm:w-[83%]",
];

export function About() {
  const t = useTranslations("Landing.About");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 800;

      // El progreso avanza mientras la sección recorre el viewport
      const startY = viewH * 0.85;
      const endY = -rect.height * 0.2;
      const progress = Math.min(Math.max((startY - rect.top) / (startY - endY), 0), 1);

      // ── ENTRADA DEL TEXTO (Desde el centro hacia la izquierda) ──
      // De progress 0 a 0.35: el texto entra desde el centro (x: +80px) hacia su columna (x: 0px)
      const textProgress = Math.min(Math.max(progress / 0.32, 0), 1);
      const textX = (1 - textProgress) * 70;
      const textY = (1 - textProgress) * 30;
      const textOpacity = Math.min(1, textProgress * 1.3);
      const textBlur = (1 - textProgress) * 6;

      section.style.setProperty("--about-text-x", `${textX.toFixed(1)}px`);
      section.style.setProperty("--about-text-y", `${textY.toFixed(1)}px`);
      section.style.setProperty("--about-text-opacity", textOpacity.toFixed(3));
      section.style.setProperty("--about-text-blur", `${textBlur.toFixed(1)}px`);

      // ── CARGA SECUENCIAL DE LAS 4 BARRAS DE ESTRATOS CON EL SCROLL ──
      // Intervalos progresivos para que cada barra se llene en cascada:
      // Barra 0: 0.18 a 0.40
      // Barra 1: 0.32 a 0.54
      // Barra 2: 0.46 a 0.68
      // Barra 3: 0.60 a 0.82
      const barWindows = [
        [0.18, 0.40],
        [0.32, 0.54],
        [0.46, 0.68],
        [0.60, 0.82],
      ];

      barWindows.forEach(([start, end], i) => {
        const barProg = Math.min(Math.max((progress - start) / (end - start), 0), 1);
        const barScale = barProg;
        const barOpacity = Math.min(1, barProg * 1.5);
        section.style.setProperty(`--bar-${i}-scale`, barScale.toFixed(3));
        section.style.setProperty(`--bar-${i}-opacity`, barOpacity.toFixed(3));
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="relative scroll-mt-20 lg:scroll-mt-24 border-b border-line px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-18"
    >
      <EntranceVein color="var(--color-cyan)" />
      <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-12 lg:items-center">
        {/* Bloque de texto con entrada desde el centro hacia la izquierda */}
        <div
          className="lg:col-span-7 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:filter-none"
          style={{
            transform:
              "translate3d(var(--about-text-x, 0px), var(--about-text-y, 0px), 0)",
            opacity: "var(--about-text-opacity, 1)",
            filter: "blur(var(--about-text-blur, 0px))",
          }}
        >
          <p className="text-balance font-display text-2xl leading-relaxed font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionIntro")}
          </p>
          <p className="my-2.5 font-display text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.85] font-black tracking-tight text-accent drop-shadow-[0_0_25px_rgba(0,240,255,0.25)] sm:my-3">
            {t("descriptionEmphasis")}
          </p>
          <p className="max-w-xl text-balance font-display text-2xl leading-relaxed font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionOutro")}
          </p>
        </div>

        {/* Barras de estadísticas que se cargan secuencialmente con el scroll */}
        <div className="relative lg:col-span-5 lg:col-start-8 lg:self-center">
          {/* Resplandor ambiental de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent blur-2xl opacity-50"
          />
          <dl className="relative flex flex-col gap-2">
            {STATS.map((stat, i) => (
              <div
                key={stat.key}
                className={`group relative flex flex-col-reverse ${BAND_WIDTH[i]}`}
              >
                <dt
                  className="flex items-center justify-end gap-2 px-6 pt-1.5 pb-2.5 font-mono text-[0.65rem] tracking-[0.16em] text-paper-dim uppercase will-change-transform motion-reduce:opacity-100"
                  style={{
                    opacity: `var(--bar-${i}-opacity, 1)`,
                  }}
                >
                  <span>{t(`stats.${stat.key}`)}</span>
                  <span
                    className="h-1.5 w-1.5 rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: stat.color, boxShadow: `0 0 6px ${stat.color}` }}
                  />
                </dt>
                <dd
                  className="relative flex items-center justify-end overflow-hidden rounded-xl px-7 py-4 font-mono text-3xl font-black text-ink tabular-nums shadow-sm transition-all duration-500 group-hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.4)] sm:py-5 sm:text-4xl lg:text-5xl will-change-transform motion-reduce:transform-none"
                  style={{
                    backgroundColor: stat.color,
                    transformOrigin: "left center",
                    transform: `scaleX(var(--bar-${i}-scale, 1))`,
                  }}
                >
                  {/* Destello metálico sutil y pausado en hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1200 ease-in-out group-hover:translate-x-[200%]"
                  />
                  <div
                    className="relative z-10 transition-opacity duration-300"
                    style={{
                      opacity: `var(--bar-${i}-opacity, 1)`,
                    }}
                  >
                    {stat.key === "dates" ? (
                      <span>
                        9<span className="mx-1.5 text-[0.52em] font-normal tracking-normal lowercase opacity-75">al</span>12 OCT
                      </span>
                    ) : (
                      <span>{stat.value}</span>
                    )}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
