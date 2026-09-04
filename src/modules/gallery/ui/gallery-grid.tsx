"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY_PHOTOS } from "./gallery-data";

const TOTAL = GALLERY_PHOTOS.length;
const SWIPE_THRESHOLD_PX = 40;

function wrap(index: number, delta: number) {
  return (index + delta + TOTAL) % TOTAL;
}

export function GalleryGrid() {
  const t = useTranslations("Gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? GALLERY_PHOTOS[openIndex] : null;
  const currentNumber = openIndex !== null ? openIndex + 1 : null;
  const isOpen = openIndex !== null;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const goPrev = () => setOpenIndex((i) => (i === null ? i : wrap(i, -1)));
  const goNext = () => setOpenIndex((i) => (i === null ? i : wrap(i, 1)));

  // Foco: entra al abrir, vuelve a la miniatura al cerrar. No se toca en
  // cada cambio de foto (eso rompería la navegación por teclado).
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    }
    if (!isOpen && wasOpenRef.current) {
      previouslyFocusedRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenIndex(null);
        return;
      }
      if (event.key === "ArrowRight") {
        goNext();
        return;
      }
      if (event.key === "ArrowLeft") {
        goPrev();
        return;
      }
      if (event.key !== "Tab") return;

      // Trampa de foco genérica sobre los botones del diálogo (cerrar,
      // anterior, siguiente) en vez de forzar siempre "cerrar" — ahora
      // hay más de un control para recorrer con Tab.
      const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    if (delta < 0) goNext();
    else goPrev();
  }

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
              alt={t("photoAlt", { n: photo.n })}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-500 hover:scale-105"
              loading={i < 4 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {open && currentNumber && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("photoAlt", { n: open.n })}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-6"
          onClick={() => setOpenIndex(null)}
        >
          <p className="sr-only" aria-live="polite">
            {t("dialogAnnounce", { current: currentNumber, total: TOTAL, alt: t("photoAlt", { n: open.n }) })}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label={t("closeLabel")}
            className="absolute top-6 right-6 z-10 font-mono text-sm text-paper-dim outline-paper outline-offset-4 transition hover:text-paper focus-visible:text-paper focus-visible:outline-2"
          >
            {t("closeLabel")} ✕
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label={t("prevLabel")}
            className="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line text-paper-dim transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none sm:left-6"
          >
            <span aria-hidden="true" className="text-lg">
              ‹
            </span>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label={t("nextLabel")}
            className="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line text-paper-dim transition hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none sm:right-6"
          >
            <span aria-hidden="true" className="text-lg">
              ›
            </span>
          </button>

          <div
            key={open.src}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[80vh] w-full max-w-4xl motion-safe:animate-[strata-settle_0.35s_cubic-bezier(0.16,1,0.3,1)_backwards]"
          >
            <Image
              src={open.src}
              alt={t("photoAlt", { n: open.n })}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-6 flex justify-center gap-1 font-mono text-xs tracking-[0.2em] text-paper-dim tabular-nums uppercase"
          >
            <span className="text-paper">{String(currentNumber).padStart(2, "0")}</span>
            <span className="text-paper-dim/50">/</span>
            <span>{String(TOTAL).padStart(2, "0")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
