import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RollStrip from '../components/gallery/RollStrip';
import Noise from '../components/reactbits/Noise';
import { rolls } from '../content';
import { observeAnimationVisibility } from '../lib/animationVisibility';

const matchMedia = window.matchMedia;
const originalIO = globalThis.IntersectionObserver;
let intersections: IntersectionObserverCallback[];
let disconnect: ReturnType<typeof vi.fn>;
function intersect(visible: boolean) {
  intersections.forEach(callback => callback([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver));
}
beforeEach(() => {
  vi.useFakeTimers();
  intersections = [];
  disconnect = vi.fn();
  window.matchMedia = query => ({ ...matchMedia(query), matches: false });
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { intersections.push(callback); }
    observe() { intersect(true); }
    disconnect = disconnect;
  });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { width: this.classList.contains('film-run') ? 6000 : 800, height: 500, left: 0, top: 0 } as DOMRect;
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.matchMedia = matchMedia;
  vi.stubGlobal('IntersectionObserver', originalIO);
});
function mouse(target: Element | Window, type: string, x = 120) {
  fireEvent(target, new MouseEvent(type, { bubbles: true, clientX: x, button: 0 }));
}

describe('animation work follows visibility and interaction', () => {
  it('stops scheduling the paused film, still scrubs smoothly, and resumes at the same speed', () => {
    const onSelect = vi.fn();
    const view = render(<RollStrip roll={rolls[0]} onSelect={onSelect} />);
    const stage = view.container.querySelector('.film-stage')!;
    const track = view.container.querySelector('.film-track') as HTMLElement;
    act(() => vi.advanceTimersByTime(80));
    const moving = track.style.transform;
    mouse(stage, 'pointerenter');
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(160));
    expect(track.style.transform).toBe(moving);
    mouse(stage, 'pointerdown');
    for (const x of [118, 116, 114, 112]) mouse(window, 'pointermove', x);
    act(() => vi.advanceTimersByTime(20));
    expect(track.style.transform).not.toBe(moving);
    mouse(window, 'pointerup', 112);
    fireEvent.click(view.container.querySelector('.film-window')!);
    expect(onSelect).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(20)); // Allow jsdom's focus/selection notification to finish.
    expect(vi.getTimerCount()).toBe(0);
    mouse(stage, 'pointerleave');
    expect(vi.getTimerCount()).toBe(1);
    act(() => intersect(false));
    expect(vi.getTimerCount()).toBe(0);
    const offscreen = track.style.transform;
    act(() => vi.advanceTimersByTime(10000));
    act(() => intersect(true));
    expect(track.style.transform).toBe(offscreen);
    act(() => vi.advanceTimersByTime(20));
    expect(track.style.transform).not.toBe(offscreen);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(disconnect).toHaveBeenCalled();
  });

  it('stops hidden-tab animation work and removes visibility subscriptions', () => {
    const update = vi.fn();
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    const stop = observeAnimationVisibility(document.body, update);
    expect(update).toHaveBeenLastCalledWith(true);
    hidden.mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    expect(update).toHaveBeenLastCalledWith(false);
    hidden.mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    expect(update).toHaveBeenLastCalledWith(true);
    stop();
    update.mockClear();
    fireEvent(document, new Event('visibilitychange'));
    expect(update).not.toHaveBeenCalled();
  });

  it('creates the grain texture once, preserves its strength, and needs no JS frame loop', () => {
    const context = {
      createImageData: () => ({ data: new Uint8ClampedArray(120 * 120 * 4) }),
      putImageData: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,AA==');
    const view = render(<Noise />);
    expect(view.container.querySelector('.film-grain')).toHaveStyle({ opacity: '0.05' });
    expect(view.container.querySelector('.film-grain-moving')).toHaveStyle({ animationDuration: '0.8s' });
    act(() => vi.advanceTimersByTime(5000));
    expect(context.putImageData).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    view.unmount();
  });
});
