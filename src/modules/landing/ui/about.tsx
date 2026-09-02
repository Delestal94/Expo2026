import { useTranslations } from "next-intl";

interface Stat {
  key: string;
  value: string;
  color: string;
}

const STATS: Stat[] = [
  { key: "edition", value: "17ª", color: "var(--color-ocher)" },
  { key: "days", value: "4", color: "var(--color-terracotta)" },
  { key: "stands", value: "+200", color: "var(--color-violet)" },
  { key: "dates", value: "9–12", color: "var(--color-teal)" },
];

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
    <section className="border-b border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <p className="text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
            {t("descriptionIntro")}
          </p>
          <p className="my-1 font-display text-[clamp(3.25rem,10vw,7rem)] leading-[0.85] font-black tracking-tight text-accent sm:my-2">
            {t("descriptionEmphasis")}
          </p>
          <p className="max-w-xl text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
            {t("descriptionOutro")}
          </p>
        </div>
        <dl className="flex flex-col overflow-hidden rounded-2xl lg:col-span-5 lg:col-start-8 lg:-mt-8 lg:self-start">
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className={`flex flex-col-reverse ${BAND_WIDTH[i]}`}
            >
              <dt className="px-6 pt-2 pb-5 text-right font-mono text-[0.65rem] tracking-[0.16em] text-paper-dim uppercase">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd
                className="flex items-center justify-end px-6 py-5 font-mono text-3xl font-black text-ink tabular-nums sm:py-6 sm:text-4xl"
                style={{ backgroundColor: stat.color }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
