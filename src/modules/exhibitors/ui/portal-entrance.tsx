"use client";

import { createContext, useContext, type ReactNode } from "react";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { Reveal } from "@/lib/ui/reveal";
import { useSectionReveal } from "@/lib/ui/use-section-reveal";

interface PortalContextValue {
  inView: boolean;
}

const PortalContext = createContext<PortalContextValue>({ inView: true });

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
  const { ref: sectionRef, revealed: inView } = useSectionReveal<HTMLElement>({
    parallax: { property: "--portal-bg-parallax", factor: -0.13 },
  });

  return (
    <PortalContext.Provider value={{ inView }}>
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
        <Reveal revealed={inView} className="relative">
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
            {eyebrow}
          </span>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-paper-dim">{description}</p>
        </Reveal>

        {/* Contenido (Directorio y desplegables) */}
        <div className="relative mt-8">
          {children}
        </div>
      </section>
    </PortalContext.Provider>
  );
}
