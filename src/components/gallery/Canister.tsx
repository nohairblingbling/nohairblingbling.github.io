import { useEffect, useRef, useState } from 'react';
import { galleryCategories, type Roll } from '../../content';
import { useIsCoarsePointer, usePrefersReducedMotion } from '../../hooks';
import FilmStock from './FilmStock';
import CanisterModel, { type CanisterModelHandle } from './CanisterModel';
import { CLOSED_POSE, FULL_TURN, OPEN_DURATION, RETRACT_DURATION, RETURN_DURATION, sampleCanisterMotion, settledPose } from './canisterMotion';

export default function Canister({ roll, onOpen }: { roll: Roll; onOpen: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLDivElement>(null);
  const pose = useRef({ ...CLOSED_POSE });
  const model = useRef<CanisterModelHandle>({ turn: 0 });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const open = (!coarse && hovered) || focused;
  const category = galleryCategories.find((item) => item.id === roll.category)!;

  useEffect(() => {
    const button = buttonRef.current;
    const assembly = assemblyRef.current;
    const leader = leaderRef.current;
    if (!button || !assembly || !leader) return;
    const from = { ...pose.current };
    const duration = open ? OPEN_DURATION : (from.film > 0 ? RETRACT_DURATION : 0) + RETURN_DURATION;
    let started: number | undefined;
    let raf = 0;
    const paint = () => {
      const { shift, film, turn } = pose.current;
      assembly.style.transform = `translate3d(calc((50% - 98px) * ${1 - shift}), 0, 0)`;
      leader.style.transform = `translate3d(calc(${(film - 1) * 100}% - ${(1 - film) * 2}px), 0, 0)`;
      if (!model.current.render) {
        // Keep the non-WebGL fallback readable instead of flipping a flat label backwards.
        const fallbackTurn = Math.sin(turn) * 0.22;
        button.style.setProperty('--canister-turn', `rotateY(${fallbackTurn}rad)`);
        button.style.setProperty('--print-position', `translate3d(${fallbackTurn * 12}px, 0, 0)`);
        button.style.setProperty('--label-reflection', `translate3d(${-12 - fallbackTurn * 35}px, 0, 0)`);
      }
      model.current.turn = turn;
      model.current.render?.();
    };
    if (reduced) {
      pose.current = settledPose(from, open);
      paint();
      return;
    }
    const aligned = Math.abs(from.turn / FULL_TURN - Math.round(from.turn / FULL_TURN)) < 1e-7;
    if (from.shift === (open ? 1 : 0) && from.film === (open ? 1 : 0) && aligned) {
      paint();
      return;
    }
    const tick = (now: number) => {
      started ??= now;
      pose.current = sampleCanisterMotion(from, open, now - started);
      paint();
      if (now - started < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, reduced]);

  return (
    <button
      ref={buttonRef}
      onClick={onOpen}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => setFocused(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => setFocused(false)}
      data-cursor
      data-roll-id={roll.id}
      aria-label={`Open ${category.label.toLowerCase()} roll ${roll.title}`}
      className={`film-canister group block w-full text-left ${modelReady ? 'model-ready' : ''}`}
    >
      <div className="gallery-roll-object" aria-hidden="true">
        <div className="film-canister-stage">
          <div ref={assemblyRef} className="film-canister-assembly">
            <div className="film-leader-sleeve">
              <div ref={leaderRef} className="film-leader">
                <FilmStock />
                <span className="film-leader-mark" aria-hidden="true">400 →</span>
              </div>
            </div>
            <CanisterModel roll={roll} motion={model} onReady={setModelReady} />
            <div className="film-canister-body">
              <span className="film-mouth" aria-hidden="true" />
              <span className="film-cap film-cap-top" aria-hidden="true" />
              <span className="film-spindle" aria-hidden="true" />
              <div className="film-canister-label">
                <div className="film-canister-print">
                  <p className="film-canister-brand">YZJ · {category.mark}</p>
                  <p className="film-canister-title">{roll.title}</p>
                  <p className="film-canister-stock">400 <span className="film-barcode" aria-hidden="true" /></p>
                  <p className="film-canister-meta">
                    {roll.subtitle && `${roll.subtitle} · `}
                    {String(roll.photos.length).padStart(2, '0')} EXP
                    {roll.year && ` · ${roll.year}`}
                  </p>
                </div>
              </div>
              <span className="film-dx-code" aria-hidden="true" />
              <span className="film-cap film-cap-bottom" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <span className="gallery-roll-info">
        <span className="gallery-roll-category">{category.label}</span>
        <span className="gallery-roll-title">{roll.title}</span>
        <span className="gallery-roll-meta">{roll.date ?? roll.year} · {String(roll.photos.length).padStart(2, '0')} frames</span>
        <span className="gallery-roll-open">Unspool roll <span aria-hidden="true">↗</span></span>
      </span>
    </button>
  );
}
