import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { textSafeColor, type Exhibitor } from "./exhibitors-data";

export function ExhibitorCard({
  exhibitor,
  index = 0,
  inView = true,
  style,
}: {
  exhibitor: Exhibitor;
  index?: number;
  inView?: boolean;
  style?: CSSProperties;
}) {
  const slot = index % 4;
  const t = useTranslations("Exhibitors");

  const initialTransform =
    slot === 0
      ? "translate3d(-25px, 40px, 0) rotate(-1.5deg) scale(0.93)"
      : slot === 1
      ? "translate3d(0, 45px, 0) scale(0.93)"
      : slot === 2
      ? "translate3d(25px, 40px, 0) rotate(1.5deg) scale(0.93)"
      : "translate3d(0, 40px, 0) scale(0.94)";

  const delay = inView ? `${140 + slot * 80}ms` : "0ms";

  return (
    <article
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-[#120f26]/95 via-ink to-[#0c0a1a] p-6 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[var(--card-color)] hover:shadow-[0_16px_36px_-20px_var(--card-color)] will-change-transform motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:hover:translate-y-0"
      style={
        {
          "--card-color": exhibitor.color,
          transform: inView ? "translate3d(0, 0, 0) rotate(0deg) scale(1)" : initialTransform,
          opacity: inView ? 1 : 0,
          transitionDelay: delay,
          ...style,
        } as CSSProperties
      }
    >
      {/* Vena mineral superior dinámica con color del eje */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--card-color)] to-transparent opacity-60 transition-all duration-300 group-hover:h-[3px] group-hover:opacity-100"
      />

      {/* Resplandor ambiental de esquina */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--card-color)] opacity-5 blur-xl transition-opacity duration-500 group-hover:opacity-25"
      />

      <span
        className="w-fit rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.1em] uppercase transition-[background-color] duration-300 group-hover:bg-[color-mix(in_srgb,var(--card-color)_32%,transparent)]"
        style={{
          backgroundColor: `color-mix(in srgb, ${exhibitor.color} 20%, transparent)`,
          color: textSafeColor(exhibitor.color),
        }}
      >
        {t(`ejes.${exhibitor.eje}`)}
      </span>
      <h3 className="font-display text-lg font-medium text-paper">{exhibitor.name}</h3>
      <p className="text-sm text-paper-dim">{t(`items.${exhibitor.id}.pitch`)}</p>
      <div className="mt-auto flex items-center gap-2 border-t border-line/70 pt-4 text-xs text-paper-dim">
        <span className="font-mono uppercase tracking-[0.08em]">{t("buscaLabel")}</span>
        <span>{t(`items.${exhibitor.id}.busca`)}</span>
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
