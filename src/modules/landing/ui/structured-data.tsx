const EVENT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "ExpoJuy 2026",
  description:
    "Sitio oficial de ExpoJuy 2026 — 9 al 12 de octubre, Ciudad Cultural, Jujuy.",
  startDate: "2026-10-09",
  endDate: "2026-10-12",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Ciudad Cultural",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jujuy",
      addressCountry: "AR",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Cámara de Comercio Exterior de Jujuy",
  },
  url: "https://expojuy2026.vercel.app",
};

export function EventStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(EVENT_JSON_LD) }}
    />
  );
}
