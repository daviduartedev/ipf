/**
 * @param {string} input
 * @returns {string}
 */
export function slugify(input) {
  const base = String(input ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return base.length > 0 ? base : 'post';
}
