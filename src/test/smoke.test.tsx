import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import { contact } from '../content';

describe('Home page', () => {
  it('renders hero name and nav', () => {
    render(
      <Layout>
        <HomePage />
      </Layout>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Yuzhuo Jia');
    expect(screen.getByRole('link', { name: 'YZ_J' })).toHaveAttribute('href', '/');
  });
  it('shows contact reveal button and page links in hero', () => {
    render(
      <Layout>
        <HomePage />
      </Layout>
    );
    expect(screen.getByRole('link', { name: 'CV ↗' })).toHaveAttribute('href', '/cv.pdf');
    const mailtoLink = screen.getByRole('link', { name: `Email ${contact.email}` });
    expect(mailtoLink).toHaveAttribute('href', `mailto:${contact.email}`);
    expect(mailtoLink).toHaveTextContent('GET IN TOUCH');
    expect(screen.queryByRole('link', { name: 'GALLERY ↗' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ALL PUBLICATIONS →' })).toHaveAttribute(
      'href',
      '/publications/'
    );
    expect(screen.getByText('University of Sydney')).toBeInTheDocument();
  });
  it('features exactly the featured publications', () => {
    render(
      <Layout>
        <HomePage />
      </Layout>
    );
    expect(screen.getAllByText('Publication')).toHaveLength(2);
  });
});
