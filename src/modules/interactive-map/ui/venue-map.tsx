"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CATEGORIES, VENUE_PLAN, categoryMeta, polygonPoints } from "./venue-plan";
import type { Category, VenueZone } from "./venue-plan";

const VIEW_W = 1200;
const VIEW_H = 865;

/** Categorías que son stands asignables; el resto es contexto del predio. */
const STAND_CATEGORIES: Category[] = ["cubierto", "artesano", "descubierto", "gastronomico", "juego"];

function isContext(zone: VenueZone) {
  return zone.category === "infraestructura" || zone.category === "institucional";
}

export function VenueMap() {
  const t = useTranslations("InteractiveMap");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | null>(null);

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
            ? `Pabellón cubierto — Serie ${prefix}`
            : prefix === "D"
              ? "Exterior — Serie D (Descubiertos)"
              : prefix === "E"
                ? "Sector E — Artesanos y Juegos"
                : "Sector F — Gastronómicos";
        groups.push({ label: title, stands: items });
      }
    }

    const remaining = assignable.filter(
      (z) => !seriesOrder.some((p) => z.label.startsWith(p)),
    );
    if (remaining.length > 0) {
      groups.push({ label: "Otros puestos", stands: remaining });
    }

    return groups;
  }, []);

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0">
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
          <div className="flex-1 min-h-0 rounded-2xl border border-line/80 bg-ink/80 p-4 sm:p-5 xl:p-6 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4 overflow-y-auto">
            {/* Selector rápido de stand */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label
                htmlFor="stand-quick-select"
                className="font-mono text-[0.68rem] tracking-[0.15em] text-paper-dim uppercase flex items-center justify-between"
              >
                <span>Selector rápido de puesto</span>
                <span className="text-paper-dim/60 font-mono text-[0.65rem]">{totalStands} stands</span>
              </label>
              <select
                id="stand-quick-select"
                value={activeId ?? ""}
                onChange={(e) => setActiveId(e.target.value || null)}
                className="w-full rounded-xl border border-line bg-[#090e24] px-3.5 py-2.5 text-xs text-paper outline-none transition focus-visible:border-accent"
              >
                <option value="">Elegí un puesto de la lista o tocá el plano...</option>
                {groupedStands.map((group) => (
                  <optgroup key={group.label} label={group.label} className="bg-[#090e24] text-paper font-semibold">
                    {group.stands.map((zone) => (
                      <option key={zone.id} value={zone.id} className="font-normal text-paper">
                        {zone.label} ({categoryMeta(zone.category).label}
                        {zone.areaM2 ? ` - ${zone.areaM2} m²` : ""})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
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
                        {active.areaM2 ? t("area", { m2: active.areaM2 }) : "16 m² de superficie"}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl xl:text-3xl font-semibold tracking-tight text-paper">
                      {active.label}
                    </h3>
                    <p className="text-xs text-paper-dim leading-relaxed">{t("standHint")}</p>
                  </div>

                  {/* Servicios y equipamiento incluidos */}
                  <div className="rounded-xl border border-line/60 bg-[#090e24] p-3 xl:p-4 text-xs">
                    <span className="font-mono text-[0.68rem] font-semibold tracking-wider text-accent uppercase block mb-2">
                      Servicios y equipamiento incluidos
                    </span>
                    <ul className="space-y-1.5 xl:space-y-2 text-[0.78rem] text-paper-dim">
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                        <span>Conexión eléctrica 220V monofásica</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                        <span>Iluminación focal y cenefa frontal con rotulado</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                        <span>Seguridad perimetral y vigilancia privada 24 hs</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-mono text-[0.65rem] text-accent">✓</span>
                        <span>Wi-Fi de alta velocidad para expositores</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Botón WhatsApp de disponibilidad y deseleccionar */}
                <div className="flex flex-col gap-2 pt-1 shrink-0">
                  <a
                    href={`https://wa.me/5493884212955?text=${encodeURIComponent(
                      `Hola! Quisiera consultar la disponibilidad y condiciones comerciales del stand ${active.label} (${categoryMeta(active.category).label}${active.areaM2 ? `, ${active.areaM2} m²` : ""}) en ExpoJuy 2026.`,
                    )}`}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 xl:py-3 font-body text-xs font-semibold text-ink transition hover:brightness-110 shadow-[0_0_20px_rgba(45,227,214,0.35)] active:scale-[0.98]"
                  >
                    <span>Consultar disponibilidad</span>
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
                  <div className="rounded-xl border border-line/60 bg-[#090e24] p-3.5 text-xs text-paper-dim space-y-2">
                    <span className="font-mono text-[0.68rem] font-semibold tracking-wider text-accent uppercase block">
                      Predio Ciudad Cultural · Jujuy
                    </span>
                    <div className="flex justify-between border-b border-line/40 pb-1.5">
                      <span>Superficie total:</span>
                      <strong className="font-mono text-paper">25.000 m²</strong>
                    </div>
                    <div className="flex justify-between border-b border-line/40 pb-1.5">
                      <span>Stands comerciales:</span>
                      <strong className="font-mono text-paper">+200 espacios</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacidad cocheras:</span>
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
                      <li
                        key={cat.id}
                        className="flex items-center gap-1.5 text-paper-dim transition hover:text-paper cursor-pointer"
                        onClick={() => setFilter(filter === cat.id ? null : cat.id)}
                      >
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

        {/* ── COLUMNA DERECHA: Filtros Superiores + Gran Contenedor del Mapa ── */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between h-full min-h-0 gap-2.5 xl:gap-3 w-full">
          {/* Barra superior de Filtros de categorías (Captura 1 y 2) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilter(null)}
                aria-pressed={filter === null}
                className="rounded-full border px-3.5 py-1.5 font-mono text-xs transition"
                style={{
                  borderColor: filter === null ? "var(--color-paper)" : "var(--color-line)",
                  color: filter === null ? "var(--color-paper)" : "var(--color-paper-dim)",
                }}
              >
                {t("filter.all", { count: totalStands })}
              </button>
              {CATEGORIES.filter((c) => STAND_CATEGORIES.includes(c.id)).map((cat) => {
                const isOn = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilter(isOn ? null : cat.id)}
                    aria-pressed={isOn}
                    className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition"
                    style={{
                      borderColor: isOn ? cat.color : "var(--color-line)",
                      color: isOn ? "var(--color-paper)" : "var(--color-paper-dim)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {t(`category.${cat.id}`)}
                    <span className="tabular-nums opacity-70">{counts.get(cat.id) ?? 0}</span>
                  </button>
                );
              })}
            </div>

            {active && (
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="font-mono text-xs text-accent transition hover:underline"
              >
                ✕ Limpiar selección
              </button>
            )}
          </div>

          {/* Contenedor del Mapa (Captura 2: Borde redondeado, canvas oscuro, adaptado a VH) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line/80 bg-[#070b1e] p-2.5 sm:p-4 shadow-2xl flex-1 min-h-0 w-full h-full">
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

                  const shapeStyle = {
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
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                {hoveredZone ? (
                  <span>
                    Explorando: <strong className="text-paper">{hoveredZone.label}</strong> — {categoryMeta(hoveredZone.category).label}
                    {hoveredZone.areaM2 ? ` (${hoveredZone.areaM2} m²)` : ""}
                  </span>
                ) : active ? (
                  <span>
                    Stand seleccionado: <strong className="text-paper">{active.label}</strong> ({categoryMeta(active.category).label})
                  </span>
                ) : (
                  <span className="text-paper-dim/80">
                    Tocá cualquier puesto para ver características y servicios
                  </span>
                )}
              </div>

              {active && (
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="font-mono text-[0.7rem] text-accent transition hover:underline"
                >
                  ✕ Deseleccionar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
