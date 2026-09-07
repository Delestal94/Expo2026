"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { PROGRAM_DAYS } from "./program-data";

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

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    if (prefersReducedMotion) {
      return;
    }

    let ticking = false;
    let hasTriggered = false;

    function evaluateVisibility() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 800;

      // Parallax continuo de fondo mineral
      const parallaxY = rect.top * -0.14;
      section.style.setProperty("--agenda-bg-parallax", `${parallaxY.toFixed(1)}px`);

      // Se dispara solo la primera vez cuando ya se mostró ~3/4 de la sección en pantalla
      if (!hasTriggered) {
        const isThreeQuartersShown = rect.top <= viewH * 0.35;
        const isStillInView = rect.bottom >= viewH * 0.15;

        if (isThreeQuartersShown && isStillInView) {
          hasTriggered = true;
          setInView(true);
        }
      }
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          evaluateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setTimeout(evaluateVisibility, 60);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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
      <div
        className="relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
        style={{
          transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 40px, 0) scale(0.96)",
          opacity: inView ? 1 : 0,
        }}
      >
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>
      </div>

      {/* Selector de días */}
      <div
        className="relative mt-8 flex flex-wrap gap-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
        style={{
          transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 30px, 0) scale(0.95)",
          opacity: inView ? 1 : 0,
          transitionDelay: inView ? "100ms" : "0ms",
        }}
        role="tablist"
        aria-label={t("dayTabsLabel")}
      >
        {PROGRAM_DAYS.map((day) => {
          const isActive = day.date === activeDate;
          return (
            <button
              key={day.date}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDate(day.date)}
              className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-all duration-200 active:scale-[0.96] motion-reduce:active:scale-100 ${
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

      {/* Tabpanel: Contenedores con vuelo lateral parallax y acentos de color */}
      <div role="tabpanel" className="relative mt-8 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tarjeta Mañana (Entra volando desde la izquierda) */}
          <div
            key={`morning-${activeDate}`}
            className="group relative overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface/95 to-surface/85 backdrop-blur-sm p-6 sm:p-8 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-cyan/50 hover:shadow-[0_16px_36px_-15px_rgba(45,227,214,0.3)] hover:-translate-y-1 will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
            style={{
              transform: inView
                ? "translate3d(0, 0, 0) rotate(0deg) scale(1)"
                : "translate3d(-35px, 40px, 0) rotate(-1.5deg) scale(0.94)",
              opacity: inView ? 1 : 0,
              transitionDelay: inView ? "160ms" : "0ms",
            }}
          >
            {/* Vena superior mineral cian */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/70 to-transparent transition-all duration-300 group-hover:h-[3px] group-hover:via-cyan"
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

          {/* Tarjeta Tarde (Entra volando desde la derecha) */}
          <div
            key={`afternoon-${activeDate}`}
            className="group relative overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface/95 to-surface/85 backdrop-blur-sm p-6 sm:p-8 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-lavender/50 hover:shadow-[0_16px_36px_-15px_rgba(185,166,245,0.3)] hover:-translate-y-1 will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
            style={{
              transform: inView
                ? "translate3d(0, 0, 0) rotate(0deg) scale(1)"
                : "translate3d(35px, 40px, 0) rotate(1.5deg) scale(0.94)",
              opacity: inView ? 1 : 0,
              transitionDelay: inView ? "240ms" : "0ms",
            }}
          >
            {/* Vena superior mineral lavanda */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-lavender/70 to-transparent transition-all duration-300 group-hover:h-[3px] group-hover:via-lavender"
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
        </div>

        {/* Actividades destacadas: Contenedor amplio y chips escalonados */}
        <div
          key={`activities-${activeDate}`}
          className="relative overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-[#100c24]/90 via-ink to-[#080614]/90 p-5 sm:p-7 backdrop-blur-sm transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
          style={{
            transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 45px, 0) scale(0.94)",
            opacity: inView ? 1 : 0,
            transitionDelay: inView ? "320ms" : "0ms",
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
            <span className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
              Actividades destacadas · {tDays(active.dayKey)} {active.dayNumber}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Confirmado
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {active.activities.map((act, idx) => (
              <div
                key={act.time}
                className="group flex flex-col justify-between rounded-xl border border-line/70 bg-[#080614]/95 p-3.5 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/60 hover:shadow-[0_8px_24px_-8px_rgba(45,227,214,0.3)] hover:-translate-y-1 will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
                style={{
                  transform: inView ? "translate3d(0, 0, 0)" : "translate3d(0, 25px, 0)",
                  opacity: inView ? 1 : 0,
                  transitionDelay: inView ? `${400 + idx * 80}ms` : "0ms",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">{act.time} hs</span>
                  <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.6rem] text-paper-dim uppercase transition-colors group-hover:border-accent/40 group-hover:text-paper">
                    {act.tag}
                  </span>
                </div>
                <p className="mt-2.5 text-xs leading-snug text-paper group-hover:text-paper">{act.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="relative mt-6 text-sm text-paper-dim">
        {t("dateLine", { day: tDays(active.dayKey), dayNumber: active.dayNumber })}
        {active.highlight && ` — ${t(`highlightNote.${active.highlight}`)}`}
      </p>
    </section>
  );
}
