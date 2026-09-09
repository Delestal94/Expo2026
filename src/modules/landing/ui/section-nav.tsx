"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type SectionId =
  | "sobre"
  | "noticias"
  | "galeria"
  | "mapa"
  | "agenda"
  | "expositores"
  | "llegar"
  | "faq"
  | "sponsors"
  | "contacto"
  | "redes";

interface SectionLink {
  id: SectionId;
  color: string;
}

// "Ejes" tenía su propia entrada acá, pero About y Ejes se fusionaron en
// una sola sección (id="sobre", con id="ejes" anidado adentro) — dos
// anclas del nav para un elemento y su propio padre son ambiguas: los dos
// topes cruzan la línea de lectura casi a la vez, y el riel quedaba
// marcando "Ejes" aunque se tocara "Sobre". Una sola entrada cubre ambas.
//
// Las etiquetas viven en Landing.SectionNav.sections (por idioma); acá solo
// queda el orden y el color de cada banda.
const SECTIONS: SectionLink[] = [
  { id: "sobre", color: "var(--color-cyan)" },
  { id: "noticias", color: "var(--color-cyan)" },
  { id: "galeria", color: "var(--color-magenta)" },
  { id: "mapa", color: "var(--color-lavender)" },
  { id: "agenda", color: "var(--color-violet)" },
  { id: "expositores", color: "var(--color-cyan)" },
  { id: "llegar", color: "var(--color-violet)" },
  { id: "faq", color: "var(--color-magenta)" },
  // Sponsors, contacto y redes viven dentro del pie, pero son tres de las
  // secciones que las consignas piden como mínimo (§5): sin ancla ni entrada
  // acá, para el visitante —y para quien evalúa recorriendo la página— no
  // existen como sección, solo como bloques del footer.
  { id: "sponsors", color: "var(--color-magenta)" },
  { id: "contacto", color: "var(--color-cyan)" },
  { id: "redes", color: "var(--color-lavender)" },
];

// Altura de la línea de lectura dentro del viewport: una sección pasa a estar
// activa cuando su tope la cruza.
const READING_LINE = 0.52;

/**
 * Índice de anclas con forma de columna estratigráfica: cada sección es una
 * banda de color de marca, igual a las de About/Ejes. Solo aparece una vez
 * que el visitante deja el Hero, para no competir con la primera impresión.
 */
export function SectionNav() {
  const t = useTranslations("Landing.SectionNav");
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

  // Scrollspy geométrico: la sección activa es la última cuyo tope ya cruzó
  // la línea de lectura.
  //
  // Acá había un IntersectionObserver que marcaba la *primera* sección
  // visible dentro de una franja del 12% al 52% del viewport. Fallaba de dos
  // maneras. En pantallas altas la franja abarca varias secciones a la vez y
  // la de más arriba tapaba a las de abajo, así que agenda, expositores,
  // llegar y faq no llegaban a marcarse nunca. Y sponsors, contacto y redes
  // viven dentro del pie, a menos de una pantalla del final del documento:
  // nunca alcanzan a subir hasta el 52%, con lo cual al llegar al final el
  // riel se quedaba clavado en "Sponsors" y daba a entender que la página
  // seguía más abajo. Por eso sobre la última pantalla de scroll la línea
  // baja desde READING_LINE hasta el borde inferior del viewport: así las
  // secciones del pie tienen su turno y la última queda activa cuando ya no
  // queda scroll.
  useEffect(() => {
    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    let ticking = false;

    function update() {
      ticking = false;
      const viewport = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewport;
      // Clampeado: el rebote de iOS deja `scrollY` por encima del máximo.
      const remaining = Math.max(maxScroll - window.scrollY, 0);
      const line = Math.max(viewport * READING_LINE, viewport - remaining);

      // Las lecturas de layout van todas juntas y dentro del rAF, que es
      // donde el navegador ya tiene resuelto el layout del cuadro.
      let current = targets[0].id;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      setActiveId(current);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
        aria-label={t("ariaLabel")}
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
              {/* Excepción consciente: revelar una etiqueta por ancho SÍ es
                  una animación de layout, pero es un solo elemento de un
                  subárbol `fixed`, 200ms, y solo mientras hay un puntero
                  encima. `transition-all` sí sobraba — limitado a lo que
                  realmente cambia. */}
              <span className="pointer-events-none max-w-0 overflow-hidden rounded-full bg-ink/90 py-1 font-mono text-[0.65rem] tracking-wide whitespace-nowrap text-paper opacity-0 shadow-lg ring-1 ring-line transition-[max-width,padding,opacity] duration-200 ease-out motion-reduce:transition-none group-hover:max-w-[10rem] group-hover:px-2.5 group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:px-2.5 group-focus-visible:opacity-100">
                {t(`sections.${section.id}.label`)}
              </span>
              {/* La banda mide siempre 2rem y se comprime con `scaleX`
                  desde la derecha. Antes animaba `width` (0.9rem ↔ 2rem):
                  cambiar el ancho de un elemento dispara layout, y acá
                  ocurría en cada cambio de sección activa mientras el
                  visitante scrollea. `scaleX` lo resuelve el compositor. */}
              <span
                aria-hidden="true"
                className="h-1.5 w-8 origin-right rounded-full transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
                style={{
                  backgroundColor: section.color,
                  transform: `scaleX(${isActive ? 1 : 0.45})`,
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
        aria-label={t("ariaLabel")}
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
                className="flex min-h-11 shrink-0 scroll-mx-3 snap-start items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
                {t(`sections.${section.id}.shortLabel`)}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
