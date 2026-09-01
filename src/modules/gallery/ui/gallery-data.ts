export interface GalleryPhoto {
  src: string;
  alt: string;
}

/**
 * Fotos reales de ExpoJuy 2024 (16ª edición), tomadas del sitio anterior
 * (expojuy.camcomexjujuy.com.ar) con autorización de reuso para esta
 * propuesta — misma organizadora, Cámara de Comercio Exterior de Jujuy.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 30 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/galeria-2024/foto-${n}.jpg`,
    alt: `ExpoJuy 2024 — foto ${i + 1}`,
  };
});

export const GALLERY_PREVIEW_COUNT = 6;
