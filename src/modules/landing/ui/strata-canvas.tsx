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
  divergenceDir: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  speedY: number;
  pulseSpeed: number;
}

const PALETTE = ["#2de3d6", "#7c4dff", "#b83fe0", "#b9a6f5"];

function createBands(height: number): Band[] {
  return [
    {
      baseY: height * 0.18,
      amplitude: 30,
      frequency: 0.0016,
      speed: 0.00034,
      phase: 0.2,
      width: 44,
      color: "#2de3d6",
      glow: 32,
      divergenceDir: -1.4,
    },
    {
      baseY: height * 0.32,
      amplitude: 36,
      frequency: 0.0014,
      speed: 0.00028,
      phase: 1.8,
      width: 40,
      color: "#7c4dff",
      glow: 28,
      divergenceDir: -0.7,
    },
    {
      baseY: height * 0.46,
      amplitude: 40,
      frequency: 0.0013,
      speed: 0.00025,
      phase: 3.4,
      width: 38,
      color: "#b83fe0",
      glow: 26,
      divergenceDir: 0.7,
    },
    {
      baseY: height * 0.60,
      amplitude: 46,
      frequency: 0.0011,
      speed: 0.00022,
      phase: 4.9,
      width: 34,
      color: "#b9a6f5",
      glow: 24,
      divergenceDir: 1.4,
    },
  ];
}

function createParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1.2,
      color: PALETTE[i % PALETTE.length],
      alpha: Math.random() * 0.5 + 0.25,
      speedY: (Math.random() - 0.5) * 0.25,
      pulseSpeed: Math.random() * 0.003 + 0.001,
    });
  }
  return particles;
}

/**
 * Fondo animado de estratos geológicos de alta fidelidad:
 * - Abarca el 100% del ancho de la pantalla sin cortes laterales.
 * - Flujo continuo, fluido y visible en tiempo real.
 * - Divergencia reactiva al scroll que abre el espacio central.
 * - Partículas de energía/litio en suspensión.
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
    let particles = createParticles(45, canvas.clientWidth, canvas.clientHeight);
    let frame = 0;
    let raf = 0;

    let mouseTargetY = 0;
    let mouseCurrentY = 0;

    function handleMouseMove(e: MouseEvent) {
      const h = window.innerHeight || 1;
      mouseTargetY = (e.clientY / h - 0.5) * 35;
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
      bands = createBands(canvas.clientHeight);
      particles = createParticles(45, canvas.clientWidth, canvas.clientHeight);
    }

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#07060d";
      ctx.fillRect(0, 0, w, h);

      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.05;

      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const scrollProgress = Math.min(Math.max(scrollY / Math.max(h * 1.5, 1), 0), 1);

      // 1. Partículas flotantes de litio / energía (siempre visibles, tenues y orgánicas)
      for (const p of particles) {
        p.y += p.speedY;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const pulse = Math.sin(time * p.pulseSpeed + p.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Tenue y sutil para no generar alboroto, manteniendo el resplandor de fondo
        ctx.globalAlpha = p.alpha * pulse * Math.max(0.32, 0.65 - scrollProgress * 0.25);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      // 2. Bandas ondulantes de estratos (transición fluida de audaz a tenue en la sección de barras)
      for (let i = 0; i < bands.length; i++) {
        const band = bands[i];

        // Divergencia suave para abrir el centro sin expulsar las líneas de la pantalla
        const divergence = band.divergenceDir * h * scrollProgress * 0.08;
        const currentBaseY = band.baseY + divergence + mouseCurrentY * (0.3 + i * 0.1);

        // Desplazamiento de fase según scroll para dar dinamismo continuo
        const shearDir = i % 2 === 0 ? 1 : -1.2;
        const scrollPhase = scrollY * 0.0018 * shearDir;

        // Amplitud viva y natural
        const currentAmp = band.amplitude * (1 + scrollProgress * 0.2);

        ctx.beginPath();

        // Se dibuja de extremo a extremo sin cortes
        for (let x = -30; x <= w + 30; x += 10) {
          const y =
            currentBaseY +
            Math.sin(x * band.frequency + time * band.speed + band.phase + scrollPhase) *
              currentAmp +
            Math.cos(x * band.frequency * 0.5 + time * band.speed * 0.7) *
              (currentAmp * 0.25);

          if (x === -30) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = band.color;
        // En hero son bandas con presencia; al scrollear a barras se vuelven líneas finas, tenues y elegantes (3px a 5px)
        const targetWidth = Math.max(2.5, band.width * (1 - scrollProgress * 0.82));
        ctx.lineWidth = targetWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Opacidad tenue en barras (0.28 a 0.35) para acompañar sin competir con el texto ni las barras
        const alpha = Math.max(0.28, 0.7 - scrollProgress * 0.38);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = band.color;
        ctx.shadowBlur = Math.max(8, band.glow * (1 - scrollProgress * 0.5));
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
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (prefersReducedMotion) {
      draw(0);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

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
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen transition-opacity duration-300 motion-reduce:transition-none will-change-transform"
      style={{
        opacity: "var(--strata-canvas-opacity, 0.8)",
      }}
    />
  );
}
