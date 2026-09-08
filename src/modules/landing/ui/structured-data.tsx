import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/lib/i18n/routing";

const SITE_URL = "https://expojuy2026.vercel.app";

/**
 * `Event` + `FAQPage` en el mismo `<script>` (array con `@graph`, patrón
 * estándar de schema.org para varios tipos en una página) en vez de dos
 * bloques sueltos — un motor que lee JSON-LD asocia ambos al mismo `url`
 * sin ambigüedad.
 *
 * Antes la descripción del Event era un string fijo en español, igual en
 * las 5 rutas de idioma: alguien en /en recibía el schema en español
 * mientras la página estaba en inglés. Ahora sale de `Metadata`, que ya
 * existe traducido en los 5 diccionarios (estaba huérfano — nada lo leía).
 *
 * No hay `geo` (lat/long): no encontramos una fuente que las confirme, y
 * un schema con coordenadas inventadas es peor que uno sin ellas — un LLM
 * o un mapa que las lea como ciertas llevaría a alguien al lugar
 * equivocado. Queda la dirección en texto, verificable.
 */
export async function EventStructuredData({ locale }: { locale: Locale }) {
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const tFaq = await getTranslations({ locale, namespace: "Landing.Faq" });

  // Mismo criterio de "as-needed" que el resto del sitio (sitemap,
  // generateMetadata): es-AR no lleva prefijo.
  const url =
    locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;

  const eventJsonLd = {
    "@type": "Event",
    "@id": `${url}#event`,
    name: "ExpoJuy 2026",
    description: tMeta("description"),
    inLanguage: locale,
    startDate: "2026-10-09",
    endDate: "2026-10-12",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Ciudad Cultural",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Av. de los Estudiantes Jujeños",
        addressLocality: "San Salvador de Jujuy",
        addressRegion: "Jujuy",
        addressCountry: "AR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Cámara de Comercio Exterior de Jujuy",
      sameAs: [
        "https://www.instagram.com/expojuy/",
        "https://www.facebook.com/camaradecomercioexteriorjujuy/",
        "https://ar.linkedin.com/company/c%C3%A1mara-de-comercio-exterior-de-jujuy",
      ],
    },
    url,
  };

  // Las 8 preguntas son las mismas que muestra FaqSection en texto plano —
  // este bloque describe ese contenido, no lo reemplaza. `entries` viene
  // de next-intl solo para listar las claves; el texto en sí sale de `t`.
  const questionKeys = [
    "dates",
    "tickets",
    "exhibitors",
    "businessRounds",
    "accessibility",
    "parking",
    "languages",
    "updates",
  ] as const;

  const faqJsonLd = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: questionKeys.map((key) => ({
      "@type": "Question",
      name: tFaq(`items.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: tFaq(`items.${key}.answer`),
      },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [eventJsonLd, faqJsonLd],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
