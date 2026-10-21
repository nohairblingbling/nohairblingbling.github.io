import type { Publication } from '../content';
import SpotlightCard from './reactbits/SpotlightCard';

export default function PubCard({ pub }: { pub: Publication }) {
  return (
    <SpotlightCard className="flex h-full flex-col">
      {pub.image && (
        <div className="relative overflow-hidden border-b border-hairline bg-[#080b0e]">
          <img
            src={pub.image}
            srcSet={pub.imageSrcSet}
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1024px) calc((100vw - 68px) / 2), 478px"
            alt=""
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full object-contain [filter:grayscale(1)_brightness(0.9)_contrast(1.05)] transition-[filter] duration-700 group-hover:[filter:none]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Publication</p>
          {pub.status && (
            <span className="border border-hairline px-2 py-0.5 font-mono text-xs text-ink-2">
              {pub.status}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-base font-medium leading-snug text-ink">{pub.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          {pub.authors.map((a, i) => (
            <span key={a.name} className={a.me ? 'text-ink' : ''}>
              {a.name}
              {i < pub.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
        <p className="mt-2 text-meta text-ink-2">{pub.venue}</p>
        {pub.link && (
          <a
            href={pub.link.url}
            target="_blank"
            rel="noreferrer"
            data-cursor
            className="mt-auto inline-flex min-h-11 items-center pt-2 font-mono text-xs tracking-[0.12em] text-ink-2 transition-colors hover:text-accent"
          >
            {pub.link.label.toUpperCase()} ↗
          </a>
        )}
      </div>
    </SpotlightCard>
  );
}
