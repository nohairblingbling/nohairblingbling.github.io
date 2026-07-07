import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Publications from '../components/Publications';
import Projects from '../components/Projects';
import { publications, projects } from '../content';

describe('Publications', () => {
  it('renders all 4 publications with venue and highlighted author', () => {
    render(<Publications />);
    for (const p of publications) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    expect(screen.getAllByText(/Yuzhuo Jia/).length).toBeGreaterThanOrEqual(4);
  });
  it('renders external links with https hrefs', () => {
    render(<Publications />);
    const links = screen.getAllByRole('link');
    for (const l of links) {
      expect(l).toHaveAttribute('href', expect.stringMatching(/^https:\/\//));
    }
  });
});

describe('Projects', () => {
  it('renders all 3 projects; github links only when defined', () => {
    render(<Projects />);
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
    expect(screen.getAllByRole('link')).toHaveLength(projects.filter((p) => p.github).length);
  });
});
