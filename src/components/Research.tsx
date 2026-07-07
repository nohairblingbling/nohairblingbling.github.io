import { useState } from 'react';
import { research, type ResearchEntry } from '../content';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import CornerBrackets from './ui/CornerBrackets';

function ResearchItem({ item, index }: { item: ResearchEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const descId = `research-desc-${index}`;
  return (
    <li className="border-b border-hairline first:border-t">
      <Reveal delay={index * 60}>
        <div className="group relative cursor-pointer py-6" onClick={() => setExpanded((v) => !v)}>
          <CornerBrackets />
          <div className="flex items-baseline justify-between gap-6">
            <button
              aria-expanded={expanded}
              aria-controls={descId}
              data-cursor
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
              className="flex flex-1 items-baseline gap-4 text-left"
            >
              <span className="shrink-0 font-mono text-[11px] text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-base font-medium text-ink md:text-lg">{item.title}</span>
            </button>
            <span className="hidden shrink-0 font-mono text-[11px] text-ink-3 sm:block">
              {item.period}
            </span>
          </div>
          <p
            id={descId}
            className={`mt-3 max-w-3xl pl-8 text-sm leading-relaxed text-ink-2 ${
              expanded ? '' : 'line-clamp-2'
            }`}
          >
            {item.description}
          </p>
          <p className="mt-2 pl-8 font-mono text-[11px] text-ink-3 sm:hidden">{item.period}</p>
        </div>
      </Reveal>
    </li>
  );
}

export default function Research() {
  return (
    <section id="research" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-28">
      <SectionHeader index="03" label="RESEARCH" title="Selected research" />
      <ol>
        {research.map((item, i) => (
          <ResearchItem key={item.title} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
}
