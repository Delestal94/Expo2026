import { ImageResponse } from "next/og";
import { BrandMark } from "../brand-mark";
import type { Locale } from "@/lib/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * El texto quedaba fijo en español ("9 al 12 de octubre, Ciudad Cultural,
 * Jujuy") en el preview que ve cualquiera en WhatsApp/X, sin importar el
 * idioma del link compartido. Solo esta línea corta necesita traducción —
 * el resto del componente (layout, marca) es igual en los 5 idiomas.
 */
const DATE_PLACE: Record<Locale, string> = {
  "es-AR": "9 al 12 de octubre, Ciudad Cultural, Jujuy",
  en: "October 9–12, Ciudad Cultural, Jujuy",
  pt: "9 a 12 de outubro, Ciudad Cultural, Jujuy",
  fr: "Du 9 au 12 octobre, Ciudad Cultural, Jujuy",
  zh: "10月9日至12日 · 胡胡伊文化城",
};

/**
 * Vivía en `src/app/opengraph-image.tsx` (segmento raíz): esa carpeta no
 * tiene páginas propias, todo el contenido cuelga de `[locale]`, así que
 * el archivo nunca se asociaba a ninguna ruta real y `/opengraph-image`
 * daba 404. Movido acá, Next lo liga al segmento `[locale]` y expone
 * `params.locale` para localizar el texto.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          background: "#0b0a12",
          color: "#f5f1e8",
        }}
      >
        <BrandMark height={140} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>ExpoJuy 2026</div>
          <div style={{ display: "flex", fontSize: 40, color: "#b3ab9c" }}>
            {DATE_PLACE[locale]}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
