"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { Reveal } from "@/lib/ui/reveal";
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

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Al entrar en vista o cambiar la actividad en vivo, la tira horizontal
  // se desliza sola para que quede centrada sin que el visitante tenga que
  // buscarla arrastrando.
  useEffect(() => {
    if (liveIndex < 0) return;
    const card = cardRefs.current[liveIndex];
    const track = trackRef.current;
    if (!card || !track) return;
    const offset = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left: Math.max(offset, 0), behavior: "smooth" });
  }, [liveIndex, activeDate]);

  // Arrastre con mouse: la tira solo tiene scroll nativo en touch/trackpad,
  // así que con mouse no había forma de deslizarla salvo la barra. Solo se
  // activa para pointerType "mouse" — en touch el scroll nativo ya funciona
  // y agregar esto encima duplicaría/pelearía con el momentum del sistema.
  const dragState = useRef({ active: false, startX: 0, startScrollLeft: 0 });

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { active: true, startX: e.clientX, startScrollLeft: track.scrollLeft };
    track.setPointerCapture(e.pointerId);
  }

  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = dragState.current.startScrollLeft - (e.clientX - dragState.current.startX);
  }

  function handleTrackPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  }

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

        {/* Actividades destacadas: Contenedor amplio y chips escalonados */}
        <Reveal revealed={inView} delay={320} y={45} scale={0.94}>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#100c24]/95 via-[#0c0920]/95 to-[#080614]/95 p-5 sm:p-7 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="font-mono text-xs tracking-[0.2em] text-white/60 uppercase">
              Actividades destacadas · {tDays(active.dayKey)} {active.dayNumber}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan motion-safe:animate-pulse" />
              {liveIndex >= 0 ? "En vivo" : "Confirmado"}
            </span>
          </div>

          {/* Tira horizontal con scroll-snap: acepta cualquier cantidad de
              actividades sin romper el layout, en vez de forzar más filas
              de grilla. Los degradés en los bordes avisan que hay más
              contenido para deslizar. */}
          <div className="relative mt-4">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#080614] to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#080614] to-transparent"
            />
            <div
              ref={trackRef}
              onPointerDown={handleTrackPointerDown}
              onPointerMove={handleTrackPointerMove}
              onPointerUp={handleTrackPointerUp}
              onPointerLeave={handleTrackPointerUp}
              onPointerCancel={handleTrackPointerUp}
              className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-smooth pt-1 pb-3 cursor-grab active:cursor-grabbing select-none [scrollbar-width:thin] [scrollbar-color:rgba(45,227,214,0.45)_rgba(255,255,255,0.08)] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-cyan/45 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan/70"
            >
              {active.activities.map((act, idx) => {
                const isLive = idx === liveIndex;
                const status = liveIndex < 0 ? "upcoming" : idx < liveIndex ? "past" : isLive ? "live" : "upcoming";
                const isPast = status === "past";
                return (
                  <Reveal
                    key={act.time}
                    revealed={inView}
                    delay={400 + idx * 70}
                    y={25}
                    scale={1}
                    className="w-[calc((100%-2.25rem)/4)] min-w-[9.5rem] shrink-0 snap-start"
                  >
                    <div
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      className={`group relative flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-xl border p-4 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                        isLive
                          ? "border-cyan/70 bg-[#0a1420]/95 shadow-[0_0_0_1px_rgba(45,227,214,0.25),0_10px_28px_-10px_rgba(45,227,214,0.45)]"
                          : isPast
                            ? "border-white/10 bg-[#0c0920]/80 hover:border-white/20"
                            : "border-white/10 bg-[#080614]/95 hover:border-cyan/60 hover:shadow-[0_8px_24px_-8px_rgba(45,227,214,0.3)]"
                      }`}
                    >
                      {isLive && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-3 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan to-transparent motion-safe:animate-pulse"
                        />
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            isLive ? "text-cyan" : isPast ? "text-white/45 line-through decoration-white/25" : "text-cyan-text"
                          }`}
                        >
                          {act.time} hs
                        </span>
                        {isLive ? (
                          <span className="flex items-center gap-1 rounded-full border border-cyan/50 bg-cyan/10 px-2 py-0.5 font-mono text-[0.65rem] text-cyan uppercase">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan motion-safe:animate-ping" />
                            Ahora
                          </span>
                        ) : (
                          <span
                            className={`rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase transition-colors ${
                              isPast
                                ? "border-white/15 text-white/45"
                                : "border-white/20 text-white/70 group-hover:border-cyan/40 group-hover:text-white"
                            }`}
                          >
                            {act.tag}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm leading-snug ${
                          isLive
                            ? "font-medium text-white"
                            : isPast
                              ? "text-white/55"
                              : "text-white group-hover:text-white"
                        }`}
                      >
                        {act.title}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
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
