const STATS = [
  { value: "17ª", label: "Edición de ExpoJuy" },
  { value: "4", label: "Días, el doble de intensidad" },
  { value: "+200", label: "Stands esperados" },
  { value: "9–12", label: "Octubre, Ciudad Cultural" },
];

export function About() {
  return (
    <section className="border-b border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
        <p className="text-balance font-display text-3xl leading-tight font-medium text-paper sm:text-4xl lg:text-5xl">
          Después de dos semanas de formato clásico, ExpoJuy se reinventa:{" "}
          <span className="text-accent">cuatro días</span> de rondas de
          negocios por la mañana y exposición por la tarde, con la minería del
          litio y el comercio internacional como ejes centrales.
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
