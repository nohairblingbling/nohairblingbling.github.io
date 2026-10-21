import { useEffect, useRef, useState } from 'react';

const DEVELOP_DURATION = 2800;

/** A single clock drives the visible progress and the handoff to the title's final hold. */
export default function EntranceProgress({ running, onComplete }: { running: boolean; onComplete: () => void }) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let started: number | undefined;
    const tick = (now: number) => {
      started ??= now;
      const progress = Math.min(1, (now - started) / DEVELOP_DURATION);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      setPercent(Math.floor(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else onComplete();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, onComplete]);

  return (
    <div className="entrance-progress" role="progressbar" aria-label="Intro progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="entrance-progress-labels" aria-hidden="true">
        <span>{percent === 100 ? 'FRAME READY' : 'DEVELOPING FRAME'}</span>
        <span className="entrance-progress-percent">{String(percent).padStart(3, '0')}<span>%</span></span>
      </div>
      <div className="entrance-progress-track" aria-hidden="true">
        <span ref={fillRef} className="entrance-progress-fill" />
      </div>
    </div>
  );
}
