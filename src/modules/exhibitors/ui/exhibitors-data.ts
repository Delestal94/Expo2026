export type ExhibitorId =
  | "altiplano-servicios"
  | "quebrada-litio"
  | "jujuy-exporta"
  | "andes-trade"
  | "capricornio-log"
  | "textiles-andinos"
  | "jujuy-software"
  | "clustear-demo";

export interface Exhibitor {
  id: ExhibitorId;
  name: string;
  eje: "mineria" | "comercio" | "corredor" | "conocimiento";
  color: string;
}

export const EJE_FILTERS: Array<{ id: Exhibitor["eje"]; color: string }> = [
  { id: "mineria", color: "var(--color-cyan)" },
  { id: "comercio", color: "var(--color-violet)" },
  { id: "corredor", color: "var(--color-magenta)" },
  { id: "conocimiento", color: "var(--color-lavender)" },
];

/**
 * Perfiles de ejemplo para el mockup — no son expositores confirmados.
 * El nombre de la empresa no se traduce (es un nombre propio, como en
 * cualquier directorio real); el pitch y lo que busca cada una viven en
 * el diccionario (`Exhibitors.items.<id>`), no acá.
 */
export const EXHIBITORS: Exhibitor[] = [
  { id: "altiplano-servicios", name: "Altiplano Servicios Mineros", eje: "mineria", color: "var(--color-cyan)" },
  { id: "quebrada-litio", name: "Quebrada Litio Insumos", eje: "mineria", color: "var(--color-cyan)" },
  { id: "jujuy-exporta", name: "Jujuy Exporta SRL", eje: "comercio", color: "var(--color-violet)" },
  { id: "andes-trade", name: "Andes Trade Corredor", eje: "comercio", color: "var(--color-violet)" },
  { id: "capricornio-log", name: "Corredor Capricornio Logística", eje: "corredor", color: "var(--color-magenta)" },
  { id: "textiles-andinos", name: "Textiles Andinos Cooperativa", eje: "corredor", color: "var(--color-magenta)" },
  { id: "jujuy-software", name: "Jujuy Software Cluster", eje: "conocimiento", color: "var(--color-lavender)" },
  { id: "clustear-demo", name: "Clustear Innovación", eje: "conocimiento", color: "var(--color-lavender)" },
];
