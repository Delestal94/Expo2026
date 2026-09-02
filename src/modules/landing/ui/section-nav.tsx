"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  key: "ejes" | "mapa" | "llegar" | "rondas" | "acceso";
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "ejes", key: "ejes", color: "var(--color-ocher)" },
  { id: "mapa", key: "mapa", color: "var(--color-terracotta)" },
  { id: "llegar", key: "llegar", color: "var(--color-violet)" },
  { id: "rondas", key: "rondas", color: "var(--color-teal)" },
  { id: "acceso", key: "acceso", color: "var(--color-rose)" },
];

/**
 * Barra sticky con forma de columna estratigráfica en miniatura: cada
 * ítem retoma el color de una banda mineral del hero, así saltar de
 * sección se lee como bajar por el mismo corte de roca. Aparece recién
 * al dejar el hero (que ya tiene su propia línea superior) y resalta la
 * sección visible con un IntersectionObserver — sin listeners de scroll.
 */
export function SectionNav() {
  const t = useTranslations("Landing.SectionNav");
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/90 backdrop-blur transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2.5 sm:justify-center sm:px-10">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className="group flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 outline-none focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span
                aria-hidden="true"
                className={`h-3.5 w-1 rounded-full transition-opacity duration-200 motion-reduce:transition-none ${
                  isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                }`}
                style={{ backgroundColor: item.color }}
              />
              <span
                className={`font-mono text-[11px] tracking-[0.15em] whitespace-nowrap uppercase transition-colors duration-200 motion-reduce:transition-none ${
                  isActive
                    ? "text-paper"
                    : "text-paper-dim group-hover:text-paper"
                }`}
              >
                {t(`items.${item.key}`)}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
