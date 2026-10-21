import { describe, expect, it } from 'vitest';
import { CLOSED_POSE, OPEN_POSE, FULL_TURN, OPEN_DURATION, RETRACT_DURATION, RETURN_DURATION, sampleCanisterMotion } from '../components/gallery/canisterMotion';

describe('canister transport', () => {
  it('completes one continuous revolution without a stop or reversal in the middle', () => {
    let previous = 0;
    for (let step = 1; step <= 100; step++) {
      const current = sampleCanisterMotion(CLOSED_POSE, true, OPEN_DURATION * step / 100);
      expect(current.turn).toBeLessThan(previous);
      previous = current.turn;
    }
    expect(sampleCanisterMotion(CLOSED_POSE, true, OPEN_DURATION)).toEqual(OPEN_POSE);
    expect(OPEN_POSE.turn - CLOSED_POSE.turn).toBeCloseTo(-FULL_TURN);
  });
  it('starts and finishes rotation gently without the old segment velocity jumps', () => {
    const angle = (time: number) => sampleCanisterMotion(CLOSED_POSE, true, time).turn;
    expect(Math.abs(angle(1) - angle(0))).toBeLessThan(1e-6);
    expect(Math.abs(angle(OPEN_DURATION) - angle(OPEN_DURATION - 1))).toBeLessThan(1e-6);
    for (const position of [0.12, 0.4, 0.51, 0.88]) {
      const t = OPEN_DURATION * position;
      const before = angle(t) - angle(t - 1);
      const after = angle(t + 1) - angle(t);
      expect(Math.abs(before - after)).toBeLessThan(0.0001);
    }
  });
  it('starts shifting and rotating together before the film feeds out', () => {
    const starting = sampleCanisterMotion(CLOSED_POSE, true, 100);
    expect(starting.shift).toBeGreaterThan(0);
    expect(starting.shift).toBeLessThan(1);
    expect(starting.turn).toBeLessThan(0);
    expect(starting.film).toBe(0);
    const sliding = sampleCanisterMotion(CLOSED_POSE, true, 400);
    expect(sliding.shift).toBeGreaterThan(starting.shift);
    expect(sliding.shift).toBeLessThan(1);
    expect(sliding.turn).toBeLessThan(starting.turn);
    expect(sliding.film).toBeGreaterThan(0);
    const finishing = sampleCanisterMotion(CLOSED_POSE, true, OPEN_DURATION - 1);
    expect(finishing.film).toBeLessThan(1);
    expect(finishing.turn).toBeGreaterThan(OPEN_POSE.turn);
    expect(sampleCanisterMotion(CLOSED_POSE, true, OPEN_DURATION)).toEqual(OPEN_POSE);
  });
  it('finishes rewinding during the slide home after the film is fully inside', () => {
    let previousTurn = OPEN_POSE.turn;
    for (const time of [1, 100, 500, RETRACT_DURATION - 1]) {
      const sample = sampleCanisterMotion(OPEN_POSE, false, time);
      expect(sample.shift).toBe(OPEN_POSE.shift);
      expect(sample.turn).toBeGreaterThan(previousTurn);
      expect(sample.film).toBeGreaterThan(0);
      previousTurn = sample.turn;
    }
    const retracted = sampleCanisterMotion(OPEN_POSE, false, RETRACT_DURATION);
    expect(retracted.shift).toBe(1);
    expect(retracted.film).toBe(0);
    expect(retracted.turn).toBeLessThan(-Math.PI / 2);
    const returning = sampleCanisterMotion(OPEN_POSE, false, RETRACT_DURATION + RETURN_DURATION / 2);
    expect(returning.shift).toBeGreaterThan(0);
    expect(returning.shift).toBeLessThan(1);
    expect(returning.film).toBe(0);
    expect(returning.turn).toBeGreaterThan(retracted.turn);
    expect(returning.turn).toBeLessThan(0);
    const closed = sampleCanisterMotion(OPEN_POSE, false, RETRACT_DURATION + RETURN_DURATION);
    expect(closed).toEqual(CLOSED_POSE);
  });
  it('has no stop or velocity jump in rotation when the cartridge starts returning', () => {
    const angle = (time: number) => sampleCanisterMotion(OPEN_POSE, false, time).turn;
    const before = angle(RETRACT_DURATION) - angle(RETRACT_DURATION - 1);
    const after = angle(RETRACT_DURATION + 1) - angle(RETRACT_DURATION);
    expect(before).toBeGreaterThan(0);
    expect(after).toBeGreaterThan(0);
    expect(Math.abs(after - before)).toBeLessThan(0.0001);
  });
  it('keeps the printed front visible after closing and spins exactly once again on the next hover', () => {
    const closed = sampleCanisterMotion(OPEN_POSE, false, RETRACT_DURATION + RETURN_DURATION);
    const reopened = sampleCanisterMotion(closed, true, OPEN_DURATION);
    expect(reopened.turn - closed.turn).toBeCloseTo(-FULL_TURN);
    expect(Math.cos(reopened.turn)).toBeCloseTo(1);
    expect(Math.sin(reopened.turn)).toBeCloseTo(0);
  });
  it('reverses from the current pose without snapping on rapid pointer changes', () => {
    const interrupted = sampleCanisterMotion(CLOSED_POSE, true, 175);
    expect(sampleCanisterMotion(interrupted, false, 0)).toEqual(interrupted);
    const returning = sampleCanisterMotion(interrupted, false, 100);
    expect(sampleCanisterMotion(returning, true, 0)).toEqual(returning);
    const finished = sampleCanisterMotion(returning, true, OPEN_DURATION);
    expect(finished).toEqual(OPEN_POSE);
    expect(sampleCanisterMotion(finished, false, RETRACT_DURATION + RETURN_DURATION)).toEqual(CLOSED_POSE);
    const beforeFilm = sampleCanisterMotion(CLOSED_POSE, true, 100);
    expect(sampleCanisterMotion(beforeFilm, false, 0)).toEqual(beforeFilm);
    expect(sampleCanisterMotion(beforeFilm, false, RETURN_DURATION)).toEqual(CLOSED_POSE);
    const movingHome = sampleCanisterMotion(OPEN_POSE, false, RETRACT_DURATION + 100);
    expect(sampleCanisterMotion(movingHome, true, 0)).toEqual(movingHome);
  });
});
