import { describe, expect, it } from 'vitest';
import { slugify } from './slugify.js';

describe('slugify', () => {
  it('normaliza acentos e espaços', () => {
    expect(slugify('Nuke DB – Introdução')).toBe('nuke-db-introducao');
  });

  it('evita string vazia', () => {
    expect(slugify('!!!')).toBe('post');
  });
});
