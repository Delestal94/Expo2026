import { useTranslations } from "next-intl";

const STATS = [
  { value: "17ª", key: "edition" },
  { value: "4", key: "days" },
  { value: "+200", key: "stands" },
  { value: "9–12", key: "dates" },
] as const;

export function About() {
  const t = useTranslations("Landing.About");

  return (
    <section className="border-b border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <p className="text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
          {t.rich("description", {
            accent: (chunks) => <span className="text-accent">{chunks}</span>,
          })}
        </p>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 self-start">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-paper-dim">{stat.label}</dt>
              <dd className="font-mono text-4xl font-semibold text-paper tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
