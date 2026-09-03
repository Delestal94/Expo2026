/**
 * EXPOJUY 2026 — MASTER WEBGL STRATA SHADER ENGINE
 * 5 Mineral Wave Ribbons (Ochre, Terracotta, Rose, Violet, Teal)
 * Metáfora geológica del Cerro de los Siete Colores y salmuera de litio.
 */

(function () {
  function initStrataShader() {
    const canvas = document.getElementById('strata-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true }) || 
               canvas.getContext('experimental-webgl', { alpha: true, antialias: true });

    if (!gl) {
      console.warn('[ExpoJuy 2026] WebGL not supported, falling back to CSS background.');
      return;
    }

    function syncSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = canvas.parentElement ? canvas.parentElement.clientHeight : 520;
      
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
        gl.Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      // Mineral strata colors (Cerro de los Siete Colores & Litio)
      const vec3 colorOchre      = vec3(0.851, 0.545, 0.247); // #d98b3f
      const vec3 colorTerracotta = vec3(0.706, 0.263, 0.180); // #b4432e
      const vec3 colorRose       = vec3(0.761, 0.302, 0.420); // #c24d6b
      const vec3 colorViolet     = vec3(0.486, 0.353, 0.620); // #7c5a9e
      const vec3 colorTeal       = vec3(0.180, 0.561, 0.525); // #2e8f86
      const vec3 colorInk        = vec3(0.043, 0.039, 0.071); // #0b0a12

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = v_texCoord;
        float t = u_time * 0.15;

        // Smooth wave undulating curves
        float wave1 = sin(uv.x * 2.8 + t * 0.8) * 0.06;
        float wave2 = cos(uv.x * 3.6 - t * 0.6) * 0.04;
        float n = (noise(vec2(uv.x * 3.0 + t * 0.2, uv.y * 1.5)) - 0.5) * 0.05;

        float yBase = uv.y + wave1 + wave2 + n;
        
        // Vertical positioning of ribbons across upper header
        float bandCenter = 0.50;
        float bandThickness = 0.026;
        float spacing = 0.052;

        // 5 Ribbons
        float r1 = smoothstep(bandCenter + spacing * 2.0 - bandThickness, bandCenter + spacing * 2.0, yBase) *
                   (1.0 - smoothstep(bandCenter + spacing * 2.0, bandCenter + spacing * 2.0 + bandThickness, yBase));

        float r2 = smoothstep(bandCenter + spacing * 1.0 - bandThickness, bandCenter + spacing * 1.0, yBase) *
                   (1.0 - smoothstep(bandCenter + spacing * 1.0, bandCenter + spacing * 1.0 + bandThickness, yBase));

        float r3 = smoothstep(bandCenter - bandThickness, bandCenter, yBase) *
                   (1.0 - smoothstep(bandCenter, bandCenter + bandThickness, yBase));

        float r4 = smoothstep(bandCenter - spacing * 1.0 - bandThickness, bandCenter - spacing * 1.0, yBase) *
                   (1.0 - smoothstep(bandCenter - spacing * 1.0, bandCenter - spacing * 1.0 + bandThickness, yBase));

        float r5 = smoothstep(bandCenter - spacing * 2.0 - bandThickness, bandCenter - spacing * 2.0, yBase) *
                   (1.0 - smoothstep(bandCenter - spacing * 2.0, bandCenter - spacing * 2.0 + bandThickness, yBase));

        vec3 color = colorInk;
        color = mix(color, colorTeal, r1 * 0.85);
        color = mix(color, colorViolet, r2 * 0.85);
        color = mix(color, colorRose, r3 * 0.85);
        color = mix(color, colorTerracotta, r4 * 0.85);
        color = mix(color, colorOchre, r5 * 0.85);

        // Soft vertical fade into page content
        float alpha = clamp(r1 + r2 + r3 + r4 + r5, 0.0, 1.0) * 0.95;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
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
      console.error(gl.getProgramInfoLog(program));
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
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let startTime = performance.now();

    function render() {
      syncSize();
      const elapsed = (performance.now() - startTime) * 0.001;
      
      gl.clearColor(0.043, 0.039, 0.071, 0.0);
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
