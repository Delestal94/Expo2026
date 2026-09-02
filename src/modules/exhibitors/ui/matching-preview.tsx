"use client";

import { useEffect, useState } from "react";

const MATCH = {
  a: { name: "Andes Trade Corredor", detail: "Ofrece: bróker de cargas internacional" },
  b: { name: "Corredor Capricornio Logística", detail: "Ofrece: transporte por el paso de Jama" },
  score: 92,
  shared: ["Corredor Bioceánico", "Logística internacional", "Paso de Jama"],
};

export function MatchingPreview() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="rounded-2xl border border-line bg-[#121022] p-8">
      <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        Cómo sugiere reuniones el sistema
      </span>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl border border-line bg-ink p-5">
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-[color-mix(in_srgb,var(--color-violet)_80%,white)] uppercase">
            Expositor
          </span>
          <h4 className="mt-2 font-display text-lg text-paper">{MATCH.a.name}</h4>
          <p className="mt-1 text-sm text-paper-dim">{MATCH.a.detail}</p>
        </div>

        <div className="flex flex-col items-center gap-2 py-4 md:py-0">
          <svg width="64" height="24" viewBox="0 0 64 24" aria-hidden="true">
            <line x1="0" y1="12" x2="64" y2="12" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="4 5">
              {!prefersReducedMotion && (
                <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.8s" repeatCount="indefinite" />
              )}
            </line>
          </svg>
          <span className="rounded-full border border-accent px-3 py-1 font-mono text-sm font-semibold text-accent">
            {MATCH.score}%
          </span>
        </div>

        <div className="rounded-xl border border-line bg-ink p-5">
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-[color-mix(in_srgb,var(--color-violet)_80%,white)] uppercase">
            Expositor
          </span>
          <h4 className="mt-2 font-display text-lg text-paper">{MATCH.b.name}</h4>
          <p className="mt-1 text-sm text-paper-dim">{MATCH.b.detail}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {MATCH.shared.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet/15 px-3 py-1 font-mono text-[0.68rem] text-[color-mix(in_srgb,var(--color-violet)_80%,white)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm text-paper-dim">
        En la primera versión, la sugerencia se calcula por rubro y país en
        común — no similitud semántica completa (ver decisión en{" "}
        <span className="font-mono">docs/architecture.md</span>). La agenda de
        reuniones se habilita en la próxima etapa.
      </p>
    </div>
  );
}
