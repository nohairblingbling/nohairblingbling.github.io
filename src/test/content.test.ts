import { describe, it, expect } from 'vitest';
import { hero, about, timeline, publications, rolls, contact, socials } from '../content';

describe('content integrity', () => {
  it('hero has editable position line and CV link', () => {
    expect(hero.name).toBe('Yuzhuo Jia');
    expect(hero.position.length).toBeGreaterThan(0);
    expect(hero.cv).toBe('/cv.pdf');
  });
  it('timeline has the two curated entries', () => {
    expect(timeline).toHaveLength(2);
    expect(timeline[0].org).toBe('Tsinghua University');
  });
  it('publications all credit Yuzhuo Jia and exactly 2 are featured', () => {
    expect(publications.length).toBeGreaterThanOrEqual(3);
    for (const p of publications) {
      expect(p.venue.length).toBeGreaterThan(0);
      expect(p.authors.some((a) => a.me)).toBe(true);
    }
    expect(publications.filter((p) => p.featured)).toHaveLength(2);
  });
  it('publication links, when present, are https', () => {
    for (const p of publications) {
      if (p.link) expect(p.link.url).toMatch(/^https:\/\//);
    }
  });
  it('gallery has at least one roll with 5+ photos', () => {
    expect(rolls.length).toBeGreaterThanOrEqual(1);
    for (const r of rolls) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.photos.length).toBeGreaterThanOrEqual(1);
      for (const p of r.photos) {
        expect(p.id.length).toBeGreaterThan(0);
        expect(p.src).toBeTruthy();
      }
    }
    expect(rolls[0].photos.length).toBeGreaterThanOrEqual(5);
  });
  it('contact and socials are set', () => {
    expect(contact.email).toBe('yuzhuojia.cs@gmail.com');
    expect(socials[0].url).toMatch(/^https:\/\//);
    expect(about.interests.length).toBeGreaterThanOrEqual(5);
  });
});
