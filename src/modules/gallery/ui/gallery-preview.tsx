import Image from "next/image";
import Link from "next/link";
import { GALLERY_PHOTOS, GALLERY_PREVIEW_COUNT } from "./gallery-data";

export function GalleryPreview() {
  const photos = GALLERY_PHOTOS.slice(0, GALLERY_PREVIEW_COUNT);

  return (
    <section className="px-6 py-24 sm:px-10 lg:px-16">
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        Edición anterior
      </span>
      <h2 className="mt-4 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        Explorá la 16ª edición
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-500 hover:scale-105"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <Link
        href="/galeria"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper transition hover:border-paper-dim"
      >
        Ver galería completa
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
