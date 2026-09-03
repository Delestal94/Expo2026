"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CATEGORIES, VENUE_PLAN, categoryMeta, polygonPoints } from "./venue-plan";
import type { Category, VenueZone } from "./venue-plan";

const VIEW_W = 1200;
const VIEW_H = 850;

/** Categorías que son stands asignables; el resto es contexto del predio. */
const STAND_CATEGORIES: Category[] = ["cubierto", "artesano", "descubierto", "gastronomico"];

function isContext(zone: VenueZone) {
  return zone.category === "infraestructura" || zone.category === "institucional";
}

export function VenueMap() {
  const t = useTranslations("InteractiveMap");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | null>(null);

  const active = activeId ? (VENUE_PLAN.find((z) => z.id === activeId) ?? null) : null;

  const counts = useMemo(() => {
    const acc = new Map<Category, number>();
    for (const zone of VENUE_PLAN) acc.set(zone.category, (acc.get(zone.category) ?? 0) + 1);
    return acc;
  }, []);

  // Cuenta lo mismo que se puede seleccionar en el plano (todo menos el
  // contexto del predio), para que el número de "Todos" no mienta.
  const totalStands = useMemo(() => VENUE_PLAN.filter((z) => !isContext(z)).length, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className="rounded-full border px-3 py-1.5 font-mono text-xs transition"
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
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition"
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

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-[#121022] p-3">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            role="img"
            aria-label={t("svgLabel")}
            className="h-auto w-full"
          >
            {VENUE_PLAN.map((zone) => {
              const meta = categoryMeta(zone.category);
              const cx = zone.x + zone.width / 2;
              const cy = zone.y + zone.height / 2;
              const isActive = zone.id === activeId;
              const context = isContext(zone);
              const dimmed = filter !== null && zone.category !== filter;

              const shapeStyle = {
                fill: isActive ? meta.color : context ? "transparent" : "rgba(255,255,255,0.05)",
                stroke: meta.color,
                strokeWidth: isActive ? 2.5 : context ? 1 : 1.4,
                opacity: dimmed ? 0.12 : isActive ? 0.9 : context ? 0.35 : 0.65,
                transition: "opacity 160ms ease, fill 160ms ease",
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

              // El contexto (pabellón, accesos, patio) se dibuja pero no se
              // puede seleccionar: lo que le interesa al visitante son los stands.
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
                  onMouseEnter={() => setActiveId(zone.id)}
                  onFocus={() => setActiveId(zone.id)}
                  onClick={() => setActiveId(zone.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveId(zone.id);
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

        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-[#121022] p-6">
          {active ? (
            <>
              <span
                className="w-fit rounded-full px-3 py-1 font-mono text-[0.68rem] tracking-widest uppercase"
                style={{
                  backgroundColor: `color-mix(in srgb, ${categoryMeta(active.category).color} 20%, transparent)`,
                  color: categoryMeta(active.category).color,
                }}
              >
                {t(`category.${active.category}`)}
              </span>
              <h3 className="font-display text-2xl font-medium text-paper">{active.label}</h3>
              {active.areaM2 ? (
                <p className="font-mono text-sm text-paper-dim">
                  {t("area", { m2: active.areaM2 })}
                </p>
              ) : null}
              <p className="text-sm text-paper-dim">{t("standHint")}</p>
            </>
          ) : (
            <>
              <h3 className="font-display text-xl font-medium text-paper">{t("emptyTitle")}</h3>
              <p className="text-sm text-paper-dim">{t("emptyHint")}</p>
            </>
          )}

          <div className="mt-2 border-t border-line pt-4">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-paper-dim uppercase">
              {t("legend")}
            </span>
            <ul className="mt-3 flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id} className="flex items-center gap-2 text-sm text-paper-dim">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {t(`category.${cat.id}`)}
                  <span className="ml-auto font-mono text-xs tabular-nums">
                    {counts.get(cat.id) ?? 0}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
