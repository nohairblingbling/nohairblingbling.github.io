/** Listen for two-finger horizontal scrolling inside one gallery surface. */
export function onHorizontalWheel(element: HTMLElement, scroll: (pixels: number) => void) {
  const handleWheel = (event: WheelEvent) => {
    const { deltaMode, deltaX, deltaY } = event;
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    // Trackpads report pixels; other wheel devices may report lines or pages.
    let pixels = deltaX;
    if (deltaMode === WheelEvent.DOM_DELTA_LINE) pixels *= 16;
    if (deltaMode === WheelEvent.DOM_DELTA_PAGE) pixels *= element.clientWidth;
    if (event.cancelable) event.preventDefault();
    scroll(pixels);
  };
  element.addEventListener('wheel', handleWheel, { passive: false });
  return () => element.removeEventListener('wheel', handleWheel);
}
