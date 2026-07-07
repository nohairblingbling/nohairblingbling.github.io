// Vendored equivalent of reactbits.dev "Particles" (https://reactbits.dev/backgrounds/particles), MIT. ogl-based.
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 8.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.2831 * random.w) * mix(0.1, 1.2, random.x);
    mPos.y += sin(t * random.y + 6.2831 * random.x) * mix(0.1, 1.2, random.w);
    mPos.z += sin(t * random.w + 6.2831 * random.y) * mix(0.1, 1.2, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + 0.6 * random.x)) / max(1.0, length(mvPos.xyz));
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord.xy - vec2(0.5));
    float circle = smoothstep(0.5, 0.35, d);
    gl_FragColor = vec4(vColor, circle * 0.5);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export default function Particles({
  count = 160,
  baseSize = 55,
  speed = 0.08,
  colors = ['#7fa3b0', '#8fa0ad', '#2dd4e8'],
  className = '',
}: {
  count?: number;
  baseSize?: number;
  speed?: number;
  colors?: string[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true, depth: false });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, 20);

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize);
    resize();

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colorAttr = new Float32Array(count * 3);
    const palette = colors.map(hexToRgb);
    for (let i = 0; i < count; i++) {
      let x = 0,
        y = 0,
        z = 0,
        len = 2;
      while (len > 1) {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      }
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colorAttr.set(palette[Math.floor(Math.random() * palette.length)], i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colorAttr },
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: 10 },
        uBaseSize: { value: baseSize },
      },
      transparent: true,
      depthTest: false,
    });
    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const update = (t: number) => {
      raf = requestAnimationFrame(update);
      const delta = t - last;
      last = t;
      elapsed += delta * speed;
      program.uniforms.uTime.value = elapsed * 0.001;
      particles.rotation.y += 0.00025 * delta;
      renderer.render({ scene: particles, camera });
    };
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [count, baseSize, speed, colors]);

  return <div ref={containerRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
