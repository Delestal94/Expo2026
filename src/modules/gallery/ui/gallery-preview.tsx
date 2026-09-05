"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { GALLERY_PHOTOS } from "./gallery-data";

/**
 * Estados de composición para el bento interactivo:
 * - 5 contenedores estrictamente confinados en 2 filas flex (2 arriba, 3 abajo).
 * - Las proporciones de ancho y alto varían de forma orgánica y fluida.
 * - Es 100% imposible que desborden el contenedor padre o se pisen entre sí.
 */
interface CompositionState {
  row1Height: string; // Ej: "56%" vs "44%"
  row2Height: string;
  r1Flex0: number;    // Proporción flex de Card 0
  r1Flex1: number;    // Proporción flex de Card 1
  r2Flex0: number;    // Proporción flex de Card 2
  r2Flex1: number;    // Proporción flex de Card 3
  r2Flex2: number;    // Proporción flex de Card 4
}

const COMPOSITIONS: CompositionState[] = [
  // Composición 0: Card 0 domina arriba a la izquierda; Card 2 domina abajo a la izquierda
  {
    row1Height: "55%",
    row2Height: "45%",
    r1Flex0: 2.4,
    r1Flex1: 1.1,
    r2Flex0: 1.9,
    r2Flex1: 1.0,
    r2Flex2: 1.0,
  },
  // Composición 1: Card 1 domina arriba a la derecha; Card 3 domina abajo al centro
  {
    row1Height: "47%",
    row2Height: "53%",
    r1Flex0: 1.1,
    r1Flex1: 2.3,
    r2Flex0: 1.0,
    r2Flex1: 2.0,
    r2Flex2: 1.0,
  },
  // Composición 2: Fila superior equilibrada; Card 4 domina abajo a la derecha
  {
    row1Height: "45%",
    row2Height: "55%",
    r1Flex0: 1.6,
    r1Flex1: 1.6,
    r2Flex0: 1.0,
    r2Flex1: 1.0,
    r2Flex2: 2.1,
  },
  // Composición 3: Fila superior dominante panorámica; fila inferior simétrica
  {
    row1Height: "57%",
    row2Height: "43%",
    r1Flex0: 2.1,
    r1Flex1: 1.4,
    r2Flex0: 1.3,
    r2Flex1: 1.3,
    r2Flex2: 1.3,
  },
];

export function GalleryPreview() {
  const t = useTranslations("Gallery");
  const [compositionIndex, setCompositionIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Índices de fotos actuales para los 5 contenedores
  const [photoIndices, setPhotoIndices] = useState<number[]>([0, 1, 2, 3, 4]);

  // Ciclo rítmico automático de variabilidad de tamaños e imágenes
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Avanza el patrón de tamaños
      setCompositionIndex((prev) => (prev + 1) % COMPOSITIONS.length);

      // Rota la foto de un contenedor de manera escalonada
      setPhotoIndices((prev) => {
        const next = [...prev];
        const randomSlot = Math.floor(Math.random() * 5);
        next[randomSlot] = (next[randomSlot]! + 5) % GALLERY_PHOTOS.length;
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const comp = COMPOSITIONS[compositionIndex]!;

  // Cálculos dinámicos de flex considerando el hover del usuario
  const flexR1_0 = hoveredCard === 0 ? 3.0 : hoveredCard === 1 ? 1.0 : comp.r1Flex0;
  const flexR1_1 = hoveredCard === 1 ? 3.0 : hoveredCard === 0 ? 1.0 : comp.r1Flex1;

  const flexR2_0 = hoveredCard === 2 ? 2.6 : (hoveredCard === 3 || hoveredCard === 4) ? 0.9 : comp.r2Flex0;
  const flexR2_1 = hoveredCard === 3 ? 2.6 : (hoveredCard === 2 || hoveredCard === 4) ? 0.9 : comp.r2Flex1;
  const flexR2_2 = hoveredCard === 4 ? 2.6 : (hoveredCard === 2 || hoveredCard === 3) ? 0.9 : comp.r2Flex2;

  return (
    <section
      id="galeria"
      className="relative px-6 py-4 sm:px-10 lg:px-16 sm:py-6 lg:py-6 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-hidden"
    >
      <EntranceVein color="var(--color-magenta)" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between shrink-0">
        <div>
          <span className="font-mono text-xs tracking-[0.25em] text-magenta uppercase">
            {t("previewEyebrow")}
          </span>
          <h2 className="mt-2 sm:mt-3 text-balance font-display text-2xl font-medium text-paper sm:text-3xl lg:text-4xl">
            {t("previewTitle")}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Indicadores de composición interactivos */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-3 py-1.5 backdrop-blur-sm"
            aria-label="Selector de composición"
          >
            {COMPOSITIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCompositionIndex(i)}
                aria-label={`Composición ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  compositionIndex === i
                    ? "w-6 bg-magenta"
                    : "w-2 bg-paper-dim/40 hover:bg-paper-dim"
                }`}
              />
            ))}
          </div>

          <Link
            href="/galeria"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition hover:border-magenta hover:text-magenta"
          >
            {t("viewFullCta")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* ── DESKTOP: Bento rigurosamente confinado con tamaños variables sin desborde ── */}
      <div
        className="hidden sm:flex flex-1 min-h-0 flex-col gap-3 lg:gap-4 my-3 sm:my-4 w-full h-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredCard(null);
        }}
      >
        {/* Fila Superior: 2 tarjetas de tamaño variable */}
        <div
          className="flex gap-3 lg:gap-4 w-full min-h-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: comp.row1Height }}
        >
          {/* Card 0 */}
          <Link
            href="/galeria"
            onMouseEnter={() => setHoveredCard(0)}
            className="group relative h-full overflow-hidden rounded-2xl border border-line/70 bg-ink/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-magenta/70 hover:shadow-[0_10px_35px_rgba(217,70,239,0.2)]"
            style={{ flex: flexR1_0 }}
          >
            <Image
              src={GALLERY_PHOTOS[photoIndices[0]! % GALLERY_PHOTOS.length]!.src}
              alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[0]!]!.n })}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                Foto #{String(GALLERY_PHOTOS[photoIndices[0]!]!.n).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                ↗
              </span>
            </div>
          </Link>

          {/* Card 1 */}
          <Link
            href="/galeria"
            onMouseEnter={() => setHoveredCard(1)}
            className="group relative h-full overflow-hidden rounded-2xl border border-line/70 bg-ink/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-magenta/70 hover:shadow-[0_10px_35px_rgba(217,70,239,0.2)]"
            style={{ flex: flexR1_1 }}
          >
            <Image
              src={GALLERY_PHOTOS[photoIndices[1]! % GALLERY_PHOTOS.length]!.src}
              alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[1]!]!.n })}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                Foto #{String(GALLERY_PHOTOS[photoIndices[1]!]!.n).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                ↗
              </span>
            </div>
          </Link>
        </div>

        {/* Fila Inferior: 3 tarjetas de tamaño variable */}
        <div
          className="flex gap-3 lg:gap-4 w-full min-h-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: comp.row2Height }}
        >
          {/* Card 2 */}
          <Link
            href="/galeria"
            onMouseEnter={() => setHoveredCard(2)}
            className="group relative h-full overflow-hidden rounded-2xl border border-line/70 bg-ink/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-magenta/70 hover:shadow-[0_10px_35px_rgba(217,70,239,0.2)]"
            style={{ flex: flexR2_0 }}
          >
            <Image
              src={GALLERY_PHOTOS[photoIndices[2]! % GALLERY_PHOTOS.length]!.src}
              alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[2]!]!.n })}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                Foto #{String(GALLERY_PHOTOS[photoIndices[2]!]!.n).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                ↗
              </span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/galeria"
            onMouseEnter={() => setHoveredCard(3)}
            className="group relative h-full overflow-hidden rounded-2xl border border-line/70 bg-ink/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-magenta/70 hover:shadow-[0_10px_35px_rgba(217,70,239,0.2)]"
            style={{ flex: flexR2_1 }}
          >
            <Image
              src={GALLERY_PHOTOS[photoIndices[3]! % GALLERY_PHOTOS.length]!.src}
              alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[3]!]!.n })}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                Foto #{String(GALLERY_PHOTOS[photoIndices[3]!]!.n).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                ↗
              </span>
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/galeria"
            onMouseEnter={() => setHoveredCard(4)}
            className="group relative h-full overflow-hidden rounded-2xl border border-line/70 bg-ink/60 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-magenta/70 hover:shadow-[0_10px_35px_rgba(217,70,239,0.2)]"
            style={{ flex: flexR2_2 }}
          >
            <Image
              src={GALLERY_PHOTOS[photoIndices[4]! % GALLERY_PHOTOS.length]!.src}
              alt={t("photoAlt", { n: GALLERY_PHOTOS[photoIndices[4]!]!.n })}
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                Foto #{String(GALLERY_PHOTOS[photoIndices[4]!]!.n).padStart(2, "0")}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-ink/80 font-mono text-xs text-magenta backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                ↗
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* ── MOBILE: Tira táctil horizontal con snap ── */}
      <div className="relative -mx-6 mt-8 sm:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photoIndices.map((idx, slot) => {
            const photo = GALLERY_PHOTOS[idx % GALLERY_PHOTOS.length]!;
            return (
              <Link
                key={slot}
                href="/galeria"
                className="group relative w-[80vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line/70 bg-ink/60 aspect-[16/10]"
              >
                <Image
                  src={photo.src}
                  alt={t("photoAlt", { n: photo.n })}
                  fill
                  sizes="80vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full border border-line bg-ink/80 px-2.5 py-1 font-mono text-[0.68rem] tracking-wider text-paper uppercase backdrop-blur-sm">
                    Foto #{String(photo.n).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-magenta">↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 sm:hidden">
        <Link
          href="/galeria"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper transition hover:border-magenta"
        >
          {t("viewFullCta")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
