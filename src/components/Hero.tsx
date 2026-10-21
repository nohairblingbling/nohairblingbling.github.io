import { hero, about, timeline, socials } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import Particles from './reactbits/Particles';
import DecryptedText from './reactbits/DecryptedText';
import ContactRevealButton from './ContactRevealButton';
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
      <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-center px-6 pb-8 pt-24 md:min-h-screen md:pb-12">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker font-mono text-[11px] tracking-[0.22em] text-accent md:tracking-[0.3em]">{hero.kicker}</p>
            <div className="hero-identity min-w-0">
              <h1 className="text-[clamp(2rem,8.5vw,3rem)] leading-tight font-medium tracking-tight text-ink md:mt-5 md:text-6xl">
                <DecryptedText text={hero.name} animateOn="both" />
              </h1>
              <p className="mt-3 font-mono text-meta text-ink-2 md:mt-4">{hero.position}</p>
            </div>
            <div className="hero-bio mt-6 max-w-xl text-base leading-relaxed text-ink-2">
              <p>
                {hero.bio} advised by{' '}
                <a
                  href={hero.advisor.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  className="-my-2 inline-block min-h-11 py-2 align-baseline text-ink underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  Prof. {hero.advisor.name}
                </a>.
              </p>
              <p className="mt-4">{renderAccented(hero.research)}</p>
            </div>
            <div className="hero-interests mt-5 flex max-w-full flex-wrap gap-1.5 md:mt-7 md:gap-2">
              {about.interests.map((i) => (
                <span
                  key={i}
                  className="border border-hairline px-2 py-1 text-xs text-ink-2 md:px-3 md:font-mono"
                >
                  {i}
                </span>
              ))}
            </div>
            <div className="hero-actions mt-6 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 md:mt-9">
              <ContactRevealButton />
              <div className="flex w-full flex-wrap items-center justify-between gap-1 md:w-auto md:justify-start md:gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor
                    className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-mono text-xs tracking-[0.08em] text-ink-2 transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                ))}
                <a
                  href={hero.cv}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-mono text-xs tracking-[0.08em] text-ink-2 transition-colors hover:text-accent"
                >
                  CV ↗
                </a>
              </div>
            </div>
          </div>
          <div className="hero-profile">
            <div className="hero-portrait group relative max-w-[250px] self-start border border-hairline p-1 md:p-1.5">
              <CornerBrackets />
              <img src={about.portrait} srcSet={about.portraitDisplay.srcSet} sizes={about.portraitDisplay.sizes}
                width={800} height={800} fetchPriority="high" decoding="async"
                alt="Portrait of Yuzhuo Jia" className="aspect-square w-full object-cover" />
            </div>
            <div className="hero-education mt-6 md:mt-8">
              <p className="font-mono text-xs tracking-[0.18em] text-accent">EDUCATION</p>
              <ol className="mt-2">
                {timeline.map((t) => (
                  <li key={t.org} className="border-b border-hairline py-3">
                    <p className="text-sm leading-snug text-ink">{t.org}</p>
                    <p className="mt-1 font-mono text-meta text-ink-2">
                      {t.role} · {t.period}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-hairline pt-5 font-mono text-xs text-ink-2 md:mt-14 md:pt-7">
          <span>
            <span className="animate-pulse-dot text-accent">●</span> {hero.status}
          </span>
          <span className="hidden sm:inline">SCROLL ↓</span>
        </div>
      </div>
    </section>
  );
}
