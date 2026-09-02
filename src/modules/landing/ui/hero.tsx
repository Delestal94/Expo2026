import { useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { StrataCanvas } from "./strata-canvas";

export function Hero() {
  const t = useTranslations("Landing.Hero");

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b border-line px-6 pt-8 pb-10 sm:px-10 lg:px-16">
      <StrataCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink"
      />

      <nav className="relative z-10 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
        <span>{t("eyebrow")}</span>
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
            className="rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink transition hover:brightness-110"
          >
            {t("ctaAttend")}
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
