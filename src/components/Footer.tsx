import { footer } from '../content';

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 font-mono text-[11px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <span>© {footer.year} Yuzhuo Jia</span>
        <span>
          <span className="text-accent">●</span> {footer.coordinates}
        </span>
        <a href="#top" data-cursor className="transition-colors hover:text-accent">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
}
