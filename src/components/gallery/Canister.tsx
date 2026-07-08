import type { Roll } from '../../content';
import { SPROCKET_BG } from './Frame';

export default function Canister({ roll, onOpen }: { roll: Roll; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      data-cursor
      aria-label={`Open roll ${roll.title}`}
      className="group block text-left"
    >
      <div className="flex items-center">
        <div className="relative z-10 h-32 w-60 rounded-lg border border-hairline bg-[#11151b] transition-transform duration-300 group-hover:-rotate-1">
          <div className="absolute inset-y-0 left-0 w-3 rounded-l-lg border-r border-hairline bg-[#1a212a]" />
          <div className="absolute inset-y-3 left-6 right-4 border-y border-accent/25 bg-[#0c0f13] px-4 py-2.5">
            <p className="font-mono text-[11px] tracking-[0.2em] text-accent">YZJ 400</p>
            <p className="mt-1 font-serif text-2xl italic leading-tight text-ink">{roll.title}</p>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.12em] text-ink-3">
              {roll.subtitle && `${roll.subtitle} · `}
              {String(roll.photos.length).padStart(2, '0')} EXP
              {roll.year && ` · ${roll.year}`}
            </p>
          </div>
        </div>
        <div className="relative -ml-1 h-14 w-20 transition-transform duration-500 group-hover:translate-x-3">
          <div
            className="absolute inset-0 border border-hairline bg-[#0c0b09]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 55% 60%, 45% 100%, 0 100%)' }}
          >
            <div className="mt-1.5 h-2 w-full" style={{ backgroundImage: SPROCKET_BG }} />
            <div className="absolute bottom-1.5 left-0 h-2 w-2/5" style={{ backgroundImage: SPROCKET_BG }} />
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-ink-3 transition-colors group-hover:text-accent">
        UNSPOOL →
      </p>
    </button>
  );
}
