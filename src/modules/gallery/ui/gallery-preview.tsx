import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { GALLERY_PHOTOS, GALLERY_PREVIEW_COUNT } from "./gallery-data";

/**
 * Desktop: mosaico editorial en vez de grilla de contactos 3x2 pareja — la
 * primera foto ancla como tapa de revista (2x2) y las otras cinco completan
 * el rectángulo alrededor. Mobile no toca esto: sigue siendo la tira con
 * scroll y snap, que ya es su propio tratamiento.
 */
const MOSAIC_CELLS = [
  { span: "sm:col-start-1 sm:col-span-2 sm:row-start-1 sm:row-span-2", sizes: "(min-width: 1024px) 44vw, 50vw" },
  { span: "sm:col-start-3 sm:row-start-1", sizes: "(min-width: 1024px) 22vw, 25vw" },
  { span: "sm:col-start-3 sm:row-start-2", sizes: "(min-width: 1024px) 22vw, 25vw" },
  { span: "sm:col-start-1 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  { span: "sm:col-start-2 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
  { span: "sm:col-start-3 sm:row-start-3", sizes: "(min-width: 1024px) 22vw, 25vw" },
] as const;

export function GalleryPreview() {
  const t = useTranslations("Gallery");
  const photos = GALLERY_PHOTOS.slice(0, GALLERY_PREVIEW_COUNT);

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
          tiene sentido replicar en desktop, donde vuelve a ser un mosaico estático. */}
      <div className="relative -mx-6 mt-8 sm:mx-0">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:auto-rows-[8.5rem] sm:overflow-visible sm:px-0 sm:pb-0 lg:auto-rows-[10.5rem] [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, i) => {
            const cell = MOSAIC_CELLS[i];
            return (
              <div
                key={photo.src}
                className={`relative aspect-[4/3] w-[68vw] shrink-0 snap-start overflow-hidden rounded-xl border border-line sm:aspect-auto sm:h-full sm:w-auto sm:shrink ${cell?.span ?? ""}`}
              >
                <Image
                  src={photo.src}
                  alt={t("photoAlt", { n: photo.n })}
                  fill
                  sizes={cell ? `${cell.sizes}, 68vw` : "(min-width: 640px) 33vw, 68vw"}
                  className="object-cover transition duration-500 hover:scale-105"
                  priority={i === 0}
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
