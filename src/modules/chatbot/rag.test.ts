import { describe, expect, it } from "vitest";
import { retrieveContext } from "./rag";

describe("retrieveContext", () => {
  it("encuentra la FAQ de entradas cuando preguntan por el precio del ticket", () => {
    const results = retrieveContext("es-AR", "¿cuánto sale la entrada?");
    expect(results.some((doc) => doc.id === "faq.tickets")).toBe(true);
  });

  it("encuentra el eje de minería cuando preguntan por litio", () => {
    const results = retrieveContext("es-AR", "che, cuéntame sobre el litio y la minería");
    expect(results.some((doc) => doc.id === "ejes.mineria")).toBe(true);
  });

  it("no devuelve nada para un mensaje sin ninguna palabra relevante del corpus", () => {
    const results = retrieveContext("es-AR", "hola");
    expect(results).toEqual([]);
  });

  it("no devuelve más de `limit` documentos", () => {
    const results = retrieveContext("es-AR", "expositores rondas negocios comercio exterior corredor jujuy", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("funciona igual para los 5 idiomas soportados", () => {
    for (const locale of ["es-AR", "en", "pt", "zh", "fr"]) {
      expect(() => retrieveContext(locale, "test")).not.toThrow();
    }
  });

  it("cae a es-AR si el locale no existe en el corpus", () => {
    const results = retrieveContext("de", "¿cuánto sale la entrada?");
    expect(results.some((doc) => doc.id === "faq.tickets")).toBe(true);
  });
});
