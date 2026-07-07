// Vendored equivalent of reactbits.dev "Noise" (https://reactbits.dev/animations/noise), MIT. Film-grain overlay.
import { useEffect, useRef } from 'react';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';

export default function Noise({
  opacity = 0.05,
  patternSize = 120,
  refreshInterval = 4,
}: {
  opacity?: number;
  patternSize?: number;
  refreshInterval?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pattern = document.createElement('canvas');
    pattern.width = patternSize;
    pattern.height = patternSize;
    const pctx = pattern.getContext('2d');
    if (!pctx) return;
    const pdata = pctx.createImageData(patternSize, patternSize);

    const renderPattern = () => {
      const buf = pdata.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 255;
      }
      pctx.putImageData(pdata, 0, 0);
    };
    const draw = () => {
      const pat = ctx.createPattern(pattern, 'repeat');
      if (!pat) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
    window.addEventListener('resize', resize);
    renderPattern();
    resize();

    // 静态颗粒：reduced-motion / 触屏不跑动画循环
    if (reduced || coarse) {
      return () => window.removeEventListener('resize', resize);
    }

    let raf = 0;
    let frame = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (frame++ % refreshInterval === 0) {
        renderPattern();
        draw();
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, coarse, patternSize, refreshInterval]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{ opacity }}
    />
  );
}
