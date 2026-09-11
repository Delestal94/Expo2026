"use client";

import { useEffect, useRef } from "react";
import { getCurrentTheme, THEME_CHANGE_EVENT, type Theme } from "@/lib/ui/theme";

/**
 * Relleno de fondo del canvas. NO es el color que se ve: es el elemento
 * neutro del modo de fusión, elegido para que el canvas no altere el color
 * de la página y solo aporten luz las bandas.
 *
 * Con `screen`, ese neutro es el negro — `screen(0, x) = x` — así que el
 * fondo del hero termina siendo exactamente `--color-ink`, igual que el
 * resto del sitio. Cualquier otro valor aclara: el relleno estuvo en
 * #2b2456 y por eso el hero se veía más claro que la página, y subir
 * `--color-ink` no cerraba la brecha (screen aclara más cuanto más claro es
 * lo que tiene detrás, así que el hero subía a la par).
 *
 * En claro el modo es `multiply` y su neutro es el blanco, por el mismo
 * motivo invertido.
 */
const BG_FILL: Record<Theme, string> = {
  dark: "#000000",
  light: "#ffffff",
};

// "screen" aclara — funciona porque las bandas son más claras que el
// fondo oscuro. Sobre un fondo casi blanco, screen contra un color
// licúa casi todo a blanco (screen con blanco da blanco): las bandas
// prácticamente desaparecían en tema claro. "multiply" oscurece en vez
// de aclarar, así que sobre un fondo claro las bandas siguen leyéndose
// como cinta de color en vez de casi desaparecer.
const BLEND_MODE: Record<Theme, string> = {
  dark: "screen",
  light: "multiply",
};

interface Band {
  baseY: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  width: number;
  color: string;
  glow: number;
}

const PALETTE = ["#2de3d6", "#7c4dff", "#b83fe0", "#b9a6f5"];

/**
 * Pasadas concéntricas con las que se reconstruye la caída del halo, y
 * opacidad de cada una.
 *
 * Al pintarse una sobre otra, el centro acumula las cinco y el filo recibe
 * una sola: la opacidad resultante va de LAYER_ALPHA en el borde a
 * 1-(1-LAYER_ALPHA)^GLOW_LAYERS en el núcleo. Con 0.129 y 5 capas eso da
 * ~0.13 afuera y ~0.50 adentro, que es el mismo núcleo que tenía el trazo
 * original con `shadowBlur`, pero llegando por una rampa en vez de por un
 * escalón.
 *
 * Diez es el punto de equilibrio: con menos se notan los anillos de la
 * aproximación (cada capa es un escalón de opacidad, y con pocas capas el
 * ojo distingue el escalón como un anillo duro), y cada capa extra es otro
 * stroke del path por banda y por frame.
 */
const GLOW_LAYERS = 10;
const LAYER_ALPHA = 0.1;

function createBands(height: number): Band[] {
  return PALETTE.map((color, i) => ({
    baseY: height * (0.16 + i * 0.135),
    amplitude: 26 + i * 6,
    frequency: 0.0016 + i * 0.0003,
    speed: 0.00018 + i * 0.00004,
    phase: i * 1.7,
    width: 46 - i * 3,
    color,
    // Ancho EXTRA que alcanza el halo por fuera del núcleo, no un radio de
    // blur. Estuvo en 26 y la banda se veía borrosa: sobre un núcleo de
    // 34-46px, un halo de 26 es tanta superficie difusa como banda nítida.
    glow: 18,
  }));
}

/**
 * Fondo animado con la paleta oficial de marca (coherente con el
 * isotipo de Instagram) en bandas tipo estrato — cinta a cinta, no un
 * gradiente estático. Se congela en el primer cuadro si el visitante
 * prefiere movimiento reducido.
 */
export function StrataCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let bands = createBands(canvas.clientHeight);
    // Un solo handle para todo el sistema. Antes había dos (`frame` para el
    // que encolaba el propio draw, `raf` para el que encolaba el
    // IntersectionObserver): al reentrar en pantalla se podía dejar vivo un
    // bucle viejo y quedaban dos draws compitiendo por el mismo canvas.
    let raf = 0;
    let running = false;
    // -Infinity, no 0: el cap de 30fps compara `time - lastDraw`, y con
    // lastDraw en 0 el primer `draw(0)` del modo movimiento-reducido caía en
    // el early-return del throttle y el canvas quedaba en blanco para siempre.
    let lastDraw = Number.NEGATIVE_INFINITY;
    let bgFill = BG_FILL[getCurrentTheme()];

    function applyBlendMode(theme: Theme) {
      if (canvas) canvas.style.mixBlendMode = BLEND_MODE[theme];
    }
    applyBlendMode(getCurrentTheme());

    function handleThemeChange(event: Event) {
      const theme = (event as CustomEvent<Theme>).detail ?? getCurrentTheme();
      bgFill = BG_FILL[theme];
      applyBlendMode(theme);
      // Con movimiento reducido no hay bucle que repinte solo: hay que
      // forzar un cuadro, salteando el cap de 30fps.
      if (prefersReducedMotion) {
        lastDraw = Number.NEGATIVE_INFINITY;
        draw(0);
      }
    }
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    // El desplazamiento de las bandas es tan lento (speed ~0.0002 rad/ms)
    // que redibujar a 60fps es imperceptible frente a 30fps — pero cuesta
    // el doble de tiempo de main thread. shadowBlur es, de por sí, una de
    // las operaciones más caras de Canvas2D; a la mitad de los frames, la
    // mitad del costo (issues #36 y #80: TBT 940ms/1480ms medidos a 60fps).
    const FRAME_INTERVAL_MS = 1000 / 30;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
      bands = createBands(canvas.clientHeight);
      // Asignar canvas.width limpia el bitmap. Con el bucle corriendo el
      // próximo frame lo repinta solo; con movimiento reducido no hay
      // próximo frame, así que el canvas quedaría vacío tras un resize.
      if (prefersReducedMotion) {
        lastDraw = Number.NEGATIVE_INFINITY;
        draw(0);
      }
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;

      if (time - lastDraw < FRAME_INTERVAL_MS) {
        if (running) raf = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const band of bands) {
        // Un solo path por banda, estampado en varias pasadas concéntricas
        // que van de la más ancha a la más angosta.
        //
        // `shadowBlur` daría el mismo halo de una, pero es una convolución
        // por software en cada frame y este proyecto ya pagó 940ms y 1480ms
        // de TBT por eso (issues #36 y #80). El problema es que sustituirlo
        // por UN trazo ancho de opacidad plana deja dos cantos duros: uno
        // donde corta el halo y otro donde arranca el núcleo, y la banda
        // queda con un contorno que el gaussiano no tenía.
        //
        // Con varias pasadas de alfa bajo, cada zona recibe tantas capas
        // como profundidad tenga: el centro las acumula todas y el borde
        // recibe una sola, así que la opacidad cae de forma escalonada en
        // vez de cortarse de golpe. Es la caída del blur reconstruida a
        // fuerza de composición, que es barata, en vez de convolución.
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y =
            band.baseY +
            Math.sin(x * band.frequency + time * band.speed + band.phase) *
              band.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = band.color;
        ctx.globalAlpha = LAYER_ALPHA;

        for (let layer = GLOW_LAYERS - 1; layer >= 0; layer--) {
          // t = 1 en la pasada más ancha (el filo del halo), 0 en el núcleo.
          // Va al cuadrado para que las capas se apiñen cerca del núcleo:
          // repartidas de forma pareja, la luz queda esparcida en un halo
          // ancho y uniforme que se lee como desenfoque. Un gaussiano
          // concentra casi todo el brillo junto al centro y cae rápido, y
          // eso es lo que reproduce la curva.
          const t = layer / (GLOW_LAYERS - 1);
          ctx.lineWidth = band.width + band.glow * t * t;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      if (running) {
        raf = requestAnimationFrame(draw);
      }
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      draw(0);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      };
    }

    // El canvas sigue montado (y su rAF seguiría corriendo) mucho después
    // de que el visitante scrollea más allá del hero — sin esto anima
    // para siempre fuera de pantalla, quemando CPU sin que nadie lo vea.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stop();
    });
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      observer.disconnect();
      stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // La opacidad la manda el hero por variable. Estuvo fija en 0.70 y la
      // variable quedó escribiéndose sin que nadie la leyera: el canvas
      // ignoraba al hero y el fondo se veía más apagado de lo pedido.
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: "var(--strata-canvas-opacity, 0.85)" }}
    />
  );
}
