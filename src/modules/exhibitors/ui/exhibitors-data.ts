export interface Exhibitor {
  id: string;
  name: string;
  eje: "mineria" | "comercio" | "corredor" | "conocimiento";
  ejeLabel: string;
  color: string;
  pitch: string;
  busca: string;
}

export const EJE_FILTERS: Array<{ id: Exhibitor["eje"]; label: string; color: string }> = [
  { id: "mineria", label: "Minería y litio", color: "var(--color-ocher)" },
  { id: "comercio", label: "Comercio exterior", color: "var(--color-terracotta)" },
  { id: "corredor", label: "Corredor bioceánico", color: "var(--color-violet)" },
  { id: "conocimiento", label: "Economía del conocimiento", color: "var(--color-teal)" },
];

/** Perfiles de ejemplo para el mockup — no son expositores confirmados. */
export const EXHIBITORS: Exhibitor[] = [
  {
    id: "altiplano-servicios",
    name: "Altiplano Servicios Mineros",
    eje: "mineria",
    ejeLabel: "Minería y litio",
    color: "var(--color-ocher)",
    pitch: "Logística y mantenimiento de equipos para operaciones de litio en el altiplano jujeño.",
    busca: "Contratos con operadoras mineras",
  },
  {
    id: "quebrada-litio",
    name: "Quebrada Litio Insumos",
    eje: "mineria",
    ejeLabel: "Minería y litio",
    color: "var(--color-ocher)",
    pitch: "Provisión de insumos químicos certificados para plantas de procesamiento de litio.",
    busca: "Distribuidores regionales",
  },
  {
    id: "jujuy-exporta",
    name: "Jujuy Exporta SRL",
    eje: "comercio",
    ejeLabel: "Comercio exterior",
    color: "var(--color-terracotta)",
    pitch: "Consultora de comercio exterior especializada en trámites de exportación agroindustrial.",
    busca: "Compradores en Chile y Paraguay",
  },
  {
    id: "andes-trade",
    name: "Andes Trade Corredor",
    eje: "comercio",
    ejeLabel: "Comercio exterior",
    color: "var(--color-terracotta)",
    pitch: "Bróker de cargas para el Corredor Bioceánico, con operación en tres pasos fronterizos.",
    busca: "Socios logísticos internacionales",
  },
  {
    id: "capricornio-log",
    name: "Corredor Capricornio Logística",
    eje: "corredor",
    ejeLabel: "Corredor bioceánico",
    color: "var(--color-violet)",
    pitch: "Transporte de cargas entre Jujuy, el norte de Chile y Paraguay por el paso de Jama.",
    busca: "Delegaciones de Chile y Paraguay",
  },
  {
    id: "textiles-andinos",
    name: "Textiles Andinos Cooperativa",
    eje: "corredor",
    ejeLabel: "Corredor bioceánico",
    color: "var(--color-violet)",
    pitch: "Cooperativa textil con fibra de llama, buscando canales de exportación regional.",
    busca: "Importadores del Corredor Bioceánico",
  },
  {
    id: "jujuy-software",
    name: "Jujuy Software Cluster",
    eje: "conocimiento",
    ejeLabel: "Economía del conocimiento",
    color: "var(--color-teal)",
    pitch: "Agrupación de estudios de desarrollo de software y agtech de la provincia.",
    busca: "Clientes B2B e inversión ángel",
  },
  {
    id: "clustear-demo",
    name: "Clustear Innovación",
    eje: "conocimiento",
    ejeLabel: "Economía del conocimiento",
    color: "var(--color-teal)",
    pitch: "Incubadora de proyectos de economía del conocimiento del ecosistema jujeño.",
    busca: "Mentores y fondos de inversión",
  },
];
