"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Veta de color que se dibuja de izquierda a derecha la primera vez que la
 * sección entra en el viewport — mismo lenguaje que el borde superior de
 * las tarjetas de Ejes al hover (`scale-x-0` → `scale-x-100`), pero como
 * bienvenida al llegar en vez de reacción a un gesto. Se dispara una sola
 * vez y queda asentada; decorativa (`aria-hidden`), así que sin JS o con
 * `prefers-reduced-motion` el elemento no se ve, sin afectar contenido ni
 * layout (el padre solo necesita `relative`).
 */
export function EntranceVein({ color }: { color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:hidden ${
        revealed ? "motion-safe:scale-x-100" : "motion-safe:scale-x-0"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}
