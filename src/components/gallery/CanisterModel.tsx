import { useEffect, useRef, type RefObject } from 'react';
import { Renderer, Camera, Transform, Mesh, Program, Cylinder, Torus, Box, Texture, type Geometry } from 'ogl';
import type { Roll } from '../../content';
import { captureLabel, labelPalettes } from './rollLabel';

export type CanisterModelHandle = { turn: number; render?: () => void };

const vertex = `
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = -view.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * view;
  }
`;
const fragment = `
  precision highp float;
  uniform vec3 uColor;
  uniform float uPaper;
  uniform float uShine;
  uniform sampler2D uLabel;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(vView);
    vec3 key = normalize(vec3(-0.7, 1.0, 1.4));
    vec3 fill = normalize(vec3(1.0, 0.1, 0.7));
    vec3 base = uPaper > 0.5 ? texture2D(uLabel, vUv).rgb : uColor;
    float diffuse = max(dot(n, key), 0.0);
    float bounce = max(dot(n, fill), 0.0);
    float spec = pow(max(dot(n, normalize(key + view)), 0.0), mix(38.0, 10.0, uPaper));
    float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
    vec3 color = base * (0.27 + 0.77 * diffuse + 0.18 * bounce);
    color += vec3(0.78, 0.85, 0.88) * spec * uShine;
    color += vec3(0.17, 0.22, 0.24) * rim * (1.0 - uPaper) * 0.45;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function labelTexture(roll: Roll) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const label = captureLabel(roll.capture);
  const palette = labelPalettes[roll.labelTone];
  ctx.fillStyle = palette.paper;
  ctx.fillRect(0, 0, 1024, 512);
  // Subtle, deterministic paper fibres rather than a regularly repeated dot grid.
  let seed = 400;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 16000; i++) {
    ctx.fillStyle = `rgba(65, 57, 44, ${random() * 0.10})`;
    ctx.fillRect(random() * 1024, random() * 512, 1 + random(), 1);
  }
  ctx.translate(24, 0);
  ctx.fillStyle = palette.stamp;
  ctx.font = '500 29px "JetBrains Mono Variable", monospace';
  ctx.fillText('Y Z J', 350, 57);
  ctx.fillText(roll.category === 'portraits' ? 'P' : 'L', 645, 57);
  ctx.fillRect(350, 77, 324, 3);
  ctx.fillRect(350, 84, 324, 1);
  ctx.fillStyle = palette.ink;
  ctx.font = '74px "Instrument Serif", Georgia, serif';
  const words = roll.title.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (line && ctx.measureText(`${line} ${word}`).width > 324) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  lines.slice(0, 2).forEach((text, i) => ctx.fillText(text, 350, 167 + i * 79, 324));
  ctx.fillStyle = palette.stamp;
  ctx.font = '500 26px "JetBrains Mono Variable", monospace';
  ctx.fillText(label.maker, 350, 292, 324);
  ctx.fillStyle = palette.ink;
  // Fit long camera or film names by reducing type size rather than squeezing the lettering.
  let markSize = 90;
  do { ctx.font = `800 ${markSize--}px "Inter Variable", sans-serif`; }
  while (ctx.measureText(label.mark).width > 324 && markSize > 24);
  ctx.fillText(label.mark, 345, 377);
  ctx.font = '23px "JetBrains Mono Variable", monospace';
  ctx.fillText(label.medium, 350, 411, 324);
  ctx.font = '25px "JetBrains Mono Variable", monospace';
  ctx.fillText(`${String(roll.photos.length).padStart(2, '0')} EXP${roll.year ? ` · ${roll.year}` : ''}`, 350, 459, 324);
  // A printed seam and small calibration bars become visible as the cylinder turns.
  ctx.fillStyle = '#363a39';
  ctx.fillRect(770, 0, 22, 512);
  for (let i = 0; i < 8; i++) ctx.fillRect(820 + i * 16, 365, 9, 75);
  return canvas;
}

export default function CanisterModel({ roll, motion, onReady }: {
  roll: Roll;
  motion: RefObject<CanisterModelHandle>;
  onReady: (ready: boolean) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof WebGLRenderingContext === 'undefined') return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ width: 260, height: 284, dpr: Math.min(devicePixelRatio, 2),
        alpha: true, antialias: true, premultipliedAlpha: false });
    } catch { return; }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    host.appendChild(gl.canvas);
    const camera = new Camera(gl, { left: -2.014, right: 2.014, top: 2.2, bottom: -2.2, near: 0.1, far: 30 });
    camera.position.set(0, 3.3, 9);
    camera.lookAt([0, 0.08, 0]);
    const scene = new Transform();
    const cartridge = new Transform();
    cartridge.setParent(scene);
    const geometries: Geometry[] = [];
    const programs: Program[] = [];
    const texture = new Texture(gl, { minFilter: gl.LINEAR_MIPMAP_LINEAR, anisotropy: 4 });
    const material = (color: number[], shine: number, paper = 0) => {
      const program = new Program(gl, { vertex, fragment, uniforms: {
        uColor: { value: color }, uShine: { value: shine }, uPaper: { value: paper }, uLabel: { value: texture },
      } });
      programs.push(program);
      return program;
    };
    const shell = material([0.095, 0.11, 0.12], 0.27);
    const rim = material([0.24, 0.27, 0.28], 0.55);
    const inset = material([0.045, 0.055, 0.06], 0.12);
    const paper = material([0.78, 0.76, 0.69], 0.018, 1);
    const add = (geometry: Geometry, program: Program, y = 0, parent: Transform = cartridge) => {
      geometries.push(geometry);
      const mesh = new Mesh(gl, { geometry, program });
      mesh.position.y = y;
      mesh.setParent(parent);
      return mesh;
    };
    const cylinder = (r: number, h: number, y: number, program: Program) =>
      add(new Cylinder(gl, { radiusTop: r, radiusBottom: r, height: h, radialSegments: 64 }), program, y);
    const ring = (radius: number, tube: number, y: number, program: Program) => {
      const mesh = add(new Torus(gl, { radius, tube, radialSegments: 8, tubularSegments: 64 }), program, y);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };
    cylinder(1, 2.84, 0, shell);
    add(new Cylinder(gl, { radiusTop: 1.004, radiusBottom: 1.004, height: 2.25,
      radialSegments: 96, openEnded: true, thetaStart: -Math.PI }), paper, 0.02);
    cylinder(1.055, 0.09, 1.45, rim);
    cylinder(0.99, 0.035, 1.505, inset);
    ring(1.016, 0.04, 1.5, rim);
    ring(0.87, 0.025, 1.52, shell);
    cylinder(1.055, 0.1, -1.44, rim);
    ring(1.018, 0.035, -1.5, rim);
    cylinder(0.34, 0.08, 1.55, shell);
    ring(0.31, 0.025, 1.6, rim);
    cylinder(0.22, 0.40, 1.79, inset);
    ring(0.20, 0.018, 1.995, shell);
    cylinder(0.16, 0.012, 1.997, inset);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const tooth = add(new Box(gl, { width: 0.035, height: 0.29, depth: 0.025 }), shell, 1.78);
      tooth.position.x = Math.sin(angle) * 0.225;
      tooth.position.z = Math.cos(angle) * 0.225;
      tooth.rotation.y = angle;
    }
    // The felt-lined exit stays fixed while the visible cartridge winds around its spindle.
    const mouth = add(new Box(gl, { width: 0.16, height: 1.62, depth: 0.25 }), shell, -0.05, scene);
    mouth.position.x = 1.015;
    mouth.position.z = 0.06;
    const slit = add(new Box(gl, { width: 0.028, height: 1.48, depth: 0.27 }), inset, -0.05, scene);
    slit.position.x = 1.10;
    slit.position.z = 0.07;
    let alive = true;
    let contextLost = false;
    let lastTurn = Number.NaN;
    const render = () => {
      if (!alive || contextLost || motion.current.turn === lastTurn) return;
      lastTurn = motion.current.turn;
      cartridge.rotation.y = motion.current.turn + 0.2;
      renderer.render({ scene, camera });
    };
    const refreshLabel = () => {
      if (!alive || contextLost) return;
      const label = labelTexture(roll);
      if (!label) return;
      texture.image = label;
      texture.needsUpdate = true;
      lastTurn = Number.NaN;
      render();
      onReady(true);
    };
    const lost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      motion.current.render = undefined;
      onReady(false);
    };
    gl.canvas.addEventListener('webglcontextlost', lost);
    motion.current.render = render;
    refreshLabel();
    if (document.fonts?.status !== 'loaded') document.fonts?.ready.then(refreshLabel);
    return () => {
      alive = false;
      motion.current.render = undefined;
      gl.canvas.removeEventListener('webglcontextlost', lost);
      geometries.forEach((geometry) => geometry.remove());
      programs.forEach((program) => program.remove());
      gl.deleteTexture(texture.texture);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      gl.canvas.remove();
    };
  }, [roll, motion, onReady]);
  return <div ref={hostRef} className="film-canister-model" aria-hidden="true" />;
}
