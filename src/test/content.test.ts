import { describe, it, expect } from 'vitest';
import { hero, about, timeline, research, publications, contact, socials } from '../content';

describe('content integrity', () => {
  it('hero has editable position line', () => {
    expect(hero.name).toBe('Yuzhuo Jia');
    expect(hero.position.length).toBeGreaterThan(0);
  });
  it('timeline shows Tsinghua and Sydney only', () => {
    expect(timeline).toHaveLength(2);
    expect(timeline.map((t) => t.org)).toEqual(['Tsinghua University', 'University of Sydney']);
  });
  it('has 3 research entries with required fields', () => {
    expect(research).toHaveLength(3);
    for (const r of research) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.period.length).toBeGreaterThan(0);
      expect(r.description.length).toBeGreaterThan(50);
    }
  });
  it('has 3 publications, each crediting Yuzhuo Jia', () => {
    expect(publications).toHaveLength(3);
    for (const p of publications) {
      expect(p.venue.length).toBeGreaterThan(0);
      expect(p.authors.some((a) => a.me)).toBe(true);
    }
  });
  it('publication links are https when present', () => {
    for (const p of publications) {
      if (p.link) expect(p.link.url).toMatch(/^https:\/\//);
    }
  });
  it('contact and socials are set', () => {
    expect(contact.email).toBe('yuzhuojia.cs@gmail.com');
    expect(socials[0].url).toMatch(/^https:\/\//);
    expect(about.interests.length).toBeGreaterThanOrEqual(5);
    expect(hero.cv).toBe('/cv.pdf');
  });
});
