import Image from "next/image";
import { useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { StrataCanvas } from "./strata-canvas";

export function Hero() {
  const t = useTranslations("Landing.Hero");

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b border-line px-6 pt-8 pb-10 sm:px-10 lg:px-16"
    >
      <StrataCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink"
      />

      <nav className="relative z-10 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logos/expojuy-mark.svg"
            alt=""
            width={20}
            height={28}
            className="h-7 w-auto"
          />
          <span>{t("eyebrow")}</span>
        </div>
        <span>{t("edition")}</span>
      </nav>

      <div className="relative z-10 flex flex-col gap-8">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("tagline")}
        </span>
        <h1 className="text-balance font-display text-[clamp(3rem,11vw,8.5rem)] leading-[0.92] font-black text-paper">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h1>
        <p className="max-w-xl text-balance font-body text-lg text-paper-dim sm:text-xl">
          {t("description")}
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <Countdown />
        <div className="flex flex-wrap gap-3">
          <a
            href="#acceso"
            className="group relative isolate inline-flex rounded-full transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:scale-[1.03] motion-safe:focus-visible:scale-[1.03]"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-2 -z-10 rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-blue),var(--color-magenta),var(--color-yellow))] opacity-0 blur-lg transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-70 group-focus-visible:opacity-70"
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink">
              {t("ctaAttend")}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1 group-focus-visible:translate-x-1"
              >
                →
              </span>
            </span>
          </a>
          <a
            href="https://forms.gle/ChErBuBgp3QfuxRr7"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-line px-6 py-3 font-body text-sm font-semibold text-paper transition hover:border-paper-dim"
          >
            {t("ctaProviders")}
          </a>
        </div>
      </div>
    </section>
  );
}
