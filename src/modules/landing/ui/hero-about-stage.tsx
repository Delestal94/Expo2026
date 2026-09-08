"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { CtaLink } from "./cta-link";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { StrataCanvas } from "./strata-canvas";

/** Datos duros del evento: acompañan al titular, no compiten con los ejes. */
const STATS = [
  { key: "edition", value: "17ª", color: "var(--color-cyan)" },
  { key: "days", value: "4", color: "var(--color-violet)" },
  { key: "stands", value: "+200", color: "var(--color-magenta)" },
  { key: "dates", value: "9–12 OCT", color: "var(--color-lavender)" },
] as const;

/** Los cuatro ejes temáticos: cada uno es una línea de tipografía viva. */
const EJES = [
  { n: "01", key: "mineria", color: "var(--color-cyan)" },
  { n: "02", key: "comercio", color: "var(--color-violet)" },
  { n: "03", key: "corredor", color: "var(--color-magenta)" },
  { n: "04", key: "conocimiento", color: "var(--color-lavender)" },
] as const;

export function HeroAboutStage() {
  const tHero = useTranslations("Landing.Hero");
  const tAbout = useTranslations("Landing.About");
  const tEjes = useTranslations("Landing.Ejes");
  const stageRef = useRef<HTMLElement>(null);
  // Eje apuntado. Arranca en el primero para que la franja de abajo nunca
  // esté vacía y se entienda que las líneas responden.
  const [activeEje, setActiveEje] = useState<number | null>(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    let snapping = false;
    let snapTimeout = 0;
    let settleTimeout = 0;
    // Umbral mínimo de scroll real para disparar el snap: un toque de
    // rueda/trackpad alcanza, no hace falta agotar los 112vh del track.
    const TRIGGER_PROGRESS = 0.04;

    /**
     * Los tres actos se solapan y cubren el recorrido completo (0 → 0.92).
     *
     * Antes quedaban dos huecos grandes —de 0.38 a 0.58 y de 0.78 a 1.0—
     * heredados de un acto de traslación que se eliminó: el 42% del scroll
     * no animaba nada y el recorrido se sentía lento y a los tirones. Con
     * las ventanas encadenadas siempre hay algo en movimiento.
     */
    function apply(progress: number) {
      if (!stage) return;
      // ── ACTO 1: HERO ZOOM-THROUGH Y DESAPARICIÓN (0.00 → 0.32) ──
      const heroZoomProgress = Math.min(Math.max(progress / 0.32, 0), 1);
      const heroMidScale = 1 + heroZoomProgress * 1.8;
      const heroMidOpacity = Math.max(0, 1 - heroZoomProgress * 1.35);
      const heroMidBlur = heroZoomProgress * 8;

      const heroControlsOpacity = Math.max(0, 1 - heroZoomProgress * 2.0);
      const heroControlsY = heroZoomProgress * 30;

      // Las líneas ondulantes se mantienen activas y dejan que el canvas module su estilo tenue y elegante
      const strataOpacity = 1.0;

      stage.style.setProperty("--hero-mid-scale", heroMidScale.toFixed(3));
      stage.style.setProperty("--hero-mid-opacity", heroMidOpacity.toFixed(3));
      stage.style.setProperty("--hero-mid-blur", `${heroMidBlur.toFixed(1)}px`);
      stage.style.setProperty(
        "--hero-controls-opacity",
        heroControlsOpacity.toFixed(3),
      );
      stage.style.setProperty(
        "--hero-controls-y",
        `${heroControlsY.toFixed(1)}px`,
      );
      stage.style.setProperty(
        "--hero-pointer-events",
        heroControlsOpacity < 0.05 ? "none" : "auto",
      );
      stage.style.setProperty(
        "--strata-canvas-opacity",
        strataOpacity.toFixed(3),
      );

      // ── ACTO 2: APARECE EL BLOQUE "SOBRE" (0.22 → 0.58, solapado con el 1) ──
      const textAppearProgress = Math.min(
        Math.max((progress - 0.22) / 0.36, 0),
        1,
      );
      const textOpacity = textAppearProgress;
      const textScale = 0.94 + textAppearProgress * 0.06;
      const textBlur = (1 - textAppearProgress) * 5;

      stage.style.setProperty("--about-text-opacity", textOpacity.toFixed(3));
      stage.style.setProperty("--about-text-scale", textScale.toFixed(3));
      stage.style.setProperty("--about-text-blur", `${textBlur.toFixed(1)}px`);
      stage.style.setProperty(
        "--about-pointer-events",
        textOpacity > 0.05 ? "auto" : "none",
      );

      // ── ACTO 3: ENTRAN LOS EJES Y LOS DATOS (0.48 → 0.92) ──
      const barsProgress = Math.min(
        Math.max((progress - 0.48) / 0.44, 0),
        1,
      );
      const barsScale = barsProgress;
      const barsOpacity = Math.min(1, barsProgress * 2.0);

      stage.style.setProperty("--bars-scale", barsScale.toFixed(3));
      stage.style.setProperty("--bars-opacity", barsOpacity.toFixed(3));
    }

    // Último progreso REAL (derivado del scroll), para disparar el snap por
    // flanco —al cruzar el umbral— y no por nivel. Semillado con la
    // medición actual en vez de 0 fijo: es solo el valor de arranque, la
    // garantía real contra la carrera de layout está en `isFirstUpdate`
    // más abajo.
    let lastProgress = getProgress() ?? 0;
    let isFirstUpdate = true;

    /**
     * Completa el recorrido moviendo el scroll de verdad hasta el extremo
     * del track, en vez de animar solo las variables CSS.
     *
     * La versión anterior animaba las variables con su propio rAF y dejaba
     * la posición real de scroll donde estaba: el estado visual decía
     * "progreso 1" mientras el scroll real seguía en ~0.3. Como el flanco se
     * calcula contra `lastProgress`, el siguiente scroll leía
     * `0.3 < 0.96 && 1 >= 0.96` y disparaba el snap hacia atrás — de ahí el
     * rebote al hero al segundo scroll hacia abajo. Moviendo el scroll real,
     * lo visual y la posición nunca se separan y el bug no puede existir.
     */
    /** Progreso real 0→1 dentro de la pista, o null si todavía no aplica. */
    function getProgress(): number | null {
      if (!stage) return null;
      const rect = stage.getBoundingClientRect();
      const viewH = window.innerHeight || 800;
      const totalScroll = rect.height - viewH;
      if (totalScroll <= 0) return null;
      return Math.min(Math.max(-rect.top / totalScroll, 0), 1);
    }

    function snapTo(target: 0 | 1) {
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const viewH = window.innerHeight || 800;
      const totalScroll = rect.height - viewH;
      if (totalScroll <= 0) return;

      const sectionTop = window.scrollY + rect.top;
      snapping = true;
      window.clearTimeout(snapTimeout);
      window.scrollTo({
        top: sectionTop + target * totalScroll,
        behavior: "smooth",
      });
      // El scroll suave no avisa cuándo terminó: liberamos el bloqueo cuando
      // ya no puede seguir en curso, y verificamos que efectivamente haya
      // llegado a un extremo (el usuario pudo haberlo interrumpido).
      snapTimeout = window.setTimeout(() => {
        snapping = false;
        settle();
      }, 700);
    }

    /**
     * Red de contención: al dejar de scrollear, si el recorrido quedó a
     * mitad de camino lo lleva al extremo más cercano.
     *
     * El disparo por flanco solo se cumple viniendo de un extremo
     * (`lastProgress` ≤ 0.04 o ≥ 0.96). Scrolleando muy despacio, el propio
     * scroll del usuario interrumpe el `scrollTo` suave y el recorrido queda
     * parado en el medio: desde ahí ninguna de las dos condiciones puede
     * volver a cumplirse nunca y la animación se congela a mitad. Esto lo
     * resuelve mirando dónde quedó, sin depender de por dónde pasó.
     */
    function settle() {
      if (snapping) return;
      const progress = getProgress();
      if (progress === null) return;
      if (progress <= TRIGGER_PROGRESS || progress >= 1 - TRIGGER_PROGRESS) return;
      snapTo(progress < 0.5 ? 0 : 1);
    }

    function update() {
      const progress = getProgress();
      if (progress === null) {
        ticking = false;
        return;
      }

      apply(progress);

      // La primera medición útil nunca evalúa flancos, sin importar cuándo
      // llegue.
      //
      // La seed de `lastProgress` de más arriba ayuda, pero no alcanza: si
      // en el instante exacto de la seed el layout todavía no había
      // terminado de asentarse (fuentes, imágenes), `getProgress()` podía
      // devolver `null` y la seed caía de nuevo a 0 — reproduciendo el bug
      // original en cuanto llegaba la primera medición real. Este flag saca
      // la corrección de la carrera: pase lo que pase antes, la primera vez
      // que `update()` logra leer un progreso válido, ese valor se toma
      // como punto de partida y nunca como "cruce".
      if (isFirstUpdate) {
        isFirstUpdate = false;
        lastProgress = progress;
        ticking = false;
        return;
      }

      // Mientras el snap está en curso no se evalúan flancos: si no, el
      // propio scroll suave se dispararía a sí mismo.
      if (!snapping) {
        const crossedForward =
          progress > TRIGGER_PROGRESS && lastProgress <= TRIGGER_PROGRESS;
        const crossedBackward =
          progress < 1 - TRIGGER_PROGRESS && lastProgress >= 1 - TRIGGER_PROGRESS;

        if (crossedForward) {
          snapTo(1);
        } else if (crossedBackward) {
          snapTo(0);
        }
      }

      lastProgress = progress;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
      // Cada scroll reinicia la cuenta: `settle` corre recién cuando el
      // visitante suelta, no durante el gesto.
      if (!snapping) {
        window.clearTimeout(settleTimeout);
        settleTimeout = window.setTimeout(settle, 140);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(snapTimeout);
      window.clearTimeout(settleTimeout);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="relative h-auto overflow-x-clip motion-safe:h-[112vh]"
    >
      {/* Puntos de anclaje para navegación oficial (#inicio y #sobre) */}
      <div
        id="inicio"
        className="pointer-events-none absolute top-0 left-0 h-screen w-full"
      />
      <div
        id="sobre"
        className="pointer-events-none absolute motion-safe:top-[69vh] top-0 bottom-0 left-0 w-full scroll-mt-0"
      />

      {/* Viewport fijo durante el recorrido scrollytelling */}
      {/* `bg-ink` no es decorativo: `position: sticky` crea un contexto de
          apilamiento, así que el `mix-blend-mode: screen` del canvas queda
          aislado acá adentro y no alcanza el fondo del body. Sin un color
          pintado en este contenedor, el canvas mezcla contra transparente y
          su relleno negro se ve negro. Con el color de página explícito,
          screen se comporta como identidad y solo las bandas suman luz. */}
      <div className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-6 pt-8 pb-10 sm:px-10 lg:px-16 motion-safe:sticky motion-safe:top-0 motion-safe:h-screen">
        {/* Fondo animado de estratos a todo el ancho (apertura de cañón con el scroll) */}
        <StrataCanvas />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/5 to-ink/30"
        />

        {/* ══════════════════════════════════════════════════════════
            CAPA 1: ELEMENTOS HERO (Desaparecen con zoom al centro)
            ══════════════════════════════════════════════════════════ */}

        {/* Navegación superior del Hero */}
        <nav
          className="motion-entrance relative z-20 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase will-change-transform motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_backwards]"
          style={{
            opacity: "var(--hero-controls-opacity, 1)",
            transform: "translate3d(0, calc(-1 * var(--hero-controls-y, 0px)), 0)",
            pointerEvents: "var(--hero-pointer-events, auto)" as React.CSSProperties["pointerEvents"],
          }}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/logos/expojuy-mark.svg"
              alt=""
              width={20}
              height={28}
              className="h-7 w-auto"
            />
            <span>{tHero("eyebrow")}</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-4">
            <span className="hidden sm:inline">{tHero("edition")}</span>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Bloque central Hero (Zoom hacia la cámara al scrollear) */}
        <div
          className="motion-entrance pointer-events-none relative z-10 my-auto flex flex-col gap-8 will-change-transform drop-shadow-[0_2px_16px_rgba(7,11,25,0.95)]"
          style={{
            transform: "scale(var(--hero-mid-scale, 1))",
            opacity: "var(--hero-mid-opacity, 1)",
            filter: "blur(var(--hero-mid-blur, 0px))",
          }}
        >
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase drop-shadow-[0_1px_6px_rgba(7,11,25,0.9)] motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.08s_backwards]">
            {tHero("tagline")}
          </span>
          <h1 className="motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.16s_backwards]">
            <Image
              src="/images/logos/expojuy-wordmark-dark.svg"
              alt={tHero("titleAlt")}
              width={1000}
              height={305}
              priority
              className="h-auto w-full max-w-205 drop-shadow-[0_2px_12px_rgba(7,11,25,0.8)]"
            />
          </h1>
          <p className="max-w-xl text-balance font-body text-lg text-paper sm:text-xl drop-shadow-[0_1px_8px_rgba(7,11,25,0.9)] motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.38s_backwards]">
            {tHero("description")}
          </p>
        </div>

        {/* Bloque inferior Hero (Countdown y CTAs) */}
        <div
          className="motion-entrance relative z-20 flex flex-col gap-8 will-change-transform sm:flex-row sm:items-end sm:justify-between motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.48s_backwards]"
          style={{
            opacity: "var(--hero-controls-opacity, 1)",
            transform: "translate3d(0, var(--hero-controls-y, 0px), 0)",
            pointerEvents: "var(--hero-pointer-events, auto)" as React.CSSProperties["pointerEvents"],
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
                {tHero("ctaAttend")}
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
              {tHero("ctaProviders")}
            </CtaLink>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CAPA 2: ELEMENTOS ABOUT — tipografía cinética en dos columnas.
            Los ejes no viven en tarjetas: son cuatro líneas de texto
            enorme, sin fondo ni borde. La activa se estira (tracking),
            toma su color y arrastra una regla que crece bajo ella.

            El reparto en dos columnas es lo que mantiene todo legible:
            apilado en una sola, la suma de alturas desbordaba el viewport
            y el `overflow-hidden` del contenedor recortaba el final. Los
            tamaños se atan con min(vw, vh) para que en pantallas bajas
            encojan por alto y no solo por ancho.
            ══════════════════════════════════════════════════════════ */}
        {/* Con movimiento reducido no hay recorrido que revele este bloque:
            las variables se quedan en su valor inicial (0) y el contenido
            quedaba INVISIBLE — el relato, los datos y los cuatro ejes
            desaparecían. `.motion-entrance` (globals.css) fuerza el estado
            final, y `motion-safe:absolute` lo saca de la superposición sobre
            el hero para que caiga en el flujo, debajo, donde se puede leer. */}
        <div
          className="motion-entrance pointer-events-none z-30 flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:relative motion-reduce:mt-12 px-6 py-6 sm:px-10 lg:px-12 xl:px-16"
          style={{
            opacity: "var(--about-text-opacity, 0)",
            pointerEvents: "var(--about-pointer-events, none)" as React.CSSProperties["pointerEvents"],
          }}
        >
          <div
            className="motion-entrance pointer-events-auto grid w-full gap-6 will-change-transform lg:grid-cols-12 lg:items-center lg:gap-12"
            style={{
              transform: "scale(var(--about-text-scale, 1))",
              filter: "blur(var(--about-text-blur, 0px))",
            }}
          >
            {/* ── Columna izquierda: el relato y los datos duros ── */}
            <div className="lg:col-span-4">
              {/* El bloque se quedó sin encabezado al fusionar Ejes acá
                  adentro: quien navega por headings saltaba del h1 del hero
                  directo a Noticias y "Sobre" no existía para él. Va oculto
                  porque el titular visual de la sección es el propio relato,
                  no un rótulo. */}
              <h2 className="sr-only">{tAbout("title")}</h2>
              <p className="font-ambit font-semibold leading-[1.15] tracking-tight text-paper text-[clamp(1rem,min(1.9vw,3.2vh),1.6rem)]">
                {tAbout("descriptionIntro")}
              </p>

              <p className="mt-1 font-ambit font-bold leading-[0.92] tracking-tight text-accent drop-shadow-[0_0_45px_rgba(45,227,214,0.45)] text-[clamp(2rem,min(4.6vw,9vh),5.5rem)]">
                {tAbout("descriptionEmphasis")}
              </p>

              <p className="mt-3 max-w-lg font-ambit leading-snug font-normal text-paper-dim text-[clamp(0.75rem,min(1.25vw,2.2vh),1.05rem)]">
                {tAbout("descriptionOutro")}
              </p>

              <dl
                className="motion-entrance mt-5 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-4 will-change-transform"
                style={{
                  opacity: "var(--bars-opacity, 0)",
                  transform: "translateY(calc((1 - var(--bars-scale, 0)) * 14px))",
                }}
              >
                {STATS.map((stat) => (
                  <div key={stat.key} className="flex flex-col">
                    <dd
                      className="font-ambit font-bold tabular-nums leading-none tracking-tight text-[clamp(1.1rem,min(2vw,3.4vh),1.9rem)]"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </dd>
                    <dt className="mt-1 max-w-32 font-mono uppercase leading-tight tracking-[0.12em] text-paper-dim text-[clamp(0.5rem,min(0.75vw,1.25vh),0.72rem)]">
                      {tAbout(`stats.${stat.key}`)}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* ── Columna derecha: los cuatro ejes en tipografía cinética ── */}
            <div
              className="motion-entrance will-change-transform lg:col-span-8"
              style={{
                opacity: "var(--bars-opacity, 0)",
                transform: "translateY(calc((1 - var(--bars-scale, 0)) * 18px))",
              }}
            >
              <p className="mb-3 font-mono uppercase tracking-[0.25em] text-paper-dim text-[clamp(0.55rem,min(0.8vw,1.35vh),0.78rem)]">
                {tEjes("eyebrow")}
              </p>

              {EJES.map((eje, i) => {
                const isActive = activeEje === i;
                return (
                  <button
                    key={eje.n}
                    type="button"
                    aria-expanded={isActive}
                    onMouseEnter={() => setActiveEje(i)}
                    onFocus={() => setActiveEje(i)}
                    onClick={() => setActiveEje(i)}
                    className="group block w-full cursor-pointer border-0 bg-transparent py-1.5 text-left"
                  >
                    <span className="flex items-baseline gap-3 sm:gap-5">
                      <span
                        className="shrink-0 font-mono tabular-nums tracking-[0.2em] transition-colors duration-500 text-[clamp(0.55rem,min(0.9vw,1.5vh),0.85rem)]"
                        style={{ color: isActive ? eje.color : "var(--color-paper-dim)" }}
                      >
                        {eje.n}
                      </span>
                      <span
                        className="block font-ambit font-bold uppercase leading-[1.02] transition-[letter-spacing,color,opacity] duration-500 ease-out motion-reduce:transition-none text-[clamp(1.2rem,min(3.7vw,6.6vh),3.5rem)]"
                        style={{
                          color: isActive ? eje.color : "var(--color-paper)",
                          opacity: isActive ? 1 : 0.4,
                          letterSpacing: isActive ? "0.03em" : "-0.02em",
                        }}
                      >
                        {tEjes(`items.${eje.key}.title`)}
                      </span>
                    </span>

                    {/* Regla que se dibuja bajo la línea activa */}
                    <span
                      aria-hidden="true"
                      className="mt-0.5 block h-px origin-left transition-transform duration-500 ease-out motion-reduce:transition-none"
                      style={{
                        backgroundColor: eje.color,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </button>
                );
              })}

              {/* Descripción del eje activo: alto reservado para que
                  cambiar de eje no mueva nunca las líneas de arriba. */}
              <p
                className="mt-4 max-w-3xl border-l-2 pl-4 leading-relaxed text-paper-dim transition-colors duration-500 text-[clamp(0.8rem,min(1.3vw,2.2vh),1.1rem)]"
                style={{
                  borderColor: activeEje === null ? "var(--color-line)" : EJES[activeEje].color,
                  minHeight: "4.5em",
                }}
              >
                {activeEje === null
                  ? tEjes("eyebrow")
                  : tEjes(`items.${EJES[activeEje].key}.description`)}
              </p>

              {/* Las otras 3 descripciones solo existen en el DOM cuando su
                  eje está activo — server-side siempre es el primero. Un
                  lector de pantalla o un motor que extrae texto plano (no
                  ejecuta hover/click) nunca ve las otras tres. Este bloque
                  las deja siempre presentes y accesibles, sin duplicar lo
                  visible: la interacción de arriba sigue igual. */}
              <dl className="sr-only">
                {EJES.map((eje) => (
                  <div key={eje.n}>
                    <dt>{tEjes(`items.${eje.key}.title`)}</dt>
                    <dd>{tEjes(`items.${eje.key}.description`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
