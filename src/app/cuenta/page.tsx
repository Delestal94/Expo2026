import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFeatureFlags } from "@/lib/config/flags";
import { AccessForm } from "@/modules/visitor-access";

export const metadata: Metadata = {
  title: "Crear cuenta — ExpoJuy 2026",
};

export default async function CuentaPage() {
  const flags = await getFeatureFlags();
  if (!flags.visitorAccess) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-24 sm:px-10">
      <Link href="/" className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        ← Volver
      </Link>
      <h1 className="mt-6 text-balance font-display text-3xl font-medium text-paper">
        Tu cuenta de visitante
      </h1>
      <p className="mt-3 text-paper-dim">
        Creá tu cuenta ahora. La compra de la entrada todavía no está
        disponible — se habilita en la próxima etapa.
      </p>
      <div className="mt-10">
        <AccessForm />
      </div>
    </main>
  );
}
