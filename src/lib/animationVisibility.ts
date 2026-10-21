/** Pause rendering only when the surface cannot be seen; resume without a time jump. */
export function observeAnimationVisibility(element: Element, update: (visible: boolean) => void) {
  let intersecting = false;
  let previous: boolean | undefined;
  const publish = () => {
    const visible = intersecting && !document.hidden;
    if (visible !== previous) { previous = visible; update(visible); }
  };
  const observer = new IntersectionObserver(([entry]) => {
    intersecting = entry.isIntersecting;
    publish();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', publish);
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', publish);
  };
}
