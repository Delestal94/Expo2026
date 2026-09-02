"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ZONES } from "./zones";

const VIEW_W = 960;
const VIEW_H = 620;

export function VenueMap() {
  const t = useTranslations("InteractiveMap");
  const [activeId, setActiveId] = useState<string>(ZONES[0].id);
  const active = ZONES.find((z) => z.id === activeId) ?? ZONES[0];
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-line bg-[#121022] p-4">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={t("svgLabel")}
          className="h-auto w-full"
        >
          {ZONES.map((zone) => {
            const isActive = zone.id === activeId;
            return (
              <g
                key={zone.id}
                onMouseEnter={() => setActiveId(zone.id)}
                onClick={() => setActiveId(zone.id)}
                className="cursor-pointer outline-offset-4 outline-paper focus-visible:outline-2"
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={zone.label}
                onFocus={() => setActiveId(zone.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveId(zone.id);
                }}
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx={14}
                  style={{
                    fill: isActive ? zone.color : "rgba(255,255,255,0.04)",
                    stroke: zone.color,
                    strokeWidth: isActive ? 2.5 : 1.5,
                    opacity: isActive ? 0.9 : 0.55,
                    transition: "all 200ms ease",
                  }}
                />
                <text
                  x={zone.x + 18}
                  y={zone.y + 30}
                  fill={isActive ? "var(--color-ink)" : "var(--color-paper)"}
                  fontFamily="var(--font-body)"
                  fontWeight={600}
                  fontSize={zone.kind === "pabellon" ? 17 : 13}
                  style={{ transition: "fill 200ms ease" }}
                >
                  {zone.shortLabel ?? zone.label}
                </text>
                {zone.status && (
                  <>
                    <circle
                      cx={zone.x + 18}
                      cy={zone.y + zone.height - 20}
                      r={5}
                      fill={zone.status === "en-ronda" ? "var(--color-accent)" : "var(--color-paper-dim)"}
                    >
                      {zone.status === "en-ronda" && !prefersReducedMotion && (
                        <animate
                          attributeName="opacity"
                          values="1;0.3;1"
                          dur="1.6s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                    <text
                      x={zone.x + 32}
                      y={zone.y + zone.height - 15}
                      fill={isActive ? "var(--color-ink)" : "var(--color-paper-dim)"}
                      fontFamily="var(--font-mono)"
                      fontSize={11}
                      style={{ transition: "fill 200ms ease" }}
                    >
                      {zone.status === "en-ronda"
                        ? t("status.enRonda")
                        : t("status.disponible")}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div
        key={active.id}
        className="flex flex-col gap-4 rounded-2xl border border-line bg-[#121022] p-6"
      >
        <span
          className="w-fit rounded-full px-3 py-1 font-mono text-[0.68rem] tracking-[0.1em] uppercase"
          style={{ backgroundColor: `color-mix(in srgb, ${active.color} 20%, transparent)`, color: active.color }}
        >
          {t(`kind.${active.kind}`)}
        </span>
        <h3 className="font-display text-xl font-medium text-paper">{active.label}</h3>
        <p className="text-paper-dim">{active.description}</p>
        {active.status && (
          <p className="font-mono text-xs text-paper-dim">
            {t("exampleStatus", {
              detail:
                active.status === "en-ronda"
                  ? t("statusDetail.enRonda")
                  : t("statusDetail.disponible"),
            })}
          </p>
        )}
      </div>
    </div>
  );
}
