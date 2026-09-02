import type { Exhibitor } from "./exhibitors-data";

export function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-[#121022] p-6">
      <span
        className="w-fit rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.1em] uppercase"
        style={{
          backgroundColor: `color-mix(in srgb, ${exhibitor.color} 20%, transparent)`,
          // Los tokens de marca (terracotta, violeta) no llegan a 4.5:1 sobre
          // el fondo oscuro si se usan tal cual como color de texto — se
          // aclaran para cumplir WCAG AA sin tocar el token compartido.
          color: `color-mix(in srgb, ${exhibitor.color} 80%, white)`,
        }}
      >
        {exhibitor.ejeLabel}
      </span>
      <h3 className="font-display text-lg font-medium text-paper">{exhibitor.name}</h3>
      <p className="text-sm text-paper-dim">{exhibitor.pitch}</p>
      <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-xs text-paper-dim">
        <span className="font-mono uppercase tracking-[0.08em]">Busca</span>
        <span>{exhibitor.busca}</span>
      </div>
    </article>
  );
}
