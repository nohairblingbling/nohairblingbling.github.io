import { useRef, type ReactNode } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../../hooks';

type Variant = 'fade-up' | 'blur' | 'fade';

const hidden: Record<Variant, string> = {
  'fade-up': 'opacity-0 translate-y-6',
  blur: 'opacity-0 blur-[6px]',
  fade: 'opacity-0',
};

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInViewOnce(ref);
  const shown = reduced || inView;
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${reduced ? '' : 'transition-all duration-700 ease-out'} ${
        shown ? 'opacity-100 translate-y-0 blur-0' : hidden[variant]
      } ${className}`}
    >
      {children}
    </div>
  );
}
