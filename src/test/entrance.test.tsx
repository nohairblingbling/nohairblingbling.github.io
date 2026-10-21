import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SiteEntrance from '../components/SiteEntrance';
import { ENTRANCE_STORAGE_KEY, ENTRANCE_RELOAD_KEY, recordEntranceVisit, prepareEntranceVisit } from '../components/entranceVisit';

const media = window.matchMedia;
const page = <main><h1>My portfolio</h1><a href="/gallery/">Gallery</a></main>;

function setReducedMotion(reduced: boolean) {
  window.matchMedia = query => ({ ...media(query), matches: reduced && query.includes('prefers-reduced-motion') });
}

beforeEach(() => {
  vi.useFakeTimers();
  window.sessionStorage.clear();
  window.history.replaceState(null, '', '/');
  setReducedMotion(false);
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.matchMedia = media;
  window.sessionStorage.clear();
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
});

describe('first-visit entrance', () => {
  it('plays once in Strict Mode, isolates the page, and restores it after the sequence', () => {
    const play = recordEntranceVisit(window.sessionStorage, 'navigate');
    const view = render(<StrictMode><SiteEntrance play={play}>{page}</SiteEntrance></StrictMode>);
    expect(screen.getByRole('dialog')).toHaveFocus();
    expect(screen.queryByRole('heading', { name: 'My portfolio' })).not.toBeInTheDocument();
    expect(view.container.querySelector('.entrance-page')).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    expect(window.sessionStorage.getItem(ENTRANCE_STORAGE_KEY)).toBe('seen');
    act(() => vi.advanceTimersByTime(1500));
    const percent = Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'));
    expect(percent).toBeGreaterThan(0);
    expect(percent).toBeLessThan(100);
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('FRAME READY')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(649));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'playing');
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'exiting');
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My portfolio' })).toHaveFocus();
    expect(screen.getByRole('heading', { name: 'My portfolio' })).toHaveAttribute('tabindex', '-1');
    fireEvent.blur(screen.getByRole('heading', { name: 'My portfolio' }));
    expect(screen.getByRole('heading', { name: 'My portfolio' })).not.toHaveAttribute('tabindex');
    expect(view.container.querySelector('.entrance-page')).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('');
    view.unmount();
    render(<SiteEntrance play={recordEntranceVisit(window.sessionStorage, 'navigate')}>{page}</SiteEntrance>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gallery' })).toBeVisible();
  });

  it.each(['button', 'Escape'])('can be skipped using %s without leaving a scroll lock', method => {
    render(<SiteEntrance play>{page}</SiteEntrance>);
    if (method === 'button') fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }));
    else fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My portfolio' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps keyboard focus on the skip control while the page is covered', () => {
    render(<SiteEntrance play>{page}</SiteEntrance>);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Skip intro' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('button', { name: 'Skip intro' })).toHaveFocus();
  });

  it('enters immediately for reduced motion, including the local replay link', () => {
    setReducedMotion(true);
    window.history.replaceState(null, '', '/?intro=1');
    render(<SiteEntrance play>{page}</SiteEntrance>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My portfolio' })).toBeVisible();
    expect(document.body.style.overflow).toBe('');
  });

  it('finishes even when intro images fail', () => {
    const view = render(<SiteEntrance play>{page}</SiteEntrance>);
    view.container.querySelectorAll('.site-entrance img').forEach(image => fireEvent.error(image));
    act(() => vi.advanceTimersByTime(3000));
    act(() => vi.advanceTimersByTime(650));
    act(() => vi.advanceTimersByTime(500));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'My portfolio' })).toBeVisible();
  });

  it('cleans up timers and restores the existing body styles on unmount', () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '12px';
    const view = render(<SiteEntrance play>{page}</SiteEntrance>);
    view.unmount();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.paddingRight).toBe('12px');
    act(() => vi.advanceTimersByTime(1));
    expect(vi.getTimerCount()).toBe(0);
  });
});


describe('entrance refresh easter egg', () => {
  it('plays initially and on every third reload, across repeated cycles', () => {
    expect(recordEntranceVisit(window.sessionStorage, 'navigate')).toBe(true);
    expect(Array.from({ length: 9 }, () => recordEntranceVisit(window.sessionStorage, 'reload')))
      .toEqual([false, false, true, false, false, true, false, false, true]);
    expect(window.sessionStorage.getItem(ENTRANCE_RELOAD_KEY)).toBe('0');
  });

  it('does not count normal navigation or browser back and forward', () => {
    recordEntranceVisit(window.sessionStorage, 'navigate');
    expect(recordEntranceVisit(window.sessionStorage, 'reload')).toBe(false);
    expect(recordEntranceVisit(window.sessionStorage, 'navigate')).toBe(false);
    expect(recordEntranceVisit(window.sessionStorage, 'back_forward')).toBe(false);
    expect(window.sessionStorage.getItem(ENTRANCE_RELOAD_KEY)).toBe('1');
    expect(recordEntranceVisit(window.sessionStorage, 'reload')).toBe(false);
    expect(recordEntranceVisit(window.sessionStorage, 'reload')).toBe(true);
  });

  it('counts the document bootstrap once despite Strict Mode and component remounts', () => {
    recordEntranceVisit(window.sessionStorage, 'navigate');
    const play = recordEntranceVisit(window.sessionStorage, 'reload');
    const view = render(<StrictMode><SiteEntrance play={play}>{page}</SiteEntrance></StrictMode>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    view.unmount();
    render(<SiteEntrance play={play}>{page}</SiteEntrance>);
    expect(window.sessionStorage.getItem(ENTRANCE_RELOAD_KEY)).toBe('1');
  });

  it('leaves the refresh cycle intact when using the local preview link', () => {
    recordEntranceVisit(window.sessionStorage, 'navigate');
    recordEntranceVisit(window.sessionStorage, 'reload');
    window.history.replaceState(null, '', '/?intro=1');
    expect(prepareEntranceVisit()).toBe(true);
    expect(window.sessionStorage.getItem(ENTRANCE_RELOAD_KEY)).toBe('1');
    setReducedMotion(true);
    expect(prepareEntranceVisit()).toBe(false);
  });
});
