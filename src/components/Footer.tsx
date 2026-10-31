import { footer } from '../content';
import { usePrefersReducedMotion } from '../hooks';

export default function Footer() {
  const reduced = usePrefersReducedMotion();
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 font-mono text-[11px] text-ink-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>© {footer.year} Yuzhuo Jia</span>
        <span>
          <span className="text-accent">●</span> {footer.coordinates}
        </span>
        <span>{footer.exif}</span>
        <a href="#top" data-cursor onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
          event.preventDefault();
          // Gallery hashes identify rolls, so scrolling must not replace the current roll URL.
          window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
        }} className="inline-flex min-h-11 items-center self-start text-xs text-ink-2 transition-colors hover:text-accent sm:self-auto">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}
