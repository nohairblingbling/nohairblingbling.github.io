// Keep the original radial highlight, moving only its own layer rather than inherited CSS variables.
import { useEffect, useRef, type ReactNode, type PointerEvent } from 'react';

export default function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const point = useRef({ x: 0, y: 0 });
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    point.current = { x: event.clientX, y: event.clientY };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (!ref.current || !light.current) return;
      const bounds = ref.current.getBoundingClientRect();
      light.current.style.transform = `translate3d(${point.current.x - bounds.left - 320}px, ${point.current.y - bounds.top - 320}px, 0)`;
    });
  };
  return (
    <div ref={ref} onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-sm border border-hairline bg-raised ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div ref={light} className="absolute left-0 top-0 h-[640px] w-[640px]"
          style={{ background: 'radial-gradient(320px circle, rgb(168 182 192 / 0.08), transparent 65%)' }} />
      </div>
      {children}
    </div>
  );
}
