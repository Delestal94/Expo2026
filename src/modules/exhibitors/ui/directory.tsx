"use client";

import { useState } from "react";
import { EJE_FILTERS, EXHIBITORS, type Exhibitor } from "./exhibitors-data";
import { ExhibitorCard } from "./exhibitor-card";

export function Directory() {
  const [filter, setFilter] = useState<Exhibitor["eje"] | "todos">("todos");

  const visible =
    filter === "todos" ? EXHIBITORS : EXHIBITORS.filter((e) => e.eje === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por eje">
        <button
          type="button"
          onClick={() => setFilter("todos")}
          aria-pressed={filter === "todos"}
          className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition ${
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
              onClick={() => setFilter(eje.id)}
              aria-pressed={isActive}
              className="rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition"
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
        {visible.map((exhibitor) => (
          <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} />
        ))}
      </div>
    </div>
  );
}
