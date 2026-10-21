export const ENTRANCE_STORAGE_KEY = 'yzj:entrance-seen:v1';
export const ENTRANCE_RELOAD_KEY = 'yzj:entrance-reloads:v1';

/** Called once at document bootstrap, outside React's render/effect replay. */
export function recordEntranceVisit(storage: Pick<Storage, 'getItem' | 'setItem'>, navigationType: string): boolean {
  if (storage.getItem(ENTRANCE_STORAGE_KEY) !== 'seen') {
    storage.setItem(ENTRANCE_STORAGE_KEY, 'seen');
    storage.setItem(ENTRANCE_RELOAD_KEY, '0');
    return true;
  }
  if (navigationType !== 'reload') return false;
  const stored = Number(storage.getItem(ENTRANCE_RELOAD_KEY));
  const previous = Number.isInteger(stored) && stored >= 0 && stored < 3 ? stored : 0;
  const next = (previous + 1) % 3;
  storage.setItem(ENTRANCE_RELOAD_KEY, String(next));
  return next === 0;
}

export function prepareEntranceVisit(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Replaying a local preview does not consume or reset the three-refresh cycle.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('intro') === '1') return true;
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    return recordEntranceVisit(window.sessionStorage, navigation?.type ?? 'navigate');
  } catch {
    return true;
  }
}
