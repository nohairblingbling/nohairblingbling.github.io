import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Lightbox from '../components/gallery/Lightbox';
import { rolls } from '../content';

const roll = rolls[0];

function GalleryHarness() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <button onClick={() => setIndex(0)}>Open photograph</button>
      <a href="/">Background navigation</a>
      {index !== null && (
        <Lightbox
          roll={roll}
          index={index}
          onClose={() => setIndex(null)}
          onNav={(delta) => setIndex((i) => ((i ?? 0) + delta + roll.photos.length) % roll.photos.length)}
        />
      )}
    </>
  );
}

describe('Lightbox keyboard and background isolation', () => {
  it('keeps a preview visible until the original is decoded, then warms the neighbours', async () => {
    const OriginalImage = window.Image;
    const requests: { src: string; onload: null | (() => Promise<void>) }[] = [];
    vi.stubGlobal('Image', class {
      src = '';
      onload: null | (() => Promise<void>) = null;
      decode = () => Promise.resolve();
      constructor() { requests.push(this); }
    });
    try {
      const view = render(<GalleryHarness />);
      fireEvent.click(screen.getByRole('button', { name: 'Open photograph' }));
      expect(screen.getByRole('img')).toHaveAttribute('src', roll.photos[0].display!.src);
      expect(requests).toHaveLength(1);
      expect(requests[0].src).toBe(roll.photos[0].src);
      await act(async () => { await requests[0].onload?.(); });
      expect(screen.getByRole('img')).toHaveAttribute('src', roll.photos[0].src);
      expect(screen.getByRole('img')).not.toHaveAttribute('srcset');
      expect(requests.slice(1).map(request => request.src)).toEqual([roll.photos.at(-1)!.src, roll.photos[1].src]);
      view.unmount();
    } finally { vi.stubGlobal('Image', OriginalImage); }
  });
  it('isolates the page, contains focus, and restores the trigger and scroll styles on close', () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '3px';
    const { container } = render(<GalleryHarness />);
    const trigger = screen.getByRole('button', { name: 'Open photograph' });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole('dialog').parentElement).toBe(document.body);
    expect(container).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    const close = screen.getByRole('button', { name: 'Close' });
    const next = screen.getByRole('button', { name: 'NEXT →' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(next).toHaveFocus();
    fireEvent.keyDown(next, { key: 'Tab' });
    expect(close).toHaveFocus();
    trigger.focus();
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container).not.toHaveAttribute('inert');
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.paddingRight).toBe('3px');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('preserves focus while changing photos, and distinguishes image and backdrop clicks', () => {
    const { container } = render(<GalleryHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open photograph' }));
    const next = screen.getByRole('button', { name: 'NEXT →' });
    next.focus();
    fireEvent.click(next);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', `Photograph ${roll.photos[1].id}`);
    expect(next).toHaveFocus();
    expect(container).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', `Photograph ${roll.photos[0].id}`);
    expect(next).toHaveFocus();

    fireEvent.click(screen.getByRole('img'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
