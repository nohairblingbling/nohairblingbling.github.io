import type { Photo } from '../../content';

export const SPROCKET_BG =
  'repeating-linear-gradient(90deg, #050608 0px, #050608 12px, transparent 12px, transparent 26px)';

export function Sprockets() {
  return <div aria-hidden="true" className="h-2.5 w-full" style={{ backgroundImage: SPROCKET_BG }} />;
}

export default function Frame({
  photo,
  index,
  onSelect,
}: {
  photo: Photo;
  index: number;
  onSelect?: () => void;
}) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <figure className="shrink-0">
      <div className="border border-hairline bg-[#0c0b09] px-3 pb-3 pt-3">
        <Sprockets />
        <div className="flex items-baseline justify-between gap-10 py-2 font-mono text-[11px] tracking-[0.15em] text-ink-3">
          <span>YZJ 400</span>
          <span>
            {n}A · {photo.id}
          </span>
        </div>
        <button
          onClick={onSelect}
          data-cursor
          aria-label={`Enlarge photograph ${photo.id}`}
          className="block cursor-pointer"
        >
          <img
            src={photo.src}
            alt={photo.caption ?? `Photograph ${photo.id}`}
            draggable={false}
            className="h-[42vh] max-h-[430px] min-h-[240px] w-auto max-w-none select-none transition-[filter] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:hover:grayscale-0"
          />
        </button>
        {photo.caption && (
          <figcaption className="pt-2 font-mono text-[11px] text-ink-3">{photo.caption}</figcaption>
        )}
        <div className="pt-2">
          <Sprockets />
        </div>
      </div>
    </figure>
  );
}
