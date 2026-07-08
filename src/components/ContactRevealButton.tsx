import { useCallback, useEffect, useRef, useState } from 'react';
import { contact } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import StarBorder from './reactbits/StarBorder';

const LABEL = 'GET IN TOUCH';
const CHARS = '!<>-_\\/[]{}—=+*^?#';

export default function ContactRevealButton() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const [display, setDisplay] = useState(coarse ? contact.email : LABEL);
  const timers = useRef<{
    scramble?: ReturnType<typeof setInterval>;
    restore?: ReturnType<typeof setTimeout>;
  }>({});

  const scrambleTo = useCallback((target: string) => {
    if (timers.current.scramble) clearInterval(timers.current.scramble);
    let revealed = 0;
    timers.current.scramble = setInterval(() => {
      revealed += 1;
      if (revealed >= target.length) {
        setDisplay(target);
        if (timers.current.scramble) clearInterval(timers.current.scramble);
      } else {
        setDisplay(
          target.slice(0, revealed) +
            Array.from({ length: target.length - revealed }, (_, i) =>
              target[revealed + i] === ' ' ? ' ' : CHARS[(Math.random() * CHARS.length) | 0]
            ).join('')
        );
      }
    }, 22);
  }, []);

  const onEnter = () => {
    if (coarse) return;
    if (timers.current.restore) clearTimeout(timers.current.restore);
    if (reduced) {
      setDisplay(contact.email);
      return;
    }
    scrambleTo(contact.email);
  };

  // 移开后邮箱保留 3 秒，再"复原"为 GET IN TOUCH
  const onLeave = () => {
    if (coarse) return;
    if (timers.current.restore) clearTimeout(timers.current.restore);
    timers.current.restore = setTimeout(() => {
      if (reduced) setDisplay(LABEL);
      else scrambleTo(LABEL);
    }, 3000);
  };

  useEffect(() => {
    const t = timers.current;
    return () => {
      if (t.scramble) clearInterval(t.scramble);
      if (t.restore) clearTimeout(t.restore);
    };
  }, []);

  return (
    <StarBorder
      href={`mailto:${contact.email}`}
      ariaLabel={`Email ${contact.email}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span className="relative inline-block whitespace-nowrap normal-case">
        <span className="invisible">{contact.email}</span>
        <span aria-hidden="true" className="absolute inset-0 text-center">
          {display}
        </span>
      </span>
    </StarBorder>
  );
}
