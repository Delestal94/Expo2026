"use client";

import { useEffect, useRef } from "react";

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

const PALETTE = ["#d98b3f", "#b4432e", "#c24d6b", "#7c5a9e", "#2e8f86", "#3bcdbf"];

function createBands(height: number): Band[] {
  return PALETTE.map((color, i) => ({
    baseY: height * (0.16 + i * 0.135),
    amplitude: 26 + i * 6,
    frequency: 0.0016 + i * 0.0003,
    speed: 0.00018 + i * 0.00004,
    phase: i * 1.7,
    width: 46 - i * 3,
    color,
    glow: 28,
  }));
}

/**
 * Fondo animado que evoca las bandas minerales del Cerro de los Siete
 * Colores (Quebrada de Humahuaca) — cinta a cinta, no un gradiente
 * estático. Se congela en el primer cuadro si el visitante prefiere
 * movimiento reducido.
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
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0a12";
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

    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(frame);
      } else if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
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
