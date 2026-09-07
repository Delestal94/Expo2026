"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIdleOffscreen } from "@/lib/ui/use-idle-offscreen";
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

  // Congela la deriva y el destello de las tarjetas fuera de pantalla: son
  // 30 fotos × 2 animaciones perpetuas y solo una docena visible a la vez.
  const gridRef = useIdleOffscreen<HTMLDivElement>();

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
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {GALLERY_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={t("photoAlt", { n: photo.n })}
            // La deriva y el destello de esta tarjeta se congelan cuando sale
            // del viewport (ver useIdleOffscreen): son 30 fotos con dos
            // animaciones perpetuas cada una y solo una docena a la vista.
            data-idle-offscreen=""
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line/80 bg-ink/60 shadow-[0_10px_24px_rgba(0,0,0,0.18)] outline-none transition-[transform,border-color,box-shadow] duration-500 motion-reduce:transition-none hover:-translate-y-1 hover:border-magenta/60 hover:shadow-[0_16px_36px_rgba(217,70,239,0.22)] focus-visible:border-magenta"
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover motion-safe:animate-[gallery-drift_12s_ease-in-out_infinite_alternate] motion-reduce:animate-none group-hover:!scale-110"
              style={{ animationDelay: `${i * -1.2}s` }}
              loading={i < 4 ? "eager" : "lazy"}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-[rgba(45,227,214,0.42)] to-transparent motion-safe:animate-[gallery-sheen_9s_ease-in-out_infinite] motion-reduce:animate-none"
              style={{ animationDelay: `${i * -0.9}s` }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div aria-hidden="true" className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                #{String(photo.n).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-magenta-text">↗</span>
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--color-cyan)] transition-transform duration-500 group-hover:scale-x-100"
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
