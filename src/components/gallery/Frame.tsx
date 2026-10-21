import type { Photo } from '../../content';

export default function Frame({
  photo,
  index,
  onSelect,
  duplicate = false,
}: {
  photo: Photo;
  index: number;
  onSelect?: () => void;
  duplicate?: boolean;
}) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <figure className="film-frame">
      <div className="film-edge film-edge-top">
        <span>YZJ 400</span>
        <span>{photo.id}</span>
      </div>
      <button
        onClick={(e) => {
          // Pointer clicks do not focus buttons in every browser. Make the
          // originating frame available for the lightbox to restore focus.
          e.currentTarget.focus({ preventScroll: true });
          onSelect?.();
        }}
        data-cursor
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`Enlarge photograph ${photo.id}`}
        className="film-window group"
      >
        <img
          src={photo.display?.src ?? photo.src}
          srcSet={photo.display?.srcSet}
          sizes="(max-width: 767px) and (max-height: 700px) 360px, (max-width: 767px) 645px, (max-height: 800px) 540px, 780px"
          width={photo.display?.width}
          height={photo.display?.height}
          loading={!duplicate && index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          alt={photo.caption ?? `Photograph ${photo.id}`}
          draggable={false}
          className="film-image w-auto max-w-none select-none transition-[filter] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:hover:grayscale-0 [@media(hover:hover)]:group-focus-visible:grayscale-0"
        />
      </button>
      <div className="film-edge film-edge-bottom" aria-hidden="true">
        <span className="film-frame-number">{n}<span className="film-frame-arrow">▴</span></span>
        <span className="film-edge-code" />
        <span>{n}A</span>
      </div>
      {photo.caption && <figcaption className="film-caption">{photo.caption}</figcaption>}
    </figure>
  );
}
