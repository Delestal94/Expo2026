"use client";

import { useEffect, useRef, useState } from "react";

interface SectionLink {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
}

const SECTIONS: SectionLink[] = [
  { id: "sobre", label: "Sobre el evento", shortLabel: "Sobre", color: "var(--color-cyan)" },
  { id: "ejes", label: "Ejes", shortLabel: "Ejes", color: "var(--color-violet)" },
  { id: "noticias", label: "Noticias", shortLabel: "Noticias", color: "var(--color-cyan)" },
  { id: "galeria", label: "Galería", shortLabel: "Galería", color: "var(--color-magenta)" },
  { id: "mapa", label: "Mapa", shortLabel: "Mapa", color: "var(--color-lavender)" },
  { id: "agenda", label: "Agenda", shortLabel: "Agenda", color: "var(--color-violet)" },
  { id: "expositores", label: "Expositores", shortLabel: "Expositores", color: "var(--color-cyan)" },
  { id: "acceso", label: "Acceso y cómo llegar", shortLabel: "Acceso", color: "var(--color-violet)" },
];

/**
 * Índice de anclas con forma de columna estratigráfica: cada sección es una
 * banda de color de marca, igual a las de About/Ejes. Solo aparece una vez
 * que el visitante deja el Hero, para no competir con la primera impresión.
 */
export function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-15% 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const visibleMap = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleMap.set(entry.target.id, entry.isIntersecting);
        });

        // Selecciona la primera sección en orden de documento que esté visible en la zona de lectura
        const firstVisible = SECTIONS.find((section) => visibleMap.get(section.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      { rootMargin: "-12% 0px -48% 0px", threshold: [0, 0.1, 0.3] },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock || !activeId) return;
    const link = dock.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!link) return;
    const target =
      link.offsetLeft - dock.clientWidth / 2 + link.clientWidth / 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    dock.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <>
      {/* Desktop: riel vertical de bandas sobre el borde derecho. */}
      <nav
        aria-hidden={!visible}
        aria-label="Secciones de la página"
        className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-end gap-1.5 transition-opacity duration-300 motion-reduce:transition-none lg:flex"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => setActiveId(section.id)}
              aria-current={isActive ? "true" : undefined}
              tabIndex={visible ? 0 : -1}
              className="group flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="pointer-events-none max-w-0 overflow-hidden rounded-full bg-ink/90 py-1 font-mono text-[0.65rem] tracking-wide whitespace-nowrap text-paper opacity-0 shadow-lg ring-1 ring-line transition-all duration-200 motion-reduce:transition-none group-hover:max-w-[10rem] group-hover:px-2.5 group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:px-2.5 group-focus-visible:opacity-100">
                {section.label}
              </span>
              <span
                aria-hidden="true"
                className="h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none"
                style={{
                  backgroundColor: section.color,
                  width: isActive ? "2rem" : "0.9rem",
                  opacity: isActive ? 1 : 0.5,
                }}
              />
            </a>
          );
        })}
      </nav>

      {/* Mobile: dock inferior con scroll horizontal y snap. */}
      <nav
        aria-hidden={!visible}
        aria-label="Secciones de la página"
        className="fixed inset-x-0 bottom-0 z-40 transition-opacity duration-300 motion-reduce:transition-none lg:hidden"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      >
        <div
          ref={dockRef}
          className="flex snap-x gap-2 overflow-x-auto border-t border-line bg-ink/90 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SECTIONS.map((section) => {
            const isActive = section.id === activeId;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveId(section.id)}
                aria-current={isActive ? "true" : undefined}
                tabIndex={visible ? 0 : -1}
                className="flex shrink-0 scroll-mx-3 snap-start items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{
                  borderColor: isActive ? section.color : "var(--color-line)",
                  color: isActive ? "var(--color-paper)" : "var(--color-paper-dim)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: section.color }}
                />
                {section.shortLabel}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
