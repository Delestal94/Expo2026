"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { GALLERY_PHOTOS, GALLERY_PREVIEW_COUNT, type GalleryPhoto } from "./gallery-data";

interface MosaicCell {
  span: string;
  sizes: string;
}

/**
 * Cinco variantes de mosaico 3x3 (celda ancla 2x2 en cada esquina, o una
 * columna alta + domino) que rotan cada LAYOUT_ROTATE_MS — el collage cambia
 * de forma, no solo de fotos. Mobile sigue siendo la tira con scroll: estas
 * clases solo aplican desde `sm:`.
 */
const MOSAIC_LAYOUTS: readonly MosaicCell[][] = [
  [
    { span: "sm:col-start-1 sm:col-span-2 sm:row-start-1 sm:row-span-2", sizes: "(min-width: 1024px) 44vw, 50vw" },
    { span: "sm:col-start-3 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-1 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  ],
  [
    { span: "sm:col-start-2 sm:col-span-2 sm:row-start-1 sm:row-span-2", sizes: "(min-width: 1024px) 44vw, 50vw" },
    { span: "sm:col-start-1 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-1 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-1 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  ],
  [
    { span: "sm:col-start-1 sm:col-span-2 sm:row-start-2 sm:row-span-2", sizes: "(min-width: 1024px) 44vw, 50vw" },
    { span: "sm:col-start-1 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  ],
  [
    { span: "sm:col-start-2 sm:col-span-2 sm:row-start-2 sm:row-span-2", sizes: "(min-width: 1024px) 44vw, 50vw" },
    { span: "sm:col-start-1 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-1 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-1 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  ],
  [
    { span: "sm:col-start-1 sm:row-start-1 sm:row-span-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-1 sm:row-span-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-2 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
    { span: "sm:col-start-3 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  ],
];

// Ángulo estático por celda — aspecto editorial/collage. Se repite si hay
// más celdas que ángulos definidos.
const CELL_TILTS = [
  "sm:rotate-[0.35deg]",
  "sm:-rotate-[0.4deg]",
  "sm:rotate-[0.2deg]",
  "sm:-rotate-[0.3deg]",
  "sm:rotate-[0.45deg]",
  "sm:-rotate-[0.2deg]",
];

// Intervalos escalonados y sin múltiplos comunes entre sí: las 6 celdas
// nunca rotan en sincronía, dan la sensación de vida constante.
const SLOT_INTERVALS_MS = [3800, 4300, 4900, 5300, 5700, 6100];
const LAYOUT_ROTATE_MS = 22000;

function pickReplacement(current: GalleryPhoto[]): GalleryPhoto {
  const visibleSrcs = new Set(current.map((photo) => photo.src));
  const pool = GALLERY_PHOTOS.filter((photo) => !visibleSrcs.has(photo.src));
  const candidates = pool.length > 0 ? pool : GALLERY_PHOTOS;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function GalleryPreview() {
  const t = useTranslations("Gallery");
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => GALLERY_PHOTOS.slice(0, GALLERY_PREVIEW_COUNT));
  const [layoutIndex, setLayoutIndex] = useState(0);

  // Cada celda rota su foto en su propio intervalo, tomada del pool de 30
  // sin repetir las que ya están visibles.
  useEffect(() => {
    const timers = photos.map((_, slot) =>
      setInterval(() => {
        setPhotos((current) => {
          const next = [...current];
          next[slot] = pickReplacement(current);
          return next;
        });
      }, SLOT_INTERVALS_MS[slot % SLOT_INTERVALS_MS.length]),
    );
    return () => timers.forEach(clearInterval);
    // Los intervalos se arman una sola vez: cada uno lee `current` fresco
    // vía el updater de setState, no necesitan reiniciarse al cambiar `photos`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setLayoutIndex((i) => (i + 1) % MOSAIC_LAYOUTS.length);
    }, LAYOUT_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const layout = MOSAIC_LAYOUTS[layoutIndex];

  return (
    <section id="galeria" className="relative px-6 py-16 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-magenta)" />
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("previewEyebrow")}
      </span>
      <h2 className="mt-3 text-balance font-display text-2xl font-medium text-paper sm:text-3xl">
        {t("previewTitle")}
      </h2>

      {/* Mobile: tira con scroll horizontal y snap — un gesto de "hojear" que no
          tiene sentido replicar en desktop, donde vuelve a ser un mosaico que
          además rota de forma y de fotos. */}
      <div className="relative -mx-6 mt-8 sm:mx-0">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:auto-rows-[8.5rem] sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-[10.5rem] [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, i) => {
            const cell = layout[i];
            const tilt = CELL_TILTS[i % CELL_TILTS.length];
            const hoverMotion =
              i % 2 === 0
                ? "sm:hover:-translate-y-1 sm:hover:rotate-[0.25deg]"
                : "sm:hover:translate-y-1 sm:hover:-rotate-[0.25deg]";
            return (
              <div
                key={`slot-${i}`}
                className={`group relative aspect-[4/3] w-[68vw] shrink-0 snap-start overflow-hidden rounded-xl border border-line shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-[transform,border-color,box-shadow] duration-500 motion-reduce:transition-none sm:aspect-auto sm:h-full sm:w-auto sm:shrink sm:hover:border-[var(--color-lavender)] sm:hover:shadow-[0_16px_36px_rgba(45,227,214,0.16)] ${tilt} ${hoverMotion} ${cell?.span ?? ""}`}
              >
                <div
                  key={photo.src}
                  className="absolute inset-0 motion-safe:animate-[gallery-fade-in_0.6s_ease-out_backwards] motion-reduce:animate-none"
                >
                  <Image
                    src={photo.src}
                    alt={t("photoAlt", { n: photo.n })}
                    fill
                    sizes={cell ? `${cell.sizes}, 68vw` : "(min-width: 640px) 33vw, 68vw"}
                    className="object-cover motion-safe:animate-[gallery-drift_12s_ease-in-out_infinite_alternate] motion-reduce:animate-none group-hover:!scale-110"
                    style={{ animationDelay: `${i * -1.8}s` }}
                    priority={i === 0}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-[rgba(45,227,214,0.42)] to-transparent motion-safe:animate-[gallery-sheen_9s_ease-in-out_infinite] motion-reduce:animate-none"
                    style={{ animationDelay: `${i * -1.2}s` }}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--color-cyan)] transition-transform duration-500 group-hover:scale-x-100"
                />
              </div>
            );
          })}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden"
        />
      </div>

      <Link
        href="/galeria"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper transition hover:border-paper-dim"
      >
        {t("viewFullCta")}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
