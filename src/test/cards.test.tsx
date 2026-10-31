import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PublicationsPage from '../pages/PublicationsPage';
import GalleryPage from '../pages/GalleryPage';
import Footer from '../components/Footer';
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
  beforeEach(() => {
    history.replaceState(null, '', '/gallery/');
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });
  afterEach(() => {
    history.replaceState(null, '', '/');
    vi.restoreAllMocks();
  });
  it('shows roll canisters on the shelf', () => {
    render(<GalleryPage />);
    for (const r of rolls) {
      expect(screen.getByRole('button', { name: `Open ${r.category} roll ${r.title}` })).toBeInTheDocument();
    }
    expect(screen.getByRole('status')).toHaveTextContent('4 rolls · 33 frames');
    expect(document.body.textContent).not.toMatch(/[\u4e00-\u9fff]/);
  });
  it('unspools a roll into frames and opens the lightbox', () => {
    render(<GalleryPage />);
    const roll = rolls[0];
    fireEvent.click(screen.getByRole('button', { name: `Open ${roll.category} roll ${roll.title}` }));
    expect(screen.getAllByRole('figure')).toHaveLength(roll.photos.length);
    expect(screen.getAllByText('YZJ 400')).toHaveLength(roll.photos.length);
    const trigger = screen.getByRole('button', { name: `Enlarge photograph ${roll.photos[0].id}` });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`01 / ${String(roll.photos.length).padStart(2, '0')}`))).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('filters rolls, links the same location, and restores shelf focus and scroll', () => {
    render(<GalleryPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Portraits' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 rolls · 23 frames');
    expect(screen.queryByRole('button', { name: 'Open landscapes roll Yunnan' })).not.toBeInTheDocument();
    expect(window.location.search).toBe('?category=portraits');
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(340);
    fireEvent.click(screen.getByRole('button', { name: 'Open portraits roll North Xinjiang' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /Same place.*Landscapes/ }));
    expect(screen.getAllByRole('figure')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: '← Gallery' }));
    expect(screen.getByRole('button', { name: 'Portraits' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Open portraits roll North Xinjiang' })).toHaveFocus();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 340, behavior: 'instant' });
  });

  it('supports the existing landscape deep link and category breadcrumb', () => {
    history.replaceState(null, '', '/gallery/#north-xinjiang');
    render(<GalleryPage />);
    expect(screen.getByRole('heading', { name: 'North Xinjiang' })).toBeInTheDocument();
    expect(screen.getAllByRole('figure')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Landscapes' }));
    expect(screen.getByRole('status')).toHaveTextContent('2 rolls · 10 frames');
    expect(screen.getByRole('button', { name: 'Open landscapes roll Yunnan' })).toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  it('follows browser Back and Forward without losing the category', async () => {
    render(<GalleryPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Landscapes' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open landscapes roll Yunnan' }));
    history.back();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Landscapes' })).toHaveAttribute('aria-pressed', 'true'));
    expect(screen.getByRole('button', { name: 'Open landscapes roll Yunnan' })).toHaveFocus();
    history.forward();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Yunnan' })).toBeInTheDocument());
  });

  it('falls back to the complete shelf for unknown categories or rolls', () => {
    history.replaceState(null, '', '/gallery/?category=unknown#missing');
    render(<GalleryPage />);
    expect(screen.getByRole('status')).toHaveTextContent('4 rolls · 33 frames');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('scrolls back to the top without replacing the selected roll hash', () => {
    history.replaceState(null, '', '/gallery/#yunnan');
    render(<><GalleryPage /><Footer /></>);
    fireEvent.click(screen.getByRole('link', { name: 'BACK TO TOP ↑' }));
    expect(window.location.hash).toBe('#yunnan');
    expect(screen.getByRole('heading', { name: 'Yunnan' })).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'instant' });
  });
});
