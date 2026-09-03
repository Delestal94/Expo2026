import { AGENDA_SLOTS, EVENT_DAYS, type MeetingSlot, type MeetingSlotStatus } from "./agenda-data";

const STATUS_LABEL: Record<MeetingSlotStatus, string> = {
  disponible: "Disponible",
  sugerido: "Sugerido",
  confirmado: "Confirmado",
};

const STATUS_COLOR: Record<MeetingSlotStatus, string> = {
  disponible: "var(--color-line)",
  sugerido: "var(--color-cyan)",
  confirmado: "var(--color-lavender)",
};

function SlotCard({ slot }: { slot: MeetingSlot }) {
  return (
    <article className="rounded-xl border border-line bg-ink p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs tracking-[0.08em] text-paper-dim uppercase">
          {slot.startTime}–{slot.endTime} · {slot.table}
        </span>
        <span
          className="rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase"
          style={{ borderColor: STATUS_COLOR[slot.status], color: STATUS_COLOR[slot.status] }}
        >
          {STATUS_LABEL[slot.status]}
        </span>
      </div>
      <p className="mt-2 font-display text-paper">
        {slot.participantA}
        {slot.participantB && <> ↔ {slot.participantB}</>}
      </p>
      {slot.sharedInterest && (
        <p className="mt-1 text-sm text-paper-dim">Interés en común: {slot.sharedInterest}</p>
      )}
    </article>
  );
}

/**
 * Vista de agenda de rondas de negocios — detrás del flag `businessRounds`
 * (ver src/lib/config/flags.ts). Los slots son de ejemplo: todavía no hay
 * backend de reservas real, así que no hay acción de "reservar" acá.
 */
export function AgendaPreview() {
  return (
    <div>
      <div className="flex flex-col gap-8">
        {EVENT_DAYS.map((day) => {
          const slots = AGENDA_SLOTS.filter((slot) => slot.day === day.date);
          if (slots.length === 0) return null;
          return (
            <div key={day.date}>
              <h4 className="font-mono text-sm font-semibold text-violet uppercase">{day.label}</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                  <SlotCard key={slot.id} slot={slot} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-paper-dim">
        Agenda de ejemplo — la reserva de reuniones todavía no tiene backend
        real detrás.
      </p>
    </div>
  );
}
