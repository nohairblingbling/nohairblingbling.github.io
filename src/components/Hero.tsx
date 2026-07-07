import { hero, about, timeline, socials } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import Particles from './reactbits/Particles';
import DecryptedText from './reactbits/DecryptedText';
import StarBorder from './reactbits/StarBorder';
import CornerBrackets from './ui/CornerBrackets';

function renderAccented(text: string) {
  return text.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="font-serif text-[1.06em] italic text-[#bfe6ee]">
        {part}
      </em>
    ) : (
      part
    )
  );
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  return (
    <section id="top" className="relative overflow-hidden">
      {!reduced && !coarse && (
        <div className="absolute inset-0" aria-hidden="true">
          <Particles />
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 38%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 pb-12 pt-24">
        <div className="grid gap-12 md:grid-cols-[1fr_250px] md:gap-16">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-accent">{hero.kicker}</p>
            <h1 className="mt-5 text-5xl font-medium tracking-tight text-ink md:text-6xl">
              <DecryptedText text={hero.name} animateOn="both" />
            </h1>
            <p className="mt-4 font-mono text-xs text-ink-3">{hero.position}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2">
              {renderAccented(hero.bio)}
            </p>
            <div className="mt-7 flex max-w-xl flex-wrap gap-2">
              {about.interests.map((i) => (
                <span
                  key={i}
                  className="border border-hairline px-3 py-1 font-mono text-[11px] tracking-wide text-ink-2"
                >
                  {i}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
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
                href={hero.cv}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="font-mono text-[11px] tracking-[0.18em] text-ink-2 transition-colors hover:text-accent"
              >
                CV ↗
              </a>
            </div>
          </div>
          <div>
            <div className="group relative max-w-[250px] border border-hairline p-1.5">
              <CornerBrackets />
              <img src={about.portrait} alt="Portrait of Yuzhuo Jia" className="w-full" />
            </div>
            <p className="mt-8 font-mono text-[11px] tracking-[0.22em] text-accent">EDUCATION</p>
            <ol className="mt-2">
              {timeline.map((t) => (
                <li key={t.org} className="border-b border-hairline py-3 last:border-b-0">
                  <p className="text-sm leading-snug text-ink">{t.org}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-3">
                    {t.role} · {t.period}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-hairline pt-7 font-mono text-[11px] text-ink-3">
          <span>
            <span className="animate-pulse-dot text-accent">●</span> {hero.status}
          </span>
          <span className="hidden sm:inline">SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}
