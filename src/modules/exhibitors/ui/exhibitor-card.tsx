import type { CSSProperties } from "react";
import type { Exhibitor } from "./exhibitors-data";

export function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  return (
    <article
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-[#121022] p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--card-color)] hover:shadow-[0_16px_32px_-20px_var(--card-color)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ "--card-color": exhibitor.color } as CSSProperties}
    >
      <span
        className="w-fit rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.1em] uppercase transition-[background-color] duration-300 group-hover:bg-[color-mix(in_srgb,var(--card-color)_32%,transparent)]"
        style={{
          backgroundColor: `color-mix(in srgb, ${exhibitor.color} 20%, transparent)`,
          color: exhibitor.color,
        }}
      >
        {exhibitor.ejeLabel}
      </span>
      <h3 className="font-display text-lg font-medium text-paper">{exhibitor.name}</h3>
      <p className="text-sm text-paper-dim">{exhibitor.pitch}</p>
      <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-xs text-paper-dim">
        <span className="font-mono uppercase tracking-[0.08em]">Busca</span>
        <span>{exhibitor.busca}</span>
        <span
          aria-hidden="true"
          className="ml-auto -translate-x-1 text-[var(--card-color)] opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:translate-x-0 motion-reduce:opacity-100"
        >
          ⟶
        </span>
      </div>
    </article>
  );
}
