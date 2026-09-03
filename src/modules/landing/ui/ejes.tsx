import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";

interface Eje {
  n: string;
  key: "mineria" | "comercio" | "corredor" | "conocimiento";
  color: string;
}

const EJES: Eje[] = [
  { n: "01", key: "mineria", color: "var(--color-cyan)" },
  { n: "02", key: "comercio", color: "var(--color-violet)" },
  { n: "03", key: "corredor", color: "var(--color-magenta)" },
  { n: "04", key: "conocimiento", color: "var(--color-lavender)" },
];

/** Cada tarjeta se asienta a su propia altura, como un corte real de estratos inclinados — no una grilla de catálogo. */
const OFFSET = ["", "sm:mt-6 lg:mt-8", "sm:mt-2 lg:mt-3", "sm:mt-10 lg:mt-12"];

export function Ejes() {
  const t = useTranslations("Landing.Ejes");

  return (
    <section id="ejes" className="relative px-6 py-16 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-violet)" />
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("eyebrow")}
      </span>

      {/* items-start: sin esto el grid estira las tarjetas para alinear sus
          bases, y el desfase de arriba se convierte en hueco vacío abajo en vez
          del escalonado que se busca. */}
      <div className="mt-10 grid items-start gap-6 sm:grid-cols-2">
        {EJES.map((eje, i) => (
          <article
            key={eje.n}
            className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-line bg-ink px-8 py-10 transition-colors hover:bg-[#121022] ${OFFSET[i]}`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: eje.color }}
            />
            <span
              aria-hidden="true"
              // Entra completo dentro de la tarjeta: antes salía por arriba y a
              // la derecha, y el overflow-hidden lo cortaba al medio del trazo.
              className="pointer-events-none absolute top-2 right-5 font-display text-[5.5rem] leading-none font-bold tracking-tighter opacity-[0.07] transition-all duration-500 select-none group-hover:translate-y-1 group-hover:opacity-30 sm:text-[7rem]"
              style={{ color: eje.color }}
            >
              {eje.n}
            </span>
            <span className="relative font-mono text-sm text-paper-dim">
              {eje.n}
            </span>
            <h3 className="relative font-display text-2xl font-medium text-paper">
              {t(`items.${eje.key}.title`)}
            </h3>
            <p className="relative text-balance text-paper-dim">
              {t(`items.${eje.key}.description`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
