const TIME_ZONE = 'America/Sao_Paulo';

/**
 * @param {string | null | undefined} isoString
 * @returns {string}
 */
export function formatPostDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: TIME_ZONE,
  }).format(d);
}
