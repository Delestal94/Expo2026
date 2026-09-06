"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";

interface PortalContextValue {
  inView: boolean;
  isMobile: boolean;
}

const PortalContext = createContext<PortalContextValue>({ inView: true, isMobile: false });

export function usePortalContext() {
  return useContext(PortalContext);
}

const SECTION_WASH = {
  background: [
    "radial-gradient(ellipse 900px 520px at 10% 0%, color-mix(in srgb, var(--color-cyan) 8%, transparent), transparent 65%)",
    "radial-gradient(ellipse 800px 480px at 90% 100%, color-mix(in srgb, var(--color-violet) 9%, transparent), transparent 65%)",
  ].join(", "),
};

export function PortalEntrance({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 640;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    if (prefersReducedMotion || typeof window === "undefined") {
      return;
    }

    let ticking = false;
    let hasTriggered = false;

    function evaluateVisibility() {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 800;

      // Parallax continuo de fondo mineral
      const parallaxY = rect.top * -0.13;
      section.style.setProperty("--portal-bg-parallax", `${parallaxY.toFixed(1)}px`);

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
    <PortalContext.Provider value={{ inView, isMobile }}>
      <section
        id="expositores"
        ref={sectionRef}
        className="relative overflow-hidden border-t border-line px-6 py-20 sm:px-10 lg:px-16"
      >
        {/* Fondo ambiental reactivo a scroll */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SECTION_WASH} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-24 h-96 w-96 rounded-full bg-cyan/10 blur-3xl will-change-transform"
          style={{ transform: "translate3d(0, var(--portal-bg-parallax, 0px), 0)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-36 bottom-12 h-96 w-96 rounded-full bg-violet/10 blur-3xl will-change-transform"
          style={{ transform: "translate3d(0, calc(var(--portal-bg-parallax, 0px) * -0.7), 0)" }}
        />

        {/* Marca de agua mineral sutil con efecto parallax */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-4 top-1/4 select-none font-display text-[8rem] sm:text-[12rem] font-black tracking-tighter text-white/[0.02] will-change-transform"
          style={{ transform: "translate3d(0, var(--portal-bg-parallax, 0px), 0)" }}
        >
          EXPO
        </span>

        <EntranceVein color="var(--color-cyan)" />

        {/* Encabezado con entrada en escena dinámica */}
        <div
          className="relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100"
          style={{
            transform: inView ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 40px, 0) scale(0.96)",
            opacity: inView ? 1 : 0,
          }}
        >
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
            {eyebrow}
          </span>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-paper-dim">{description}</p>
        </div>

        {/* Contenido (Directorio y desplegables) */}
        <div className="relative mt-8">
          {children}
        </div>
      </section>
    </PortalContext.Provider>
  );
}
