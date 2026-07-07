import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav, { NAV_LINKS } from '../components/Nav';

describe('Nav', () => {
  it('renders one anchor per page plus logo', () => {
    render(<Nav />);
    for (const l of NAV_LINKS) {
      const link = screen.getAllByRole('link', { name: l.label })[0];
      expect(link).toHaveAttribute('href', l.href);
    }
    expect(screen.getByRole('link', { name: 'YZ_J' })).toHaveAttribute('href', '/');
  });
  it('includes about, publications and gallery', () => {
    expect(NAV_LINKS.map((l) => l.label)).toEqual(['ABOUT', 'PUBLICATIONS', 'GALLERY']);
  });
});
