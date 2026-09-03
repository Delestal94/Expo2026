"use client";

import { useState } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { PROGRAM_DAYS } from "./program-data";

export function ProgramSection() {
  const [activeDate, setActiveDate] = useState(PROGRAM_DAYS[0]!.date);
  const active = PROGRAM_DAYS.find((day) => day.date === activeDate) ?? PROGRAM_DAYS[0]!;

  return (
    <section id="agenda" className="relative border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-violet)" />
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">Agenda</span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        Cuatro días, un mismo ritmo
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">
        Mañana de rondas de negocios, tarde de expo — así confirmó la
        organización el formato 2026. La grilla horaria de charlas, paneles y
        shows nocturnos se publica más cerca de la fecha, como en la edición
        anterior.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Elegir día de la agenda">
        {PROGRAM_DAYS.map((day) => {
          const isActive = day.date === activeDate;
          return (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDate(day.date)}
              className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                isActive
                  ? "border-paper bg-paper text-ink"
                  : "border-line text-paper-dim hover:border-paper-dim"
              }`}
            >
              {day.label}
              {day.highlight && <span className="ml-1.5 text-accent">· {day.highlight}</span>}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-[#121022] p-6">
          <span className="font-mono text-xs tracking-[0.15em] text-cyan uppercase">Mañana</span>
          <p className="mt-2 font-display text-lg text-paper">{active.morning}</p>
        </div>
        <div className="rounded-2xl border border-line bg-[#121022] p-6">
          <span className="font-mono text-xs tracking-[0.15em] text-lavender uppercase">Tarde</span>
          <p className="mt-2 font-display text-lg text-paper">{active.afternoon}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-paper-dim">
        {active.weekday} {active.date.slice(-2)} de octubre
        {active.highlight === "Apertura" && " — día de apertura del evento."}
        {active.highlight === "Cierre" && " — día de cierre del evento."}
      </p>
    </section>
  );
}
