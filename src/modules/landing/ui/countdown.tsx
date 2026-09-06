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

const pad = (value: number) => String(value).padStart(2, "0");

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

  const clockLabel = timeLeft
    ? `${pad(timeLeft.hours)} ${t("hours")}, ${pad(timeLeft.minutes)} ${t("minutes")} y ${pad(timeLeft.seconds)} ${t("seconds")}`
    : undefined;

  return (
    <div className="flex items-end gap-6" role="timer" aria-live="off">
      <div className="flex flex-col">
        <span className="font-display text-[3.25rem] leading-[0.85] font-black tabular-nums text-paper sm:text-[4.75rem]">
          {timeLeft ? pad(timeLeft.days) : "--"}
        </span>
        <span
          aria-hidden="true"
          className="mt-2 h-[3px] w-10 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet),var(--color-magenta),var(--color-lavender))]"
        />
        <span className="mt-1.5 font-mono text-[0.65rem] tracking-[0.3em] text-paper-dim uppercase">
          {t("days")}
        </span>
      </div>

      <div className="flex items-baseline gap-[2px] pb-2 font-mono text-lg text-paper-dim tabular-nums sm:text-xl">
        <span className="sr-only">{clockLabel}</span>
        <span aria-hidden="true">{timeLeft ? pad(timeLeft.hours) : "--"}</span>
        <span aria-hidden="true" className="text-paper-dim/50">
          :
        </span>
        <span aria-hidden="true">{timeLeft ? pad(timeLeft.minutes) : "--"}</span>
        <span aria-hidden="true" className="text-paper-dim/50">
          :
        </span>
        <span aria-hidden="true">{timeLeft ? pad(timeLeft.seconds) : "--"}</span>
      </div>
    </div>
  );
}
