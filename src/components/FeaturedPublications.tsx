import { publications } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import PubCard from './PubCard';

export default function FeaturedPublications() {
  const featured = publications.filter((p) => p.featured);
  return (
    <section id="publications" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="02" label="SELECTED WORK" title="" titleAccent="Selected Work" />
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.title} variant="develop" delay={i * 80} className="h-full">
            <PubCard pub={p} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-6">
        <a
          href="/publications/"
          data-cursor
          className="inline-block border border-hairline px-6 py-3 font-mono text-[11px] tracking-[0.2em] text-ink-2 transition-colors hover:border-accent/50 hover:text-accent"
        >
          ALL PUBLICATIONS →
        </a>
        <p className="font-mono text-[11px] text-ink-3">* Equal contribution</p>
      </div>
    </section>
  );
}
