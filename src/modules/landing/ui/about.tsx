interface Stat {
  value: string;
  label: string;
  color: string;
}

const STATS: Stat[] = [
  { value: "17ª", label: "Edición de ExpoJuy", color: "var(--color-ocher)" },
  {
    value: "4",
    label: "Días, el doble de intensidad",
    color: "var(--color-terracotta)",
  },
  { value: "+200", label: "Stands esperados", color: "var(--color-violet)" },
  {
    value: "9–12",
    label: "Octubre, Ciudad Cultural",
    color: "var(--color-teal)",
  },
];

/** Cada banda corta distinto, como un afloramiento real — no una grilla prolija. */
const BAND_WIDTH = [
  "w-full",
  "w-full sm:w-[91%]",
  "w-full sm:w-[98%]",
  "w-full sm:w-[83%]",
];

export function About() {
  return (
    <section className="border-b border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <p className="text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
            Después de dos semanas de formato clásico, ExpoJuy se reinventa:
          </p>
          <p className="my-1 font-display text-[clamp(3.25rem,10vw,7rem)] leading-[0.85] font-black tracking-tight text-accent sm:my-2">
            cuatro días
          </p>
          <p className="max-w-xl text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
            de rondas de negocios por la mañana y exposición por la tarde,
            con la minería del litio y el comercio internacional como ejes
            centrales.
          </p>
        </div>
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
