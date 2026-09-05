"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { CtaLink } from "./cta-link";
import { LanguageSwitcher } from "./language-switcher";
import { StrataCanvas } from "./strata-canvas";

export function Hero() {
  const t = useTranslations("Landing.Hero");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      if (!section) return;
      const scrollY = window.scrollY || 0;
      const h = section.clientHeight || window.innerHeight;
      const progress = Math.min(Math.max(scrollY / h, 0), 1);

      // Parallax del bloque central (profundidad z y desvanecimiento suave al salir hacia #sobre)
      const midY = scrollY * 0.35;
      const midScale = Math.max(0.92, 1 - progress * 0.08);
      const midOpacity = Math.max(0, 1 - progress * 1.35);
      const midBlur = progress * 4;

      // Parallax del bloque inferior (countdown y CTAs)
      const bottomY = scrollY * 0.2;
      const bottomOpacity = Math.max(0, 1 - progress * 1.5);

      section.style.setProperty("--hero-mid-y", `${midY.toFixed(1)}px`);
      section.style.setProperty("--hero-mid-scale", midScale.toFixed(3));
      section.style.setProperty("--hero-mid-opacity", midOpacity.toFixed(3));
      section.style.setProperty("--hero-mid-blur", `${midBlur.toFixed(1)}px`);
      section.style.setProperty("--hero-bottom-y", `${bottomY.toFixed(1)}px`);
      section.style.setProperty("--hero-bottom-opacity", bottomOpacity.toFixed(3));

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b border-line px-6 pt-8 pb-10 sm:px-10 lg:px-16"
    >
      {/* Fondo animado de estratos a todo el ancho */}
      <StrataCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink"
      />

      {/* Navegación superior */}
      <nav className="relative z-10 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_backwards]">
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
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">{t("edition")}</span>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Bloque central oficial (Lockup con parallax espacial) */}
      <div
        className="relative z-10 flex flex-col gap-8 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:filter-none"
        style={{
          transform:
            "translate3d(0, var(--hero-mid-y, 0px), 0) scale(var(--hero-mid-scale, 1))",
          opacity: "var(--hero-mid-opacity, 1)",
          filter: "blur(var(--hero-mid-blur, 0px))",
        }}
      >
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.08s_backwards]">
          {t("tagline")}
        </span>
        <h1 className="motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.16s_backwards]">
          <Image
            src="/images/logos/expojuy-wordmark-dark.svg"
            alt={t("titleAlt")}
            width={1000}
            height={305}
            priority
            className="h-auto w-full max-w-205"
          />
        </h1>
        <p className="max-w-xl text-balance font-body text-lg text-paper-dim sm:text-xl motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.38s_backwards]">
          {t("description")}
        </p>
      </div>

      {/* Bloque inferior (Countdown y CTAs) */}
      <div
        className="relative z-10 flex flex-col gap-8 will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 sm:flex-row sm:items-end sm:justify-between motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.48s_backwards]"
        style={{
          transform: "translate3d(0, var(--hero-bottom-y, 0px), 0)",
          opacity: "var(--hero-bottom-opacity, 1)",
        }}
      >
        <Countdown />
        <div className="flex flex-wrap gap-3">
          <a
            href="#acceso"
            className="group relative isolate inline-flex rounded-full transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:scale-[1.03] motion-safe:focus-visible:scale-[1.03]"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-2 -z-10 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet),var(--color-magenta),var(--color-lavender))] opacity-0 blur-lg transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-70 group-focus-visible:opacity-70"
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
          <CtaLink
            href="https://forms.gle/ChErBuBgp3QfuxRr7"
            variant="outline"
            external
          >
            {t("ctaProviders")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
