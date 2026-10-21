import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Roll } from '../../content';

export default function Lightbox({
  roll,
  index,
  onClose,
  onNav,
}: {
  roll: Roll;
  index: number;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const photo = roll.photos[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [decodedSource, setDecodedSource] = useState<string | null>(null);
  const originalReady = decodedSource === photo.src || !photo.display;

  useEffect(() => {
    if (!photo.display) return;
    let active = true;
    const original = new Image();
    original.decoding = 'async';
    original.fetchPriority = 'high';
    original.onload = async () => {
      try { await original.decode(); } catch { /* A loaded image can still be displayed. */ }
      if (!active) return;
      setDecodedSource(photo.src);
      // Neighbours download only after opening a photo and finishing the current original.
      for (const delta of [-1, 1]) {
        const neighbour = new Image();
        neighbour.decoding = 'async';
        neighbour.fetchPriority = 'low';
        neighbour.src = roll.photos[(index + delta + roll.photos.length) % roll.photos.length].src;
      }
    };
    original.src = photo.src;
    return () => { active = false; original.onload = null; };
  }, [photo, roll, index]);

  // Keep this lifetime separate from photo/callback updates so navigation does
  // not reset focus, unlock scrolling, or briefly reactivate the background.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = Array.from(document.body.children)
      .filter((el): el is HTMLElement => el instanceof HTMLElement && el !== dialog)
      .map((el) => ({ el, inert: el.getAttribute('inert') }));
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    closeRef.current?.focus({ preventScroll: true });
    background.forEach(({ el }) => el.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    }

    const keepFocusInside = (e: FocusEvent) => {
      if (e.target instanceof Node && !dialog.contains(e.target)) {
        closeRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('focusin', keepFocusInside);
    return () => {
      document.removeEventListener('focusin', keepFocusInside);
      background.forEach(({ el, inert }) => {
        if (inert === null) el.removeAttribute('inert');
        else el.setAttribute('inert', inert);
      });
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        onNav(e.key === 'ArrowLeft' ? -1 : 1);
      }
      if (e.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${photo.id}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[55] grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-3 bg-base/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:gap-5 sm:p-6"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        data-cursor
        aria-label="Close"
        className="min-h-11 justify-self-end px-3 font-mono text-xs tracking-[0.12em] text-ink-2 transition-colors hover:text-accent"
      >
        CLOSE ✕
      </button>
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        className="flex min-h-0 min-w-0 items-center justify-center"
      >
        <img
          src={originalReady ? photo.src : photo.display!.src}
          srcSet={originalReady ? undefined : photo.display?.srcSet}
          sizes="(max-width: 767px) calc(100vw - 32px), calc(100vw - 48px)"
          decoding="async"
          fetchPriority="high"
          alt={photo.caption ?? `Photograph ${photo.id}`}
          className="max-h-full max-w-full border border-hairline object-contain"
        />
      </div>
      <div className="mx-auto grid w-full max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono text-xs tracking-[0.06em] text-ink-2 sm:gap-8">
        <button onClick={() => onNav(-1)} data-cursor className="min-h-11 min-w-11 px-2 transition-colors hover:text-accent">
          ← PREV
        </button>
        <span aria-live="polite" aria-atomic="true" className="text-center tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(roll.photos.length).padStart(2, '0')} ·{' '}
          {photo.id}
        </span>
        <button onClick={() => onNav(1)} data-cursor className="min-h-11 min-w-11 px-2 transition-colors hover:text-accent">
          NEXT →
        </button>
      </div>
    </div>,
    document.body
  );
}
