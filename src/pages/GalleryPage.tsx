import { useCallback, useEffect, useState } from 'react';
import { galleryCategories, rolls } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import Reveal from '../components/ui/Reveal';
import Canister from '../components/gallery/Canister';
import RollStrip from '../components/gallery/RollStrip';
import Lightbox from '../components/gallery/Lightbox';
import useGalleryNavigation from '../components/gallery/useGalleryNavigation';
import '../components/gallery/film.css';
import '../components/gallery/catalog.css';

const filters = [{ id: 'all', label: 'All' }, ...galleryCategories] as const;
const pad = (value: number) => String(value).padStart(2, '0');

export default function GalleryPage() {
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const { category, rollId, openRoll, closeRoll, selectCategory } = useGalleryNavigation();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const roll = rolls.find((item) => item.id === rollId) ?? null;
  const filtered = rolls.filter((item) => category === 'all' || item.category === category);
  const categoryLabel = galleryCategories.find((item) => item.id === roll?.category)?.label;
  const related = roll && rolls.find((item) => item.location === roll.location && item.category !== roll.category);
  const frameCount = filtered.reduce((total, item) => total + item.photos.length, 0);

  useEffect(() => { setLightbox(null); }, [rollId]);
  const navLightbox = useCallback((delta: number) => {
    if (!roll) return;
    setLightbox((index) => index === null ? index : (index + delta + roll.photos.length) % roll.photos.length);
  }, [roll]);

  return (
    <main id="top" className={`gallery-film ${roll ? 'gallery-view' : 'gallery-shelf-view'}`}>
      <div className="mx-auto w-full max-w-5xl px-6">
        {!roll ? (
          <>
            <Reveal variant="fade">
              <header className="gallery-shelf-heading">
                <div>
                  <p className="gallery-kicker">FR.03 · PHOTOGRAPHIC ARCHIVE</p>
                  <h1 className="gallery-title">Gallery</h1>
                </div>
                <p className="gallery-summary">{pad(rolls.length)} rolls · {pad(rolls.reduce((n, item) => n + item.photos.length, 0))} frames</p>
              </header>
            </Reveal>
            <div className="gallery-filters" role="group" aria-label="Photography categories">
              {filters.map((filter) => {
                const count = rolls.filter((item) => filter.id === 'all' || item.category === filter.id).length;
                return (
                  <button key={filter.id} type="button" data-cursor aria-pressed={category === filter.id}
                    aria-controls="gallery-rolls" onClick={() => selectCategory(filter.id)}>
                    {filter.label}<span aria-hidden="true">{pad(count)}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <header>
            <nav className="gallery-breadcrumb" aria-label="Gallery breadcrumb">
              <button onClick={() => closeRoll()} data-cursor>← Gallery</button>
              <span aria-hidden="true">/</span>
              <button onClick={() => closeRoll(roll.category)} data-cursor>{categoryLabel}</button>
            </nav>
            <h1 id="gallery-roll-heading" tabIndex={-1} className="gallery-title">{roll.title}</h1>
            <p className="gallery-roll-summary">{roll.date ?? roll.year}<span aria-hidden="true">/</span>{pad(roll.photos.length)} frames</p>
          </header>
        )}
      </div>
      {!roll ? (
        <div className="mx-auto w-full max-w-5xl px-6">
          <div id="gallery-rolls" className="gallery-rolls">
            {filtered.map((item, index) => (
              <Reveal key={item.id} delay={index * 60} className="min-w-0">
                <Canister roll={item} onOpen={() => openRoll(item.id)} />
              </Reveal>
            ))}
          </div>
          <div className="gallery-shelf-footer">
            <p role="status">{filtered.length} {filtered.length === 1 ? 'roll' : 'rolls'} · {frameCount} frames</p>
            <p>Choose a roll to unspool <span aria-hidden="true">↗</span></p>
          </div>
        </div>
      ) : (
        <section className="film-viewer" aria-label={`${categoryLabel}: ${roll.title} photographs`}>
          <RollStrip key={roll.id} roll={roll} onSelect={setLightbox} />
          <div className="mx-auto w-full max-w-5xl px-6">
            <p className="film-instructions mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs leading-relaxed tracking-[0.06em] text-ink-2">
              {!coarse && !reduced && <><span>HOVER TO PAUSE</span><span aria-hidden="true" className="text-ink-3">·</span></>}
              <span>{coarse ? 'SWIPE TO BROWSE' : reduced ? 'SCROLL TO BROWSE' : 'DRAG TO SCRUB'}</span>
              <span aria-hidden="true" className="text-ink-3">·</span>
              <span>{coarse ? 'TAP TO ENLARGE' : 'CLICK TO ENLARGE'}</span>
            </p>
            {related && (
              <button className="gallery-related" data-cursor onClick={() => openRoll(related.id)}>
                Same place <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">{galleryCategories.find((item) => item.id === related.category)?.label} <span aria-hidden="true">→</span></span>
              </button>
            )}
          </div>
        </section>
      )}
      {roll && lightbox !== null && lightbox < roll.photos.length && (
        <Lightbox key={roll.id} roll={roll} index={lightbox} onClose={() => setLightbox(null)} onNav={navLightbox} />
      )}
    </main>
  );
}
