import { useCallback, useState } from 'react';
import { rolls } from '../content';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal from '../components/ui/Reveal';
import Canister from '../components/gallery/Canister';
import RollStrip from '../components/gallery/RollStrip';
import Lightbox from '../components/gallery/Lightbox';

export default function GalleryPage() {
  const [rollId, setRollId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.location.hash.slice(1) || null : null
  );
  const [lightbox, setLightbox] = useState<number | null>(null);
  const roll = rolls.find((r) => r.id === rollId) ?? null;

  const openRoll = (id: string) => {
    setRollId(id);
    history.replaceState(null, '', `#${id}`);
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
    <main id="top" className="min-h-screen pb-28 pt-36">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader index="03" label="GALLERY" title="" titleAccent="Gallery" />
        {!roll ? (
          <p className="-mt-8 mb-14 font-mono text-[11px] tracking-[0.18em] text-ink-3">
            {String(rolls.length).padStart(2, '0')} ROLL{rolls.length > 1 ? 'S' : ''} ON THE SHELF ·
            PICK ONE TO UNSPOOL
          </p>
        ) : (
          <div className="-mt-8 mb-12">
            <button
              onClick={closeRoll}
              data-cursor
              className="font-mono text-[11px] tracking-[0.2em] text-ink-2 transition-colors hover:text-accent"
            >
              ← ALL ROLLS
            </button>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h3 className="font-serif text-3xl italic tracking-tight text-ink md:text-4xl">
                {roll.title}
              </h3>
              {roll.year && (
                <span className="font-mono text-[11px] tracking-[0.18em] text-ink-3">
                  {roll.year}
                </span>
              )}
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.18em] text-ink-2">
              <span className="text-ink-3">{String(roll.photos.length).padStart(2, '0')} FRAMES</span>
              <span className="text-ink-3">·</span>
              <span className="text-accent">HOVER TO PAUSE</span>
              <span className="text-ink-3">·</span>
              <span className="text-accent">DRAG TO SCRUB</span>
              <span className="text-ink-3">·</span>
              <span className="text-accent">CLICK TO ENLARGE</span>
            </p>
          </div>
        )}
      </div>

      {!roll ? (
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-16 gap-y-12 px-6">
          {rolls.map((r, i) => (
            <Reveal key={r.id} delay={i * 90}>
              <Canister roll={r} onOpen={() => openRoll(r.id)} />
            </Reveal>
          ))}
        </div>
      ) : (
        <RollStrip key={roll.id} roll={roll} onSelect={(i) => setLightbox(i)} />
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
