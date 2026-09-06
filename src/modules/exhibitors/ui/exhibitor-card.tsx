import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import type { Exhibitor } from "./exhibitors-data";

/**
 * Al filtrar por eje, el directorio entero se reemplazaba de golpe — sin
 * feedback de que el click surtió efecto más allá del cambio de color en
 * el filtro. Cada tarjeta ahora se asienta como un estrato al montar (el
 * mismo lenguaje que ya usa el Hero), escalonada por columna para que se
 * lea como una fila que decanta, no un parpadeo simultáneo.
 */
export function ExhibitorCard({
  exhibitor,
  index = 0,
}: {
  exhibitor: Exhibitor;
  index?: number;
}) {
  const delay = (index % 3) * 0.08;
  const t = useTranslations("Exhibitors");

  return (
    <article
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-[#121022] p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--card-color)] hover:shadow-[0_16px_32px_-20px_var(--card-color)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-safe:animate-[strata-settle_0.45s_cubic-bezier(0.16,1,0.3,1)_backwards]"
      style={
        {
          "--card-color": exhibitor.color,
          animationDelay: `${delay}s`,
        } as CSSProperties
      }
    >
      <span
        className="w-fit rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.1em] uppercase transition-[background-color] duration-300 group-hover:bg-[color-mix(in_srgb,var(--card-color)_32%,transparent)]"
        style={{
          backgroundColor: `color-mix(in srgb, ${exhibitor.color} 20%, transparent)`,
          color: exhibitor.color,
        }}
      >
        {t(`ejes.${exhibitor.eje}`)}
      </span>
      <h3 className="font-display text-lg font-medium text-paper">{exhibitor.name}</h3>
      <p className="text-sm text-paper-dim">{t(`items.${exhibitor.id}.pitch`)}</p>
      <div className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-xs text-paper-dim">
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
