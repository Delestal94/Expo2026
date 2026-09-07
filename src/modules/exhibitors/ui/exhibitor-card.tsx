import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Reveal } from "@/lib/ui/reveal";
import { textSafeColor, type Exhibitor } from "./exhibitors-data";

/**
 * Cada tarjeta entra desde un punto distinto según su posición en la fila
 * (las de los bordes con una pizca de rotación, la del medio recta), pero
 * SIEMPRE con la misma curva y duración que el resto del sitio.
 */
const ENTRANCE_BY_SLOT = [
  { x: -25, y: 40, rotate: -1.5, scale: 0.93 },
  { x: 0, y: 45, rotate: 0, scale: 0.93 },
  { x: 25, y: 40, rotate: 1.5, scale: 0.93 },
  { x: 0, y: 40, rotate: 0, scale: 0.94 },
] as const;

export function ExhibitorCard({
  exhibitor,
  index = 0,
  inView = true,
}: {
  exhibitor: Exhibitor;
  index?: number;
  inView?: boolean;
}) {
  const slot = index % 4;
  const t = useTranslations("Exhibitors");
  const entrance = ENTRANCE_BY_SLOT[slot]!;

  return (
    <Reveal
      revealed={inView}
      delay={140 + slot * 80}
      x={entrance.x}
      y={entrance.y}
      rotate={entrance.rotate}
      scale={entrance.scale}
      className="h-full max-sm:[--reveal-x:0px]"
    >
    <article
      // 300ms ease-out, no 800ms con la curva de entrada: esto responde a
      // un gesto del visitante, no es una llegada en escena. Antes compartía
      // la declaración de `transition` con la entrada, y arrastraba también
      // su `transition-delay` inline (hasta 380ms): el hover tardaba casi
      // 1.2s en completarse y se sentía roto.
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-br from-surface via-surface/95 to-surface/85 backdrop-blur-sm p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--card-color)] hover:shadow-[0_16px_36px_-20px_var(--card-color)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{ "--card-color": exhibitor.color } as CSSProperties}
    >
      {/* Vena mineral superior dinámica con color del eje */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-top bg-gradient-to-r from-transparent via-[var(--card-color)] to-transparent opacity-60 transition-[transform,opacity] duration-300 motion-reduce:transition-none group-hover:scale-y-150 group-hover:opacity-100"
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
      </div>
    </article>
    </Reveal>
  );
}
