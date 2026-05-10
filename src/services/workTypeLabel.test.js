import { describe, it, expect } from 'vitest';
import { workTypeLabel } from './workTypeLabel.js';

describe('workTypeLabel', () => {
  it('returns Álbum for missing value', () => {
    expect(workTypeLabel(undefined)).toBe('Álbum');
  });
  it('returns Live for live', () => {
    expect(workTypeLabel('live')).toBe('Live');
  });
  it('returns EP for ep', () => {
    expect(workTypeLabel('ep')).toBe('EP');
  });
});
