/**
 * EXPOJUY 2026 — FLUID STRATA SHADER ENGINE (WEBGL)
 * 4 Glowing Brand Mineral Strata Ribbons calibrated behind the Header Title:
 * 1. Cyan (#2de3d6)
 * 2. Violet (#7c3aed)
 * 3. Magenta (#d946ef)
 * 4. Lavender (#c4b5fd)
 */

(function () {
  function initStrataShader() {
    const canvas = document.getElementById('strata-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false }) || 
               canvas.getContext('experimental-webgl', { alpha: true, antialias: true, premultipliedAlpha: false });

    if (!gl) {
      console.warn('[ExpoJuy 2026] WebGL not supported.');
      return;
    }

    function syncSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : 560;
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }
    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Official Brand Colors from develop
      const vec3 colorCyan      = vec3(0.176, 0.890, 0.839); // #2de3d6
      const vec3 colorViolet    = vec3(0.486, 0.227, 0.929); // #7c3aed
      const vec3 colorMagenta   = vec3(0.851, 0.275, 0.937); // #d946ef
      const vec3 colorLavender  = vec3(0.769, 0.710, 0.992); // #c4b5fd

      void main() {
        vec2 uv = v_texCoord;
        float t = u_time * 0.18;

        // Smooth flowing harmonic waves
        float w1 = sin(uv.x * 2.2 + t * 0.75) * 0.070;
        float w2 = cos(uv.x * 3.6 - t * 0.55 + 1.2) * 0.038;
        float w3 = sin(uv.x * 5.2 + t * 0.35 + 2.1) * 0.022;
        float displacement = w1 + w2 + w3;

        // Position ribbons right behind the "EXPOJUY 2026" title (framing the letters)
        float y = uv.y + displacement;

        // 4 Ribbon Centerlines calibrated to frame EXPOJUY 2026
        float c1 = 0.76; // Cyan (top of title)
        float c2 = 0.69; // Violet (upper-mid title)
        float c3 = 0.62; // Magenta (lower-mid title)
        float c4 = 0.55; // Lavender (baseline of title, above subtitle)

        float thickness = 0.024;

        float d1 = abs(y - c1);
        float d2 = abs(y - c2);
        float d3 = abs(y - c3);
        float d4 = abs(y - c4);

        // Core ribbon intensities
        float core1 = smoothstep(thickness, 0.0, d1);
        float core2 = smoothstep(thickness, 0.0, d2);
        float core3 = smoothstep(thickness, 0.0, d3);
        float core4 = smoothstep(thickness, 0.0, d4);

        // Luminous glowing falloffs
        float glow1 = exp(-d1 * 22.0) * 0.75;
        float glow2 = exp(-d2 * 20.0) * 0.75;
        float glow3 = exp(-d3 * 20.0) * 0.75;
        float glow4 = exp(-d4 * 22.0) * 0.70;

        // Additive glowing colors
        vec3 ribbonColor = vec3(0.0);
        ribbonColor += colorCyan * (core1 * 0.95 + glow1 * 0.70);
        ribbonColor += colorViolet * (core2 * 0.95 + glow2 * 0.70);
        ribbonColor += colorMagenta * (core3 * 0.95 + glow3 * 0.70);
        ribbonColor += colorLavender * (core4 * 0.90 + glow4 * 0.65);

        // Vertical fade so it gracefully vanishes near top and bottom
        float bottomFade = smoothstep(0.18, 0.38, uv.y);
        float topFade = smoothstep(0.98, 0.88, uv.y);
        float mask = bottomFade * topFade;

        float alpha = clamp((core1 + core2 + core3 + core4 + glow1 + glow2 + glow3 + glow4) * 1.15, 0.0, 1.0) * mask;

        gl_FragColor = vec4(ribbonColor * mask, alpha);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[Shader Error]', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[Program Link Error]', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    let startTime = performance.now();

    function render() {
      syncSize();
      const elapsed = (performance.now() - startTime) * 0.001;
      
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStrataShader);
  } else {
    initStrataShader();
  }
})();
