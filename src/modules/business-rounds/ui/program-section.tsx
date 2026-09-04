"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { PROGRAM_DAYS } from "./program-data";

export function ProgramSection() {
  const t = useTranslations("BusinessRounds.Program");
  const tDays = useTranslations("BusinessRounds.Agenda.days");
  const [activeDate, setActiveDate] = useState(PROGRAM_DAYS[0]!.date);
  const active = PROGRAM_DAYS.find((day) => day.date === activeDate) ?? PROGRAM_DAYS[0]!;

  return (
    <section id="agenda" className="relative border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-violet)" />
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t("dayTabsLabel")}>
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
              {tDays(day.dayKey)} {day.dayNumber}
              {day.highlight && <span className="ml-1.5 text-accent">· {t(`highlight.${day.highlight}`)}</span>}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-[#121022] p-6">
          <span className="font-mono text-xs tracking-[0.15em] text-cyan uppercase">
            {t("morningLabel")}
          </span>
          <p className="mt-2 font-display text-lg text-paper">{t("morningContent")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-[#121022] p-6">
          <span className="font-mono text-xs tracking-[0.15em] text-lavender uppercase">
            {t("afternoonLabel")}
          </span>
          <p className="mt-2 font-display text-lg text-paper">{t("afternoonContent")}</p>
        </div>
      </div>

      <p className="mt-6 text-sm text-paper-dim">
        {t("dateLine", { day: tDays(active.dayKey), dayNumber: active.dayNumber })}
        {active.highlight && ` — ${t(`highlightNote.${active.highlight}`)}`}
      </p>
    </section>
  );
}
