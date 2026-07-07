// Vendored equivalent of reactbits.dev "Target Cursor" (https://reactbits.dev/animations/target-cursor), MIT. rAF-based.
import { useEffect, useRef } from 'react';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';

const INTERACTIVE = 'a, button, [data-cursor]';

export default function TargetCursor() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const enabled = !reduced && !coarse;
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const corners = cornerRefs.current;
    if (!wrap || !dot || corners.length < 4 || corners.some((c) => !c)) return;

    document.documentElement.classList.add('cursor-hidden');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let x = mx;
    let y = my;
    let target: Element | null = null;
    const cur = [0, 1, 2, 3].map(() => ({ x: mx, y: my }));
    const IDLE = 10;
    const PAD = 6;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      target = (e.target as Element).closest?.(INTERACTIVE) ?? null;
    };
    const onLeave = () => {
      wrap.style.opacity = '0';
    };
    const onEnter = () => {
      wrap.style.opacity = '1';
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (mx - x) * 0.2;
      y += (my - y) * 0.2;
      dot.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`;

      let pts: { x: number; y: number }[];
      if (target && document.contains(target)) {
        const r = (target as HTMLElement).getBoundingClientRect();
        pts = [
          { x: r.left - PAD, y: r.top - PAD },
          { x: r.right + PAD, y: r.top - PAD },
          { x: r.left - PAD, y: r.bottom + PAD },
          { x: r.right + PAD, y: r.bottom + PAD },
        ];
      } else {
        pts = [
          { x: x - IDLE, y: y - IDLE },
          { x: x + IDLE, y: y - IDLE },
          { x: x - IDLE, y: y + IDLE },
          { x: x + IDLE, y: y + IDLE },
        ];
      }
      corners.forEach((c, i) => {
        cur[i].x += (pts[i].x - cur[i].x) * 0.25;
        cur[i].y += (pts[i].y - cur[i].y) * 0.25;
        c!.style.transform = `translate3d(${cur[i].x}px, ${cur[i].y}px, 0)`;
      });
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, true);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver, true);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('cursor-hidden');
    };
  }, [enabled]);

  if (!enabled) return null;

  const cornerBase = 'absolute left-0 top-0 h-2.5 w-2.5 border-accent will-change-transform';
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
    >
      <div ref={dotRef} className="absolute left-0 top-0 h-1 w-1 bg-accent will-change-transform" />
      <div
        ref={(el) => {
          cornerRefs.current[0] = el;
        }}
        className={`${cornerBase} border-l border-t`}
        style={{ marginLeft: -5, marginTop: -5 }}
      />
      <div
        ref={(el) => {
          cornerRefs.current[1] = el;
        }}
        className={`${cornerBase} border-r border-t`}
        style={{ marginLeft: -5, marginTop: -5 }}
      />
      <div
        ref={(el) => {
          cornerRefs.current[2] = el;
        }}
        className={`${cornerBase} border-b border-l`}
        style={{ marginLeft: -5, marginTop: -5 }}
      />
      <div
        ref={(el) => {
          cornerRefs.current[3] = el;
        }}
        className={`${cornerBase} border-b border-r`}
        style={{ marginLeft: -5, marginTop: -5 }}
      />
    </div>
  );
}
