"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Reveal } from "@/lib/ui/reveal";
import { EJE_FILTERS, EXHIBITORS, textSafeColor, type Exhibitor } from "./exhibitors-data";
import { ExhibitorCard } from "./exhibitor-card";
import { usePortalContext } from "./portal-entrance";

export const INITIAL_VISIBLE_COUNT = 4;

/**
 * Sin resultados no es "nada" — es la única veta que sí calzaba con el
 * filtro pero no con el texto: se muestra erosionada (el mismo trazo
 * dashed que ya usa el estrato faltante de /not-found) en vez de un
 * párrafo genérico. Si el filtro es "todos", se erosionan las 4 vetas
 * porque ninguna respondió.
 */
function EmptyDirectory({
  query,
  activeEje,
  onClearQuery,
}: {
  query: string;
  activeEje: { label: string; color: string } | null;
  onClearQuery: () => void;
}) {
  const bands = activeEje ? [activeEje.color] : EJE_FILTERS.map((eje) => eje.color);

  return (
    <div className="mt-8 flex flex-col items-center gap-5 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <div
        aria-hidden="true"
        className="flex h-10 w-full max-w-xs overflow-hidden rounded-lg border border-line"
      >
        {bands.map((color, i) => (
          <div
            key={i}
            className="flex-1 border-line first:border-l-0 last:border-r-0 [&:not(:last-child)]:border-r"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 5px, color-mix(in srgb, ${color} 35%, transparent) 5px, color-mix(in srgb, ${color} 35%, transparent) 6px)`,
            }}
          />
        ))}
      </div>
      <p className="max-w-sm text-sm text-paper-dim">
        {activeEje ? (
          <>
            Ninguna veta de{" "}
            <span style={{ color: textSafeColor(activeEje.color) }}>{activeEje.label}</span> coincide con
            &ldquo;{query}&rdquo;.
          </>
        ) : (
          <>Ninguna veta coincide con &ldquo;{query}&rdquo;.</>
        )}
      </p>
      <button
        type="button"
        onClick={onClearQuery}
        className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] text-paper-dim transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Borrar búsqueda
      </button>
    </div>
  );
}

export function Directory() {
  const t = useTranslations("Exhibitors");
  const [filter, setFilter] = useState<Exhibitor["eje"] | "todos">("todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const { inView } = usePortalContext();

  const selectFilter = (next: Exhibitor["eje"] | "todos") => {
    setFilter(next);
    setExpanded(false);
  };

  function matchesQuery(exhibitor: Exhibitor, needle: string) {
    const haystack = [
      exhibitor.name,
      t(`ejes.${exhibitor.eje}`),
      t(`items.${exhibitor.id}.pitch`),
      t(`items.${exhibitor.id}.busca`),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle.toLowerCase());
  }

  const byEje = filter === "todos" ? EXHIBITORS : EXHIBITORS.filter((e) => e.eje === filter);
  const matching = query.trim() ? byEje.filter((e) => matchesQuery(e, query.trim())) : byEje;
  const visible = expanded ? matching : matching.slice(0, INITIAL_VISIBLE_COUNT);
  const hidden = matching.length - visible.length;

  return (
    <div>
      <Reveal revealed={inView} y={35}>
        <label className="block">
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(false);
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-line bg-transparent px-5 py-2.5 text-sm text-paper placeholder:text-paper-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t("filterGroupLabel")}>
          <button
            type="button"
            onClick={() => selectFilter("todos")}
            aria-pressed={filter === "todos"}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.94] motion-reduce:active:scale-100 ${
              filter === "todos"
                ? "border-paper bg-paper text-ink"
                : "border-line text-paper-dim hover:border-paper-dim"
            }`}
          >
            {t("filterAll")}
          </button>
          {EJE_FILTERS.map((eje) => {
            const isActive = filter === eje.id;
            return (
              <button
                key={eje.id}
                type="button"
                onClick={() => selectFilter(eje.id)}
                aria-pressed={isActive}
                className="rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.94] motion-reduce:active:scale-100"
                style={
                  isActive
                    ? { backgroundColor: textSafeColor(eje.color), borderColor: eje.color, color: "var(--color-ink)" }
                    : { borderColor: "var(--color-line)", color: "var(--color-paper-dim)" }
                }
              >
                {t(`ejes.${eje.id}`)}
              </button>
            );
          })}
        </div>
      </Reveal>

      {matching.length === 0 ? (
        <EmptyDirectory
          query={query.trim()}
          activeEje={
            filter === "todos"
              ? null
              : {
                  label: t(`ejes.${filter}`),
                  color: EJE_FILTERS.find((eje) => eje.id === filter)!.color,
                }
          }
          onClearQuery={() => setQuery("")}
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((exhibitor, i) => (
            <ExhibitorCard
              key={exhibitor.id}
              exhibitor={exhibitor}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      )}

      {hidden > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="h-px w-24 overflow-hidden bg-line" aria-hidden="true">
            {/* Se escala en vez de cambiar el ancho: mismo resultado visual,
                pero `transform` lo resuelve el compositor y `width` obliga a
                recalcular layout en cada frame de la transición. */}
            <div
              className="h-full w-full origin-left bg-accent transition-transform duration-500 motion-reduce:transition-none"
              style={{
                transform: `scaleX(${visible.length / matching.length})`,
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded={expanded}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>{t("viewProfilesCta", { count: matching.length })}</span>{" "}
            <span className="text-accent">+{hidden}</span>
          </button>
        </div>
      )}

      {expanded && matching.length > INITIAL_VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              document.getElementById("expositores")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-expanded={expanded}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>{t("collapseCta")}</span>
            <span className="text-accent" aria-hidden="true">↑</span>
          </button>
        </div>
      )}
    </div>
  );
}
