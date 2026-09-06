import { useTranslations } from "next-intl";

const STATS = [
  { key: "edition", value: "17ª", color: "var(--color-cyan)" },
  { key: "days", value: "4", color: "var(--color-violet)" },
  { key: "stands", value: "+200", color: "var(--color-magenta)" },
  { key: "dates", value: "9–12 OCT", color: "var(--color-lavender)" },
] as const;

/**
 * Bloque de apertura de la sección "Sobre el evento" — vive dentro de Ejes,
 * no como sección propia: el texto es corto y no justifica una parada de
 * scroll completa por sí solo. Las stats son chips compactos en fila, no las
 * franjas de ancho completo que tenía cuando esto era su propia sección.
 */
export function About() {
  const t = useTranslations("Landing.About");

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
      <div className="lg:col-span-7">
        <p className="text-balance font-display text-2xl leading-tight font-medium text-paper sm:text-3xl">
          {t("descriptionIntro")}
        </p>
        <p className="my-1 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] font-black tracking-tight text-accent">
          {t("descriptionEmphasis")}
        </p>
        <p className="max-w-xl text-balance font-body text-base text-paper-dim sm:text-lg">
          {t("descriptionOutro")}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:col-span-5 lg:grid-cols-2">
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col gap-1 rounded-xl px-4 py-3"
            style={{ backgroundColor: stat.color }}
          >
            <dd className="font-mono text-xl font-black text-ink tabular-nums sm:text-2xl">
              {stat.value}
            </dd>
            <dt className="font-mono text-[0.6rem] tracking-[0.14em] text-ink/70 uppercase">
              {t(`stats.${stat.key}`)}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
