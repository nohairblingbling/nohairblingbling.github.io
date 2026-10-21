// Film grain: tile once, then move the texture on the compositor at the original refresh cadence.
import { useEffect, useRef } from 'react';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';
import './noise.css';

const textures = new Map<number, string>();
function grainTexture(size: number) {
  if (textures.has(size)) return textures.get(size)!;
  const tile = document.createElement('canvas');
  tile.width = tile.height = size;
  const context = tile.getContext('2d');
  if (!context) return '';
  const pixels = context.createImageData(size, size);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const value = (Math.random() * 255) | 0;
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
    pixels.data[i + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = `url(${tile.toDataURL()})`;
  textures.set(size, texture);
  return texture;
}

export default function Noise({ opacity = 0.05, patternSize = 120, refreshInterval = 4 }: {
  opacity?: number; patternSize?: number; refreshInterval?: number;
}) {
  const textureRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  useEffect(() => {
    const texture = textureRef.current;
    if (!texture) return;
    texture.style.backgroundImage = grainTexture(patternSize);
    const sync = () => { texture.style.animationPlayState = document.hidden ? 'paused' : 'running'; };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [patternSize]);
  useEffect(() => {
    if (reduced || coarse) return;
    // A short calibration preserves "every four frames" on 60 Hz and high-refresh displays.
    // After eight samples, grain animation needs no JavaScript frame loop.
    const samples: number[] = [];
    let previous: number | undefined;
    let raf = 0;
    const sample = (time: number) => {
      if (previous !== undefined) samples.push(time - previous);
      previous = time;
      if (samples.length < 8) raf = requestAnimationFrame(sample);
      else if (textureRef.current) {
        samples.sort((a, b) => a - b);
        const frameTime = Math.max(1000 / 240, Math.min(samples[3], 1000 / 30));
        textureRef.current.style.animationDuration = `${frameTime * Math.max(1, refreshInterval) * 12 / 1000}s`;
      }
    };
    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, [reduced, coarse, refreshInterval]);
  return (
    <div aria-hidden="true" className="film-grain" style={{ opacity }}>
      <div ref={textureRef} className={`film-grain-texture ${!reduced && !coarse ? 'film-grain-moving' : ''}`}
        style={{ inset: -Math.max(patternSize, 44), animationDuration: `${Math.max(1, refreshInterval) * 12 / 60}s` }} />
    </div>
  );
}
