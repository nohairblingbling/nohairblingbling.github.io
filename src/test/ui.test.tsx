import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Reveal from '../components/ui/Reveal';
import SectionHeader from '../components/ui/SectionHeader';

describe('Reveal (reduced motion)', () => {
  it('renders children fully visible', () => {
    render(
      <Reveal>
        <p>hello</p>
      </Reveal>
    );
    const el = screen.getByText('hello').parentElement!;
    expect(el.className).toContain('opacity-100');
  });
});

describe('SectionHeader', () => {
  it('renders index, label and title', () => {
    render(<SectionHeader index="02" label="ABOUT" title="About" />);
    expect(screen.getByText('FR.02 — ABOUT')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });
});
