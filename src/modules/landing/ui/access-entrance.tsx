"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/lib/ui/reveal";
import { useSectionReveal } from "@/lib/ui/use-section-reveal";

/**
 * Entrada en dos tiempos de la sección de Acceso: primero la columna de
 * información, 150ms después el mapa.
 *
 * No lleva parallax de fondo. La versión anterior calculaba y escribía
 * `--access-bg-parallax` en cada frame de scroll durante toda la vida de la
 * página, y ningún elemento del sitio leía esa variable: era trabajo puro
 * de layout a cambio de nada.
 */
export function AccessEntrance({
  leftContent,
  rightContent,
}: {
  leftContent: ReactNode;
  rightContent: ReactNode;
}) {
  const { ref: sectionRef, revealed: inView } = useSectionReveal<HTMLDivElement>();

  return (
    <div
      ref={sectionRef}
      className="relative grid gap-y-16 lg:grid-cols-12 lg:gap-x-12"
    >
      {/* Columna Izquierda: Información de llegada y acceso */}
      <Reveal revealed={inView} className="lg:col-span-7">
        {leftContent}
      </Reveal>

      {/* Columna Derecha: Mapa HUD y bloque de proveedores */}
      <Reveal
        revealed={inView}
        delay={150}
        y={48}
        scale={0.95}
        className="lg:col-span-5 lg:col-start-8"
      >
        {rightContent}
      </Reveal>
    </div>
  );
}
