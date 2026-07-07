import { hero, contact, socials } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import Particles from './reactbits/Particles';
import DecryptedText from './reactbits/DecryptedText';
import StarBorder from './reactbits/StarBorder';

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {!reduced && !coarse && (
        <div className="absolute inset-0" aria-hidden="true">
          <Particles />
        </div>
      )}
      <div className="relative mx-auto w-full max-w-5xl px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-accent">{hero.kicker}</p>
        <h1 className="mt-6 text-5xl font-medium tracking-tight text-ink md:text-7xl">
          <DecryptedText text={hero.name} />
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">{hero.tagline}</p>
        <p className="mt-3 font-mono text-xs text-ink-3">{hero.position}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <StarBorder href="#research">View research</StarBorder>
          <a
            href={socials[0].url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
          >
            GITHUB ↗
          </a>
          <a
            href={`mailto:${contact.email}`}
            data-cursor
            className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
          >
            EMAIL ↗
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 font-mono text-[11px] text-ink-3">
          <span>
            <span className="animate-pulse-dot text-accent">●</span> {hero.status}
          </span>
          <span>SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}
