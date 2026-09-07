"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORIES, VENUE_PLAN, categoryMeta, polygonPoints } from "./venue-plan";
import type { Category, VenueZone } from "./venue-plan";
import { useMapPresence } from "./use-map-presence";

const VIEW_W = 1200;
const VIEW_H = 865;

/** Categorías que son stands asignables; el resto es contexto del predio. */
const STAND_CATEGORIES: Category[] = ["cubierto", "artesano", "descubierto", "gastronomico", "juego"];

function isContext(zone: VenueZone) {
  return zone.category === "infraestructura" || zone.category === "institucional";
}

/** Cálculo de perímetro geométrico para el efecto de trazado blueprint */
function getZonePerimeter(zone: VenueZone): number {
  if (zone.shape === "circle") {
    const rx = zone.width / 2;
    const ry = zone.height / 2;
    return Math.round(2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2));
  }
  if (zone.shape === "polygon" && zone.points?.length) {
    let perimeter = 0;
    const pts = zone.points.map(
      ([px, py]) => [zone.x + px * zone.width, zone.y + py * zone.height] as const,
    );
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i]!;
      const [x2, y2] = pts[(i + 1) % pts.length]!;
      perimeter += Math.hypot(x2 - x1, y2 - y1);
    }
    return Math.round(perimeter);
  }
  return Math.round(2 * (zone.width + zone.height));
}

/** Clasificación de las 220 zonas en 7 ondas según los sectores y colores solicitados */
function getZoneWave(zone: VenueZone): number {
  if (zone.category === "cubierto") {
    // 139 stands en el pabellón cubierto (cian): 3 filas sucesivas
    if (zone.y < 190) return 0;
    if (zone.y < 270) return 1;
    return 2;
  }
  if (zone.category === "artesano") {
    return 3; // Artesanos (magenta)
  }
  if (zone.category === "descubierto") {
    return 4; // Descubiertos (morado / violeta)
  }
  if (zone.category === "gastronomico" || zone.category === "juego") {
    return 5; // Gastronómicos y Juegos (lavanda y acento)
  }
  return 6; // Institucional e Infraestructura (grises)
}

const ZONE_METRICS = new Map(
  VENUE_PLAN.map((z) => [
    z.id,
    { perimeter: getZonePerimeter(z), wave: getZoneWave(z) },
  ]),
);

/** Ventanas de progreso de scroll (mapProg: 0 a 1) para las 7 ondas de sectores */
const WAVE_WINDOWS = [
  // Sector 1: Cubiertos fila superior (cian)
  { start: 0.00, end: 0.28 },
  // Sector 1: Cubiertos fila media (cian)
  { start: 0.08, end: 0.36 },
  // Sector 1: Cubiertos fila inferior (cian)
  { start: 0.16, end: 0.44 },
  // Sector 2: Artesanos (magenta)
  { start: 0.35, end: 0.60 },
  // Sector 3: Descubiertos (morado / violeta)
  { start: 0.50, end: 0.74 },
  // Sector 4: Gastronómicos y Juegos (lavanda y acento)
  { start: 0.64, end: 0.86 },
  // Sector 5: Institucional e Infraestructura (grises)
  { start: 0.76, end: 0.95 },
];

/**
 * Calcula la posición X y opacidad de una píldora con entrada de derecha a izquierda,
 * impacto con la pared invisible / píldora previa y rebote elástico.
 */
function getPillBounce(progress: number, start: number, end: number): { x: number; opacity: number } {
  if (progress <= start) return { x: 260, opacity: 0 };
  if (progress >= end) return { x: 0, opacity: 1 };

  const t = (progress - start) / (end - start);

  // Fase 1 (0 -> 0.70): Entrada rápida desde la derecha hacia el tope
  if (t < 0.70) {
    const p = t / 0.70;
    const ease = 1 - Math.pow(1 - p, 2.8);
    return {
      x: (1 - ease) * 260,
      opacity: Math.min(p * 3.5, 1),
    };
  }

  // Fase 2 (0.70 -> 1.00): Choque contra la barrera y rebote elástico amortiguado
  const u = (t - 0.70) / 0.30;
  const x = Math.sin(u * Math.PI * 2) * Math.exp(-u * 3.2) * 11;
  return {
    x,
    opacity: 1,
  };
}

export function VenueMap() {
  const t = useTranslations("InteractiveMap");
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | null>(null);
  const viewerCount = useMapPresence();
  const [isDrawn, setIsDrawn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cerrar el dropdown al hacer click afuera o presionar Escape
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const runway = el.closest("#mapa") as HTMLElement | null;
    // Si se monta sin runway (ej: tests unitarios en aislamiento), activar inmediatamente
    if (!runway) {
      requestAnimationFrame(() => {
        setIsDrawn(true);
      });
      return;
    }

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const isMobile = window.innerWidth < 640;

    function applyAssembled(target: HTMLElement) {
      target.style.setProperty("--map-box-border", "1");
      target.style.setProperty("--map-left-content-opacity", "1");
      target.style.setProperty("--map-left-content-y", "0px");
      for (let i = 0; i < 6; i++) {
        target.style.setProperty(`--map-pill-${i}-x`, "0px");
        target.style.setProperty(`--map-pill-${i}-opacity`, "1");
      }
      for (let w = 0; w < 7; w++) {
        target.style.setProperty(`--map-w${w}`, "1");
        target.style.setProperty(`--map-w${w}-fill`, "1");
      }
    }

    if (prefersReducedMotion || isMobile) {
      requestAnimationFrame(() => {
        setIsDrawn(true);
      });
      applyAssembled(runway);
      return;
    }

    let completed = false;
    let introTriggered = false;
    let introRaf = 0;
    // Duración de toda la presentación del mapa. Antes el trazado dependía
    // de cuánto scrolleabas dentro de la sección; ahora es una línea de
    // tiempo única que arranca al entrar y termina sola.
    const INTRO_MS = 1600;

    // Estado inicial: todo oculto, esperando que la sección entre en pantalla.
    runway.style.setProperty("--map-box-border", "0");
    runway.style.setProperty("--map-left-content-opacity", "0");
    runway.style.setProperty("--map-left-content-y", "16px");
    for (let i = 0; i < 6; i++) {
      runway.style.setProperty(`--map-pill-${i}-x`, "260px");
      runway.style.setProperty(`--map-pill-${i}-opacity`, "0");
    }
    for (let w = 0; w < 7; w++) {
      runway.style.setProperty(`--map-w${w}`, "0");
      runway.style.setProperty(`--map-w${w}-fill`, "0");
    }

    /**
     * Presentación completa del mapa en una sola pasada de tiempo:
     *  - 0.00 a 0.45 → se dibujan los contenedores, entra el panel izquierdo
     *    y las píldoras de filtro rebotan desde la derecha.
     *  - 0.30 a 1.00 → se trazan los 7 sectores de stands, solapándose con
     *    el final de la fase anterior para que no se lea como dos etapas.
     */
    function runIntro(startTime: number) {
      function step(now: number) {
        if (!runway) return;
        const t = Math.min((now - startTime) / INTRO_MS, 1);

        // ── Fase A: contenedores, panel izquierdo y píldoras ──
        const approach = Math.min(t / 0.45, 1);

        const boxEase = 1 - Math.pow(1 - approach, 2.2);
        runway.style.setProperty("--map-box-border", boxEase.toFixed(3));

        const leftEase = approach * (2 - approach);
        runway.style.setProperty("--map-left-content-opacity", leftEase.toFixed(3));
        runway.style.setProperty("--map-left-content-y", `${((1 - leftEase) * 16).toFixed(1)}px`);

        for (let i = 0; i < 6; i++) {
          const pStart = 0.04 + i * 0.12;
          const pEnd = pStart + 0.28;
          const { x, opacity } = getPillBounce(approach, pStart, pEnd);
          runway.style.setProperty(`--map-pill-${i}-x`, `${x.toFixed(1)}px`);
          runway.style.setProperty(`--map-pill-${i}-opacity`, opacity.toFixed(3));
        }

        // ── Fase B: el trazado de los stands, sector por sector ──
        const mapProg = Math.min(Math.max((t - 0.3) / 0.7, 0), 1);
        WAVE_WINDOWS.forEach(({ start, end }, w) => {
          const p = Math.min(Math.max((mapProg - start) / (end - start), 0), 1);
          const strokeEase = 1 - Math.pow(1 - p, 2.4);
          const fillOp = Math.min(Math.max((p - 0.35) / 0.65, 0), 1);
          runway.style.setProperty(`--map-w${w}`, strokeEase.toFixed(3));
          runway.style.setProperty(`--map-w${w}-fill`, fillOp.toFixed(3));
        });

        if (t < 1) {
          introRaf = requestAnimationFrame(step);
        } else {
          completed = true;
          setIsDrawn(true);
          applyAssembled(runway);
        }
      }
      introRaf = requestAnimationFrame(step);
    }

    function startIntro() {
      if (introTriggered || completed) return;
      introTriggered = true;
      runIntro(performance.now());
    }

    function handleFastLoad() {
      completed = true;
      introTriggered = true;
      cancelAnimationFrame(introRaf);
      setIsDrawn(true);
      if (runway) applyAssembled(runway);
    }

    // Carga inmediata en navegación directa por hash o click en la barra lateral
    if (window.location.hash.includes("mapa")) {
      handleFastLoad();
    }
    const onHashChange = () => {
      if (window.location.hash.includes("mapa")) {
        handleFastLoad();
      }
    };
    window.addEventListener("hashchange", onHashChange);

    const onGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href*="#mapa"]');
      if (anchor) {
        handleFastLoad();
      }
    };
    document.addEventListener("click", onGlobalClick, { capture: true });

    // El disparo va por visibilidad, no por posición de scroll: apenas la
    // sección asoma, la animación arranca y se completa sola.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startIntro();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(runway);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onGlobalClick, { capture: true });
      cancelAnimationFrame(introRaf);
    };
  }, []);

  const active = activeId ? (VENUE_PLAN.find((z) => z.id === activeId) ?? null) : null;
  const hoveredZone = hoveredId ? (VENUE_PLAN.find((z) => z.id === hoveredId) ?? null) : null;

  const counts = useMemo(() => {
    const acc = new Map<Category, number>();
    for (const zone of VENUE_PLAN) acc.set(zone.category, (acc.get(zone.category) ?? 0) + 1);
    return acc;
  }, []);

  const totalStands = useMemo(() => VENUE_PLAN.filter((z) => !isContext(z)).length, []);

  // Agrupamiento ordenado por serie para el selector rápido
  const groupedStands = useMemo(() => {
    const groups: { label: string; stands: VenueZone[] }[] = [];
    const assignable = VENUE_PLAN.filter((z) => !isContext(z));
    const seriesOrder = ["A", "B", "C", "D", "E", "F"];

    for (const prefix of seriesOrder) {
      const items = assignable.filter((z) => z.label.startsWith(prefix));
      if (items.length > 0) {
        const title =
          prefix === "A" || prefix === "B" || prefix === "C"
            ? t("groupCovered", { prefix })
            : prefix === "D"
              ? t("groupOutdoor")
              : prefix === "E"
                ? t("groupCrafts")
                : t("groupFood");
        groups.push({ label: title, stands: items });
      }
    }

    const remaining = assignable.filter(
      (z) => !seriesOrder.some((p) => z.label.startsWith(p)),
    );
    if (remaining.length > 0) {
      groups.push({ label: t("groupOther"), stands: remaining });
    }

    return groups;
  }, []);

  return (
    <div ref={rootRef} className="w-full h-full flex-1 flex flex-col min-h-0">
      {/* ── Grilla Principal:
          Columna Izquierda: Encabezado de la sección + Selector rápido e Inspector
          Columna Derecha: Filtros superiores de categorías + Gran Lienzo del Mapa (Captura 1 y 2)
      ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8 items-stretch w-full flex-1 h-full min-h-0">
        {/* ── COLUMNA IZQUIERDA: Header + Inspector ── */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between h-full min-h-0 gap-4 xl:gap-5">
          {/* Bloque de Cabecera: Eyebrow + Título + Descripción (Captura 1) */}
          <div className="flex flex-col gap-2 xl:gap-3 shrink-0">
            <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="text-balance font-display text-2xl sm:text-3xl xl:text-4xl font-medium text-paper leading-[1.14]">
              {t("title")}
            </h2>
            <p className="text-xs xl:text-sm text-paper-dim leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Tarjeta del Inspector: Selector Rápido + Ficha Técnica / Estado Inicial */}
          <div
            className="relative flex-1 min-h-0 rounded-2xl bg-ink/80 p-4 sm:p-5 xl:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4 overflow-y-auto overflow-x-hidden border"
            style={{
              borderColor: isDrawn
                ? "var(--color-line)"
                : "color-mix(in srgb, var(--color-line) calc(var(--map-box-border, 0) * 100%), transparent)",
            }}
          >
            {/* SVG que dibuja el borde perimetral durante la aproximación */}
            {!isDrawn && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl overflow-visible"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  rx="16"
                  fill="none"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  pathLength="1000"
                  strokeDasharray="1000px"
                  style={{
                    width: "calc(100% - 2px)",
                    height: "calc(100% - 2px)",
                    strokeDashoffset: "calc(1000px * (1 - var(--map-box-border, 0)))",
                  }}
                />
              </svg>
            )}

            {/* Contenido interior que aparece a medida que se dibuja el borde */}
            <div
              className={`flex flex-col justify-between gap-4 flex-1 min-h-0 transition-opacity motion-entrance ${isDrawn ? "" : "will-change-transform"}`}
              style={{
                opacity: isDrawn ? 1 : "var(--map-left-content-opacity, 0)",
                transform: isDrawn
                  ? "none"
                  : "translate3d(0, var(--map-left-content-y, 16px), 0)",
              }}
            >
              {/* Selector rápido de stand */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <label
                  htmlFor="stand-quick-select"
                  className="font-mono text-[0.68rem] tracking-[0.15em] text-paper-dim uppercase flex items-center justify-between"
                >
                  <span>{t("quickSelect")}</span>
                  <span className="text-paper-dim/60 font-mono text-[0.65rem]">{totalStands} stands</span>
                </label>
                <div ref={dropdownRef} className="relative w-full">
                  {/* Select nativo oculto para accesibilidad y pruebas */}
                  <select
                    id="stand-quick-select"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={activeId ?? ""}
                    onChange={(e) => setActiveId(e.target.value || null)}
                    className="sr-only"
                  >
                    <option value="">{t("quickSelectPlaceholder")}</option>
                    {groupedStands.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.stands.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.label} ({categoryMeta(zone.category).label}
                            {zone.areaM2 ? ` - ${zone.areaM2} m²` : ""})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Botón trigger del selector con el estilo visual exacto del sitio */}
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full cursor-pointer rounded-xl border border-line bg-surface pl-3.5 pr-10 py-2.5 text-xs text-left text-paper outline-none transition focus-visible:border-accent hover:border-paper-dim flex items-center justify-between"
                  >
                    <span className="truncate">
                      {active ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: categoryMeta(active.category).color }}
                          />
                          <span className="font-mono font-medium text-paper">{active.label}</span>
                          <span className="text-paper-dim text-[0.7rem]">
                            ({categoryMeta(active.category).label}
                            {active.areaM2 ? ` · ${active.areaM2} m²` : ""})
                          </span>
                        </span>
                      ) : (
                        <span className="text-paper-dim">Elegí un puesto de la lista o tocá el plano...</span>
                      )}
                    </span>
                    <svg
                      className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-paper-dim transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-accent" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Menú flotante con barra de desplazamiento estilizada acorde a la web */}
                  {isDropdownOpen && (
                    <div
                      role="listbox"
                      className="absolute z-50 top-full left-0 mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl border border-line bg-surface/95 backdrop-blur-md p-1.5 shadow-2xl [scrollbar-width:thin] [scrollbar-color:rgba(45,227,214,0.35)_#070b1e] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#070b1e] [&::-webkit-scrollbar-thumb]:bg-paper-dim/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-accent"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeId === null}
                        onClick={() => {
                          setActiveId(null);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between ${
                          activeId === null
                            ? "bg-accent/20 text-accent font-semibold"
                            : "text-paper-dim hover:bg-white/5 hover:text-paper"
                        }`}
                      >
                        <span>{t("quickSelectPlaceholder")}</span>
                      </button>

                      {groupedStands.map((group) => (
                        <div key={group.label} className="mt-2 first:mt-0">
                          <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm px-2.5 py-1 font-mono text-[0.66rem] font-bold text-accent uppercase tracking-wider border-b border-line/30 mb-0.5">
                            {group.label}
                          </div>
                          {group.stands.map((zone) => {
                            const isSelected = zone.id === activeId;
                            const meta = categoryMeta(zone.category);
                            return (
                              <button
                                key={zone.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setActiveId(zone.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full cursor-pointer text-left px-2.5 py-1.5 my-0.5 rounded-lg text-xs flex items-center justify-between transition ${
                                  isSelected
                                    ? "bg-accent/20 text-accent font-semibold"
                                    : "text-paper/90 hover:bg-white/5 hover:text-paper"
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span
                                    aria-hidden="true"
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ backgroundColor: meta.color }}
                                  />
                                  <span className="font-mono">{zone.label}</span>
                                  <span className="text-paper-dim text-[0.68rem]">
                                    ({meta.label})
                                  </span>
                                </span>
                                {zone.areaM2 && (
                                  <span className="font-mono text-[0.65rem] text-paper-dim/70 shrink-0 ml-2">
                                    {zone.areaM2} m²
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Ficha de Stand Seleccionado vs Estado Inicial */}
              {active ? (
                <div className="flex flex-col justify-between gap-4 flex-1 min-h-0">
                  <div className="flex flex-col gap-3">
                    {/* Cabecera del Stand */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-fit rounded-full px-2.5 py-0.5 font-mono text-[0.68rem] font-medium tracking-wider uppercase"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${categoryMeta(active.category).color} 20%, transparent)`,
                            color: categoryMeta(active.category).color,
                            border: `1px solid color-mix(in srgb, ${categoryMeta(active.category).color} 40%, transparent)`,
                          }}
                        >
                          {t(`category.${active.category}`)}
                        </span>
                        <span className="font-mono text-xs text-paper-dim">
                          {active.areaM2 ? t("area", { m2: active.areaM2 }) : t("areaFallback")}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl xl:text-3xl font-semibold tracking-tight text-paper">
                        {active.label}
                      </h3>
                      <p className="text-xs text-paper-dim leading-relaxed">{t("standHint")}</p>
                    </div>

                    {/* Servicios y equipamiento incluidos */}
                    <div className="rounded-xl border border-line/60 bg-surface p-3 xl:p-4 text-xs">
                      <span className="font-mono text-[0.68rem] font-semibold tracking-wider text-accent uppercase block mb-2">
                        {t("servicesTitle")}
                      </span>
                      <ul className="space-y-1.5 xl:space-y-2 text-[0.78rem] text-paper-dim">
                        <li className="flex items-center gap-2.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                          <span>{t("servicePower")}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                          <span>{t("serviceLighting")}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                          <span>{t("serviceSecurity")}</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                          <span>{t("serviceWifi")}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Botón WhatsApp de disponibilidad y deseleccionar */}
                  <div className="flex flex-col gap-2 pt-1 shrink-0">
                    <a
                      href={`https://wa.me/5493884212955?text=${encodeURIComponent(
                        t("whatsappTemplate", {
                          stand: active.label,
                          category: categoryMeta(active.category).label,
                          area: active.areaM2 ? `, ${active.areaM2} m²` : "",
                        }),
                      )}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 xl:py-3 font-body text-xs font-semibold text-ink transition hover:brightness-110 shadow-[0_0_20px_rgba(45,227,214,0.35)] active:scale-[0.98]"
                    >
                      <span>{t("askAvailability")}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="rounded-full border border-line py-1.5 xl:py-2 text-center font-mono text-xs text-paper-dim transition hover:border-paper hover:text-paper"
                    >
                      ✕ Ver información general del predio
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between gap-4 flex-1 min-h-0">
                  <div className="flex flex-col gap-3">
                    {/* Encabezado sin selección */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-xl xl:text-2xl font-medium text-paper">{t("emptyTitle")}</h3>
                      <p className="text-xs text-paper-dim leading-relaxed">{t("emptyHint")}</p>
                    </div>

                    {/* Ficha informativa del predio (Captura 1) */}
                    <div className="rounded-xl border border-line/60 bg-surface p-3.5 text-xs text-paper-dim space-y-2">
                      <span className="font-mono text-[0.68rem] font-semibold tracking-wider text-accent uppercase block">
                        {t("venueTitle")}
                      </span>
                      <div className="flex justify-between border-b border-line/40 pb-1.5">
                        <span>{t("venueArea")}</span>
                        <strong className="font-mono text-paper">25.000 m²</strong>
                      </div>
                      <div className="flex justify-between border-b border-line/40 pb-1.5">
                        <span>{t("venueStands")}</span>
                        <strong className="font-mono text-paper">+200 espacios</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("venueParking")}</span>
                        <strong className="font-mono text-paper">+1.500 vehículos</strong>
                      </div>
                    </div>
                  </div>

                  {/* Leyenda de referencias por categoría (Captura 1) */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <span className="font-mono text-[0.65rem] tracking-[0.2em] text-paper-dim uppercase">
                      {t("legend")}
                    </span>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                      {CATEGORIES.map((cat) => (
                        <li key={cat.id} className="flex items-center gap-2 text-paper-dim">
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="truncate text-[0.75rem]">{t(`category.${cat.id}`)}</span>
                          <span className="ml-auto font-mono text-[0.68rem] tabular-nums text-paper-dim/80">
                            {counts.get(cat.id) ?? 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Filtros Superiores + Gran Contenedor del Mapa ── */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between h-full min-h-0 gap-2.5 xl:gap-3 w-full">
          {/* Barra superior de Filtros de categorías con efecto rebote de derecha a izquierda */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0 overflow-hidden py-1">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter(null)}
                aria-pressed={filter === null}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-mono text-xs transition motion-reduce:transform-none motion-reduce:opacity-100 hover:border-paper-dim ${isDrawn ? "" : "will-change-transform"}`}
                style={{
                  borderColor: filter === null ? "var(--color-paper)" : "var(--color-line)",
                  backgroundColor: filter === null ? "var(--color-paper)" : "var(--color-surface)",
                  color: filter === null ? "var(--color-ink)" : "var(--color-paper-dim)",
                  fontWeight: filter === null ? 700 : 500,
                  transform: isDrawn ? "none" : "translate3d(var(--map-pill-0-x, 260px), 0, 0)",
                  opacity: isDrawn ? 1 : "var(--map-pill-0-opacity, 0)",
                }}
              >
                {t("filter.all", { count: totalStands })}
              </button>
              {CATEGORIES.filter((c) => STAND_CATEGORIES.includes(c.id)).map((cat, idx) => {
                const isOn = filter === cat.id;
                const pillIdx = idx + 1;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilter(isOn ? null : cat.id)}
                    aria-pressed={isOn}
                    className={`cursor-pointer flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition motion-reduce:transform-none motion-reduce:opacity-100 hover:border-paper-dim ${isDrawn ? "" : "will-change-transform"}`}
                    style={{
                      borderColor: isOn ? cat.color : "var(--color-line)",
                      backgroundColor: isOn ? "color-mix(in srgb, " + cat.color + " 18%, var(--color-surface))" : "var(--color-surface)",
                      color: isOn ? "var(--color-paper)" : "var(--color-paper-dim)",
                      fontWeight: isOn ? 700 : 500,
                      transform: isDrawn ? "none" : `translate3d(var(--map-pill-${pillIdx}-x, 260px), 0, 0)`,
                      opacity: isDrawn ? 1 : `var(--map-pill-${pillIdx}-opacity, 0)`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{t(`category.${cat.id}`)}</span>
                    <span className="tabular-nums opacity-85 font-semibold">{counts.get(cat.id) ?? 0}</span>
                  </button>
                );
              })}
            </div>
            {viewerCount !== null && viewerCount > 1 && (
              <p className="flex items-center gap-2 font-mono text-xs text-paper-dim shrink-0">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
                {t("viewersOnline", { count: viewerCount })}
              </p>
            )}
          </div>

          {/* Contenedor del Mapa (Captura 2: Borde redondeado, canvas oscuro, adaptado a VH) */}
          <div
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#070b1e] p-2.5 sm:p-4 shadow-2xl flex-1 min-h-0 w-full h-full border"
            style={{
              borderColor: isDrawn
                ? "var(--color-line)"
                : "color-mix(in srgb, var(--color-line) calc(var(--map-box-border, 0) * 100%), transparent)",
            }}
          >
            {/* SVG que dibuja el borde perimetral durante la aproximación */}
            {!isDrawn && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl overflow-visible"
                aria-hidden="true"
              >
                <rect
                  x="1"
                  y="1"
                  rx="16"
                  fill="none"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  pathLength="1000"
                  strokeDasharray="1000px"
                  style={{
                    width: "calc(100% - 2px)",
                    height: "calc(100% - 2px)",
                    strokeDashoffset: "calc(1000px * (1 - var(--map-box-border, 0)))",
                  }}
                />
              </svg>
            )}
            <div className="w-full h-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                role="img"
                aria-label={t("svgLabel")}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full select-none"
              >
                {VENUE_PLAN.map((zone) => {
                  const meta = categoryMeta(zone.category);
                  const cx = zone.x + zone.width / 2;
                  const cy = zone.y + zone.height / 2;
                  const isActive = zone.id === activeId;
                  const isHovered = zone.id === hoveredId;
                  const context = isContext(zone);
                  const dimmed = filter !== null && zone.category !== filter;

                  const metrics = ZONE_METRICS.get(zone.id) ?? { perimeter: 100, wave: 0 };
                  const perimeter = metrics.perimeter;
                  const wave = metrics.wave;

                  const shapeStyle: React.CSSProperties = isDrawn
                    ? {
                        fill: isActive
                          ? meta.color
                          : isHovered
                            ? `color-mix(in srgb, ${meta.color} 45%, rgba(255,255,255,0.18))`
                            : context
                              ? "transparent"
                              : "rgba(255,255,255,0.05)",
                        stroke: meta.color,
                        strokeWidth: isActive ? 3 : isHovered ? 2.2 : context ? 1 : 1.4,
                        opacity: dimmed ? 0.12 : isActive ? 1 : isHovered ? 0.95 : context ? 0.35 : 0.7,
                        transition: "opacity 160ms ease, fill 160ms ease, stroke-width 160ms ease",
                      }
                    : {
                        fill: context
                          ? "transparent"
                          : isActive
                            ? meta.color
                            : `color-mix(in srgb, ${meta.color} calc(var(--map-w${wave}-fill, 0) * 15%), rgba(255,255,255,calc(var(--map-w${wave}-fill, 0) * 0.05)))`,
                        stroke: meta.color,
                        strokeDasharray: `${perimeter}px`,
                        strokeDashoffset: `calc(${perimeter}px * (1 - var(--map-w${wave}, 0)))`,
                        opacity: `calc(var(--map-w${wave}, 0) * ${dimmed ? 0.12 : isActive ? 1 : isHovered ? 0.95 : context ? 0.35 : 0.7})`,
                        pointerEvents: "none",
                      };

                  const shape =
                    zone.shape === "circle" ? (
                      <ellipse cx={cx} cy={cy} rx={zone.width / 2} ry={zone.height / 2} style={shapeStyle} />
                    ) : zone.shape === "polygon" && zone.points?.length ? (
                      <polygon points={polygonPoints(zone)} style={shapeStyle} />
                    ) : (
                      <rect
                        x={zone.x}
                        y={zone.y}
                        width={zone.width}
                        height={zone.height}
                        rx={3}
                        style={shapeStyle}
                      />
                    );

                  if (context) {
                    return (
                      <g
                        key={zone.id}
                        transform={zone.rotation ? `rotate(${zone.rotation} ${cx} ${cy})` : undefined}
                        style={{ pointerEvents: "none" }}
                      >
                        {shape}
                      </g>
                    );
                  }

                  return (
                    <g
                      key={zone.id}
                      transform={zone.rotation ? `rotate(${zone.rotation} ${cx} ${cy})` : undefined}
                      onMouseEnter={() => setHoveredId(zone.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveId(activeId === zone.id ? null : zone.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveId(activeId === zone.id ? null : zone.id);
                        }
                      }}
                      tabIndex={dimmed ? -1 : 0}
                      role="button"
                      aria-label={`${zone.label} — ${t(`category.${zone.category}`)}`}
                      aria-pressed={isActive}
                      className="cursor-pointer outline-offset-2 outline-paper focus-visible:outline-2"
                    >
                      {shape}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Barra inferior de estado (Captura 2) */}
            <div className="mt-2 flex items-center justify-between border-t border-line/40 pt-2 px-1 text-xs text-paper-dim shrink-0">
              <div className="flex items-center gap-2 font-mono text-[0.72rem]">
                <span className="inline-block h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse" />
                {hoveredZone ? (
                  <span>
                    {t("exploring")} <strong className="text-paper">{hoveredZone.label}</strong> — {categoryMeta(hoveredZone.category).label}
                    {hoveredZone.areaM2 ? ` (${hoveredZone.areaM2} m²)` : ""}
                  </span>
                ) : active ? (
                  <span>
                    {t("selectedStand")} <strong className="text-paper">{active.label}</strong> ({categoryMeta(active.category).label})
                  </span>
                ) : (
                  <span className="text-paper-dim/80">
                    {t("tapHint")}
                  </span>
                )}
              </div>

              {active && (
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="cursor-pointer font-mono text-xs text-accent transition hover:underline mr-8 sm:mr-10"
                >
                  ✕ {t("clearSelection")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
