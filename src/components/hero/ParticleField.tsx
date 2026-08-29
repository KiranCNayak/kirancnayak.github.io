import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  ACCENT_A,
  ACCENT_B,
  ACCENT_WASH,
  ALPHA_THRESHOLD,
  ASSEMBLY_DURATION,
  BG_DIST_SQ,
  DENT_EASE,
  DENT_RADIUS,
  DENT_STRENGTH,
  DENT_Z_LIFT,
  DEPTH_JITTER,
  DRIFT_AMP_ACTIVE,
  DRIFT_AMP_IDLE,
  DRIFT_FREQ_XA,
  DRIFT_FREQ_XB,
  DRIFT_FREQ_YA,
  DRIFT_FREQ_YB,
  DRIFT_FREQ_ZA,
  DRIFT_FREQ_ZB,
  DRIFT_SPEED_X,
  DRIFT_SPEED_Y,
  DRIFT_SPEED_Z,
  EDGE_FADE_END,
  EDGE_FADE_START,
  OFFSET_EASE,
  PARTICLE_ALPHA,
  PHOTO_COLOR_WEIGHT,
  PHOTO_URL,
  POINT_SIZE_FACTOR,
  PORTRAIT_BREAKPOINT,
  PORTRAIT_OFFSET,
  SCATTER_X,
  SCATTER_Y,
  SCATTER_Z,
  TARGET_COUNT,
  WORLD_HEIGHT,
} from './particleConfig';
import { lerpPointer, type PointerRef } from './usePointer';

// GLSL float literal — interpolates a config constant into the shader source
const f = (v: number) => v.toFixed(4);

// deterministic PRNG (mulberry32) keeps render pure and the layout stable across re-renders
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// marks pixels connected to the image border with a similar color as background,
// so opaque studio backdrops are stripped and only the person becomes particles
function detectBackground(data: Uint8ClampedArray, w: number, h: number): Uint8Array {
  const bg = new Uint8Array(w * h);
  const borderIdx: number[] = [];
  for (let x = 0; x < w; x++) borderIdx.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y++) borderIdx.push(y * w, y * w + w - 1);

  // per-channel median is robust even when the subject crosses the border (e.g. torso at the bottom)
  const median = (channel: number) => {
    const values = borderIdx.map((i) => data[i * 4 + channel]!).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)]!;
  };
  const mr = median(0);
  const mg = median(1);
  const mb = median(2);

  const isBgColor = (i: number) => {
    if (data[i * 4 + 3]! <= ALPHA_THRESHOLD) return true;
    const dr = data[i * 4]! - mr;
    const dg = data[i * 4 + 1]! - mg;
    const db = data[i * 4 + 2]! - mb;
    return dr * dr + dg * dg + db * db < BG_DIST_SQ;
  };

  // plain flood fill: background = pixels connected to the border whose color stays
  // near the border median. No local-similarity chaining — that crawls through the
  // smooth gradients of a face and erases the subject.
  const queue: number[] = [];
  for (const i of borderIdx) {
    if (!bg[i] && isBgColor(i)) {
      bg[i] = 1;
      queue.push(i);
    }
  }
  while (queue.length > 0) {
    const i = queue.pop()!;
    const x = i % w;
    const y = (i - x) / w;
    const neighbors = [
      x > 0 ? i - 1 : -1,
      x < w - 1 ? i + 1 : -1,
      y > 0 ? i - w : -1,
      y < h - 1 ? i + w : -1,
    ];
    for (const nb of neighbors) {
      if (nb >= 0 && !bg[nb] && isBgColor(nb)) {
        bg[nb] = 1;
        queue.push(nb);
      }
    }
  }
  return bg;
}

interface Sampled {
  count: number;
  home: Float32Array;
  colors: Float32Array;
  seeds: Float32Array;
  spacing: number;
}

function sampleImage(image: HTMLImageElement): Sampled {
  const aspect = image.width / image.height;
  // sample at ~2x the target so roughly half the grid cells (the subject ones) survive,
  // capped at the source resolution so we never oversample
  const gridH = Math.min(Math.round(Math.sqrt((TARGET_COUNT * 2) / aspect)), image.height);
  const gridW = Math.round(gridH * aspect);
  const canvas = document.createElement('canvas');
  canvas.width = gridW;
  canvas.height = gridH;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, gridW, gridH);
  const data = ctx.getImageData(0, 0, gridW, gridH).data;
  const bg = detectBackground(data, gridW, gridH);

  const cells: number[] = [];
  for (let i = 0; i < gridW * gridH; i++) {
    if (data[i * 4 + 3]! > ALPHA_THRESHOLD && !bg[i]) cells.push(i);
  }

  const random = mulberry32(1337);
  const count = cells.length;
  const home = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const worldW = WORLD_HEIGHT * aspect;
  const spacing = WORLD_HEIGHT / gridH;
  const color = new THREE.Color();

  for (let n = 0; n < count; n++) {
    const cell = cells[n]!;
    const gx = cell % gridW;
    const gy = Math.floor(cell / gridW);
    const i = cell * 4;

    home[n * 3] = (gx / gridW - 0.5) * worldW;
    home[n * 3 + 1] = (0.5 - gy / gridH) * WORLD_HEIGHT;
    home[n * 3 + 2] = (random() - 0.5) * DEPTH_JITTER;

    const alpha = data[i + 3]! / 255;
    const or = (data[i]! / 255) * alpha;
    const og = (data[i + 1]! / 255) * alpha;
    const ob = (data[i + 2]! / 255) * alpha;
    const lum = 0.2126 * or + 0.7152 * og + 0.0722 * ob;
    // faithful photo colors with a slight wash of the site's accent scheme
    const mix = (gx / gridW) * 0.7 + (1 - gy / gridH) * 0.3;
    color.copy(ACCENT_A).lerp(ACCENT_B, mix);
    const wash = (0.3 + 0.7 * lum) * ACCENT_WASH;
    colors[n * 3] = Math.min(1, or * PHOTO_COLOR_WEIGHT + color.r * wash);
    colors[n * 3 + 1] = Math.min(1, og * PHOTO_COLOR_WEIGHT + color.g * wash);
    colors[n * 3 + 2] = Math.min(1, ob * PHOTO_COLOR_WEIGHT + color.b * wash);

    seeds[n] = random();
  }

  return { count, home, colors, seeds, spacing };
}

// all motion runs on the GPU so particle count can be photo-dense (~100k)
const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uActive;
  uniform float uSize;
  uniform float uScale;
  varying vec3 vColor;

  void main() {
    // assembly intro: scattered cloud eases into the portrait
    float progress = clamp(uTime / ${f(ASSEMBLY_DURATION)}, 0.0, 1.0);
    progress = 1.0 - pow(1.0 - progress, 3.0);
    vec3 scatter = position + vec3(
      sin(aSeed * 78.233) * ${f(SCATTER_X)},
      cos(aSeed * 12.9898) * ${f(SCATTER_Y)},
      sin(aSeed * 39.425) * ${f(SCATTER_Z)}
    );
    vec3 pos = mix(scatter, position, progress);

    // gentle organic drift: each particle floats around its home position
    float amp = mix(${f(DRIFT_AMP_IDLE)}, ${f(DRIFT_AMP_ACTIVE)}, uActive);
    pos.x += sin(position.x * ${f(DRIFT_FREQ_XA)} + position.y * ${f(DRIFT_FREQ_XB)} + uTime * ${f(DRIFT_SPEED_X)}) * amp;
    pos.y += cos(position.y * ${f(DRIFT_FREQ_YA)} + position.z * ${f(DRIFT_FREQ_YB)} + uTime * ${f(DRIFT_SPEED_Y)}) * amp;
    pos.z += sin(position.z * ${f(DRIFT_FREQ_ZA)} + position.x * ${f(DRIFT_FREQ_ZB)} + uTime * ${f(DRIFT_SPEED_Z)}) * amp;

    // pointer dent: particles bulge away from the cursor
    vec2 d = pos.xy - uPointer;
    float dist = length(d);
    float force = (1.0 - smoothstep(0.0, ${f(DENT_RADIUS)}, dist)) * ${f(DENT_STRENGTH)} * uActive;
    pos.xy += (d / max(dist, 1e-4)) * force;
    pos.z += force * ${f(DENT_Z_LIFT)};

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv, uv);
    if (d > ${f(EDGE_FADE_END)}) discard;
    float alpha = (1.0 - smoothstep(${f(EDGE_FADE_START)}, ${f(EDGE_FADE_END)}, d)) * ${f(PARTICLE_ALPHA)};
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function createUniforms(spacing: number) {
  return {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, -10) },
    uActive: { value: 0 },
    uSize: { value: spacing * POINT_SIZE_FACTOR },
    uScale: { value: 1 },
  };
}

export default function ParticleField({ pointer }: { pointer: PointerRef }) {
  const image = useLoader(THREE.ImageLoader, PHOTO_URL);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);

  const { count, home, colors, seeds, spacing } = useMemo(() => sampleImage(image), [image]);
  const initialUniforms = useMemo(() => createUniforms(spacing), [spacing]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;
    const p = pointer.current;
    lerpPointer(p, delta);
    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;

    // from the lg breakpoint up the portrait sits right of center, beside the hero text
    const offsetX = size.width >= PORTRAIT_BREAKPOINT ? viewport.width * PORTRAIT_OFFSET : 0;
    group.position.x += (offsetX - group.position.x) * Math.min(1, OFFSET_EASE * delta);

    const uniforms = material.uniforms;
    uniforms.uTime!.value = timeRef.current;
    uniforms.uPointer!.value.set(
      p.x * (viewport.width / 2) - group.position.x,
      p.y * (viewport.height / 2),
    );
    uniforms.uActive!.value +=
      ((p.active ? 1 : 0) - uniforms.uActive!.value) * Math.min(1, DENT_EASE * dt);
    const camera = state.camera as THREE.PerspectiveCamera;
    uniforms.uScale!.value =
      (state.size.height * state.viewport.dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
  });

  return (
    <group ref={groupRef}>
      <points key={count} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[home, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={initialUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </points>
    </group>
  );
}
