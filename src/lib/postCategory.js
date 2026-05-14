/** Valores persistidos em `posts.category` (Supabase check). */
export const POST_CATEGORY_VALUES = [
  'standard',
  'live',
  'launch_review',
  'classic_review',
  'event_coverage',
  'interview',
];

export const POST_CATEGORY_VALUE_SET = new Set(POST_CATEGORY_VALUES);

/** Opções para selects (valor → rótulo em pt-BR). */
export const POST_CATEGORY_OPTIONS = [
  { value: 'standard', label: 'Padrão' },
  { value: 'live', label: 'LIVE' },
  { value: 'launch_review', label: 'Review de lançamento' },
  { value: 'classic_review', label: 'Review de clássico' },
  { value: 'event_coverage', label: 'Cobertura de eventos' },
  { value: 'interview', label: 'Entrevistas' },
];

const LABEL_BY_VALUE = Object.fromEntries(POST_CATEGORY_OPTIONS.map((o) => [o.value, o.label]));

/**
 * @param {string | undefined | null} value
 * @returns {string}
 */
export function normalizePostCategory(value) {
  const v = String(value ?? '').trim();
  return POST_CATEGORY_VALUE_SET.has(v) ? v : 'standard';
}

/**
 * @param {string | undefined | null} value
 * @returns {string}
 */
export function postCategoryLabel(value) {
  const v = normalizePostCategory(value);
  return LABEL_BY_VALUE[v] ?? 'Padrão';
}

/**
 * @param {string | undefined | null} value
 * @returns {boolean}
 */
export function postCategoryShowsBadge(value) {
  return normalizePostCategory(value) !== 'standard';
}
