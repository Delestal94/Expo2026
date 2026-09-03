"use client";

import { useState } from "react";
import { EJE_FILTERS, EXHIBITORS, type Exhibitor } from "./exhibitors-data";
import { ExhibitorCard } from "./exhibitor-card";

export const INITIAL_VISIBLE_COUNT = 4;

export function Directory() {
  const [filter, setFilter] = useState<Exhibitor["eje"] | "todos">("todos");
  const [expanded, setExpanded] = useState(false);

  const selectFilter = (next: Exhibitor["eje"] | "todos") => {
    setFilter(next);
    setExpanded(false);
  };

  const matching =
    filter === "todos" ? EXHIBITORS : EXHIBITORS.filter((e) => e.eje === filter);
  const visible = expanded ? matching : matching.slice(0, INITIAL_VISIBLE_COUNT);
  const hidden = matching.length - visible.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por eje">
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
          Todos
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
                  ? { backgroundColor: eje.color, borderColor: eje.color, color: "var(--color-ink)" }
                  : { borderColor: "var(--color-line)", color: "var(--color-paper-dim)" }
              }
            >
              {eje.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((exhibitor, i) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} index={i} />
        ))}
      </div>

      {hidden > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="h-px w-24 overflow-hidden bg-line" aria-hidden="true">
            <div
              className="h-full bg-accent transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${(visible.length / matching.length) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded={expanded}
            className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>Ver los {matching.length} perfiles</span>{" "}
            <span className="text-accent">+{hidden}</span>
          </button>
        </div>
      )}
    </div>
  );
}
