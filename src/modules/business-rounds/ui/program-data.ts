import { EVENT_DAYS } from "./agenda-data";

export interface ProgramDay {
  date: string;
  dayKey: (typeof EVENT_DAYS)[number]["dayKey"];
  dayNumber: number;
  highlight?: "apertura" | "cierre";
}

/**
 * Estructura diaria confirmada por la organización en la cobertura de
 * prensa del lanzamiento (rondas de negocios por la mañana, expo abierta
 * por la tarde) — no la grilla horaria completa de charlas y shows, que
 * todavía no está publicada para 2026. En la edición 2024 esa grilla se
 * conoció recién en la semana previa al evento; por eso esta sección
 * muestra lo confirmado y avisa qué falta, en vez de inventar horarios.
 * El texto de mañana/tarde y de cada highlight vive en el diccionario
 * (`BusinessRounds.Program`), no acá — este archivo es solo estructura.
 */
export const PROGRAM_DAYS: ProgramDay[] = EVENT_DAYS.map((day, i) => ({
  date: day.date,
  dayKey: day.dayKey,
  dayNumber: day.dayNumber,
  highlight: i === 0 ? "apertura" : i === EVENT_DAYS.length - 1 ? "cierre" : undefined,
}));
