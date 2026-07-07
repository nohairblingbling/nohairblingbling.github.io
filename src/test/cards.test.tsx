import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PublicationsPage from '../pages/PublicationsPage';
import GalleryPage from '../pages/GalleryPage';
import { publications, photos } from '../content';

describe('PublicationsPage', () => {
  it('renders every publication with highlighted author', () => {
    render(<PublicationsPage />);
    for (const p of publications) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/Yuzhuo Jia/).length).toBeGreaterThanOrEqual(publications.length);
  });
  it('renders only https external links', () => {
    render(<PublicationsPage />);
    for (const l of screen.queryAllByRole('link')) {
      expect(l).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
    }
  });
});

describe('GalleryPage', () => {
  it('renders a frame per photo with film edge markings', () => {
    render(<GalleryPage />);
    expect(screen.getAllByRole('figure')).toHaveLength(photos.length);
    for (const p of photos) {
      expect(screen.getByText(new RegExp(p.id))).toBeInTheDocument();
    }
    expect(screen.getAllByText('YZJ 400')).toHaveLength(photos.length);
  });
});
