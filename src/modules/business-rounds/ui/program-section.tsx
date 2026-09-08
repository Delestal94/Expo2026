"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useState } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { ENTRANCE_EASE, ENTRANCE_MS, Reveal } from "@/lib/ui/reveal";
import { useSectionReveal } from "@/lib/ui/use-section-reveal";
import { PROGRAM_DAYS, type ProgramActivity } from "./program-data";

type ActivityStatus = "past" | "live" | "upcoming";

/**
 * Compara contra la hora real del visitante: sirve para marcar "en vivo"
 * durante el evento (9-12 oct 2026) y queda simplemente en "upcoming"
 * cualquier otro día del año, sin rama especial que mantener.
 */
function getActivityStatus(date: string, activities: ProgramActivity[], index: number, now: Date): ActivityStatus {
  const start = new Date(`${date}T${activities[index]!.time}:00`);
  const next = activities[index + 1];
  const end = next ? new Date(`${date}T${next.time}:00`) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  if (now >= end) return "past";
  if (now >= start) return "live";
  return "upcoming";
}

/**
 * Actividades visibles antes de pedir "ver más". Con 4 entran la franja de
 * la mañana y el arranque de la tarde sin que el bloque empuje al resto de
 * la sección fuera de pantalla en un teléfono.
 */
export const COLLAPSED_COUNT = 4;

const SECTION_WASH = {
  background: [
    "radial-gradient(ellipse 900px 520px at 85% 0%, color-mix(in srgb, var(--color-violet) 10%, transparent), transparent 65%)",
    "radial-gradient(ellipse 750px 460px at 15% 100%, color-mix(in srgb, var(--color-lavender) 9%, transparent), transparent 65%)",
  ].join(", "),
};

export function ProgramSection() {
  const t = useTranslations("BusinessRounds.Program");
  const tDays = useTranslations("BusinessRounds.Agenda.days");
  const [activeDate, setActiveDate] = useState(PROGRAM_DAYS[0]!.date);
  const active = PROGRAM_DAYS.find((day) => day.date === activeDate) ?? PROGRAM_DAYS[0]!;

  const { ref: sectionRef, revealed: inView } = useSectionReveal<HTMLElement>({
    parallax: { property: "--agenda-bg-parallax", factor: -0.14 },
  });

  // Reloj propio (no Date.now() en render) para poder marcar la actividad
  // "en vivo" sin desincronizar el server render; se actualiza cada minuto,
  // suficiente para una franja horaria que nunca dura menos de 30'.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata el reloj tras el montaje a propósito, para evitar desincronizar el server render
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const realLiveIndex = useMemo(() => {
    if (!now) return -1;
    return active.activities.findIndex(
      (_, idx) => getActivityStatus(active.date, active.activities, idx, now) === "live",
    );
  }, [active, now]);

  // Fuera de las fechas reales del evento (9-12 oct 2026) no hay ninguna
  // actividad "en vivo" de verdad — se simula una para que la demo muestre
  // el estado en cualquier momento en que se visite el sitio.
  const liveIndex = now ? (realLiveIndex >= 0 ? realLiveIndex : 1 % active.activities.length) : -1;

  const listId = useId();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // La actividad en vivo no puede quedar tapada por el corte: si cae fuera,
  // el día arranca desplegado (y ahí el botón deja de tener sentido).
  const forcedOpen = liveIndex >= COLLAPSED_COUNT;
  const expanded = forcedOpen || expandedDate === active.date;
  const hiddenCount = Math.max(active.activities.length - COLLAPSED_COUNT, 0);
  const visibleActivities = expanded ? active.activities : active.activities.slice(0, COLLAPSED_COUNT);

  return (
    <section
      id="agenda"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line px-6 py-20 sm:px-10 lg:px-16"
    >
      {/* Fondo ambiental reactivo a scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SECTION_WASH} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 -top-24 h-96 w-96 rounded-full bg-violet/10 blur-3xl will-change-transform"
        style={{ transform: "translate3d(0, var(--agenda-bg-parallax, 0px), 0)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 bottom-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl will-change-transform"
        style={{ transform: "translate3d(0, calc(var(--agenda-bg-parallax, 0px) * -0.6), 0)" }}
      />

      {/* Marca de agua mineral sutil con efecto parallax */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 top-1/4 select-none font-display text-[8rem] sm:text-[11rem] font-black tracking-tighter text-white/[0.02] will-change-transform"
        style={{ transform: "translate3d(0, var(--agenda-bg-parallax, 0px), 0)" }}
      >
        2026
      </span>

      <EntranceVein color="var(--color-violet)" />

      {/* Encabezado con entrada en escena dinámica */}
      <Reveal revealed={inView} className="relative">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>
      </Reveal>

      {/* Selector de días */}
      <Reveal revealed={inView} delay={100} y={30} scale={0.95} className="relative mt-8">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("dayTabsLabel")}>
        {PROGRAM_DAYS.map((day) => {
          const isActive = day.date === activeDate;
          return (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDate(day.date)}
              className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-[border-color,background-color,color,box-shadow,transform] duration-200 motion-reduce:transition-none active:scale-[0.96] motion-reduce:active:scale-100 ${
                isActive
                  ? "border-paper bg-paper text-ink shadow-[0_0_16px_rgba(245,241,232,0.25)]"
                  : "border-line text-paper-dim hover:border-paper-dim hover:text-paper"
              }`}
            >
              {tDays(day.dayKey)} {day.dayNumber}
              {day.highlight && (
                // El tab activo pasa a fondo claro (bg-paper): text-accent
                // (cyan) ahí da ~1.4:1 de contraste, muy por debajo de las
                // 4.5:1 de WCAG AA. Encontrado con axe-core al verificar el
                // fix del issue #35 — no estaba en la lista original.
                <span className={`ml-1.5 ${isActive ? "text-ink/70" : "text-accent"}`}>
                  · {t(`highlight.${day.highlight}`)}
                </span>
              )}
            </button>
          );
        })}
        </div>
      </Reveal>

      {/* Tabpanel: el panel entero se vuelve a montar al cambiar de día
          (`key`) y arranca con un `panel-swap` de 320ms — antes las tres
          tarjetas tenían `key` propia pero la transición de entrada ya
          estaba en su estado final al montarse, así que el remonte no
          animaba nada: el contenido cambiaba de golpe y el trabajo de
          remontar tres subárboles no compraba nada. */}
      <div
        key={activeDate}
        role="tabpanel"
        className="relative mt-8 flex flex-col gap-4 motion-safe:animate-[panel-swap_0.32s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tarjeta Mañana (Entra volando desde la izquierda) */}
          <Reveal revealed={inView} delay={160} x={-35} y={40} scale={0.94} rotate={-1.5}>
          <div
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface/95 to-surface/85 backdrop-blur-sm p-6 sm:p-8 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-cyan/50 hover:shadow-[0_16px_36px_-15px_rgba(45,227,214,0.3)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/* Vena superior mineral cian */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] origin-top bg-gradient-to-r from-transparent via-cyan/70 to-transparent transition-[transform,opacity] duration-300 motion-reduce:transition-none group-hover:scale-y-150 group-hover:opacity-100"
            />
            {/* Resplandor ambiental de esquina */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan/10 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
            />
            <span className="font-mono text-xs tracking-[0.15em] text-cyan-text uppercase">
              {t("morningLabel")}
            </span>
            <h3 className="mt-2 font-display text-lg text-paper sm:text-xl">{active.morningTitle}</h3>
            <p className="mt-2 text-sm text-paper-dim leading-relaxed">{active.morningDescription}</p>
          </div>
          </Reveal>

          {/* Tarjeta Tarde (Entra volando desde la derecha) */}
          <Reveal revealed={inView} delay={240} x={35} y={40} scale={0.94} rotate={1.5}>
          <div
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface/95 to-surface/85 backdrop-blur-sm p-6 sm:p-8 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-lavender/50 hover:shadow-[0_16px_36px_-15px_rgba(185,166,245,0.3)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/* Vena superior mineral lavanda */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] origin-top bg-gradient-to-r from-transparent via-lavender/70 to-transparent transition-[transform,opacity] duration-300 motion-reduce:transition-none group-hover:scale-y-150 group-hover:opacity-100"
            />
            {/* Resplandor ambiental de esquina */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-lavender/10 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
            />
            <span className="font-mono text-xs tracking-[0.15em] text-lavender-text uppercase">
              {t("afternoonLabel")}
            </span>
            <h3 className="mt-2 font-display text-lg text-paper sm:text-xl">{active.afternoonTitle}</h3>
            <p className="mt-2 text-sm text-paper-dim leading-relaxed">{active.afternoonDescription}</p>
          </div>
          </Reveal>
        </div>

        {/* Actividades destacadas: grilla horaria vertical.

            Antes esto era una tira horizontal con scroll-snap y arrastre con
            mouse. Deslizar de costado es un gesto que no todo el mundo
            descubre —y con teclado o motricidad reducida es directamente un
            muro—, así que lo que no entraba en el ancho quedaba invisible:
            en el día de apertura, 3 de 7 actividades. La lectura vertical
            usa el mismo scroll que el resto de la página y lo que no entra
            se despliega con un botón explícito. */}
        <Reveal revealed={inView} delay={320} y={45} scale={0.94}>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#100c24]/95 via-[#0c0920]/95 to-[#080614]/95 p-5 sm:p-7 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-mono text-xs tracking-[0.2em] text-white/60 uppercase">
              {t("activitiesLabel")} · {tDays(active.dayKey)} {active.dayNumber}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.65rem] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan motion-safe:animate-pulse" />
              {liveIndex >= 0 ? t("liveBadge") : t("confirmedBadge")}
            </span>
          </div>

          <ol
            id={listId}
            aria-label={`${t("activitiesLabel")} — ${tDays(active.dayKey)} ${active.dayNumber}`}
            className="relative mt-4"
          >
            {visibleActivities.map((act, idx) => {
              const isLive = idx === liveIndex;
              const status: ActivityStatus =
                liveIndex < 0 ? "upcoming" : idx < liveIndex ? "past" : isLive ? "live" : "upcoming";
              const isPast = status === "past";
              const isLast = idx === visibleActivities.length - 1;
              const delay = 400 + idx * 60;
              return (
                // La entrada escalonada va inline y no con <Reveal>: ese
                // componente monta un <div>, y un <div> entre <ol> y <li> no
                // es HTML válido. `motion-entrance` conserva la misma salida
                // por prefers-reduced-motion que el resto de la sección.
                <li
                  key={act.time}
                  className={`motion-entrance grid grid-cols-[3rem_1.25rem_minmax(0,1fr)] sm:grid-cols-[3.75rem_1.5rem_minmax(0,1fr)] ${
                    idx >= COLLAPSED_COUNT
                      ? "motion-safe:animate-[panel-swap_0.32s_cubic-bezier(0.16,1,0.3,1)]"
                      : ""
                  }`}
                  style={{
                    // Las filas que aparecen al desplegar montan ya reveladas
                    // (sin transición que animar): para esas la entrada es el
                    // panel-swap de arriba.
                    transform: inView ? "none" : "translate3d(0, 18px, 0)",
                    opacity: inView ? 1 : 0,
                    transition: `transform ${ENTRANCE_MS}ms ${ENTRANCE_EASE} ${delay}ms, opacity ${ENTRANCE_MS}ms ${ENTRANCE_EASE} ${delay}ms`,
                  }}
                >
                  <span
                    className={`pt-3 text-right font-mono text-xs font-semibold tabular-nums sm:text-sm ${
                      isLive
                        ? "text-cyan"
                        : isPast
                          ? "text-white/45 line-through decoration-white/25"
                          : "text-cyan-text"
                    }`}
                  >
                    {act.time}
                  </span>

                  {/* Riel de la jornada: línea continua entre franjas y un
                      nodo por actividad. En la última fila la línea se corta
                      en el nodo, para que la agenda termine y no quede
                      sugiriendo que hay algo más abajo. */}
                  <div aria-hidden="true" className="relative flex justify-center">
                    <span className={`absolute top-0 w-px bg-white/10 ${isLast ? "h-[1.4rem]" : "bottom-0"}`} />
                    <span
                      className={`relative mt-[1.05rem] h-2 w-2 shrink-0 rounded-full ${
                        isLive
                          ? "bg-cyan shadow-[0_0_0_4px_rgba(45,227,214,0.18)]"
                          : isPast
                            ? "bg-white/25"
                            : "bg-white/40"
                      }`}
                    />
                  </div>

                  <div className="pb-2.5">
                    <div
                      className={`group/row flex flex-col gap-1.5 rounded-xl border px-3.5 py-2.5 transition-[border-color,background-color,box-shadow] duration-200 motion-reduce:transition-none sm:flex-row sm:items-start sm:justify-between sm:gap-3 ${
                        isLive
                          ? "border-cyan/60 bg-[#0a1420]/95 shadow-[0_0_0_1px_rgba(45,227,214,0.2),0_10px_28px_-14px_rgba(45,227,214,0.5)]"
                          : isPast
                            ? "border-white/[0.07] bg-white/[0.015] hover:border-white/20"
                            : "border-white/10 bg-white/[0.03] hover:border-cyan/50 hover:bg-cyan/[0.04]"
                      }`}
                    >
                      <p
                        className={`text-sm leading-snug ${
                          isLive ? "font-medium text-white" : isPast ? "text-white/55" : "text-white/90"
                        }`}
                      >
                        {act.title}
                      </p>
                      {isLive ? (
                        <span className="flex shrink-0 items-center gap-1 self-start rounded-full border border-cyan/50 bg-cyan/10 px-2 py-0.5 font-mono text-[0.65rem] text-cyan uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan motion-safe:animate-ping" />
                          {t("nowBadge")}
                        </span>
                      ) : (
                        <span
                          className={`shrink-0 self-start rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase transition-colors ${
                            isPast
                              ? "border-white/15 text-white/45"
                              : "border-white/20 text-white/70 group-hover/row:border-cyan/40 group-hover/row:text-white"
                          }`}
                        >
                          {act.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {hiddenCount > 0 && !forcedOpen && (
            <button
              type="button"
              onClick={() => setExpandedDate(expanded ? null : active.date)}
              aria-expanded={expanded}
              aria-controls={listId}
              className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/70 transition-[border-color,background-color,color] duration-200 hover:border-cyan/50 hover:bg-cyan/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              {expanded ? t("showLess") : t("showMore", { count: hiddenCount })}
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-3 w-3 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M3 4.5 6 7.5 9 4.5" />
              </svg>
            </button>
          )}
        </div>
        </Reveal>
      </div>

      <p className="relative mt-6 text-sm text-paper-dim">
        {t("dateLine", { day: tDays(active.dayKey), dayNumber: active.dayNumber })}
        {active.highlight && ` — ${t(`highlightNote.${active.highlight}`)}`}
      </p>
    </section>
  );
}
