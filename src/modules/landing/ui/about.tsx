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
    <section id="sobre" className="relative px-6 pt-16 pb-8 sm:px-10 sm:pt-20 sm:pb-10 lg:px-16 lg:pt-20 lg:pb-6">
      <EntranceVein color="var(--color-cyan)" />
      <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10 lg:items-center">
        <div className="lg:col-span-7">
          <p className="text-balance font-display text-2xl leading-tight font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionIntro")}
          </p>
          <p className="my-1 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.88] font-black tracking-tight text-accent sm:my-2">
            {t("descriptionEmphasis")}
          </p>
          <p className="max-w-xl text-balance font-display text-2xl leading-tight font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("descriptionOutro")}
          </p>
        </div>
        <dl className="flex flex-col overflow-hidden rounded-2xl lg:col-span-5 lg:col-start-8 lg:self-center">
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className={`flex flex-col-reverse ${BAND_WIDTH[i]}`}
            >
              <dt className="px-5 pt-1.5 pb-3 text-right font-mono text-[0.62rem] tracking-[0.16em] text-paper-dim uppercase lg:px-5 lg:pt-1 lg:pb-2 lg:text-[0.6rem]">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd
                className="flex items-center justify-end px-5 py-3 font-mono text-2xl font-black text-ink tabular-nums sm:py-4 sm:text-3xl lg:py-2.5 lg:px-5 lg:text-2xl"
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
