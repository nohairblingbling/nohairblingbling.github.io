// Vendored equivalent of reactbits.dev "Star Border" (https://reactbits.dev/animations/star-border), MIT.
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks';

export default function StarBorder({
  children,
  href,
  className = '',
  ariaLabel,
  onMouseEnter,
  onMouseLeave,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  ariaLabel?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <a
      href={href}
      data-cursor
      aria-label={ariaLabel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative inline-block overflow-hidden rounded-sm p-px ${className}`}
    >
      {!reduced && (
        <>
          <span
            aria-hidden="true"
            className="animate-star-top absolute left-0 top-0 h-1/2 w-full"
            style={{ background: 'radial-gradient(circle, rgb(45 212 232 / 0.9) 0%, transparent 12%)' }}
          />
          <span
            aria-hidden="true"
            className="animate-star-bottom absolute bottom-0 left-0 h-1/2 w-full"
            style={{ background: 'radial-gradient(circle, rgb(45 212 232 / 0.9) 0%, transparent 12%)' }}
          />
        </>
      )}
      <span
        className={`relative z-10 block border bg-base px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent ${
          reduced ? 'border-accent/50' : 'border-hairline'
        }`}
      >
        {children}
      </span>
    </a>
  );
}
