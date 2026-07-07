import { useEffect, useState } from 'react';

export const NAV_SECTIONS = [
  { id: 'research', label: 'RESEARCH' },
  { id: 'publications', label: 'PUBLICATIONS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    for (const s of NAV_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a href="#top" data-cursor className="font-mono text-sm tracking-widest text-accent">
          YZ_J
        </a>
        <div className="hidden gap-7 md:flex">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-cursor
              className={`font-mono text-[11px] tracking-[0.18em] transition-colors ${
                active === s.id ? 'text-accent' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {s.label}
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
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 font-mono text-xs tracking-[0.2em] text-ink-2"
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
