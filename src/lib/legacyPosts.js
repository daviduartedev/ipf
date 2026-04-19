import { slugify } from './slugify.js';

/**
 * @param {{ id: string, title: string, image: string, excerpt: string, content: string }} post
 */
export function legacyPostSlug(post) {
  return slugify(`${post.title}-${post.id}`);
}

/**
 * @returns {Promise<Array<{ slug: string, title: string, excerpt: string, content: string, imageUrl: string, publishedAt: string | null, updatedAt: string | null }>>}
 */
export async function loadLegacyPostsFromJson() {
  const res = await fetch(`${import.meta.env.BASE_URL}posts.json`);
  if (!res.ok) throw new Error('Falha ao carregar posts.json');
  const data = await res.json();
  const posts = Array.isArray(data.posts) ? data.posts : [];
  return posts.map((p) => ({
    slug: legacyPostSlug(p),
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    imageUrl: `${import.meta.env.BASE_URL}${String(p.image).replace(/^\//, '')}`,
    publishedAt: null,
    updatedAt: null,
  }));
}

/**
 * Primeiros N cartões fixos da home (conteúdo editorial em `public/posts.json`).
 * @param {number} [limit]
 */
export async function loadFeaturedPostsFromJson(limit = 3) {
  const all = await loadLegacyPostsFromJson();
  return all.slice(0, limit);
}

/**
 * @param {string} slugOrLegacy
 */
export async function findLegacyPostBySlug(slugOrLegacy) {
  const res = await fetch(`${import.meta.env.BASE_URL}posts.json`);
  if (!res.ok) return null;
  const data = await res.json();
  const posts = Array.isArray(data.posts) ? data.posts : [];
  for (const p of posts) {
    if (legacyPostSlug(p) === slugOrLegacy) {
      return {
        slug: legacyPostSlug(p),
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        imageUrl: `${import.meta.env.BASE_URL}${String(p.image).replace(/^\//, '')}`,
        publishedAt: null,
        updatedAt: null,
      };
    }
    if (p.id === slugOrLegacy) {
      return {
        slug: legacyPostSlug(p),
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        imageUrl: `${import.meta.env.BASE_URL}${String(p.image).replace(/^\//, '')}`,
        publishedAt: null,
        updatedAt: null,
      };
    }
  }
  return null;
}
