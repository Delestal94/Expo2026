import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { EventStructuredData } from "./structured-data";

/**
 * `getTranslations` real depende del contexto de request de Next.js, que
 * no existe en un test de componente aislado. Este mock resuelve
 * namespace + clave contra el diccionario real (`es-AR.json`), así el
 * test sigue verificando el contenido de verdad en vez de un string
 * inventado — si alguien borra una clave del diccionario, el test la
 * nota igual.
 */
vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: string }) => {
    const root = namespace
      .split(".")
      .reduce<unknown>((acc, seg) => (acc as Record<string, unknown>)[seg], esAR);
    return (key: string) =>
      key
        .split(".")
        .reduce<unknown>((acc, seg) => (acc as Record<string, unknown>)[seg], root) as string;
  },
}));

describe("EventStructuredData", () => {
  it("emite un @graph con Event y FAQPage, con solo los datos confirmados del evento", async () => {
    const markup = renderToStaticMarkup(
      await EventStructuredData({ locale: "es-AR" }),
    );
    const jsonText = markup
      .replace(/^<script[^>]*>/, "")
      .replace(/<\/script>$/, "");
    const data = JSON.parse(jsonText);

    expect(data["@context"]).toBe("https://schema.org");
    const [event, faq] = data["@graph"];

    expect(event["@type"]).toBe("Event");
    expect(event.name).toBe("ExpoJuy 2026");
    expect(event.inLanguage).toBe("es-AR");
    expect(event.startDate).toBe("2026-10-09");
    expect(event.endDate).toBe("2026-10-12");
    expect(event.location.address.addressCountry).toBe("AR");
    expect(event.organizer.name).toBe("Cámara de Comercio Exterior de Jujuy");
    expect(event.organizer.sameAs).toContain("https://www.instagram.com/expojuy/");
    expect(event).not.toHaveProperty("offers");

    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity).toHaveLength(8);
    expect(faq.mainEntity[0].name).toBe(esAR.Landing.Faq.items.dates.question);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe(
      esAR.Landing.Faq.items.dates.answer,
    );
  });
});
