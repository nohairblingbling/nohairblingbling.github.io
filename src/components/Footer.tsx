import { footer } from '../content';

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 font-mono text-[11px] text-ink-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>© {footer.year} Yuzhuo Jia</span>
        <span>
          <span className="text-accent">●</span> {footer.coordinates}
        </span>
        <span>{footer.exif}</span>
        <a href="#top" data-cursor className="inline-flex min-h-11 items-center self-start text-xs text-ink-2 transition-colors hover:text-accent sm:self-auto">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}
