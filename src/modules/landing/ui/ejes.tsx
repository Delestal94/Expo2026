import { useTranslations } from "next-intl";

interface Eje {
  n: string;
  key: "mineria" | "comercio" | "corredor" | "conocimiento";
  color: string;
}

const EJES: Eje[] = [
  { n: "01", key: "mineria", color: "var(--color-ocher)" },
  { n: "02", key: "comercio", color: "var(--color-terracotta)" },
  { n: "03", key: "corredor", color: "var(--color-violet)" },
  { n: "04", key: "conocimiento", color: "var(--color-teal)" },
];

export function Ejes() {
  const t = useTranslations("Landing.Ejes");

  return (
    <section id="ejes" className="scroll-mt-24 px-6 py-24 sm:px-10 lg:px-16">
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("eyebrow")}
      </span>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {EJES.map((eje) => (
          <article
            key={eje.n}
            className="group relative flex flex-col gap-4 overflow-hidden bg-ink px-8 py-10 transition-colors hover:bg-[#121022]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: eje.color }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 -right-3 font-display text-[7rem] leading-none font-bold tracking-tighter opacity-[0.07] transition-all duration-500 select-none group-hover:translate-y-1 group-hover:opacity-30 sm:text-[9rem]"
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
