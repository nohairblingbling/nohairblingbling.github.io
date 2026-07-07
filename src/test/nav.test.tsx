import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav, { NAV_SECTIONS } from '../components/Nav';

describe('Nav', () => {
  it('renders one anchor per section plus logo', () => {
    render(<Nav />);
    for (const s of NAV_SECTIONS) {
      const link = screen.getAllByRole('link', { name: s.label })[0];
      expect(link).toHaveAttribute('href', `#${s.id}`);
    }
    expect(screen.getByRole('link', { name: 'YZ_J' })).toHaveAttribute('href', '#top');
  });
});
