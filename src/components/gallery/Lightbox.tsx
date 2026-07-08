import { useEffect } from 'react';
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${photo.id}`}
      onClick={onClose}
      className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-5 bg-base/95 p-6 backdrop-blur-sm"
    >
      <img
        src={photo.src}
        alt={photo.caption ?? `Photograph ${photo.id}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-[92vw] border border-hairline"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-8 font-mono text-[11px] tracking-[0.15em] text-ink-3"
      >
        <button onClick={() => onNav(-1)} data-cursor className="transition-colors hover:text-accent">
          ← PREV
        </button>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(roll.photos.length).padStart(2, '0')} ·{' '}
          {photo.id}
        </span>
        <button onClick={() => onNav(1)} data-cursor className="transition-colors hover:text-accent">
          NEXT →
        </button>
      </div>
      <button
        onClick={onClose}
        data-cursor
        aria-label="Close"
        className="absolute right-6 top-6 font-mono text-[11px] tracking-[0.2em] text-ink-2 transition-colors hover:text-accent"
      >
        CLOSE ✕
      </button>
    </div>
  );
}
