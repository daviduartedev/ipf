import { describe, expect, it } from 'vitest';
import { formatPostDate } from './formatPostDate.js';

describe('formatPostDate', () => {
  it('retorna vazio para valores em falta', () => {
    expect(formatPostDate('')).toBe('');
    expect(formatPostDate(null)).toBe('');
  });

  it('formata ISO em pt-BR', () => {
    const s = formatPostDate('2024-06-15T15:30:00.000Z');
    expect(s.length).toBeGreaterThan(5);
    expect(s).toMatch(/2024/);
  });
});
