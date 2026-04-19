import { getSupabase } from './supabaseClient.js';

const BUCKET = 'post-images';

/**
 * @param {string} imagePath storage path or absolute URL
 * @returns {string}
 */
export function resolvePostImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const supabase = getSupabase();
  if (!supabase) {
    return `${import.meta.env.BASE_URL}${imagePath.replace(/^\//, '')}`;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(imagePath);
  return data.publicUrl;
}
