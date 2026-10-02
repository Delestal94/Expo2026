"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Aviso de prototipo + créditos de autoría. Se renderiza abierto desde el
 * servidor para que sea lo primero que se ve al entrar, antes de que hidrate
 * nada. Va solo en español a pedido de los autores, sin pasar por next-intl.
 *
 * Es un overlay y no una franja en el flujo de la página a propósito: el
 * hero hace scroll-jacking midiendo su propia posición, y empujarlo hacia
 * abajo con un bloque arriba le corre todas las cuentas.
 */
const AUTHORS = [
  {
    name: "Miguel Ignacio Delestal",
    href: "https://www.linkedin.com/in/ignacio-delestal/",
    color: "var(--color-cyan-text)",
  },
  {
    name: "Maximiliano David Lezano",
    href: "https://www.linkedin.com/in/maxlezano/",
    color: "var(--color-magenta-text)",
  },
] as const;

export function CreditsBanner() {
  const [open, setOpen] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="credits-banner-heading"
      aria-describedby="credits-banner-body"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-md sm:p-6"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface p-6 text-paper shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-10 motion-safe:animate-[bot-panel-in_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet),var(--color-magenta),var(--color-lavender))]"
        />

        <span className="font-mono text-xs tracking-[0.25em] text-cyan-text uppercase">
          Prototipo · ExpoJuy 2026
        </span>

        <h2
          id="credits-banner-heading"
          className="mt-4 font-display text-2xl leading-tight font-bold text-paper sm:text-4xl"
        >
          Esta página es un prototipo
        </h2>

        <p
          id="credits-banner-body"
          className="mt-4 text-base leading-relaxed text-paper/85 sm:text-lg"
        >
          Este sitio fue desarrollado como prototipo para participar en un
          evento de la <strong className="text-paper">EXPOJUY 2026</strong>.
          No es el sitio oficial de la exposición.
        </p>

        <div className="mt-8 border-t border-line pt-6">
          <p className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
            Créditos — creado por
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {AUTHORS.map((author) => (
              <li key={author.href}>
                <a
                  href={author.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Perfil de LinkedIn de ${author.name} (se abre en una pestaña nueva)`}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line bg-ink/40 px-4 py-3 transition-colors duration-200 hover:border-paper-dim focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none motion-reduce:transition-none"
                >
                  <span>
                    <span
                      className="block font-display text-base font-medium"
                      style={{ color: author.color }}
                    >
                      {author.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-paper-dim">
                      LinkedIn
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-paper-dim transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink transition-[filter,transform] duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Entrar al sitio
          </button>
        </div>
      </div>
    </div>
  );
}
