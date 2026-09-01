export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
      <div className="font-display text-lg font-semibold text-paper">
        ExpoJuy 2026
      </div>
      <p className="max-w-md text-sm text-paper-dim">
        Cámara de Comercio Exterior de Jujuy · Ministerio de Desarrollo
        Económico y Producción · Dirección Provincial de Servicios Basados en
        el Conocimiento · Clustear.
      </p>
      <span className="font-mono text-xs text-paper-dim">
        Prototipo — Desafío Digital 2026
      </span>
    </footer>
  );
}
