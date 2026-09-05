"use client";

import { useEffect, useRef } from "react";
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

function EjeCard({
  eje,
  cardStyle,
  className = "",
}: {
  eje: Eje;
  cardStyle?: React.CSSProperties;
  className?: string;
}) {
  const t = useTranslations("Landing.Ejes");

  return (
    <article
      style={cardStyle}
      className={`group relative flex w-[82vw] shrink-0 snap-start flex-col gap-4 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-[#120f26]/95 via-ink to-[#0c0a1a] px-8 py-7 transition-all duration-500 hover:border-paper/25 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] sm:w-auto sm:shrink ${className}`}
    >
      {/* Destello metálico sutil y pausado en hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1200 ease-in-out group-hover:translate-x-[200%]"
      />
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
        className="pointer-events-none absolute right-4 bottom-0 select-none font-display text-[5.5rem] leading-none font-black tracking-tighter opacity-[0.06] transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-20 sm:text-[6.5rem]"
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
  );
}

export function Ejes() {
  const t = useTranslations("Landing.Ejes");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const maxProg = [0, 0, 0, 0];
    let allCompleted = false;

    function update() {
      if (!section || allCompleted) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 800;
      const sectionTop = rect.top;

      // Cálculo de ventanas progresivas para entrada escalonada alternada:
      // 01: Izquierda (0.85 a 0.62)
      // 02: Derecha   (0.70 a 0.48)
      // 03: Izquierda (0.52 a 0.30)
      // 04: Derecha   (0.36 a 0.14)
      const windows = [
        { start: 0.85, end: 0.62, dir: -1 }, // 01 izq
        { start: 0.70, end: 0.48, dir: 1 },  // 02 der
        { start: 0.52, end: 0.30, dir: -1 }, // 03 izq
        { start: 0.36, end: 0.14, dir: 1 },  // 04 der
      ];

      let completedCount = 0;

      windows.forEach(({ start, end, dir }, i) => {
        const startY = viewH * start;
        const endY = viewH * end;
        const currentProg = Math.min(
          Math.max((startY - sectionTop) / (startY - endY), 0),
          1,
        );
        // El progreso solo avanza; no retrocede al scrollear hacia arriba
        maxProg[i] = Math.max(maxProg[i]!, currentProg);
        const prog = maxProg[i]!;

        if (prog >= 1) {
          completedCount++;
        }

        const x = (1 - prog) * (dir * 75);
        const opacity = Math.min(1, prog * 1.3);

        section.style.setProperty(`--eje-${i}-x`, `${x.toFixed(1)}px`);
        section.style.setProperty(`--eje-${i}-opacity`, opacity.toFixed(3));
      });

      if (completedCount === windows.length) {
        allCompleted = true;
        // Al completarse al 100%, dejamos fijos los valores finales y desconectamos el scroll
        windows.forEach((_, i) => {
          section.style.setProperty(`--eje-${i}-x`, "0px");
          section.style.setProperty(`--eje-${i}-opacity`, "1");
        });
        window.removeEventListener("scroll", onScroll);
      }

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
      id="ejes"
      className="relative scroll-mt-20 lg:scroll-mt-24 px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-18 overflow-x-clip"
    >
      <EntranceVein color="var(--color-violet)" />
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("eyebrow")}
      </span>

      <div className="relative -mx-6 mt-8 sm:mx-0 sm:mt-10">
        {/* Mobile: carrusel horizontal nativo con snap (01, 02, 03, 04 secuencial) */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
          {EJES.map((eje) => (
            <EjeCard key={eje.n} eje={eje} />
          ))}
        </div>

        {/* Desktop: dos columnas con entrada escalonada alternada al scrollear (01 izq, 02 der, 03 izq, 04 der) */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-x-6 lg:gap-x-8">
          {/* Columna izquierda: 01 y 03 */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <EjeCard
              eje={EJES[0]}
              className="will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              cardStyle={{
                transform: "translate3d(var(--eje-0-x, 0px), 0, 0)",
                opacity: "var(--eje-0-opacity, 1)",
              }}
            />
            <EjeCard
              eje={EJES[2]}
              className="will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              cardStyle={{
                transform: "translate3d(var(--eje-2-x, 0px), 0, 0)",
                opacity: "var(--eje-2-opacity, 1)",
              }}
            />
          </div>

          {/* Columna derecha: 02 y 04 escalonados con mt simétrico */}
          <div className="flex flex-col gap-6 sm:mt-6 lg:mt-8 lg:gap-8">
            <EjeCard
              eje={EJES[1]}
              className="will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              cardStyle={{
                transform: "translate3d(var(--eje-1-x, 0px), 0, 0)",
                opacity: "var(--eje-1-opacity, 1)",
              }}
            />
            <EjeCard
              eje={EJES[3]}
              className="will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              cardStyle={{
                transform: "translate3d(var(--eje-3-x, 0px), 0, 0)",
                opacity: "var(--eje-3-opacity, 1)",
              }}
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden"
        />
      </div>
    </section>
  );
}
