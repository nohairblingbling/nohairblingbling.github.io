import { useCallback, useState } from 'react';
import { rolls } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Canister from '../components/gallery/Canister';
import RollStrip from '../components/gallery/RollStrip';
import Lightbox from '../components/gallery/Lightbox';
import '../components/gallery/film.css';

export default function GalleryPage() {
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const [rollId, setRollId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.location.hash.slice(1) || null : null
  );
  const [lightbox, setLightbox] = useState<number | null>(null);
  const roll = rolls.find((r) => r.id === rollId) ?? null;

  const openRoll = (id: string) => {
    setRollId(id);
    history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const closeRoll = () => {
    setRollId(null);
    setLightbox(null);
    history.replaceState(null, '', window.location.pathname);
  };
  const navLightbox = useCallback(
    (delta: number) => {
      if (!roll) return;
      setLightbox((i) => (i === null ? i : (i + delta + roll.photos.length) % roll.photos.length));
    },
    [roll]
  );

  return (
    <main id="top" className={`gallery-film ${roll ? 'gallery-view' : 'min-h-screen pb-28 pt-28 md:pt-36'}`}>
      <div className="mx-auto w-full max-w-5xl px-6">
        {!roll ? (
          <>
            <SectionHeader index="03" label="GALLERY" title="" titleAccent="Gallery" />
            <p className="-mt-4 mb-10 font-mono text-xs leading-relaxed tracking-[0.12em] text-ink-2 md:-mt-8 md:mb-14">
              {String(rolls.length).padStart(2, '0')} ROLL{rolls.length > 1 ? 'S' : ''} ON THE SHELF ·
              PICK ONE TO UNSPOOL
            </p>
          </>
        ) : (
          <header>
            <button
              onClick={closeRoll}
              data-cursor
              className="inline-flex min-h-11 items-center font-mono text-xs tracking-[0.14em] text-ink-2 transition-colors hover:text-accent"
            >
              ← ALL ROLLS
            </button>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <h1 className="font-serif text-4xl italic leading-tight tracking-tight text-[#bfe6ee] md:text-5xl">
                {roll.title}
              </h1>
              <p className="flex items-center gap-3 font-mono text-meta tracking-[0.08em] text-ink-2">
                {roll.year && <><span>{roll.year}</span><span aria-hidden="true" className="text-ink-3">/</span></>}
                <span>{String(roll.photos.length).padStart(2, '0')} FRAMES</span>
              </p>
            </div>
          </header>
        )}
      </div>

      {!roll ? (
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-16 gap-y-12 px-6">
          {rolls.map((r, i) => (
            <Reveal key={r.id} delay={i * 90} className="w-[360px] max-w-full">
              <Canister roll={r} onOpen={() => openRoll(r.id)} />
            </Reveal>
          ))}
        </div>
      ) : (
        <section className="film-viewer" aria-label={`${roll.title} photographs`}>
          <RollStrip key={roll.id} roll={roll} onSelect={(i) => setLightbox(i)} />
          <p className="film-instructions mx-auto mt-4 flex w-full max-w-5xl flex-wrap items-center gap-x-2.5 gap-y-1 px-6 font-mono text-xs leading-relaxed tracking-[0.06em] text-ink-2">
            {!coarse && !reduced && (
              <>
                <span>HOVER TO PAUSE</span>
                <span className="text-ink-3">·</span>
              </>
            )}
            <span>{coarse ? 'SWIPE TO BROWSE' : reduced ? 'SCROLL TO BROWSE' : 'DRAG TO SCRUB'}</span>
            <span className="text-ink-3">·</span>
            <span>{coarse ? 'TAP TO ENLARGE' : 'CLICK TO ENLARGE'}</span>
          </p>
        </section>
      )}

      {roll && lightbox !== null && (
        <Lightbox
          roll={roll}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={navLightbox}
        />
      )}
    </main>
  );
}
