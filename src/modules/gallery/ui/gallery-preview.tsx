import Image from "next/image";
import Link from "next/link";
import { GALLERY_PHOTOS, GALLERY_PREVIEW_COUNT } from "./gallery-data";

export function GalleryPreview() {
  const photos = GALLERY_PHOTOS.slice(0, GALLERY_PREVIEW_COUNT);

  return (
    <section id="galeria" className="px-6 py-16 sm:px-10 lg:px-16">
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        Edición anterior
      </span>
      <h2 className="mt-3 text-balance font-display text-2xl font-medium text-paper sm:text-3xl">
        Explorá la 16ª edición
      </h2>

      {/* Mobile: tira con scroll horizontal y snap — un gesto de "hojear" que no
          tiene sentido replicar en desktop, donde vuelve a ser una grilla estática. */}
      <div className="relative -mx-6 mt-8 sm:mx-0">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          {photos.map((photo, i) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] w-[68vw] shrink-0 snap-start overflow-hidden rounded-xl border border-line sm:w-auto sm:shrink"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 33vw, 68vw"
                className="object-cover transition duration-500 hover:scale-105"
                priority={i === 0}
              />
            </div>
          ))}
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
        Ver galería completa
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
