/**
 * EXPOJUY 2026 — WEBGL STRATA SHADER ENGINE (SINCRONIZADO CON DEVELOP)
 * 4 Brand Mineral Wave Ribbons:
 * Cyan (#2de3d6), Violet (#7c3aed), Magenta (#d946ef), Lavender (#c4b5fd)
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

      // Brand palette from develop (Isotipo ExpoJuy & 4 Ejes)
      const vec3 colorCyan      = vec3(0.176, 0.890, 0.839); // #2de3d6
      const vec3 colorViolet    = vec3(0.486, 0.227, 0.929); // #7c3aed
      const vec3 colorMagenta   = vec3(0.851, 0.275, 0.937); // #d946ef
      const vec3 colorLavender  = vec3(0.769, 0.710, 0.992); // #c4b5fd
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
        float t = u_time * 0.14;

        // Undulating organic curves
        float wave1 = sin(uv.x * 2.6 + t * 0.7) * 0.06;
        float wave2 = cos(uv.x * 3.4 - t * 0.5) * 0.04;
        float n = (noise(vec2(uv.x * 3.0 + t * 0.2, uv.y * 1.5)) - 0.5) * 0.04;

        float yBase = uv.y + wave1 + wave2 + n;
        
        float bandCenter = 0.52;
        float bandThickness = 0.028;
        float spacing = 0.055;

        // 4 Brand Ribbons
        float r1 = smoothstep(bandCenter + spacing * 1.5 - bandThickness, bandCenter + spacing * 1.5, yBase) *
                   (1.0 - smoothstep(bandCenter + spacing * 1.5, bandCenter + spacing * 1.5 + bandThickness, yBase));

        float r2 = smoothstep(bandCenter + spacing * 0.5 - bandThickness, bandCenter + spacing * 0.5, yBase) *
                   (1.0 - smoothstep(bandCenter + spacing * 0.5, bandCenter + spacing * 0.5 + bandThickness, yBase));

        float r3 = smoothstep(bandCenter - spacing * 0.5 - bandThickness, bandCenter - spacing * 0.5, yBase) *
                   (1.0 - smoothstep(bandCenter - spacing * 0.5, bandCenter - spacing * 0.5 + bandThickness, yBase));

        float r4 = smoothstep(bandCenter - spacing * 1.5 - bandThickness, bandCenter - spacing * 1.5, yBase) *
                   (1.0 - smoothstep(bandCenter - spacing * 1.5, bandCenter - spacing * 1.5 + bandThickness, yBase));

        vec3 color = colorInk;
        color = mix(color, colorCyan, r1 * 0.9);
        color = mix(color, colorViolet, r2 * 0.9);
        color = mix(color, colorMagenta, r3 * 0.9);
        color = mix(color, colorLavender, r4 * 0.85);

        float alpha = clamp(r1 + r2 + r3 + r4, 0.0, 1.0) * 0.95;
        
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
