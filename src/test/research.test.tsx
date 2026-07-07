import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Research from '../components/Research';
import { research } from '../content';

describe('Research', () => {
  it('renders all 6 entries', () => {
    render(<Research />);
    for (const r of research) {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    }
  });
  it('toggles description expansion via button', () => {
    render(<Research />);
    const btn = screen.getAllByRole('button', { name: new RegExp(research[0].title) })[0];
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
