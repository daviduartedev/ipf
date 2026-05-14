import { describe, it, expect } from 'vitest';
import { normalizePostCategory, postCategoryLabel, postCategoryShowsBadge } from './postCategory.js';

describe('postCategory', () => {
  it('normalizes unknown to standard', () => {
    expect(normalizePostCategory('nope')).toBe('standard');
    expect(normalizePostCategory('')).toBe('standard');
  });

  it('accepts launch_review', () => {
    expect(normalizePostCategory('launch_review')).toBe('launch_review');
    expect(postCategoryLabel('launch_review')).toBe('Review de lançamento');
    expect(postCategoryShowsBadge('launch_review')).toBe(true);
  });

  it('standard has no badge', () => {
    expect(postCategoryShowsBadge('standard')).toBe(false);
  });
});
