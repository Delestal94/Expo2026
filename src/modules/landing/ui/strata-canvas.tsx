"use client";

import { useEffect, useRef } from "react";
import { getCurrentTheme, THEME_CHANGE_EVENT, type Theme } from "@/lib/ui/theme";

// Mismos tonos que --color-ink en cada tema (ver globals.css) — el canvas
// no puede leer variables CSS directamente en fillStyle, así que se
// duplican acá. En tema claro, mix-blend-screen sobre un fondo casi
// blanco licúa casi todo el neón de las bandas (screen con blanco da
// blanco) — es un efecto más apagado a propósito, no un bug: recrear el
// glow completo en claro pediría cambiar el blend mode y repensar la
// pieza, y la alternativa (mantener el fondo oscuro bajo un tema claro)
// se ve rota, no "sutil".
const BG_FILL: Record<Theme, string> = {
  dark: "#0b0a12",
  light: "#f5f1e8",
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

function createBands(height: number): Band[] {
  return PALETTE.map((color, i) => ({
    baseY: height * (0.16 + i * 0.135),
    amplitude: 26 + i * 6,
    frequency: 0.0016 + i * 0.0003,
    speed: 0.00018 + i * 0.00004,
    phase: i * 1.7,
    width: 46 - i * 3,
    color,
    // Bajado de 28 a 18: shadowBlur es la operación más cara de este loop,
    // y a este radio el glow sigue siendo visible (issues #36, #80).
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
    let frame = 0;
    let raf = 0;
    let lastDraw = 0;
    let bgFill = BG_FILL[getCurrentTheme()];

    function handleThemeChange(event: Event) {
      const detail = (event as CustomEvent<Theme>).detail;
      bgFill = BG_FILL[detail ?? getCurrentTheme()];
      if (prefersReducedMotion) draw(lastDraw);
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
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;

      if (time - lastDraw < FRAME_INTERVAL_MS) {
        if (!prefersReducedMotion) frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, w, h);

      for (const band of bands) {
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
        ctx.lineWidth = band.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = 0.5;
        ctx.shadowColor = band.color;
        ctx.shadowBlur = band.glow;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (!prefersReducedMotion) {
        frame = requestAnimationFrame(draw);
      }
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
      if (entry.isIntersecting) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      observer.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full opacity-70 mix-blend-screen"
    />
  );
}
