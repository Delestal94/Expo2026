export interface GalleryPhoto {
  /** Número de foto (1 a 30) — el `alt` traducido se arma en el componente. */
  n: number;
  src: string;
}

/**
 * Fotos reales de ExpoJuy 2024 (16ª edición), tomadas del sitio anterior
 * (expojuy.camcomexjujuy.com.ar) con autorización de reuso para esta
 * propuesta — misma organizadora, Cámara de Comercio Exterior de Jujuy.
 */
export const GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 30 }, (_, i) => ({
  n: i + 1,
  src: `/images/galeria-2024/foto-${String(i + 1).padStart(2, "0")}.jpg`,
}));

export const GALLERY_PREVIEW_COUNT = 6;
