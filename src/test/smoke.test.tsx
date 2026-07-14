import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    const contactBtn = screen.getByRole('link', { name: `Copy email ${contact.email}` });
    expect(contactBtn).toHaveAttribute('href', `mailto:${contact.email}`);
    expect(contactBtn).toHaveTextContent('GET IN TOUCH');
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
  it('clicking the contact button copies the email and confirms', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    render(
      <Layout>
        <HomePage />
      </Layout>
    );
    const contactBtn = screen.getByRole('link', { name: `Copy email ${contact.email}` });
    fireEvent.click(contactBtn);
    expect(writeText).toHaveBeenCalledWith(contact.email);
    expect(contactBtn).toHaveTextContent(/EMAIL COPIED/);
    vi.unstubAllGlobals();
  });
});
