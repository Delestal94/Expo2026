"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { NEWS_ITEMS } from "./news-data";

/** Enlace interno (ancla de la misma página) vs. nota de prensa externa. */
function isInternal(href: string) {
  return href.startsWith("#");
}

/** 4 colores de marca correspondientes a los 4 estratos minerales de ExpoJuy */
const CARD_COLORS = [
  "var(--color-cyan)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "var(--color-lavender)",
];

const SECTION_WASH = {
  background: [
    "radial-gradient(ellipse 800px 480px at 10% 0%, color-mix(in srgb, var(--color-cyan) 8%, transparent), transparent 65%)",
    "radial-gradient(ellipse 750px 480px at 90% 100%, color-mix(in srgb, var(--color-violet) 8%, transparent), transparent 65%)",
  ].join(", "),
};

export function NewsSection() {
  const t = useTranslations("News");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      section.style.setProperty("--news-header-y", "0px");
      section.style.setProperty("--news-header-opacity", "1");
      NEWS_ITEMS.forEach((_, i) => {
        section.style.setProperty(`--news-card-${i}-x`, "0px");
        section.style.setProperty(`--news-card-${i}-y`, "0px");
        section.style.setProperty(`--news-card-${i}-scale`, "1");
        section.style.setProperty(`--news-card-${i}-opacity`, "1");
      });
      return;
    }

    let ticking = false;
    let headerMaxProg = 0;
    const cardsMaxProg = [0, 0, 0, 0];
    let allCompleted = false;

    // Ventanas de scroll progresivo para header y las 4 tarjetas
    const cardWindows = [
      { start: 0.88, end: 0.58, xOffset: -45 }, // Card 0 (izq exterior)
      { start: 0.80, end: 0.50, xOffset: -15 }, // Card 1 (izq interior)
      { start: 0.72, end: 0.42, xOffset: 15 },  // Card 2 (der interior)
      { start: 0.64, end: 0.34, xOffset: 45 },  // Card 3 (der exterior)
    ];

    function update() {
      if (!section || allCompleted) return;

      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 800;
      const sectionTop = rect.top;
      const isMobile = window.innerWidth < 640;

      // 1. Animación de scroll del encabezado (0.95 a 0.70)
      const hStartY = viewH * 0.95;
      const hEndY = viewH * 0.70;
      const hCurrentProg = Math.min(
        Math.max((hStartY - sectionTop) / (hStartY - hEndY), 0),
        1,
      );
      headerMaxProg = Math.max(headerMaxProg, hCurrentProg);

      const headerY = (1 - headerMaxProg) * 35;
      const headerOpacity = Math.min(1, headerMaxProg * 1.4);
      section.style.setProperty("--news-header-y", `${headerY.toFixed(1)}px`);
      section.style.setProperty("--news-header-opacity", headerOpacity.toFixed(3));

      // 2. Animación de scroll de las 4 tarjetas
      let completedCardsCount = 0;

      cardWindows.forEach(({ start, end, xOffset }, i) => {
        const startY = viewH * start;
        const endY = viewH * end;
        const currentProg = Math.min(
          Math.max((startY - sectionTop) / (startY - endY), 0),
          1,
        );
        cardsMaxProg[i] = Math.max(cardsMaxProg[i]!, currentProg);
        const prog = cardsMaxProg[i]!;

        if (prog >= 1) {
          completedCardsCount++;
        }

        const x = isMobile ? 0 : (1 - prog) * xOffset;
        const y = (1 - prog) * 55;
        const scale = 0.94 + 0.06 * prog;
        const opacity = Math.min(1, prog * 1.35);

        section.style.setProperty(`--news-card-${i}-x`, `${x.toFixed(1)}px`);
        section.style.setProperty(`--news-card-${i}-y`, `${y.toFixed(1)}px`);
        section.style.setProperty(`--news-card-${i}-scale`, scale.toFixed(3));
        section.style.setProperty(`--news-card-${i}-opacity`, opacity.toFixed(3));
      });

      if (headerMaxProg >= 1 && completedCardsCount === cardWindows.length) {
        allCompleted = true;
        section.style.setProperty("--news-header-y", "0px");
        section.style.setProperty("--news-header-opacity", "1");
        cardWindows.forEach((_, i) => {
          section.style.setProperty(`--news-card-${i}-x`, "0px");
          section.style.setProperty(`--news-card-${i}-y`, "0px");
          section.style.setProperty(`--news-card-${i}-scale`, "1");
          section.style.setProperty(`--news-card-${i}-opacity`, "1");
        });
        window.removeEventListener("scroll", onScroll);
      }

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
      id="noticias"
      ref={sectionRef}
      className="relative overflow-x-clip border-t border-line px-6 py-20 sm:px-10 lg:px-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={SECTION_WASH} />
      <EntranceVein color="var(--color-cyan)" />

      <div
        className="relative will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
        style={{
          transform: "translate3d(0, var(--news-header-y, 0px), 0)",
          opacity: "var(--news-header-opacity, 1)",
        }}
      >
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>
      </div>

      <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {NEWS_ITEMS.map((item, index) => {
          const color = CARD_COLORS[index % CARD_COLORS.length]!;

          return (
            <article
              key={item.id}
              className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-line/80 bg-gradient-to-b from-surface via-surface/95 to-surface/85 p-6 backdrop-blur-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-2 hover:border-paper/35 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] will-change-transform motion-reduce:transform-none motion-reduce:opacity-100"
              style={{
                transform: `translate3d(var(--news-card-${index}-x, 0px), var(--news-card-${index}-y, 0px), 0) scale(var(--news-card-${index}-scale, 1))`,
                opacity: `var(--news-card-${index}-opacity, 1)`,
              }}
            >
              {/* Resplandor ambiental de acento en hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ backgroundColor: color }}
              />

              {/* Vena superior con degradé al color mineral del card */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] opacity-40 transition-all duration-300 group-hover:h-[3px] group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                }}
              />

              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full motion-safe:animate-pulse"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    <span
                      className="font-mono text-[0.65rem] font-semibold tracking-[0.15em] uppercase"
                      style={{ color }}
                    >
                      {t(`items.${item.id}.tag`)}
                    </span>
                  </div>
                  <span className="font-mono text-[0.65rem] text-paper-dim/80">{item.date}</span>
                </div>

                <h3 className="font-display text-lg leading-snug font-medium text-paper transition-colors duration-200 group-hover:text-paper">
                  {t(`items.${item.id}.title`)}
                </h3>

                <p className="text-sm leading-relaxed text-paper-dim">{t(`items.${item.id}.excerpt`)}</p>
              </div>

              <div className="relative pt-2">
                <a
                  href={item.href}
                  target={isInternal(item.href) ? undefined : "_blank"}
                  rel={isInternal(item.href) ? undefined : "noopener noreferrer"}
                  className="group/link inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-paper/90 transition-colors duration-200 hover:text-accent"
                >
                  <span className="underline underline-offset-4 decoration-line transition-colors group-hover/link:decoration-accent">
                    {isInternal(item.href) ? t("readOnSite") : t("readOnSource", { source: item.source })}
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5"
                  >
                    {isInternal(item.href) ? "→" : "↗"}
                  </span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
