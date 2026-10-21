export type CanisterPose = { shift: number; film: number; turn: number };
export const CLOSED_POSE: CanisterPose = { shift: 0, film: 0, turn: 0 };
export const FULL_TURN = Math.PI * 2;
export const OPEN_POSE: CanisterPose = { shift: 1, film: 1, turn: -FULL_TURN };
export const OPEN_DURATION = 1350;
export const RETRACT_DURATION = 750;
export const RETURN_DURATION = 600;
const LEFT_SHIFT_DURATION = 660;
const FILM_START = 180;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.max(0, Math.min(1, t));
const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * x * (10 + x * (-15 + 6 * x));
};

export function settledPose(from: CanisterPose, open: boolean): CanisterPose {
  // Unspool forwards and rewind backwards, always stopping at the printed front.
  const turns = open
    ? Math.floor((from.turn - 1e-7) / FULL_TURN)
    : from.film > 0
      ? Math.ceil((from.turn + 1e-7) / FULL_TURN)
      : Math.round(from.turn / FULL_TURN);
  return { shift: open ? 1 : 0, film: open ? 1 : 0, turn: turns * FULL_TURN || 0 };
}

/** Keep the revolution continuous while the film and carriage overlap its timeline. */
export function sampleCanisterMotion(from: CanisterPose, open: boolean, elapsed: number): CanisterPose {
  const target = settledPose(from, open);
  if (open) {
    const progress = smooth(elapsed / OPEN_DURATION);
    return {
      shift: mix(from.shift, 1, smooth(elapsed / LEFT_SHIFT_DURATION)),
      film: mix(from.film, 1, smooth((elapsed - FILM_START) / (OPEN_DURATION - FILM_START))),
      turn: mix(from.turn, target.turn, progress),
    };
  }
  // Start rewinding in place, then finish the same revolution during the slide home.
  const retractTime = from.film > 0 ? RETRACT_DURATION : 0;
  const turnProgress = smooth(elapsed / (retractTime + RETURN_DURATION));
  return {
    film: retractTime ? mix(from.film, 0, smooth(elapsed / retractTime)) : 0,
    shift: mix(from.shift, 0, smooth((elapsed - retractTime) / RETURN_DURATION)),
    turn: mix(from.turn, target.turn, turnProgress),
  };
}
