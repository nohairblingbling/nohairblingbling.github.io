// Vendored equivalent of reactbits.dev "Decrypted Text" (https://reactbits.dev/text-animations/decrypted-text), MIT.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../../hooks';

const CHARS = '!<>-_\\/[]{}—=+*^?#';

export default function DecryptedText({
  text,
  animateOn = 'view',
  speed = 35,
  className = '',
}: {
  text: string;
  animateOn?: 'view' | 'hover' | 'both';
  speed?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(ref, 0.3);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    const scramble = (revealed: number) =>
      text.slice(0, revealed) +
      Array.from({ length: text.length - revealed }, (_, i) =>
        text[revealed + i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('');
    let revealed = 0;
    setStarted(true);
    setDisplay(scramble(0));
    timer.current = setInterval(() => {
      revealed += 1;
      if (revealed >= text.length) {
        setDisplay(text);
        if (timer.current) clearInterval(timer.current);
      } else {
        setDisplay(scramble(revealed));
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      setStarted(true);
      return;
    }
    if ((animateOn === 'view' || animateOn === 'both') && inView && !startedRef.current) {
      startedRef.current = true;
      run();
    }
  }, [reduced, animateOn, inView, run, text]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  return (
    <span
      ref={ref}
      aria-label={text}
      onMouseEnter={(animateOn === 'hover' || animateOn === 'both') && !reduced ? run : undefined}
      className={className}
    >
      <span
        aria-hidden="true"
        className={started || reduced || animateOn === 'hover' ? '' : 'opacity-0'}
      >
        {display}
      </span>
    </span>
  );
}
