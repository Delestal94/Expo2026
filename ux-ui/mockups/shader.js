/**
 * EXPOJUY 2026 — STRATA CANVAS ENGINE (IDÉNTICO A DEVELOP)
 * Replicación exacta 1:1 de src/modules/landing/ui/strata-canvas.tsx
 * 4 Bandas ondulantes tipo estrato con la paleta oficial (#2de3d6, #7c4dff, #b83fe0, #b9a6f5)
 */

(function () {
  function initStrataCanvas() {
    const canvas = document.getElementById('strata-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PALETTE = ["#2de3d6", "#7c4dff", "#b83fe0", "#b9a6f5"];

    function createBands(height) {
      return PALETTE.map((color, i) => ({
        baseY: height * (0.16 + i * 0.135),
        amplitude: 26 + i * 6,
        frequency: 0.0016 + i * 0.0003,
        speed: 0.00018 + i * 0.00004,
        phase: i * 1.7,
        width: 46 - i * 3,
        color: color,
        glow: 28,
      }));
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let bands = createBands(canvas.clientHeight || 520);
    let frame = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const clientW = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const clientH = canvas.parentElement ? canvas.parentElement.clientHeight : 520;
      canvas.width = clientW * dpr;
      canvas.height = clientH * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
      bands = createBands(clientH);
    }

    function draw(time) {
      if (!canvas || !ctx) return;
      const w = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const h = canvas.parentElement ? canvas.parentElement.clientHeight : 520;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0a12";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < bands.length; i++) {
        const band = bands[i];
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
      return;
    }

    frame = requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStrataCanvas);
  } else {
    initStrataCanvas();
  }
})();
