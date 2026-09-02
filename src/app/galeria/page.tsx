import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/modules/gallery";

export const metadata: Metadata = {
  title: "Galería 2024 — ExpoJuy 2026",
  description:
    "Fotos de la 16ª edición de ExpoJuy (2024) en la Ciudad Cultural de San Salvador de Jujuy.",
};

export default function GaleriaPage() {
  return (
    <main className="px-6 py-16 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase transition hover:text-paper"
      >
        ← Volver
      </Link>

      <h1 className="mt-6 text-balance font-display text-4xl font-medium text-paper sm:text-5xl">
        Galería — 16ª edición (2024)
      </h1>
      <p className="mt-3 max-w-xl text-paper-dim">
        30 fotos de ExpoJuy 2024 en la Ciudad Cultural de San Salvador de
        Jujuy.
      </p>

      <div className="mt-12">
        <GalleryGrid />
      </div>
    </main>
  );
}
