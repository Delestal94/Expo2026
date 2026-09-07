"use client";

import type { CSSProperties, ReactNode } from "react";

/** Curva de entrada única del sitio: decidida al salir, frena larga. */
export const ENTRANCE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Duración de entrada única del sitio. */
export const ENTRANCE_MS = 700;

interface RevealProps {
  revealed: boolean;
  children: ReactNode;
  /** Escalonado respecto del primer elemento del grupo, en ms. */
  delay?: number;
  /** Desplazamiento inicial. Positivo = entra desde abajo / desde la derecha. */
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Envoltorio de entrada. Existe por dos razones concretas, las dos salidas
 * de bugs reales de esta base:
 *
 * **1. La entrada y el hover no pueden compartir la misma declaración de
 * `transition`.** Las tarjetas ponían el desplazamiento de entrada y el
 * `hover:-translate-y-1` sobre el mismo elemento, con un `transitionDelay`
 * inline que quedaba puesto para siempre. Resultado: después de entrar, cada
 * hover esperaba entre 140 y 400ms antes de arrancar, y después tardaba
 * 800ms en levantar la tarjeta. El gesto se sentía muerto. Separando la
 * entrada (este wrapper, lento y escalonado) del hover (la tarjeta, rápido y
 * sin delay) cada uno queda con el timing que le corresponde.
 *
 * **2. `will-change` no puede quedar puesto para siempre.** Cada elemento
 * con `will-change` es una capa de composición reservada en GPU; el sitio
 * tenía 38 declaraciones permanentes. Acá se levanta solo mientras la
 * entrada está pendiente y se suelta al terminar.
 *
 * La clase `.motion-entrance` es la salida por `prefers-reduced-motion`
 * (ver globals.css): gana contra estos estilos inline, que es justo lo que
 * `motion-reduce:opacity-100` no podía hacer.
 */
export function Reveal({
  revealed,
  children,
  delay = 0,
  y = 40,
  x = 0,
  scale = 0.96,
  rotate = 0,
  className = "",
  style,
}: RevealProps) {
  // `--reveal-x` permite anular el desplazamiento lateral por breakpoint
  // desde el markup (ej. `max-sm:[--reveal-x:0px]`): en una sola columna no
  // hay "afuera" desde donde entrar y el gesto lateral se lee arbitrario.
  const transform =
    `translate3d(var(--reveal-x, ${x}px), var(--reveal-y, ${y}px), 0)` +
    (rotate ? ` rotate(${rotate}deg)` : "") +
    (scale !== 1 ? ` scale(${scale})` : "");

  return (
    <div
      className={`motion-entrance ${className}`}
      style={{
        transform: revealed ? "none" : transform,
        opacity: revealed ? 1 : 0,
        transition: `transform ${ENTRANCE_MS}ms ${ENTRANCE_EASE} ${delay}ms, opacity ${ENTRANCE_MS}ms ${ENTRANCE_EASE} ${delay}ms`,
        willChange: revealed ? undefined : "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
