import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_BYTES, validateImageFile } from './validateImageFile.js';

describe('validateImageFile', () => {
  it('aceita ausência de ficheiro', () => {
    expect(validateImageFile(null).ok).toBe(true);
  });

  it('rejeita tipo inválido', () => {
    const file = new File([new Uint8Array([1])], 'x.gif', { type: 'image/gif' });
    const r = validateImageFile(file);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toMatch(/JPEG|PNG/i);
  });

  it('rejeita ficheiro grande', () => {
    const big = new Uint8Array(MAX_IMAGE_BYTES + 1);
    const file = new File([big], 'x.jpg', { type: 'image/jpeg' });
    const r = validateImageFile(file);
    expect(r.ok).toBe(false);
  });
});
