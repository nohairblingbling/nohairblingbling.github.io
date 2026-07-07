import { useState } from 'react';

export const NAV_LINKS = [
  { href: '/', label: 'ABOUT' },
  { href: '/publications/', label: 'PUBLICATIONS' },
  { href: '/gallery/', label: 'GALLERY' },
];

function isActive(href: string, path: string) {
  return href === '/' ? path === '/' : path.startsWith(href.replace(/\/$/, ''));
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a href="/" data-cursor className="font-mono text-sm tracking-widest text-accent">
          YZ_J
        </a>
        <div className="hidden gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor
              className={`font-mono text-[11px] tracking-[0.18em] transition-colors ${
                isActive(l.href, path) ? 'text-accent' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="font-mono text-[11px] tracking-[0.18em] text-ink-2 md:hidden"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </nav>
      {open && (
        <div className="border-t border-hairline bg-base/95 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 font-mono text-xs tracking-[0.2em] text-ink-2"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
