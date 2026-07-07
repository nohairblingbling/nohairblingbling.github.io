import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DecryptedText from '../components/reactbits/DecryptedText';
import CountUp from '../components/reactbits/CountUp';

describe('DecryptedText (reduced motion)', () => {
  it('renders the final text immediately and exposes aria-label', () => {
    render(<DecryptedText text="Yuzhuo Jia" />);
    expect(screen.getByLabelText('Yuzhuo Jia')).toHaveTextContent('Yuzhuo Jia');
  });
});

describe('CountUp (reduced motion)', () => {
  it('renders the target value immediately', () => {
    render(<CountUp value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
