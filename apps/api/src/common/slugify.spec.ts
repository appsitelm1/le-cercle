import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('minuscule et tirets', () => {
    expect(slugify("Côte d'Ivoire")).toBe('cote-d-ivoire');
  });

  it('retire les accents', () => {
    expect(slugify('Médina')).toBe('medina');
  });

  it('normalise les espaces multiples', () => {
    expect(slugify('  Aït   Melloul ')).toBe('ait-melloul');
  });

  it('conserve les chiffres', () => {
    expect(slugify('R+2 Immeuble 3')).toBe('r-2-immeuble-3');
  });
});
