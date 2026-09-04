import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EventStructuredData } from "./structured-data";

describe("EventStructuredData", () => {
  it("emite un JSON-LD de tipo Event con solo los datos confirmados del evento", () => {
    const markup = renderToStaticMarkup(<EventStructuredData />);
    const jsonText = markup
      .replace(/^<script[^>]*>/, "")
      .replace(/<\/script>$/, "");
    const data = JSON.parse(jsonText);

    expect(data["@type"]).toBe("Event");
    expect(data.name).toBe("ExpoJuy 2026");
    expect(data.startDate).toBe("2026-10-09");
    expect(data.endDate).toBe("2026-10-12");
    expect(data.location.address.addressCountry).toBe("AR");
    expect(data.organizer.name).toBe("Cámara de Comercio Exterior de Jujuy");
    expect(data.organizer.sameAs).toContain("https://www.instagram.com/expojuy/");
    expect(data).not.toHaveProperty("offers");
  });
});
