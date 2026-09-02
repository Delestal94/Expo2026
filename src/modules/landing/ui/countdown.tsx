"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const EVENT_START = new Date("2026-10-09T09:00:00-03:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getTimeLeft(): TimeLeft {
  const diff = Math.max(EVENT_START - Date.now(), 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS: Array<keyof TimeLeft> = ["days", "hours", "minutes", "seconds"];

/** Cuenta regresiva real al inicio de ExpoJuy 2026 (9/10, 09:00 ART). */
export function Countdown() {
  const t = useTranslations("Landing.Countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // El valor inicial se calcula recien en el cliente (Date.now() difiere
    // del render de servidor) — arrancar en null y pisarlo aca es lo que
    // evita un mismatch de hidratacion, no un efecto en cascada real.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-5 font-mono" role="timer" aria-live="off">
      {UNITS.map((key) => (
        <div key={key} className="flex flex-col items-center">
          <span className="text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
            {timeLeft ? String(timeLeft[key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[0.65rem] tracking-[0.15em] text-paper-dim uppercase">
            {t(key)}
          </span>
        </div>
      ))}
    </div>
  );
}
