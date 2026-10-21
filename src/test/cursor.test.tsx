import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TargetCursor from '../components/reactbits/TargetCursor';

const matchMedia = window.matchMedia;
const hitTestDescriptor = Object.getOwnPropertyDescriptor(document, 'elementFromPoint');
function pointer(target: Element, type = 'pointermove', pointerType = 'mouse', buttons = 0) {
  const event = new MouseEvent(type, { bubbles: true, clientX: 120, clientY: 80, buttons });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  fireEvent(target, event);
  act(() => vi.advanceTimersByTime(20));
}
function fixture() {
  return render(<>
    <TargetCursor />
    <div data-testid="space" />
    <a href="/gallery/">Gallery</a>
    <p>Selectable text</p>
    <input aria-label="Name" />
    <div className="film-stage"><button className="film-window">Photograph</button></div>
  </>);
}
beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = query => ({ ...matchMedia(query), matches: false });
});
afterEach(() => {
  vi.useRealTimers();
  window.matchMedia = matchMedia;
  if (hitTestDescriptor) Object.defineProperty(document, 'elementFromPoint', hitTestDescriptor);
  else Reflect.deleteProperty(document, 'elementFromPoint');
  document.documentElement.classList.remove('cursor-hidden', 'cursor-native-drag');
});

describe('compact focus cursor', () => {
  it('starts hidden, follows the actual pointer, and stops scheduling frames when idle', () => {
    const view = fixture();
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    pointer(screen.getByTestId('space'));
    const cursor = view.container.querySelector('.focus-cursor')!;
    expect(cursor).toHaveStyle({ transform: 'translate3d(98px, 58px, 0)', opacity: '1' });
    expect(cursor).toHaveAttribute('data-mode', 'idle');
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByRole('link'));
    expect(cursor).toHaveAttribute('data-mode', 'link');
    pointer(screen.getByRole('button', { name: 'Photograph' }));
    expect(cursor).toHaveAttribute('data-mode', 'photo');
    view.unmount();
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses the quill for reading but keeps native inputs, gallery dragging, and touch', () => {
    const view = fixture();
    const cursor = view.container.querySelector('.focus-cursor')!;
    pointer(screen.getByRole('link'));
    pointer(screen.getByText('Selectable text'));
    expect(document.documentElement).toHaveClass('cursor-hidden');
    expect(cursor).toHaveStyle({ opacity: '1' });
    expect(cursor).toHaveAttribute('data-mode', 'text');
    expect(cursor).toHaveAttribute('data-phase', 'idle');
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByRole('textbox'));
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    expect(cursor).toHaveStyle({ opacity: '0' });
    pointer(screen.getByRole('button', { name: 'Photograph' }).parentElement!);
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    expect(cursor).toHaveStyle({ opacity: '0' });
    pointer(screen.getByRole('button', { name: 'Photograph' }), 'pointerdown', 'mouse', 1);
    expect(document.documentElement).toHaveClass('cursor-native-drag');
    expect(cursor).toHaveStyle({ opacity: '0' });
    pointer(screen.getByRole('button', { name: 'Photograph' }), 'pointercancel');
    expect(document.documentElement).not.toHaveClass('cursor-native-drag');
    pointer(screen.getByRole('link'), 'pointermove', 'touch');
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
  });

  it('keeps the reading pose across links during text selection and releases it afterward', () => {
    const view = fixture();
    const cursor = view.container.querySelector('.focus-cursor')!;
    const link = screen.getByRole('link');
    document.elementFromPoint = vi.fn(() => link);
    pointer(screen.getByText('Selectable text'), 'pointerdown', 'mouse', 1);
    pointer(link, 'pointermove', 'mouse', 1);
    expect(cursor).toHaveAttribute('data-mode', 'text');
    expect(cursor).toHaveAttribute('data-phase', 'idle');
    expect(cursor).toHaveStyle({ opacity: '1' });
    pointer(link, 'pointerup');
    act(() => vi.advanceTimersByTime(120));
    expect(cursor).toHaveAttribute('data-mode', 'link');
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    expect(cursor).toHaveAttribute('data-pressed', 'false');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('restores native visibility when keyboard navigation or window focus changes', () => {
    fixture();
    pointer(screen.getByRole('link'));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    pointer(screen.getByRole('link'));
    fireEvent.blur(window);
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps its hover pose across controls without scheduling a writing loop', () => {
    const view = fixture();
    const cursor = view.container.querySelector('.focus-cursor')!;
    pointer(screen.getByRole('link'));
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByRole('button', { name: 'Photograph' }));
    expect(cursor).toHaveAttribute('data-mode', 'photo');
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels lift-off on quick re-entry and restores native cursors during the gesture', () => {
    const view = fixture();
    const cursor = view.container.querySelector('.focus-cursor')!;
    pointer(screen.getByRole('link'));
    act(() => vi.advanceTimersByTime(120));
    pointer(screen.getByTestId('space'));
    expect(cursor).toHaveAttribute('data-phase', 'release');
    pointer(screen.getByRole('link'));
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    act(() => vi.advanceTimersByTime(600));
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByText('Selectable text'));
    expect(cursor).toHaveAttribute('data-phase', 'idle');
    pointer(screen.getByRole('link'));
    expect(cursor).toHaveAttribute('data-phase', 'hover');
    pointer(screen.getByRole('textbox'));
    act(() => vi.advanceTimersByTime(600));
    expect(cursor).toHaveAttribute('data-phase', 'idle');
    expect(cursor).toHaveStyle({ opacity: '0' });
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByRole('link'));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('gives a short click response and clears it on release or cancellation', () => {
    const view = fixture();
    const cursor = view.container.querySelector('.focus-cursor')!;
    document.elementFromPoint = vi.fn(() => screen.getByRole('link'));
    pointer(screen.getByRole('link'), 'pointerdown', 'mouse', 1);
    expect(cursor).toHaveAttribute('data-pressed', 'true');
    expect(cursor).toHaveStyle({ transform: 'translate3d(98px, 58px, 0)' });
    pointer(screen.getByRole('link'), 'pointerup');
    act(() => vi.advanceTimersByTime(120));
    expect(cursor).toHaveAttribute('data-pressed', 'false');
    expect(vi.getTimerCount()).toBe(0);
    pointer(screen.getByRole('link'), 'pointerdown', 'mouse', 1);
    fireEvent.blur(window);
    expect(cursor).toHaveAttribute('data-pressed', 'false');
    expect(cursor).toHaveStyle({ opacity: '0' });
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['pointer: coarse', 'prefers-reduced-motion'])('does not replace the native cursor for %s', queryPart => {
    window.matchMedia = query => ({ ...matchMedia(query), matches: query.includes(queryPart) });
    const view = fixture();
    expect(view.container.querySelector('.focus-cursor')).not.toBeInTheDocument();
    pointer(screen.getByRole('link'));
    expect(document.documentElement).not.toHaveClass('cursor-hidden');
  });
});
