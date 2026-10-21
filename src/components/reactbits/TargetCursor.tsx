// A feather quill based on the supplied silhouette, with an exact writing-tip hotspot.
import { useEffect, useId, useRef } from 'react';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';
import './target-cursor.css';

const INTERACTIVE = 'a[href], button, [role="button"], [data-cursor]';
const NATIVE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-cursor="native"]';
const TEXT = 'p, h1, h2, h3, h4, h5, h6, li, figcaption, blockquote, pre, code';

export default function TargetCursor() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const enabled = !reduced && !coarse;
  const cursorRef = useRef<HTMLDivElement>(null);
  const signatureId = useId();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!enabled || !cursor) return;
    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let present = false;
    let dragging = false;
    let selectingText = false;
    let target: Element | null = null;
    let retarget = false;
    let raf = 0;
    let releaseTimer = 0;
    let engaged = false;
    let gestureTimer = 0;

    const clearGesture = () => {
      window.clearTimeout(gestureTimer);
      gestureTimer = 0;
    };
    const gesture = (active: boolean, immediate = false) => {
      if (immediate) {
        engaged = false;
        clearGesture();
        cursor.dataset.phase = 'idle';
        return;
      }
      if (active === engaged) return;
      engaged = active;
      clearGesture();
      if (active) {
        // CSS continues from the visible pose, including a quick re-entry during lift-off.
        cursor.dataset.phase = 'hover';
      } else {
        cursor.dataset.phase = 'release';
        gestureTimer = window.setTimeout(() => {
          cursor.dataset.phase = 'idle';
          gestureTimer = 0;
        }, 210);
      }
    };

    const hide = () => {
      gesture(false, true);
      cursor.style.opacity = '0';
      cursor.dataset.mode = 'idle';
      root.classList.remove('cursor-hidden', 'cursor-native-drag');
    };
    const paint = () => {
      raf = 0;
      if (!present) return;
      if (retarget) {
        target = document.elementFromPoint(x, y);
        retarget = false;
      }
      // No interpolation or trailing physics: the mark stays under the pointer.
      cursor.style.transform = `translate3d(${x - 22}px, ${y - 22}px, 0)`;
      const interactive = target?.closest(INTERACTIVE);
      const native = !target || target.closest(`${NATIVE}, .site-entrance, [inert]`)
        || interactive?.matches(':disabled, [aria-disabled="true"]')
        || (!interactive && target?.closest('.film-stage'));
      const text = selectingText || (!interactive && Boolean(target?.closest(TEXT)));
      const custom = !native && !dragging;
      root.classList.toggle('cursor-hidden', custom);
      root.classList.toggle('cursor-native-drag', dragging);
      cursor.style.opacity = custom ? '1' : '0';
      if (!custom) {
        cursor.dataset.mode = 'idle';
        gesture(false, true);
        return;
      }
      const photo = interactive?.matches('.film-canister, .film-window')
        || interactive?.querySelector('img, canvas');
      cursor.dataset.mode = text ? 'text' : interactive ? (photo ? 'photo' : 'link') : 'idle';
      // Keep the smaller reading pose throughout a selection, even across inline links.
      gesture(Boolean(interactive) && !text, text);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const leave = () => {
      present = false;
      dragging = false;
      selectingText = false;
      cursor.dataset.pressed = 'false';
      window.clearTimeout(releaseTimer);
      cancelAnimationFrame(raf);
      raf = 0;
      hide();
    };
    const point = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') { leave(); return false; }
      x = event.clientX;
      y = event.clientY;
      target = event.target instanceof Element ? event.target : null;
      present = true;
      retarget = false;
      schedule();
      return true;
    };
    const onDown = (event: PointerEvent) => {
      if (!point(event) || event.button !== 0) return;
      dragging = Boolean(target?.closest('.film-stage'));
      selectingText = !dragging && !target?.closest(`${INTERACTIVE}, ${NATIVE}`)
        && Boolean(target?.closest(TEXT));
      window.clearTimeout(releaseTimer);
      cursor.dataset.pressed = 'true';
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      dragging = false;
      selectingText = false;
      retarget = true;
      schedule();
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => { cursor.dataset.pressed = 'false'; }, 100);
    };
    const refresh = () => { if (present) { retarget = true; schedule(); } };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Tab') leave(); };
    const onVisibility = () => { if (document.hidden) leave(); };

    window.addEventListener('pointermove', point, { passive: true });
    window.addEventListener('pointerover', point, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', leave);
    window.addEventListener('blur', leave);
    window.addEventListener('resize', refresh);
    document.addEventListener('scroll', refresh, { passive: true, capture: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    root.addEventListener('pointerleave', leave);
    return () => {
      leave();
      window.removeEventListener('pointermove', point);
      window.removeEventListener('pointerover', point);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', leave);
      window.removeEventListener('blur', leave);
      window.removeEventListener('resize', refresh);
      document.removeEventListener('scroll', refresh, true);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      root.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={cursorRef} className="focus-cursor" data-mode="idle" data-phase="idle" aria-hidden="true">
      <div className="focus-cursor-glyph">
        <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={signatureId} gradientUnits="userSpaceOnUse" x1="22" y1="26" x2="78" y2="26">
              <stop stopColor="var(--color-ink)" stopOpacity="0.72" />
              <stop offset="0.65" stopColor="var(--color-ink-2)" stopOpacity="0.65" />
              <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.24" />
            </linearGradient>
          </defs>
          <g className="focus-cursor-quill">
            <path className="focus-cursor-feather" d="M22 22C24.8 14.3 28.3 2.3 36.5-7.5C40.7-12.5 45.1-15 48-15.2C47.8-10.1 46.9-3.8 45.1 1.1L41.6 3.1L44.5 2.7C43.8 6.2 42.7 8.9 40.9 11.4L37.9 11L39.4 12.8C35.8 16.7 32.8 16.5 29.3 15.4C32.3 8.1 36.7 0.2 43.7-8.8C34.9-0.2 28.6 11.8 22 22Z" />
            <path className="focus-cursor-veins" d="M35.8 2.7C38.9 2.3 41.4 0.9 43.8-0.4M32.8 8.7C35.5 8.8 38.1 7.6 40.9 6" />
          </g>
          <path className="focus-cursor-signature" stroke={`url(#${signatureId})`} pathLength="1" d="M22 26C29.8 27.9 35.4 27 41.9 25.4S57.3 23.9 62.9 25.2C67.9 26.4 71.8 26 78 24.6" />
        </svg>
      </div>
    </div>
  );
}
