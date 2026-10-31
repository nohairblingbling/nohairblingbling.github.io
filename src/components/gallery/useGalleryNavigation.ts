import { useEffect, useLayoutEffect, useState } from 'react';
import { rolls, type GalleryCategory } from '../../content';

export type GalleryFilter = GalleryCategory | 'all';
type View = { category: GalleryFilter; rollId: string | null };
type Shelf = { category: GalleryFilter; scrollY: number; focusId?: string };
type Entry = { scrollY: number; focusId?: string; shelf?: Shelf };

function readView(): View {
  const query = new URLSearchParams(window.location.search).get('category');
  const category = query === 'portraits' || query === 'landscapes' ? query : 'all';
  const id = window.location.hash.slice(1);
  return { category, rollId: rolls.some((roll) => roll.id === id) ? id : null };
}
function viewUrl(view: View) {
  const url = new URL(window.location.href);
  if (view.category === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', view.category);
  url.hash = view.rollId ?? '';
  return `${url.pathname}${url.search}${url.hash}`;
}

export default function useGalleryNavigation() {
  const [view, setView] = useState(readView);
  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const sync = () => setView(readView());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      history.scrollRestoration = previous;
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);
  useLayoutEffect(() => {
    const entry: Entry | undefined = history.state?.gallery;
    window.scrollTo({ top: entry?.scrollY ?? 0, behavior: 'instant' });
    if (view.rollId) document.getElementById('gallery-roll-heading')?.focus({ preventScroll: true });
    else if (entry?.focusId && rolls.some((roll) => roll.id === entry.focusId)) {
      document.querySelector<HTMLButtonElement>(`[data-roll-id="${entry.focusId}"]`)?.focus({ preventScroll: true });
    }
  }, [view]);
  const navigate = (next: View, entry: Entry, replace = false) => {
    history[replace ? 'replaceState' : 'pushState']({ ...history.state, gallery: entry }, '', viewUrl(next));
    setView(next);
  };
  const openRoll = (id: string) => {
    const shelf: Shelf = view.rollId
      ? history.state?.gallery?.shelf ?? { category: view.category, scrollY: 0 }
      : { category: view.category, scrollY: window.scrollY, focusId: id };
    if (!view.rollId) {
      // Browser Back restores the shelf and the canister that opened this roll.
      history.replaceState({ ...history.state, gallery: { scrollY: shelf.scrollY, focusId: id } }, '');
    }
    navigate({ ...view, rollId: id }, { scrollY: 0, shelf });
  };
  const closeRoll = (category?: GalleryFilter) => {
    const shelf: Shelf = history.state?.gallery?.shelf ?? { category: view.category, scrollY: 0 };
    const changed = category !== undefined && category !== shelf.category;
    navigate({ category: category ?? shelf.category, rollId: null }, {
      scrollY: changed ? 0 : shelf.scrollY,
      focusId: changed ? undefined : shelf.focusId,
    });
  };
  const selectCategory = (category: GalleryFilter) => {
    navigate({ category, rollId: null }, { scrollY: window.scrollY }, true);
  };
  return { ...view, openRoll, closeRoll, selectCategory };
}
