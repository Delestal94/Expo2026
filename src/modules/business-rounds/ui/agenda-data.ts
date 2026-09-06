export type MeetingSlotStatus = "disponible" | "sugerido" | "confirmado";

export type SharedInterestKey =
  | "pasoDeJama"
  | "exportacionRegional"
  | "automatizacionProcesos"
  | "comercioExterior";

export interface MeetingSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  table: number;
  status: MeetingSlotStatus;
  participantA: string;
  participantB?: string;
  sharedInterest?: SharedInterestKey;
}

/**
 * `dayKey` resuelve el nombre corto del día ("Vie", "Sáb"...) vía el
 * diccionario (`BusinessRounds.Agenda.days.<dayKey>`) — el número de
 * fecha (`dayNumber`) no necesita traducción.
 */
export const EVENT_DAYS = [
  { date: "2026-10-09", dayKey: "fri", dayNumber: 9 },
  { date: "2026-10-10", dayKey: "sat", dayNumber: 10 },
  { date: "2026-10-11", dayKey: "sun", dayNumber: 11 },
  { date: "2026-10-12", dayKey: "mon", dayNumber: 12 },
] as const;

/**
 * Slots de ejemplo — no hay backend de reservas real todavía (ver
 * matching-preview.tsx). El modelo (día, horario, mesa, estado,
 * participantes) es el que va a persistir un adaptador de reservas real
 * cuando exista; por ahora solo lo completan estos datos de ejemplo.
 */
export const AGENDA_SLOTS: MeetingSlot[] = [
  {
    id: "slot-01",
    day: "2026-10-09",
    startTime: "10:00",
    endTime: "10:30",
    table: 1,
    status: "confirmado",
    participantA: "Andes Trade Corredor",
    participantB: "Corredor Capricornio Logística",
    sharedInterest: "pasoDeJama",
  },
  {
    id: "slot-02",
    day: "2026-10-09",
    startTime: "10:30",
    endTime: "11:00",
    table: 2,
    status: "sugerido",
    participantA: "Jujuy Exporta SRL",
    participantB: "Textiles Andinos Cooperativa",
    sharedInterest: "exportacionRegional",
  },
  {
    id: "slot-03",
    day: "2026-10-09",
    startTime: "11:00",
    endTime: "11:30",
    table: 3,
    status: "disponible",
    participantA: "Altiplano Servicios Mineros",
  },
  {
    id: "slot-04",
    day: "2026-10-10",
    startTime: "10:00",
    endTime: "10:30",
    table: 1,
    status: "sugerido",
    participantA: "Quebrada Litio Insumos",
    participantB: "Jujuy Software Cluster",
    sharedInterest: "automatizacionProcesos",
  },
  {
    id: "slot-05",
    day: "2026-10-10",
    startTime: "11:00",
    endTime: "11:30",
    table: 2,
    status: "disponible",
    participantA: "Clustear Innovación",
  },
  {
    id: "slot-06",
    day: "2026-10-11",
    startTime: "15:00",
    endTime: "15:30",
    table: 1,
    status: "confirmado",
    participantA: "Jujuy Exporta SRL",
    participantB: "Andes Trade Corredor",
    sharedInterest: "comercioExterior",
  },
];
