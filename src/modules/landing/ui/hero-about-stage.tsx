"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { CtaLink } from "./cta-link";
import { LanguageSwitcher } from "./language-switcher";
import { StrataCanvas } from "./strata-canvas";

const ABOUT_LINES: Record<
  string,
  {
    intro1: string;
    intro2: string;
    outro1: string;
    outro2: string;
    outro3: string;
    outro4: string;
    outro5: string;
  }
> = {
  "es-AR": {
    intro1: "Después de dos semanas de formato clásico,",
    intro2: "ExpoJuy se reinventa:",
    outro1: "de rondas de negocios por la mañana",
    outro2: "y exposición por la tarde,",
    outro3: "con la minería del litio",
    outro4: "y el comercio internacional",
    outro5: "como ejes centrales.",
  },
  es: {
    intro1: "Después de dos semanas de formato clásico,",
    intro2: "ExpoJuy se reinventa:",
    outro1: "de rondas de negocios por la mañana",
    outro2: "y exposición por la tarde,",
    outro3: "con la minería del litio",
    outro4: "y el comercio internacional",
    outro5: "como ejes centrales.",
  },
  en: {
    intro1: "After two weeks in its classic format,",
    intro2: "ExpoJuy reinvents itself:",
    outro1: "of morning business rounds",
    outro2: "and afternoon exhibits,",
    outro3: "with lithium mining",
    outro4: "and international trade",
    outro5: "as the central themes.",
  },
  pt: {
    intro1: "Após duas semanas em formato clássico,",
    intro2: "a ExpoJuy se reinventa:",
    outro1: "de rodadas de negócios pela manhã",
    outro2: "e exposição à tarde,",
    outro3: "com a mineração de lítio",
    outro4: "e o comércio internacional",
    outro5: "como eixos centrais.",
  },
  zh: {
    intro1: "在经历了经典的两周形式后，",
    intro2: "ExpoJuy 焕新重塑：",
    outro1: "上午举办商务洽谈，",
    outro2: "下午举办产业展览，",
    outro3: "以锂矿开采",
    outro4: "与国际贸易",
    outro5: "为核心主轴。",
  },
};

const STATS = [
  { key: "edition", value: "17ª", color: "var(--color-cyan)" },
  { key: "days", value: "4", color: "var(--color-violet)" },
  { key: "stands", value: "+200", color: "var(--color-magenta)" },
  { key: "dates", value: "9 al 12 OCT", color: "var(--color-lavender)" },
] as const;

const BAND_WIDTH = [
  "w-full",
  "w-full sm:w-[91%]",
  "w-full sm:w-[98%]",
  "w-full sm:w-[83%]",
];

export function HeroAboutStage() {
  const tHero = useTranslations("Landing.Hero");
  const tAbout = useTranslations("Landing.About");
  const locale = useLocale();
  const lines = ABOUT_LINES[locale] ?? ABOUT_LINES.es;
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const viewH = window.innerHeight || 800;
      const totalScroll = rect.height - viewH;
      if (totalScroll <= 0) return;

      // Progreso normalizado de 0 a 1 dentro de la pista fija
      const progress = Math.min(Math.max(-rect.top / totalScroll, 0), 1);

      // ── ACTO 1: HERO ZOOM-THROUGH Y DESAPARICIÓN DE ESTRATOS (0.00 a 0.20) ──
      const heroZoomProgress = Math.min(Math.max(progress / 0.22, 0), 1);
      const heroMidScale = 1 + heroZoomProgress * 1.8;
      const heroMidOpacity = Math.max(0, 1 - heroZoomProgress * 1.35);
      const heroMidBlur = heroZoomProgress * 8;

      const heroControlsOpacity = Math.max(0, 1 - heroZoomProgress * 2.0);
      const heroControlsY = heroZoomProgress * 30;

      // Las líneas ondulantes se mantienen activas y dejan que el canvas module su estilo tenue y elegante
      const strataOpacity = 1.0;

      stage.style.setProperty("--hero-mid-scale", heroMidScale.toFixed(3));
      stage.style.setProperty("--hero-mid-opacity", heroMidOpacity.toFixed(3));
      stage.style.setProperty("--hero-mid-blur", `${heroMidBlur.toFixed(1)}px`);
      stage.style.setProperty(
        "--hero-controls-opacity",
        heroControlsOpacity.toFixed(3),
      );
      stage.style.setProperty(
        "--hero-controls-y",
        `${heroControlsY.toFixed(1)}px`,
      );
      stage.style.setProperty(
        "--hero-pointer-events",
        heroControlsOpacity < 0.05 ? "none" : "auto",
      );
      stage.style.setProperty(
        "--strata-canvas-opacity",
        strataOpacity.toFixed(3),
      );

      // ── ACTO 2: TEXTO DE ABOUT APARECE CENTRADO EN EL FONDO LIMPIO (0.24 a 0.38) ──
      const textAppearProgress = Math.min(
        Math.max((progress - 0.24) / 0.14, 0),
        1,
      );
      const textOpacity = textAppearProgress;
      const textScale = 0.94 + textAppearProgress * 0.06;
      const textBlur = (1 - textAppearProgress) * 5;

      stage.style.setProperty("--about-text-opacity", textOpacity.toFixed(3));
      stage.style.setProperty("--about-text-scale", textScale.toFixed(3));
      stage.style.setProperty("--about-text-blur", `${textBlur.toFixed(1)}px`);
      stage.style.setProperty(
        "--about-pointer-events",
        textOpacity > 0.05 ? "auto" : "none",
      );

      // ── ACTO 3: TRASLADO ARMONIOSO Y UNIFICADO DEL CENTRO A LA IZQUIERDA (0.42 a 0.68) ──
      const glideProgress = Math.min(
        Math.max((progress - 0.42) / 0.24, 0),
        1,
      );
      // Easing suave (smoothstep cúbico) para que la traslación sea natural y progresiva
      const easedGlide = glideProgress * glideProgress * (3 - 2 * glideProgress);
      // En desktop, 18vw traslada el bloque exactamente al centro horizontal
      const glideX = (1 - easedGlide) * 18;
      stage.style.setProperty("--about-glide-x", `${glideX.toFixed(2)}vw`);

      // ── ACTO 4: CARGA SIMULTÁNEA DE LAS 4 BARRAS (0.68 a 0.86) ──
      const barsProgress = Math.min(
        Math.max((progress - 0.68) / 0.18, 0),
        1,
      );
      const barsScale = barsProgress;
      const barsOpacity = Math.min(1, barsProgress * 2.0);

      // ── ACTO 5: SUBTÍTULOS Y PUNTOS SOLO APARECEN CUANDO LAS BARRAS ESTÁN COMPLETAS (0.86 a 0.95) ──
      const labelsProgress = Math.min(
        Math.max((progress - 0.86) / 0.09, 0),
        1,
      );
      const labelsOpacity = labelsProgress;

      stage.style.setProperty("--bars-scale", barsScale.toFixed(3));
      stage.style.setProperty("--bars-opacity", barsOpacity.toFixed(3));
      stage.style.setProperty("--labels-opacity", labelsOpacity.toFixed(3));

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
      ref={stageRef}
      className="relative h-auto border-b border-line overflow-x-clip motion-safe:h-[280vh]"
    >
      {/* Puntos de anclaje para navegación oficial (#inicio y #sobre) */}
      <div
        id="inicio"
        className="pointer-events-none absolute top-0 left-0 h-screen w-full"
      />
      <div
        id="sobre"
        className="pointer-events-none absolute motion-safe:top-[172vh] top-0 bottom-0 left-0 w-full scroll-mt-0"
      />

      {/* Viewport fijo durante el recorrido scrollytelling */}
      <div className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pt-8 pb-10 sm:px-10 lg:px-16 motion-safe:sticky motion-safe:top-0 motion-safe:h-screen">
        {/* Fondo animado de estratos a todo el ancho (apertura de cañón con el scroll) */}
        <StrataCanvas />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/90"
        />

        {/* ══════════════════════════════════════════════════════════
            CAPA 1: ELEMENTOS HERO (Desaparecen con zoom al centro)
            ══════════════════════════════════════════════════════════ */}

        {/* Navegación superior del Hero */}
        <nav
          className="relative z-20 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase will-change-transform motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_backwards]"
          style={{
            opacity: "var(--hero-controls-opacity, 1)",
            transform: "translate3d(0, calc(-1 * var(--hero-controls-y, 0px)), 0)",
            pointerEvents: "var(--hero-pointer-events, auto)" as React.CSSProperties["pointerEvents"],
          }}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/logos/expojuy-mark.svg"
              alt=""
              width={20}
              height={28}
              className="h-7 w-auto"
            />
            <span>{tHero("eyebrow")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{tHero("edition")}</span>
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Bloque central Hero (Zoom hacia la cámara al scrollear) */}
        <div
          className="pointer-events-none relative z-10 my-auto flex flex-col gap-8 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:filter-none drop-shadow-[0_2px_16px_rgba(7,11,25,0.95)]"
          style={{
            transform: "scale(var(--hero-mid-scale, 1))",
            opacity: "var(--hero-mid-opacity, 1)",
            filter: "blur(var(--hero-mid-blur, 0px))",
          }}
        >
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase drop-shadow-[0_1px_6px_rgba(7,11,25,0.9)] motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.08s_backwards]">
            {tHero("tagline")}
          </span>
          <h1 className="motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.16s_backwards]">
            <Image
              src="/images/logos/expojuy-wordmark-dark.svg"
              alt={tHero("titleAlt")}
              width={1000}
              height={305}
              priority
              className="h-auto w-full max-w-205 drop-shadow-[0_2px_12px_rgba(7,11,25,0.8)]"
            />
          </h1>
          <p className="max-w-xl text-balance font-body text-lg text-paper sm:text-xl drop-shadow-[0_1px_8px_rgba(7,11,25,0.9)] motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.38s_backwards]">
            {tHero("description")}
          </p>
        </div>

        {/* Bloque inferior Hero (Countdown y CTAs) */}
        <div
          className="relative z-20 flex flex-col gap-8 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 sm:flex-row sm:items-end sm:justify-between motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.48s_backwards]"
          style={{
            opacity: "var(--hero-controls-opacity, 1)",
            transform: "translate3d(0, var(--hero-controls-y, 0px), 0)",
            pointerEvents: "var(--hero-pointer-events, auto)" as React.CSSProperties["pointerEvents"],
          }}
        >
          <Countdown />
          <div className="flex flex-wrap gap-3">
            <a
              href="#acceso"
              className="group relative isolate inline-flex rounded-full transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:scale-[1.03] motion-safe:focus-visible:scale-[1.03]"
            >
              <span
                aria-hidden="true"
                className="absolute -inset-2 -z-10 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet),var(--color-magenta),var(--color-lavender))] opacity-0 blur-lg transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-70 group-focus-visible:opacity-70"
              />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink">
                {tHero("ctaAttend")}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1 group-focus-visible:translate-x-1"
                >
                  →
                </span>
              </span>
            </a>
            <CtaLink
              href="https://forms.gle/ChErBuBgp3QfuxRr7"
              variant="outline"
              external
            >
              {tHero("ctaProviders")}
            </CtaLink>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CAPA 2: ELEMENTOS ABOUT
            (Texto emerge al medio -> se traslada a la izquierda
             -> se cargan las 4 barras simultáneamente)
            ══════════════════════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-x-6 top-1/2 z-30 -translate-y-1/2 sm:inset-x-10 lg:inset-x-16"
          style={{
            opacity: "var(--about-text-opacity, 0)",
            pointerEvents: "var(--about-pointer-events, none)" as React.CSSProperties["pointerEvents"],
          }}
        >
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12 lg:items-center">
            {/* Bloque de texto con tipografía de 8 líneas y traslación armónica del centro a la izquierda sin ghosting */}
            <div
              className="pointer-events-auto lg:col-span-7 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              style={{
                transform:
                  "translate3d(var(--about-glide-x, 0vw), 0, 0) scale(var(--about-text-scale, 1))",
                filter: "blur(var(--about-text-blur, 0px))",
              }}
            >
              <div className="relative w-full max-w-none mx-auto lg:mx-0">
                <div className="flex flex-col text-left">
                  {/* Líneas 1 y 2 */}
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.intro1}
                    </span>
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.intro2}
                    </span>
                  </div>

                  {/* Línea 3: cuatro días */}
                  <div className="my-4 sm:my-5 lg:my-6">
                    <span className="block font-display text-[clamp(3.6rem,7.5vw,6.5rem)] leading-[0.88] font-black tracking-tight text-accent drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
                      {tAbout("descriptionEmphasis")}
                    </span>
                  </div>

                  {/* Líneas 4, 5, 6, 7 y 8 */}
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.outro1}
                    </span>
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.outro2}
                    </span>
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.outro3}
                    </span>
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.outro4}
                    </span>
                    <span className="block whitespace-normal sm:whitespace-nowrap font-display text-[clamp(1.15rem,1.65vw,1.8rem)] leading-snug font-medium text-paper">
                      {lines.outro5}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Barras de estratos: se cargan todas a la vez sin distorsión tipográfica */}
            <div className="relative pointer-events-auto lg:col-span-5 lg:col-start-8 lg:self-center">
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
                      className="flex items-center justify-end gap-2.5 px-3 pt-2 pb-1 font-mono text-[0.72rem] tracking-[0.14em] text-paper-dim uppercase font-semibold will-change-transform motion-reduce:opacity-100"
                      style={{
                        opacity: "var(--labels-opacity, 0)",
                      }}
                    >
                      <span className="text-right whitespace-nowrap">
                        {tAbout(`stats.${stat.key}`)}
                      </span>
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: stat.color,
                          boxShadow: `0 0 8px ${stat.color}`,
                        }}
                      />
                    </dt>
                    <dd
                      className="relative flex items-center justify-end overflow-hidden rounded-xl px-7 py-4 font-mono text-3xl font-black text-ink tabular-nums shadow-sm transition-all duration-500 group-hover:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.4)] sm:py-5 sm:text-4xl lg:text-5xl will-change-transform"
                      style={{
                        backgroundColor: stat.color,
                        clipPath:
                          "inset(0 calc((1 - var(--bars-scale, 0)) * 100%) 0 0 round 0.75rem)",
                        opacity: "var(--bars-opacity, 0)",
                      }}
                    >
                      {/* Destello metálico sutil y pausado en hover */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1200 ease-in-out group-hover:translate-x-[200%]"
                      />
                      <div className="relative z-10">
                        {stat.key === "dates" ? (
                          <span>
                            9
                            <span className="mx-1.5 text-[0.52em] font-normal tracking-normal lowercase opacity-75">
                              al
                            </span>
                            12 OCT
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
        </div>
      </div>
    </section>
  );
}
