import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Publications from '../components/Publications';
import { publications } from '../content';

describe('Publications', () => {
  it('renders all publications with highlighted author', () => {
    render(<Publications />);
    for (const p of publications) {
      expect(screen.getAllByText(p.title).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getAllByText(/Yuzhuo Jia/).length).toBeGreaterThanOrEqual(publications.length);
  });
  it('renders only https external links', () => {
    render(<Publications />);
    const links = screen.queryAllByRole('link');
    for (const l of links) {
      expect(l).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
    }
  });
});
