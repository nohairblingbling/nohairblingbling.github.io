import { useEffect, useRef, useState } from 'react';
import type { Photo } from '../content';
import Reveal from './ui/Reveal';

const SPROCKET_BG =
  'repeating-linear-gradient(90deg, #050608 0px, #050608 12px, transparent 12px, transparent 26px)';

function Sprockets() {
  return <div aria-hidden="true" className="h-2.5 w-full" style={{ backgroundImage: SPROCKET_BG }} />;
}

function Frame({ photo, index }: { photo: Photo; index: number }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <figure className="shrink-0 snap-start">
      <Reveal variant="develop" delay={index * 90}>
        <div className="border border-hairline bg-[#0c0b09] px-3 pb-3 pt-3">
          <Sprockets />
          <div className="flex items-baseline justify-between gap-10 py-2 font-mono text-[11px] tracking-[0.15em] text-ink-3">
            <span>YZJ 400</span>
            <span>
              {n}A · {photo.id}
            </span>
          </div>
          <img
            src={photo.src}
            alt={photo.caption ?? `Photograph ${photo.id}`}
            draggable={false}
            className="pointer-events-none h-[42vh] max-h-[430px] min-h-[240px] w-auto max-w-none select-none"
          />
          {photo.caption && (
            <figcaption className="pt-2 font-mono text-[11px] text-ink-3">{photo.caption}</figcaption>
          )}
          <div className="pt-2">
            <Sprockets />
          </div>
        </div>
      </Reveal>
    </figure>
  );
}

export default function FilmRoll({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, startLeft: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="border-y border-hairline bg-[#0c0b09]">
      <div
        ref={ref}
        className={`film-scroll flex gap-8 overflow-x-auto px-8 py-6 md:px-12 ${
          dragging ? 'cursor-grabbing' : 'snap-x cursor-grab'
        }`}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') return;
          const el = ref.current;
          if (!el) return;
          drag.current = { startX: e.clientX, startLeft: el.scrollLeft };
          setDragging(true);
          el.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging || !ref.current) return;
          ref.current.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
        }}
        onPointerUp={(e) => {
          if (dragging && ref.current) ref.current.releasePointerCapture(e.pointerId);
          setDragging(false);
        }}
        onPointerCancel={() => setDragging(false)}
      >
        {photos.map((p, i) => (
          <Frame key={p.id} photo={p} index={i} />
        ))}
      </div>
    </div>
  );
}
