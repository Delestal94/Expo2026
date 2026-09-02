export type MeetingSlotStatus = "disponible" | "sugerido" | "confirmado";

export interface MeetingSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  table: string;
  status: MeetingSlotStatus;
  participantA: string;
  participantB?: string;
  sharedInterest?: string;
}

export const EVENT_DAYS = [
  { date: "2026-10-09", label: "Vie 9" },
  { date: "2026-10-10", label: "Sáb 10" },
  { date: "2026-10-11", label: "Dom 11" },
  { date: "2026-10-12", label: "Lun 12" },
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
    table: "Mesa 1",
    status: "confirmado",
    participantA: "Andes Trade Corredor",
    participantB: "Corredor Capricornio Logística",
    sharedInterest: "Paso de Jama",
  },
  {
    id: "slot-02",
    day: "2026-10-09",
    startTime: "10:30",
    endTime: "11:00",
    table: "Mesa 2",
    status: "sugerido",
    participantA: "Jujuy Exporta SRL",
    participantB: "Textiles Andinos Cooperativa",
    sharedInterest: "Exportación regional",
  },
  {
    id: "slot-03",
    day: "2026-10-09",
    startTime: "11:00",
    endTime: "11:30",
    table: "Mesa 3",
    status: "disponible",
    participantA: "Altiplano Servicios Mineros",
  },
  {
    id: "slot-04",
    day: "2026-10-10",
    startTime: "10:00",
    endTime: "10:30",
    table: "Mesa 1",
    status: "sugerido",
    participantA: "Quebrada Litio Insumos",
    participantB: "Jujuy Software Cluster",
    sharedInterest: "Automatización de procesos",
  },
  {
    id: "slot-05",
    day: "2026-10-10",
    startTime: "11:00",
    endTime: "11:30",
    table: "Mesa 2",
    status: "disponible",
    participantA: "Clustear Innovación",
  },
  {
    id: "slot-06",
    day: "2026-10-11",
    startTime: "15:00",
    endTime: "15:30",
    table: "Mesa 1",
    status: "confirmado",
    participantA: "Jujuy Exporta SRL",
    participantB: "Andes Trade Corredor",
    sharedInterest: "Comercio exterior",
  },
];
