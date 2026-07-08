import { useEffect, useRef } from 'react';
import type { Roll } from '../../content';
import { usePrefersReducedMotion } from '../../hooks';
import Reveal from '../ui/Reveal';
import Frame from './Frame';

const SPEED = 42; // px per second
const DRAG_THRESHOLD = 5; // px before a press counts as a scrub, not a click

export default function RollStrip({
  roll,
  onSelect,
}: {
  roll: Roll;
  onSelect: (index: number) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLDivElement>(null);

  // rAF/drag state lives in refs so the loop and listeners never re-render
  const offset = useRef(0);
  const runWidth = useRef(0);
  const paused = useRef(false); // hover
  const dragging = useRef(false);
  const moved = useRef(false); // suppresses the click that ends a scrub
  const lastX = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const track = trackRef.current;
    const run = runRef.current;
    if (!container || !track || !run) return;

    const measure = () => {
      runWidth.current = run.offsetWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(run);
    run.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true });
    });

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - last) / 1000, 0.05); // clamp so refocus after a hidden tab doesn't jump
      last = t;
      if (!paused.current && !dragging.current) offset.current += SPEED * dt;
      const w = runWidth.current;
      if (w > 0) offset.current = ((offset.current % w) + w) % w;
      track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
    };
    raf = requestAnimationFrame(loop);

    // hover pauses the auto-run; drag works whether paused or not
    const onEnter = () => {
      paused.current = true;
    };
    const onLeave = () => {
      paused.current = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      if (Math.abs(dx) > DRAG_THRESHOLD) moved.current = true;
      offset.current -= dx;
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      moved.current = false;
      lastX.current = e.clientX;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };

    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointerdown', onDown);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [reduced, roll]);

  // reduced motion: plain native-scroll strip, no auto-run
  if (reduced) {
    return (
      <div className="border-y border-hairline bg-[#0c0b09]">
        <div className="film-scroll flex gap-8 overflow-x-auto px-8 py-6 md:px-12">
          {roll.photos.map((p, i) => (
            <Reveal key={p.id} variant="fade" className="shrink-0">
              <Frame photo={p} index={i} onSelect={() => onSelect(i)} />
            </Reveal>
          ))}
        </div>
      </div>
    );
  }

  const run = (clone: boolean) => (
    <div ref={clone ? undefined : runRef} className="flex shrink-0 gap-8 pr-8" aria-hidden={clone}>
      {roll.photos.map((p, i) => (
        <Frame
          key={p.id}
          photo={p}
          index={i}
          onSelect={() => {
            if (moved.current) return; // was a scrub, not a click
            onSelect(i);
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="cursor-grab touch-pan-y select-none overflow-hidden border-y border-hairline bg-[#0c0b09] active:cursor-grabbing"
    >
      <div ref={trackRef} className="flex w-max py-6 will-change-transform">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
