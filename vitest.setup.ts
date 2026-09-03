import "@testing-library/jest-dom/vitest";

/**
 * jsdom no implementa IntersectionObserver. `EntranceVein` (usado por
 * `AdmissionTicket` y varias secciones de la landing) lo instancia en un
 * `useEffect`, así que sin este stub cualquier test que monte uno de esos
 * componentes revienta con un ReferenceError antes de llegar a las
 * aserciones.
 */
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- stub mínimo, no implementa la interfaz completa del DOM.
globalThis.IntersectionObserver = IntersectionObserverStub;
