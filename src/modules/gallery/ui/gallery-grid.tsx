"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY_PHOTOS } from "./gallery-data";

export function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? GALLERY_PHOTOS[openIndex] : null;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenIndex(null);
      } else if (event.key === "Tab") {
        // Único elemento enfocable dentro del diálogo: mantiene el foco
        // adentro en vez de dejarlo escapar al contenido de atrás.
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [openIndex]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GALLERY_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line outline-none focus-visible:border-accent"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-500 hover:scale-105"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Cerrar"
            className="absolute top-6 right-6 font-mono text-sm text-paper-dim outline-paper outline-offset-4 transition hover:text-paper focus-visible:text-paper focus-visible:outline-2"
          >
            Cerrar ✕
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image
              src={open.src}
              alt={open.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
