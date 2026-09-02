export interface Zone {
  id: string;
  label: string;
  /** Etiqueta corta para el plano cuando `label` no entra en la caja. */
  shortLabel?: string;
  kind: "pabellon" | "sala" | "acceso";
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  status?: "en-ronda" | "libre";
}

/**
 * Plano esquemático de referencia para el mockup — no son coordenadas
 * reales de Ciudad Cultural (todavía no tenemos el plano oficial).
 * Los 4 pabellones reutilizan los mismos ejes y colores de la landing.
 */
export const ZONES: Zone[] = [
  {
    id: "pabellon-mineria",
    label: "Pabellón Minería y Litio",
    kind: "pabellon",
    color: "var(--color-cyan)",
    x: 40,
    y: 40,
    width: 420,
    height: 220,
    description:
      "Proveedores y contratistas del sector minero, con foco en la cadena de valor del litio.",
  },
  {
    id: "pabellon-comercio",
    label: "Pabellón Comercio Exterior",
    kind: "pabellon",
    color: "var(--color-violet)",
    x: 500,
    y: 40,
    width: 420,
    height: 220,
    description:
      "Exportadores e importadores jujeños, organizados por la Cámara de Comercio Exterior.",
  },
  {
    id: "pabellon-corredor",
    label: "Pabellón Corredor Bioceánico",
    kind: "pabellon",
    color: "var(--color-magenta)",
    x: 40,
    y: 300,
    width: 420,
    height: 180,
    description: "Delegaciones de Chile, Paraguay y provincias vecinas del corredor.",
  },
  {
    id: "pabellon-conocimiento",
    label: "Pabellón Economía del Conocimiento",
    kind: "pabellon",
    color: "var(--color-lavender)",
    x: 500,
    y: 300,
    width: 420,
    height: 180,
    description: "Software, agtech y servicios basados en el conocimiento — el sector de este desafío.",
  },
  {
    id: "sala-a",
    label: "Sala de Ronda de Negocios A",
    shortLabel: "Sala A",
    kind: "sala",
    color: "var(--color-magenta)",
    x: 40,
    y: 510,
    width: 176,
    height: 70,
    description: "Reuniones 1 a 1 entre expositores y compradores agendadas por franja horaria.",
    status: "en-ronda",
  },
  {
    id: "sala-b",
    label: "Sala de Ronda de Negocios B",
    shortLabel: "Sala B",
    kind: "sala",
    color: "var(--color-magenta)",
    x: 244,
    y: 510,
    width: 176,
    height: 70,
    description: "Reuniones 1 a 1 entre expositores y compradores agendadas por franja horaria.",
    status: "libre",
  },
  {
    id: "sala-c",
    label: "Sala de Ronda de Negocios C",
    shortLabel: "Sala C",
    kind: "sala",
    color: "var(--color-magenta)",
    x: 448,
    y: 510,
    width: 176,
    height: 70,
    description: "Reuniones 1 a 1 entre expositores y compradores agendadas por franja horaria.",
    status: "en-ronda",
  },
  {
    id: "acceso",
    label: "Acceso principal",
    kind: "acceso",
    color: "var(--color-accent)",
    x: 700,
    y: 510,
    width: 220,
    height: 70,
    description: "Ingreso con QR de registro — ver módulo de registro de acceso.",
  },
];
