import type { CSSProperties } from "react";
import { Countdown } from "./countdown";
import { StrataCanvas } from "./strata-canvas";

const CORE_SAMPLE = [
  { color: "var(--color-ocher)", peak: "10px" },
  { color: "var(--color-terracotta)", peak: "17px" },
  { color: "var(--color-rose)", peak: "12px" },
  { color: "var(--color-violet)", peak: "19px" },
  { color: "var(--color-teal)", peak: "13px" },
];

/**
 * Decoración de una columna estratigráfica en miniatura: en reposo no ocupa
 * espacio, y al hover/focus florece cinta a cinta (con `transition-delay`
 * escalonado) como un testigo de sondaje saliendo a la vista — en vez de un
 * cambio plano de brillo/color.
 */
function CoreSampleTicks() {
  return (
    <span
      aria-hidden="true"
      className="flex items-end gap-0 transition-[gap,margin-right] duration-300 ease-out group-hover:mr-2 group-hover:gap-[3px] group-focus-visible:mr-2 group-focus-visible:gap-[3px] motion-reduce:transition-none"
    >
      {CORE_SAMPLE.map(({ color, peak }, i) => (
        <span
          key={color}
          style={{ backgroundColor: color, "--peak": peak, transitionDelay: `${i * 45}ms` } as CSSProperties}
          className="h-0 w-0 rounded-full transition-[width,height] duration-300 ease-out group-hover:h-[var(--peak)] group-hover:w-[3px] group-focus-visible:h-[var(--peak)] group-focus-visible:w-[3px] motion-reduce:transition-none"
        />
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b border-line px-6 pt-8 pb-10 sm:px-10 lg:px-16">
      <StrataCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink"
      />

      <nav className="relative z-10 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
        <span>ExpoJuy · Jujuy, Argentina</span>
        <span>17ª edición</span>
      </nav>

      <div className="relative z-10 flex flex-col gap-8">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          Desafío Digital ExpoJuy 2026 · Propuesta
        </span>
        <h1 className="text-balance font-display text-[clamp(3rem,11vw,8.5rem)] leading-[0.92] font-black text-paper">
          EXPOJUY
          <br />
          2026
        </h1>
        <p className="max-w-xl text-balance font-body text-lg text-paper-dim sm:text-xl">
          Donde la Quebrada se conecta con el mundo: cuatro días de rondas de
          negocios, comercio exterior y economía del conocimiento en el
          corazón del Corredor Bioceánico.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <Countdown />
        <div className="flex flex-wrap gap-3">
          <a
            href="#acceso"
            className="group inline-flex items-center rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink outline-offset-4 outline-paper transition-colors focus-visible:outline-2"
          >
            <CoreSampleTicks />
            Quiero asistir
          </a>
          <a
            href="https://forms.gle/ChErBuBgp3QfuxRr7"
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper outline-offset-4 outline-paper transition-colors hover:border-paper-dim focus-visible:outline-2"
          >
            <CoreSampleTicks />
            Sumar mi empresa como proveedora
          </a>
        </div>
      </div>
    </section>
  );
}
