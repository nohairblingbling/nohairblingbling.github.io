import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PublicationsPage from '../pages/PublicationsPage';
import GalleryPage from '../pages/GalleryPage';
import { publications, rolls } from '../content';

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
  it('shows roll canisters on the shelf', () => {
    render(<GalleryPage />);
    for (const r of rolls) {
      expect(screen.getByRole('button', { name: `Open roll ${r.title}` })).toBeInTheDocument();
      expect(screen.getByText(r.title)).toBeInTheDocument();
    }
  });
  it('unspools a roll into frames and opens the lightbox', () => {
    render(<GalleryPage />);
    const roll = rolls[0];
    fireEvent.click(screen.getByRole('button', { name: `Open roll ${roll.title}` }));
    expect(screen.getAllByRole('figure')).toHaveLength(roll.photos.length);
    expect(screen.getAllByText('YZJ 400')).toHaveLength(roll.photos.length);
    fireEvent.click(
      screen.getByRole('button', { name: `Enlarge photograph ${roll.photos[0].id}` })
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`01 / 0${roll.photos.length}`))).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
