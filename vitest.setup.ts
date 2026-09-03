import "@testing-library/jest-dom/vitest";

/**
 * jsdom no implementa IntersectionObserver. EntranceVein (usado por casi
 * todas las secciones de la landing) lo necesita solo para animar la
 * entrada en scroll — un stub que no observa nada alcanza para que los
 * componentes monten en los tests sin simular scroll real.
 */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = IntersectionObserverStub;
}
