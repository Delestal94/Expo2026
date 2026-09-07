"use client";

import { useEffect, useRef } from "react";

/**
 * Pausa las animaciones CSS infinitas de los elementos que salieron del
 * viewport, alternando la clase `.motion-idle` (ver globals.css).
 *
 * Una animación CSS infinita sigue consumiendo trabajo de compositor
 * aunque su elemento esté a diez pantallas de distancia. En la grilla de
 * /galeria hay 30 fotos y cada una corre DOS animaciones perpetuas (la
 * deriva tipo Ken Burns y el destello): 60 animaciones activas de las que,
 * en el mejor de los casos, se ven doce. Es la misma regla que ya aplican
 * el canvas de estratos y el resto de los bucles del sitio —cortá lo que no
 * se ve— trasladada a lo que anima el navegador por su cuenta.
 *
 * Un solo observer para todos los elementos: registrar treinta observers
 * costaría más que lo que se ahorra.
 */
export function useIdleOffscreen<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>("[data-idle-offscreen]"),
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("motion-idle", !entry.isIntersecting);
        }
      },
      // Un margen generoso: la animación se reanuda antes de que la foto
      // asome, así nunca se ve arrancar desde el cuadro congelado.
      { rootMargin: "40% 0px 40% 0px" },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
