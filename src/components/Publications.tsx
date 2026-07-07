import { publications, type Publication } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import SpotlightCard from './reactbits/SpotlightCard';

function PubCard({ pub }: { pub: Publication }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      {pub.image && (
        <div className="border-b border-hairline">
          <img
            src={pub.image}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Publication</p>
          {pub.status && (
            <span className="border border-hairline px-2 py-0.5 font-mono text-[11px] text-ink-2">
              {pub.status}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-base font-medium leading-snug text-ink">{pub.title}</h3>
        <p className="mt-2 text-sm text-ink-3">
          {pub.authors.map((a, i) => (
            <span key={a.name} className={a.me ? 'text-ink' : ''}>
              {a.name}
              {i < pub.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <p className="mt-2 text-xs text-ink-3">{pub.venue}</p>
        {pub.link && (
          <a
            href={pub.link.url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="mt-auto pt-4 font-mono text-[11px] tracking-[0.15em] text-ink-2 transition-colors hover:text-accent"
          >
            {pub.link.label.toUpperCase()} ↗
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}

export default function Publications() {
  return (
    <section id="publications" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="03" label="PUBLICATIONS" title="Publications" />
      <div className="grid gap-5 md:grid-cols-2">
        {publications.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <PubCard pub={p} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-[11px] text-ink-3">* Equal contribution</p>
    </section>
  );
}
