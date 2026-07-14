import type { Publication } from '../content';
import SpotlightCard from './reactbits/SpotlightCard';

export default function PubCard({ pub }: { pub: Publication }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      {pub.image && (
        <div className="relative overflow-hidden border-b border-hairline bg-[#080b0e]">
          <img
            src={pub.image}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-contain [filter:grayscale(1)_brightness(0.9)_contrast(1.05)] transition-[filter] duration-700 group-hover:[filter:none]"
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
