import { about, timeline, stats } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import CornerBrackets from './ui/CornerBrackets';
import CountUp from './reactbits/CountUp';

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="02" label="ABOUT" title="About" />
      <div className="grid gap-12 md:grid-cols-[240px_1fr]">
        <Reveal>
          <div className="group relative w-56 border border-hairline p-1.5">
            <CornerBrackets />
            <img
              src={about.portrait}
              alt="Portrait of Yuzhuo Jia"
              className="w-full grayscale transition-all duration-500 group-hover:grayscale-0"
            />
          </div>
        </Reveal>
        <div>
          <Reveal delay={80}>
            <p className="max-w-2xl text-base leading-relaxed text-ink-2">{about.bio}</p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-8 flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <span
                  key={i}
                  className="border border-hairline px-3 py-1 font-mono text-[11px] tracking-wide text-ink-2"
                >
                  {i}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={240}>
            <ol className="mt-12">
              {timeline.map((t) => (
                <li
                  key={t.org}
                  className="flex items-baseline justify-between gap-6 border-b border-hairline py-4 first:border-t"
                >
                  <div>
                    <p className="text-sm text-ink">{t.org}</p>
                    <p className="mt-1 text-xs text-ink-3">{t.role}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-ink-3">{t.period}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-medium text-ink md:text-4xl">
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-3">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
