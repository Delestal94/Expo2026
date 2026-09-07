"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { GALLERY_PHOTOS } from "./gallery-data";

/**
 * Estados de composición para el bento interactivo:
 * - 5 contenedores estrictamente confinados en 2 filas flex (2 arriba, 3 abajo).
 * - Las proporciones de ancho y alto varían de forma orgánica y fluida.
 * - Es 100% imposible que desborden el contenedor padre o se pisen entre sí.
 */
interface CompositionState {
  row1Height: string;
  row2Height: string;
  r1Flex0: number;
  r1Flex1: number;
  r2Flex0: number;
  r2Flex1: number;
  r2Flex2: number;
}

const COMPOSITIONS: CompositionState[] = [
  {
    row1Height: "55%",
    row2Height: "45%",
    r1Flex0: 2.4,
    r1Flex1: 1.1,
    r2Flex0: 1.9,
    r2Flex1: 1.0,
    r2Flex2: 1.0,
  },
  {
    row1Height: "47%",
    row2Height: "53%",
    r1Flex0: 1.1,
    r1Flex1: 2.3,
    r2Flex0: 1.0,
    r2Flex1: 2.0,
    r2Flex2: 1.0,
  },
  {
    row1Height: "45%",
    row2Height: "55%",
    r1Flex0: 1.6,
    r1Flex1: 1.6,
    r2Flex0: 1.0,
    r2Flex1: 1.0,
    r2Flex2: 2.1,
  },
  {
    row1Height: "57%",
    row2Height: "43%",
    r1Flex0: 2.1,
    r1Flex1: 1.4,
    r2Flex0: 1.3,
    r2Flex1: 1.3,
    r2Flex2: 1.3,
  },
  // Contraste fuerte: una panorámica arriba y tres verticales angostas abajo
  {
    row1Height: "62%",
    row2Height: "38%",
    r1Flex0: 1.0,
    r1Flex1: 2.8,
    r2Flex0: 1.0,
    r2Flex1: 1.4,
    r2Flex2: 1.0,
  },
  // Peso abajo: la fila inferior manda y se abre hacia la izquierda
  {
    row1Height: "40%",
    row2Height: "60%",
    r1Flex0: 1.7,
    r1Flex1: 1.2,
    r2Flex0: 2.4,
    r2Flex1: 1.0,
    r2Flex2: 1.2,
  },
];

const GALLERY_WASH = {
  background: [
    "radial-gradient(ellipse 850px 520px at 12% 100%, color-mix(in srgb, var(--color-magenta) 9%, transparent), transparent 65%)",
    "radial-gradient(ellipse 750px 480px at 88% 10%, color-mix(in srgb, var(--color-lavender) 8%, transparent), transparent 65%)",
  ].join(", "),
};

interface CardFlightConfig {
  start: number;
  end: number;
  ox: number;
  oy: number;
  rot: number;
}

// Configuración de vuelo para las 5 fotos:
// Arrancan en un racimo desordenado artístico en el centro (exacto a la captura de referencia del usuario),
// visibles y superpuestas, y van saliendo de forma continua y fluida desde que la sección asoma.
const SCATTER_FLIGHTS: CardFlightConfig[] = [
  // Foto 0 (Arriba Izq): carta ancha principal al frente, inclinada hacia la izquierda (-7°)
  { start: 0.04, end: 0.68, ox: -65, oy: -35, rot: -7 },
  // Foto 1 (Arriba Der): carta en parte superior derecha del racimo (5°)
  { start: 0.08, end: 0.72, ox: 85, oy: -30, rot: 5 },
  // Foto 2 (Abajo Izq): carta abajo a la izquierda del racimo (-4°)
  { start: 0.12, end: 0.76, ox: -40, oy: 60, rot: -4 },
  // Foto 3 (Abajo Centro): carta medio derecha (2°)
  { start: 0.16, end: 0.80, ox: 65, oy: 25, rot: 2 },
  // Foto 4 (Abajo Der): carta pequeña en esquina inferior derecha (4°)
  { start: 0.20, end: 0.84, ox: 105, oy: 70, rot: 4 },
];

export function GalleryPreview() {
  const t = useTranslations("Gallery");
  const runwayRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  const [compositionIndex, setCompositionIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAssembled, setIsAssembled] = useState(false);

  // Índices de fotos actuales para los 5 contenedores
  const [photoIndices, setPhotoIndices] = useState<number[]>([0, 1, 2, 3, 4]);

  // ── Continuous Scroll-triggered 3D Scatter & Docking Animation ──
  useEffect(() => {
    const runway = runwayRef.current;
    const bento = bentoRef.current;
    if (!runway || !bento) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth < 640;

    // En móviles o reduce-motion, arranca 100% armada y lista sin animaciones de scroll
    if (prefersReducedMotion || isMobile) {
      requestAnimationFrame(() => {
        setIsAssembled(true);
      });
      runway.style.setProperty("--gal-title-x", "0px");
      runway.style.setProperty("--gal-eyebrow-x", "0px");
      runway.style.setProperty("--gal-controls-opacity", "1");
      runway.style.setProperty("--gal-controls-y", "0px");
      for (let i = 0; i < 5; i++) {
        runway.style.setProperty(`--gal-c${i}-x`, "0px");
        runway.style.setProperty(`--gal-c${i}-y`, "0px");
        runway.style.setProperty(`--gal-c${i}-scale`, "1");
        runway.style.setProperty(`--gal-c${i}-rot`, "0deg");
        runway.style.setProperty(`--gal-c${i}-badge-opacity`, "1");
      }
      return;
    }

    let completed = false;
    let introTriggered = false;
    let introRaf = 0;
    let currentProg = 0;
    // Toda la presentación del bento en una sola línea de tiempo. Antes el
    // armado dependía del scroll y sólo se daba por completo al llegar a
    // maxProg 0.95, lo que exigía scrollear más de una pantalla entera: si
    // llegabas a la sección y parabas, `isAssembled` nunca pasaba a true y
    // el ciclo de rotación de fotos jamás arrancaba. Ahora corre por tiempo.
    const INTRO_MS = 1800;

    // Medición exacta de coordenadas de cada slot respecto al centro del Bento
    function calculateCardCenters() {
      if (!bento) return [];
      const bentoRect = bento.getBoundingClientRect();
      const bentoCenterX = bentoRect.left + bentoRect.width / 2;
      const bentoCenterY = bentoRect.top + bentoRect.height / 2;

      return slotRefs.current.map((slotEl) => {
        if (!slotEl) return { dx: 0, dy: 0 };
        const slotRect = slotEl.getBoundingClientRect();
        const slotCenterX = slotRect.left + slotRect.width / 2;
        const slotCenterY = slotRect.top + slotRect.height / 2;

        const dx = bentoCenterX - slotCenterX;
        const dy = bentoCenterY - slotCenterY;
        return { dx, dy };
      });
    }

    // Medición para centrar el bloque de texto y centrar el eyebrow sobre el heading
    function calculateTextOffsets() {
      const header = headerRef.current;
      const heading = headingRef.current;
      const eyebrow = eyebrowRef.current;
      if (!header || !heading || !eyebrow) {
        return { titleCenterX: 0, eyebrowCenterX: 0 };
      }

      const headerRect = header.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const eyebrowRect = eyebrow.getBoundingClientRect();

      const titleCenterX = Math.max((headerRect.width - headingRect.width) / 2, 0);
      const eyebrowCenterX = Math.max((headingRect.width - eyebrowRect.width) / 2, 0);

      return { titleCenterX, eyebrowCenterX };
    }

    // Las medidas se toman FUERA del bucle y se recalculan solo en resize o
    // al arrancar la intro. `measured` es lo que corta el recálculo por
    // frame: antes `render()` volvía a medir cuando `titleCenterX === 0`,
    // que no es un centinela de "sin medir" sino un valor perfectamente
    // válido (el título ocupa todo el header en pantallas angostas). En esas
    // pantallas se disparaban 3 `getBoundingClientRect` en cada uno de los
    // ~108 frames de la intro: sincronización de layout forzada dentro del
    // bucle de animación, justo lo que no puede pasar.
    let measured = false;
    let deltaCenters = calculateCardCenters();
    let textOffsets = calculateTextOffsets();

    function measure() {
      deltaCenters = calculateCardCenters();
      textOffsets = calculateTextOffsets();
      measured = true;
    }

    function applyAssembledStyles() {
      if (!runway) return;
      runway.style.setProperty("--gal-title-x", "0px");
      runway.style.setProperty("--gal-eyebrow-x", "0px");
      runway.style.setProperty("--gal-controls-opacity", "1");
      runway.style.setProperty("--gal-controls-y", "0px");
      for (let i = 0; i < 5; i++) {
        runway.style.setProperty(`--gal-c${i}-x`, "0px");
        runway.style.setProperty(`--gal-c${i}-y`, "0px");
        runway.style.setProperty(`--gal-c${i}-scale`, "1");
        runway.style.setProperty(`--gal-c${i}-rot`, "0deg");
        runway.style.setProperty(`--gal-c${i}-badge-opacity`, "1");
      }
    }

    // Carga completa inmediata únicamente al navegar directo (click en barra lateral o URL con hash)
    function handleFastLoad() {
      completed = true;
      introTriggered = true;
      currentProg = 1;
      cancelAnimationFrame(introRaf);
      setIsAssembled(true);
      applyAssembledStyles();
    }

    if (window.location.hash.includes("galeria")) {
      handleFastLoad();
    }
    const onHashChange = () => {
      if (window.location.hash.includes("galeria")) {
        handleFastLoad();
      }
    };
    window.addEventListener("hashchange", onHashChange);

    // Event delegation global con capture para detectar clicks en la barra lateral o cualquier botón hacia #galeria
    const onGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#galeria"]');
      if (anchor) {
        handleFastLoad();
      }
    };
    document.addEventListener("click", onGlobalClick, { capture: true });

    function render(prog: number) {
      if (!runway) return;

      if (!measured) measure();

      currentProg = prog;

      // 1. Texto del encabezado: ya cargado y visible al 100%, centrado en ambas líneas y se desliza a la izquierda
      const textProg = Math.min(Math.max(prog / 0.50, 0), 1);
      const textEase = textProg * (2 - textProg); // easeOutQuad
      const curTitleX = (1 - textEase) * textOffsets.titleCenterX;
      const curEyebrowX = (1 - textEase) * textOffsets.eyebrowCenterX;

      runway.style.setProperty("--gal-title-x", `${curTitleX.toFixed(1)}px`);
      runway.style.setProperty("--gal-eyebrow-x", `${curEyebrowX.toFixed(1)}px`);

      // 2. Las 5 fotos: proyectadas desde el racimo desordenado central hacia sus ranuras
      deltaCenters.forEach(({ dx, dy }, i) => {
        const flight = SCATTER_FLIGHTS[i]!;
        if (prog <= flight.start) {
          // Posición en el racimo inicial desordenado
          runway.style.setProperty(`--gal-c${i}-x`, `${(dx + flight.ox).toFixed(1)}px`);
          runway.style.setProperty(`--gal-c${i}-y`, `${(dy + flight.oy).toFixed(1)}px`);
          runway.style.setProperty(`--gal-c${i}-scale`, "0.36");
          runway.style.setProperty(`--gal-c${i}-rot`, `${flight.rot}deg`);
          runway.style.setProperty(`--gal-c${i}-badge-opacity`, "0");
        } else if (prog >= flight.end) {
          // Acomodada en su ranura
          runway.style.setProperty(`--gal-c${i}-x`, "0px");
          runway.style.setProperty(`--gal-c${i}-y`, "0px");
          runway.style.setProperty(`--gal-c${i}-scale`, "1");
          runway.style.setProperty(`--gal-c${i}-rot`, "0deg");
          runway.style.setProperty(`--gal-c${i}-badge-opacity`, "1");
        } else {
          // En vuelo fluido hacia su ranura
          const p = (prog - flight.start) / (flight.end - flight.start);
          const ease = 1 - Math.pow(1 - p, 2.8);
          const curX = (1 - ease) * (dx + flight.ox);
          const curY = (1 - ease) * (dy + flight.oy);
          const curScale = 0.36 + 0.64 * ease;
          const curRot = (1 - ease) * flight.rot;
          const badgeOp = Math.min(Math.max((ease - 0.4) / 0.6, 0), 1);

          runway.style.setProperty(`--gal-c${i}-x`, `${curX.toFixed(1)}px`);
          runway.style.setProperty(`--gal-c${i}-y`, `${curY.toFixed(1)}px`);
          runway.style.setProperty(`--gal-c${i}-scale`, curScale.toFixed(3));
          runway.style.setProperty(`--gal-c${i}-rot`, `${curRot.toFixed(1)}deg`);
          runway.style.setProperty(`--gal-c${i}-badge-opacity`, badgeOp.toFixed(3));
        }
      });

      // 3. Botones restantes: aparecen fluidamente en simultáneo con la llegada de las fotos (0.45 a 0.82)
      const controlsProg = Math.min(Math.max((prog - 0.45) / 0.37, 0), 1);
      const controlsEase = controlsProg * (2 - controlsProg);
      const controlsY = (1 - controlsEase) * 16;
      runway.style.setProperty("--gal-controls-opacity", controlsEase.toFixed(3));
      runway.style.setProperty("--gal-controls-y", `${controlsY.toFixed(1)}px`);

    }

    /** Arma el bento completo en una sola pasada de tiempo. */
    function runIntro(startTime: number) {
      function step(now: number) {
        const t = Math.min((now - startTime) / INTRO_MS, 1);
        render(t);

        if (t < 1) {
          introRaf = requestAnimationFrame(step);
        } else {
          completed = true;
          setIsAssembled(true);
          applyAssembledStyles();
        }
      }
      introRaf = requestAnimationFrame(step);
    }

    function startIntro() {
      if (introTriggered || completed) return;
      introTriggered = true;
      measure();
      runIntro(performance.now());
    }

    function onResize() {
      measure();
      if (completed) {
        applyAssembledStyles();
      } else {
        render(currentProg);
      }
    }

    window.addEventListener("resize", onResize, { passive: true });

    // Estado inicial (racimo desordenado) antes de que la sección asome.
    setTimeout(() => {
      if (completed || introTriggered) return;
      measure();
      render(0);
    }, 40);

    // El armado se dispara por visibilidad, no por posición de scroll: apenas
    // la sección asoma, se completa sola y habilita el ciclo de rotación.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startIntro();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(runway);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onGlobalClick, { capture: true });
      cancelAnimationFrame(introRaf);
    };
  }, []);

  // Ciclo automático (solo cuando el bento ya está armado).
  //
  // Antes cambiaban a la vez la composición y una foto al azar cada 4.5s: se
  // leía como un salto seco y períodos largos de quietud. Ahora rota una foto
  // por tick en round-robin —siempre hay una entrando fundida, y cada
  // contenedor recorre la galería— y la composición se mueve cada 3 ticks,
  // así el cambio de layout no compite con el de las imágenes.
  //
  // El ciclo no se pausa al pasar el mouse: el hover solo agranda la tarjeta
  // apuntada (`hoveredCard`), pero las fotos siguen rotando.
  useEffect(() => {
    if (!isAssembled) return;

    let tick = 0;
    const interval = setInterval(() => {
      const slot = tick % 5;
      setPhotoIndices((prev) => {
        const next = [...prev];
        next[slot] = (next[slot]! + 5) % GALLERY_PHOTOS.length;
        return next;
      });

      if (tick % 3 === 2) {
        setCompositionIndex((prev) => (prev + 1) % COMPOSITIONS.length);
      }
      tick += 1;
    }, 1700);

    return () => clearInterval(interval);
  }, [isAssembled]);

  const comp = COMPOSITIONS[compositionIndex]!;

  // Cálculos dinámicos de flex considerando el hover del usuario
  const flexR1_0 = hoveredCard === 0 ? 3.0 : hoveredCard === 1 ? 1.0 : comp.r1Flex0;
  const flexR1_1 = hoveredCard === 1 ? 3.0 : hoveredCard === 0 ? 1.0 : comp.r1Flex1;

  const flexR2_0 = hoveredCard === 2 ? 2.6 : (hoveredCard === 3 || hoveredCard === 4) ? 0.9 : comp.r2Flex0;
  const flexR2_1 = hoveredCard === 3 ? 2.6 : (hoveredCard === 2 || hoveredCard === 4) ? 0.9 : comp.r2Flex1;
  const flexR2_2 = hoveredCard === 4 ? 2.6 : (hoveredCard === 2 || hoveredCard === 3) ? 0.9 : comp.r2Flex2;

  return (
    <section
      ref={runwayRef}
      id="galeria"
      className="relative w-full motion-safe:sm:h-[150vh] h-auto"
    >
      {/* Contenedor encajonado sticky a pantalla completa */}
      <div className="sticky top-0 w-full min-h-screen lg:h-screen lg:max-h-screen px-6 py-4 sm:px-10 lg:px-16 sm:py-6 lg:py-6 flex flex-col justify-between overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GALLERY_WASH} />
        <EntranceVein color="var(--color-magenta)" />

        {/* Encabezado: texto centrado inicialmente que se desliza a la izquierda; controles que aparecen al final */}
        <div
          ref={headerRef}
          className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between shrink-0 w-full"
        >
          <div
            className={`flex flex-col items-start text-left w-fit shrink-0 motion-reduce:transform-none ${isAssembled ? "" : "will-change-transform"}`}
            style={{
              transform: "translate3d(var(--gal-title-x, 0px), 0, 0)",
            }}
          >
            <span
              ref={eyebrowRef}
              className={`font-mono text-xs tracking-[0.25em] text-magenta uppercase motion-reduce:transform-none ${isAssembled ? "" : "will-change-transform"}`}
              style={{
                transform: "translate3d(var(--gal-eyebrow-x, 0px), 0, 0)",
              }}
            >
              {t("previewEyebrow")}
            </span>
            <h2
              ref={headingRef}
              className="mt-2 sm:mt-3 text-balance font-display text-2xl font-medium text-paper sm:text-3xl lg:text-4xl"
            >
              {t("previewTitle")}
            </h2>
          </div>

          <div
            className={`motion-entrance flex items-center gap-4 transition-opacity duration-300 ${isAssembled ? "" : "will-change-transform"}`}
            style={{
              opacity: "var(--gal-controls-opacity, 0)",
              transform: "translate3d(0, var(--gal-controls-y, 16px), 0)",
              pointerEvents: isAssembled ? "auto" : "none",
            }}
          >
            {/* Indicadores de composición interactivos */}
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-3 py-1.5 backdrop-blur-sm"
              aria-label="Selector de composición"
            >
              {COMPOSITIONS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCompositionIndex(i)}
                  aria-label={`Composición ${i + 1}`}
                  className={`h-2 rounded-full transition-[width,background-color] duration-500 motion-reduce:transition-none ${
                    compositionIndex === i
                      ? "w-6 bg-magenta"
                      : "w-2 bg-paper-dim/40 hover:bg-paper-dim"
                  }`}
                />
              ))}
            </div>

            <Link
              href="/galeria"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition hover:border-magenta hover:text-magenta"
            >
              {t("viewFullCta")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* ── DESKTOP: Bento sin recuadros fantasma, fotos proyectadas desde la pila central ── */}
        <div
          ref={bentoRef}
          className="relative hidden sm:flex flex-1 min-h-0 flex-col gap-3 lg:gap-4 my-3 sm:my-4 w-full h-full"
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Fila Superior: 2 tarjetas */}
          <div
            className={`flex gap-3 lg:gap-4 w-full min-h-0 transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isAssembled ? "" : "relative z-20"
            }`}
            style={{ height: comp.row1Height }}
          >
            {/* Slot 0 (Arriba Izquierda) */}
            <div
              ref={(el) => {
                slotRefs.current[0] = el;
              }}
              className={`relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAssembled ? "" : "z-[25]"
              }`}
              style={{ flex: flexR1_0 }}
            >
              <Link
                href="/galeria"
                onMouseEnter={() => setHoveredCard(0)}
                className={`group relative flex h-full w-full overflow-hidden rounded-2xl border border-line/70 bg-ink/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-magenta/70 hover:shadow-[0_12px_40px_rgba(217,70,239,0.25)] motion-reduce:transform-none ${
                  isAssembled ? "" : "will-change-transform"
                } ${
                  hoveredCard === 0 ? "z-30" : "z-10"
                }`}
                style={{
                  transform:
                    "translate3d(var(--gal-c0-x, 0px), var(--gal-c0-y, 0px), 0) scale(var(--gal-c0-scale, 1)) rotate(var(--gal-c0-rot, 0deg))",
                }}
              >
                <Image
                  key={photoIndices[0]}
                  src={GALLERY_PHOTOS[photoIndices[0]! % GALLERY_PHOTOS.length]!.src}
                  alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[0]!]!.n })}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-safe:animate-[gallery-fade-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-end transition-opacity duration-300"
                  style={{
                    opacity: isAssembled ? 1 : "var(--gal-c0-badge-opacity, 1)",
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>
              </Link>
            </div>

            {/* Slot 1 (Arriba Derecha) */}
            <div
              ref={(el) => {
                slotRefs.current[1] = el;
              }}
              className={`relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAssembled ? "" : "z-[24]"
              }`}
              style={{ flex: flexR1_1 }}
            >
              <Link
                href="/galeria"
                onMouseEnter={() => setHoveredCard(1)}
                className={`group relative flex h-full w-full overflow-hidden rounded-2xl border border-line/70 bg-ink/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-magenta/70 hover:shadow-[0_12px_40px_rgba(217,70,239,0.25)] motion-reduce:transform-none ${
                  isAssembled ? "" : "will-change-transform"
                } ${
                  hoveredCard === 1 ? "z-30" : "z-10"
                }`}
                style={{
                  transform:
                    "translate3d(var(--gal-c1-x, 0px), var(--gal-c1-y, 0px), 0) scale(var(--gal-c1-scale, 1)) rotate(var(--gal-c1-rot, 0deg))",
                }}
              >
                <Image
                  key={photoIndices[1]}
                  src={GALLERY_PHOTOS[photoIndices[1]! % GALLERY_PHOTOS.length]!.src}
                  alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[1]!]!.n })}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-safe:animate-[gallery-fade-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-end transition-opacity duration-300"
                  style={{
                    opacity: isAssembled ? 1 : "var(--gal-c1-badge-opacity, 1)",
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Fila Inferior: 3 tarjetas */}
          <div
            className={`flex gap-3 lg:gap-4 w-full min-h-0 transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isAssembled ? "" : "relative z-10"
            }`}
            style={{ height: comp.row2Height }}
          >
            {/* Slot 2 (Abajo Izquierda) */}
            <div
              ref={(el) => {
                slotRefs.current[2] = el;
              }}
              className={`relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAssembled ? "" : "z-[23]"
              }`}
              style={{ flex: flexR2_0 }}
            >
              <Link
                href="/galeria"
                onMouseEnter={() => setHoveredCard(2)}
                className={`group relative flex h-full w-full overflow-hidden rounded-2xl border border-line/70 bg-ink/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-magenta/70 hover:shadow-[0_12px_40px_rgba(217,70,239,0.25)] motion-reduce:transform-none ${
                  isAssembled ? "" : "will-change-transform"
                } ${
                  hoveredCard === 2 ? "z-30" : "z-10"
                }`}
                style={{
                  transform:
                    "translate3d(var(--gal-c2-x, 0px), var(--gal-c2-y, 0px), 0) scale(var(--gal-c2-scale, 1)) rotate(var(--gal-c2-rot, 0deg))",
                }}
              >
                <Image
                  key={photoIndices[2]}
                  src={GALLERY_PHOTOS[photoIndices[2]! % GALLERY_PHOTOS.length]!.src}
                  alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[2]!]!.n })}
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-safe:animate-[gallery-fade-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-end transition-opacity duration-300"
                  style={{
                    opacity: isAssembled ? 1 : "var(--gal-c2-badge-opacity, 1)",
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>
              </Link>
            </div>

            {/* Slot 3 (Abajo Centro) */}
            <div
              ref={(el) => {
                slotRefs.current[3] = el;
              }}
              className={`relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAssembled ? "" : "z-[22]"
              }`}
              style={{ flex: flexR2_1 }}
            >
              <Link
                href="/galeria"
                onMouseEnter={() => setHoveredCard(3)}
                className={`group relative flex h-full w-full overflow-hidden rounded-2xl border border-line/70 bg-ink/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-magenta/70 hover:shadow-[0_12px_40px_rgba(217,70,239,0.25)] motion-reduce:transform-none ${
                  isAssembled ? "" : "will-change-transform"
                } ${
                  hoveredCard === 3 ? "z-30" : "z-10"
                }`}
                style={{
                  transform:
                    "translate3d(var(--gal-c3-x, 0px), var(--gal-c3-y, 0px), 0) scale(var(--gal-c3-scale, 1)) rotate(var(--gal-c3-rot, 0deg))",
                }}
              >
                <Image
                  key={photoIndices[3]}
                  src={GALLERY_PHOTOS[photoIndices[3]! % GALLERY_PHOTOS.length]!.src}
                  alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[3]!]!.n })}
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-safe:animate-[gallery-fade-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-end transition-opacity duration-300"
                  style={{
                    opacity: isAssembled ? 1 : "var(--gal-c3-badge-opacity, 1)",
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>
              </Link>
            </div>

            {/* Slot 4 (Abajo Derecha) */}
            <div
              ref={(el) => {
                slotRefs.current[4] = el;
              }}
              className={`relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isAssembled ? "" : "z-[21]"
              }`}
              style={{ flex: flexR2_2 }}
            >
              <Link
                href="/galeria"
                onMouseEnter={() => setHoveredCard(4)}
                className={`group relative flex h-full w-full overflow-hidden rounded-2xl border border-line/70 bg-ink/80 shadow-2xl transition-[border-color,box-shadow] duration-500 ease-out hover:border-magenta/70 hover:shadow-[0_12px_40px_rgba(217,70,239,0.25)] motion-reduce:transform-none ${
                  isAssembled ? "" : "will-change-transform"
                } ${
                  hoveredCard === 4 ? "z-30" : "z-10"
                }`}
                style={{
                  transform:
                    "translate3d(var(--gal-c4-x, 0px), var(--gal-c4-y, 0px), 0) scale(var(--gal-c4-scale, 1)) rotate(var(--gal-c4-rot, 0deg))",
                }}
              >
                <Image
                  key={photoIndices[4]}
                  src={GALLERY_PHOTOS[photoIndices[4]! % GALLERY_PHOTOS.length]!.src}
                  alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[4]!]!.n })}
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-safe:animate-[gallery-fade-in_700ms_cubic-bezier(0.16,1,0.3,1)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-end transition-opacity duration-300"
                  style={{
                    opacity: isAssembled ? 1 : "var(--gal-c4-badge-opacity, 1)",
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    ↗
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── MOBILE: Tira táctil horizontal con snap ── */}
        <div className="relative -mx-6 mt-8 sm:hidden">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photoIndices.map((idx, slot) => {
              const photo = GALLERY_PHOTOS[idx % GALLERY_PHOTOS.length]!;
              return (
                <Link
                  key={slot}
                  href="/galeria"
                  className="group relative w-[80vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line/70 bg-ink/60 aspect-[16/10]"
                >
                  <Image
                    src={photo.src}
                    alt={t("photoAlt", { n: photo.n })}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end">
                    <span className="font-mono text-xs text-magenta">↗</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/galeria"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper transition hover:border-magenta"
          >
            {t("viewFullCta")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
