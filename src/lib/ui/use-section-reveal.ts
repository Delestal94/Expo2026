"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface ParallaxConfig {
  /** Nombre de la custom property que recibe el desplazamiento, en px. */
  property: string;
  /** Factor sobre `rect.top`. Negativo = el fondo sube más lento que la página. */
  factor: number;
}

interface SectionRevealOptions {
  /** Parallax de fondo. Sin esto no se registra ningún listener de scroll. */
  parallax?: ParallaxConfig;
  /** Fracción visible que dispara la entrada. */
  threshold?: number;
  rootMargin?: string;
}

/**
 * Entrada de sección compartida por Agenda, Expositores, Acceso y Noticias.
 *
 * Tres cosas que antes cada sección resolvía por su cuenta —y mal— y que
 * acá están resueltas una sola vez:
 *
 * 1. **El disparo va por visibilidad, no por posición de scroll.** Las
 *    versiones anteriores comparaban `rect.top` contra fracciones del
 *    viewport en cada frame de scroll. Si el visitante frenaba justo en el
 *    medio del rango, la entrada quedaba a mitad para siempre (el mismo bug
 *    que ya se había arreglado en el mapa y en la galería). Un
 *    `IntersectionObserver` dispara una vez y la transición CSS termina sola.
 *
 * 2. **`prefers-reduced-motion` devuelve el estado FINAL, no el inicial.**
 *    Antes el efecto salía temprano y dejaba `revealed` en false, o sea
 *    `opacity: 0` inline — y `motion-reduce:opacity-100` es una clase, que
 *    pierde contra un estilo inline. Resultado: con movimiento reducido, la
 *    Agenda, el Portal de expositores y toda la sección de Acceso quedaban
 *    invisibles. Acá se resuelve en el primer efecto y además está la red de
 *    `.motion-entrance` en globals.css para el caso sin JS.
 *
 * 3. **El listener de parallax solo existe mientras la sección se ve.**
 *    Antes quedaba registrado durante toda la vida de la página, leyendo
 *    layout en cada scroll aunque la sección estuviera a tres pantallas.
 */
export function useSectionReveal<T extends HTMLElement>(
  options: SectionRevealOptions = {},
): { ref: RefObject<T | null>; revealed: boolean } {
  const { parallax, threshold = 0.15, rootMargin = "0px 0px -12% 0px" } = options;
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  const parallaxProperty = parallax?.property;
  const parallaxFactor = parallax?.factor;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    if (prefersReducedMotion) {
      // El estado con movimiento reducido es el final, nunca el inicial.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    let ticking = false;
    let listening = false;

    function applyParallax() {
      const node = ref.current;
      if (!node || !parallaxProperty || parallaxFactor === undefined) return;
      const top = node.getBoundingClientRect().top;
      node.style.setProperty(
        parallaxProperty,
        `${(top * parallaxFactor).toFixed(1)}px`,
      );
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
    }

    function setListening(next: boolean) {
      if (next === listening || !parallaxProperty) return;
      listening = next;
      if (next) {
        window.addEventListener("scroll", onScroll, { passive: true });
        applyParallax();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    }

    let hasRevealed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;

        setListening(entry.isIntersecting);

        // Epsilon: el ratio que reporta el observer al cruzar un umbral
        // puede quedar una milésima por debajo del valor pedido.
        if (!hasRevealed && entry.isIntersecting && entry.intersectionRatio >= threshold - 0.001) {
          hasRevealed = true;
          setRevealed(true);
        }
      },
      { threshold: [0, threshold], rootMargin },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      setListening(false);
    };
  }, [threshold, rootMargin, parallaxProperty, parallaxFactor]);

  return { ref, revealed };
}
