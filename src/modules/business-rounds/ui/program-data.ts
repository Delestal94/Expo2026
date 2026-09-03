import { EVENT_DAYS } from "./agenda-data";

export interface ProgramDay {
  date: string;
  label: string;
  weekday: string;
  highlight?: "Apertura" | "Cierre";
  morning: string;
  afternoon: string;
}

/**
 * Estructura diaria confirmada por la organización en la cobertura de
 * prensa del lanzamiento (rondas de negocios por la mañana, expo abierta
 * por la tarde) — no la grilla horaria completa de charlas y shows, que
 * todavía no está publicada para 2026. En la edición 2024 esa grilla se
 * conoció recién en la semana previa al evento; por eso esta sección
 * muestra lo confirmado y avisa qué falta, en vez de inventar horarios.
 */
export const PROGRAM_DAYS: ProgramDay[] = EVENT_DAYS.map((day, i) => ({
  date: day.date,
  label: day.label,
  weekday: ["Viernes", "Sábado", "Domingo", "Lunes"][i] ?? day.label,
  highlight: i === 0 ? "Apertura" : i === EVENT_DAYS.length - 1 ? "Cierre" : undefined,
  morning: "Rondas de negocios internacionales — Corredor Bioceánico",
  afternoon: "Expo abierta en Ciudad Cultural — stands, minería, comercio exterior y economía del conocimiento",
}));
