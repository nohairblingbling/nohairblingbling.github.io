import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { contact } from '../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks';
import StarBorder from './reactbits/StarBorder';

const LABEL = 'GET IN TOUCH';
const COPIED = 'EMAIL COPIED ✓';
const CHARS = '!<>-_\\/[]{}—=+*^?#';

export default function ContactRevealButton() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  const [display, setDisplay] = useState(coarse ? contact.email : LABEL);
  const hovering = useRef(false);
  const timers = useRef<{
    scramble?: ReturnType<typeof setInterval>;
    restore?: ReturnType<typeof setTimeout>;
    copied?: ReturnType<typeof setTimeout>;
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

  const showEmail = useCallback(() => {
    if (reduced) setDisplay(contact.email);
    else scrambleTo(contact.email);
  }, [reduced, scrambleTo]);

  const showLabel = useCallback(() => {
    if (reduced) setDisplay(LABEL);
    else scrambleTo(LABEL);
  }, [reduced, scrambleTo]);

  const onEnter = () => {
    if (coarse) return;
    hovering.current = true;
    if (timers.current.restore) clearTimeout(timers.current.restore);
    if (timers.current.copied) return; // don't interrupt the copied confirmation
    showEmail();
  };

  // 移开后邮箱保留 3 秒，再"复原"为 GET IN TOUCH
  const onLeave = () => {
    if (coarse) return;
    hovering.current = false;
    if (timers.current.restore) clearTimeout(timers.current.restore);
    if (timers.current.copied) return; // copied flow handles the revert
    timers.current.restore = setTimeout(showLabel, 3000);
  };

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(contact.email);
        return;
      }
    } catch {
      /* fall through to the textarea fallback */
    }
    const ta = document.createElement('textarea');
    ta.value = contact.email;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {
      /* clipboard unavailable — email is still visible to select manually */
    }
    document.body.removeChild(ta);
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 默认行为改为复制，而非打开邮件客户端
    void copyEmail();
    if (timers.current.scramble) clearInterval(timers.current.scramble);
    if (timers.current.restore) clearTimeout(timers.current.restore);
    if (timers.current.copied) clearTimeout(timers.current.copied);
    setDisplay(COPIED);
    timers.current.copied = setTimeout(() => {
      timers.current.copied = undefined;
      if (hovering.current || coarse) showEmail();
      else showLabel();
    }, 1800);
  };

  useEffect(() => {
    const t = timers.current;
    return () => {
      if (t.scramble) clearInterval(t.scramble);
      if (t.restore) clearTimeout(t.restore);
      if (t.copied) clearTimeout(t.copied);
    };
  }, []);

  return (
    <StarBorder
      href={`mailto:${contact.email}`}
      ariaLabel={`Copy email ${contact.email}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
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
