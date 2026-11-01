import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { rolls, type Capture } from '../content';
import Canister from '../components/gallery/Canister';
import RollStrip from '../components/gallery/RollStrip';

describe('capture metadata across gallery surfaces', () => {
  it.each([
    { capture: { medium: 'digital', brand: 'NIKON', model: 'Zf' } as Capture,
      mark: 'Zf', detail: 'NIKON Zf · DIGITAL', edge: 'NIKON Zf' },
    { capture: { medium: 'film', brand: 'ILFORD', stock: 'DELTA', iso: 100, format: '135', camera: 'FM2' } as Capture,
      mark: 'DELTA', detail: 'ILFORD DELTA · 135 · ISO 100 · FM2', edge: 'ILFORD DELTA 100' },
  ])('uses supplied $capture.medium data instead of a fixed camera or ISO', ({ capture, mark, detail, edge }) => {
    const roll = { ...rolls[0], capture };
    const view = render(<><Canister roll={roll} onOpen={vi.fn()} /><RollStrip roll={roll} onSelect={vi.fn()} /></>);
    expect(view.container.querySelector('.film-canister-stock')).toHaveTextContent(mark);
    expect(screen.getByText(detail)).toBeInTheDocument();
    expect(screen.getAllByText(edge)).toHaveLength(roll.photos.length);
    expect(view.container).not.toHaveTextContent('A7M4');
    expect(view.container).not.toHaveTextContent('400');
  });
});
