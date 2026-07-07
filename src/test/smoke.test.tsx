import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders hero name and nav', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yuzhuo Jia');
    expect(screen.getByRole('link', { name: 'YZ_J' })).toBeInTheDocument();
  });
  it('merged hero shows CV link and education', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'CV ↗' })).toHaveAttribute('href', '/cv.pdf');
    expect(screen.getByText('University of Sydney')).toBeInTheDocument();
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
  });
});
