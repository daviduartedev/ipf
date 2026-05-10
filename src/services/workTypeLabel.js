import { WORK_TYPE_OPTIONS } from './data.js';

const LABEL_BY_VALUE = Object.fromEntries(WORK_TYPE_OPTIONS.map((o) => [o.value, o.label]));

/**
 * @param {string | undefined} value
 * @returns {string}
 */
export function workTypeLabel(value) {
  if (!value) return 'Álbum';
  return LABEL_BY_VALUE[value] ?? 'Álbum';
}
