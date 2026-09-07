"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function AccessEntrance({
  leftContent,
  rightContent,
}: {
  leftContent: ReactNode;
  rightContent: ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
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

      // Parallax continuo sutil de fondo mineral
      const parallaxY = rect.top * -0.12;
      section.style.setProperty("--access-bg-parallax", `${parallaxY.toFixed(1)}px`);

      // Se dispara una única vez cuando ~3/4 de la sección entra en pantalla
      if (!hasTriggered) {
        const isThreeQuartersShown = rect.top <= viewH * 0.40;
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
    <div
      ref={sectionRef}
      className="relative grid gap-y-16 lg:grid-cols-12 lg:gap-x-12"
    >
      {/* Columna Izquierda: Información de llegada y acceso */}
      <div
        className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform lg:col-span-7 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
        style={{
          transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 40px, 0) scale(0.96)",
          opacity: inView ? 1 : 0,
        }}
      >
        {leftContent}
      </div>

      {/* Columna Derecha: Mapa HUD y bloque de proveedores */}
      <div
        className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform lg:col-span-5 lg:col-start-8 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
        style={{
          transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 48px, 0) scale(0.95)",
          opacity: inView ? 1 : 0,
          transitionDelay: inView ? "150ms" : "0ms",
        }}
      >
        {rightContent}
      </div>
    </div>
  );
}
