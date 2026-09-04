import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";

const STATS = [
  { key: "edition", value: "17ª", color: "var(--color-cyan)" },
  { key: "days", value: "4", color: "var(--color-violet)" },
  { key: "stands", value: "+200", color: "var(--color-magenta)" },
  { key: "dates", value: "9 al 12 OCT", color: "var(--color-lavender)" },
] as const;

/** Cada banda corta distinto, como un afloramiento real — no una grilla prolija. */
const BAND_WIDTH = [
  "w-full",
  "w-full sm:w-[91%]",
  "w-full sm:w-[98%]",
  "w-full sm:w-[83%]",
];

export function About() {
  const t = useTranslations("Landing.About");

  return (
    <section id="sobre" className="relative scroll-mt-20 lg:scroll-mt-24 border-b border-line px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
      <EntranceVein color="var(--color-cyan)" />
      <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-12 lg:items-center">
        <div className="lg:col-span-7">
          <p className="text-balance font-display text-2xl leading-relaxed font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionIntro")}
          </p>
          <p className="my-3 font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.85] font-black tracking-tight text-accent drop-shadow-[0_0_30px_rgba(0,240,255,0.28)] transition-all duration-300 sm:my-4">
            {t("descriptionEmphasis")}
          </p>
          <p className="max-w-xl text-balance font-display text-2xl leading-relaxed font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionOutro")}
          </p>
        </div>
        <div className="relative lg:col-span-5 lg:col-start-8 lg:self-center">
          {/* Resplandor ambiental de fondo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent blur-2xl opacity-60"
          />
          <dl className="relative flex flex-col gap-2.5">
            {STATS.map((stat, i) => (
              <div
                key={stat.key}
                className={`group relative flex flex-col-reverse transition-all duration-300 motion-safe:hover:translate-x-1.5 ${BAND_WIDTH[i]}`}
              >
                <dt className="flex items-center justify-between px-6 pt-2 pb-4 font-mono text-[0.68rem] tracking-[0.18em] text-paper-dim uppercase">
                  <span>{t(`stats.${stat.key}`)}</span>
                  <span
                    className="h-1.5 w-1.5 rounded-full opacity-60 transition-opacity group-hover:opacity-100 motion-safe:animate-pulse"
                    style={{ backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}` }}
                  />
                </dt>
                <dd
                  className="relative flex items-center justify-end overflow-hidden rounded-xl px-7 py-5 font-mono text-3xl font-black text-ink tabular-nums shadow-md transition-all duration-300 group-hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] sm:py-6 sm:text-4xl lg:text-5xl"
                  style={{ backgroundColor: stat.color }}
                >
                  {/* Destello metálico suave de izquierda a derecha en hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[250%]"
                  />
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                    {stat.value}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
