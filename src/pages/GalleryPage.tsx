import { photos } from '../content';
import SectionHeader from '../components/ui/SectionHeader';
import FilmRoll from '../components/FilmRoll';

export default function GalleryPage() {
  return (
    <main id="top" className="min-h-screen pb-28 pt-36">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader index="03" label="GALLERY" title="" titleAccent="Gallery" />
        <p className="-mt-8 mb-12 font-mono text-[11px] tracking-[0.18em] text-ink-3">
          ONE ROLL — {String(photos.length).padStart(2, '0')} FRAMES · DRAG OR SCROLL SIDEWAYS
        </p>
      </div>
      <FilmRoll photos={photos} />
    </main>
  );
}
