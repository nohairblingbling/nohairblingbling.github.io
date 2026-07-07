import { describe, it, expect } from 'vitest';
import { hero, about, timeline, research, publications, projects, contact, socials, stats } from '../content';

describe('content integrity', () => {
  it('hero has editable position line', () => {
    expect(hero.name).toBe('Yuzhuo Jia');
    expect(hero.position.length).toBeGreaterThan(0);
  });
  it('has 3 timeline entries and 3-value stats', () => {
    expect(timeline).toHaveLength(3);
    expect(stats.map((s) => s.value)).toEqual([6, 6, 3]);
  });
  it('has 6 research entries with required fields', () => {
    expect(research).toHaveLength(6);
    for (const r of research) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.period.length).toBeGreaterThan(0);
      expect(r.description.length).toBeGreaterThan(50);
    }
  });
  it('has 6 publications, each crediting Yuzhuo Jia', () => {
    expect(publications).toHaveLength(6);
    for (const p of publications) {
      expect(p.venue.length).toBeGreaterThan(0);
      expect(p.authors.some((a) => a.me)).toBe(true);
    }
  });
  it('publication links are https', () => {
    for (const p of publications) {
      if (p.link) expect(p.link.url).toMatch(/^https:\/\//);
    }
  });
  it('has 3 projects with https github links when present', () => {
    expect(projects).toHaveLength(3);
    for (const p of projects) {
      if (p.github) expect(p.github).toMatch(/^https:\/\/github\.com\//);
    }
  });
  it('contact and socials are set', () => {
    expect(contact.email).toBe('yuzhuojia.cs@gmail.com');
    expect(socials[0].url).toMatch(/^https:\/\//);
    expect(about.interests.length).toBeGreaterThanOrEqual(5);
    expect(hero.cv).toBe('/cv.pdf');
  });
});
