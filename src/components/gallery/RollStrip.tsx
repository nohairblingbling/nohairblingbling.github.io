import { useEffect, useRef } from 'react';
import type { Roll } from '../../content';
import { usePrefersReducedMotion } from '../../hooks';
import Frame from './Frame';
import FilmStock from './FilmStock';
import { observeAnimationVisibility } from '../../lib/animationVisibility';

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

    let raf = 0;
    let last = performance.now();
    let visible = false;
    let dragStart = 0;
    let paintedOffset = Number.NaN;
    const paint = () => {
      const width = runWidth.current;
      if (width > 0) offset.current = ((offset.current % width) + width) % width;
      if (offset.current !== paintedOffset) {
        track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
        paintedOffset = offset.current;
      }
    };
    const autoRunning = () => visible && !paused.current && !dragging.current;
    const loop = (time: number) => {
      raf = 0;
      if (autoRunning()) offset.current += SPEED * Math.min((time - last) / 1000, 0.05);
      last = time;
      paint();
      if (autoRunning()) raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = performance.now();
      if (autoRunning()) raf = requestAnimationFrame(loop);
    };
    const measure = () => {
      const width = run.getBoundingClientRect().width;
      if (width !== runWidth.current) {
        runWidth.current = width;
        const holes = Math.max(1, Math.round(width / 32));
        track.style.setProperty('--film-pitch', `${width / holes}px`);
        paint();
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(run);
    const images = Array.from(run.querySelectorAll('img'));
    images.forEach(img => { if (!img.complete) img.addEventListener('load', measure, { once: true }); });
    const stopObserving = observeAnimationVisibility(container, active => { visible = active; sync(); });

    const onEnter = () => { paused.current = true; sync(); };
    const onLeave = () => { paused.current = false; sync(); };
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const dx = event.clientX - lastX.current;
      lastX.current = event.clientX;
      if (Math.abs(event.clientX - dragStart) > DRAG_THRESHOLD) moved.current = true;
      offset.current -= dx;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onUp = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; paint(); }
      dragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      sync();
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging.current = true;
      moved.current = false;
      dragStart = lastX.current = event.clientX;
      sync();
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointerdown', onDown);
    return () => {
      cancelAnimationFrame(raf);
      stopObserving();
      ro.disconnect();
      images.forEach(img => img.removeEventListener('load', measure));
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [reduced, roll]);

  // reduced motion: plain native-scroll strip, no auto-run
  if (reduced) {
    return (
      <div className="film-stage">
        <div className="film-scroll overflow-x-auto">
          <div className="film-run w-max">
            <FilmStock />
            {roll.photos.map((p, i) => (
              <Frame key={p.id} photo={p} index={i} onSelect={() => onSelect(i)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const run = (clone: boolean) => (
    <div ref={clone ? undefined : runRef} className="film-run" aria-hidden={clone}>
      <FilmStock />
      {roll.photos.map((p, i) => (
        <Frame
          key={p.id}
          photo={p}
          index={i}
          duplicate={clone}
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
      className="film-stage relative cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
    >
      <div ref={trackRef} className="film-track flex w-max will-change-transform">
        {run(false)}
        {run(true)}
      </div>
      <div
        aria-hidden="true"
        className="light-leak pointer-events-none absolute inset-y-0 left-0 z-20 w-[38%]"
        style={{
          background:
            'linear-gradient(105deg, transparent 0%, rgba(143, 160, 173, 0.16) 45%, rgba(191, 230, 238, 0.10) 62%, transparent 100%)',
        }}
      />
    </div>
  );
}
