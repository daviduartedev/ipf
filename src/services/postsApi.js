import { getSupabase } from '../lib/supabaseClient.js';
import { findLegacyPostBySlug, loadLegacyPostsFromJson } from '../lib/legacyPosts.js';
import { resolvePostImageUrl } from '../lib/postImageUrl.js';

const TABLE = 'posts';
const BUCKET = 'post-images';

/** Número de posts por página na home (secção dinâmica). */
export const POSTS_PAGE_SIZE = 30;

function recencyValue(postLike) {
  const candidate = postLike?.publishedAt ?? postLike?.published_at ?? postLike?.updatedAt ?? postLike?.updated_at;
  if (!candidate) return 0;
  const ts = Date.parse(candidate);
  return Number.isNaN(ts) ? 0 : ts;
}

function compareByRecencyDesc(a, b) {
  return recencyValue(b) - recencyValue(a);
}

/** Tuplo PostgREST para `not.in` / `in` com slugs de texto. */
function slugListForInFilter(slugs) {
  return `(${slugs.map((s) => `"${String(s).replace(/"/g, '\\"')}"`).join(',')})`;
}

/**
 * @param {object} row
 */
function mapRowToHomeView(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    imageUrl: resolvePostImageUrl(row.image_path),
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    category: row.category ?? 'standard',
  };
}

/**
 * @param {object} row
 */
function mapRowToPublicView(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    imageUrl: resolvePostImageUrl(row.image_path),
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    category: row.category ?? 'standard',
  };
}

/**
 * @param {number} page — 1-based
 * @param {number} [pageSize]
 * @param {string[]} [excludeSlugs] — evita duplicar posts já mostrados nos cartões fixos (ex.: migração do `posts.json`)
 */
export async function fetchPublishedPostsPage(
  page,
  pageSize = POSTS_PAGE_SIZE,
  excludeSlugs = [],
) {
  const feed = await fetchPublishedPostsFeed(excludeSlugs);
  if (!feed.ok) return feed;

  const total = feed.posts.length;
  if (total === 0) {
    return {
      ok: true,
      posts: [],
      total: 0,
      totalPages: 1,
      page: 1,
      source: feed.source,
    };
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const posts = feed.posts.slice(start, start + pageSize);

  return {
    ok: true,
    posts,
    total,
    totalPages,
    page: safePage,
    source: feed.source,
  };
}

/**
 * Lista completa para a secção "Postagens" (sem os destaques),
 * já ordenada por recência canônica.
 * @param {string[]} [excludeSlugs]
 */
export async function fetchPublishedPostsFeed(excludeSlugs = []) {
  const supabase = getSupabase();
  if (!supabase) {
    try {
      const all = await loadLegacyPostsFromJson();
      const filtered = all.filter((post, index) => {
        if (index < 3) return false;
        if (!excludeSlugs.length) return true;
        return !excludeSlugs.includes(post.slug);
      });
      const posts = filtered.sort(compareByRecencyDesc);
      return {
        ok: true,
        posts,
        source: 'legacy',
      };
    } catch (e) {
      return {
        ok: false,
        error: String(e?.message ?? e),
        posts: [],
        source: 'legacy',
      };
    }
  }

  let dataQuery = supabase
    .from(TABLE)
    .select(
      'id, slug, title, excerpt, image_path, published_at, updated_at, sort_order, status, category',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false, nullsFirst: false });

  if (excludeSlugs.length > 0) {
    dataQuery = dataQuery.not('slug', 'in', slugListForInFilter(excludeSlugs));
  }

  const { data, error } = await dataQuery;

  if (error) {
    return {
      ok: false,
      error: error.message,
      posts: [],
      source: 'supabase',
    };
  }

  const posts = (data ?? []).map(mapRowToHomeView).sort(compareByRecencyDesc);
  return {
    ok: true,
    posts,
    source: 'supabase',
  };
}

export async function fetchPublishedPostBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase) {
    const found = await findLegacyPostBySlug(slug);
    return found
      ? { ok: true, post: found }
      : { ok: false, error: 'Post não encontrado' };
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, slug, title, excerpt, content, image_path, published_at, updated_at, status, category',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) {
    // Fallback para os posts fixos/editoriais mantidos em `public/posts.json`.
    const legacy = await findLegacyPostBySlug(slug);
    if (legacy) return { ok: true, post: legacy };
    return { ok: false, error: 'Post não encontrado' };
  }
  return { ok: true, post: mapRowToPublicView(data) };
}

export async function fetchAllPostsForAdmin() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).sort(compareByRecencyDesc);
}

export async function fetchPostByIdForAdmin(id) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {File} file
 * @returns {Promise<string>} storage path
 */
export async function uploadPostImage(file) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const ext = file.type === 'image/png' ? 'png' : 'jpg';
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function removePostImage(path) {
  if (!path) return;
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error('Erro ao remover imagem:', error);
}

/**
 * @param {{ title: string, slug: string, excerpt: string, content: string, status: 'draft'|'published', image_path: string, category?: 'standard'|'live' }} input
 */
export async function createPost(input) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const { data: maxRow } = await supabase
    .from(TABLE)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;
  const now = new Date().toISOString();
  const publishedAt =
    input.status === 'published' ? now : null;
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      image_path: input.image_path,
      status: input.status,
      published_at: publishedAt,
      sort_order: nextOrder,
      category: input.category ?? 'standard',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * @param {string} id
 * @param {{ title: string, slug: string, excerpt: string, content: string, status: 'draft'|'published', image_path: string, category?: 'standard'|'live' }} input
 * @param {{ previousPublishedAt: string | null, previousImagePath: string }} meta
 */
export async function updatePost(id, input, meta) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  let publishedAt = meta.previousPublishedAt;
  if (input.status === 'published') {
    publishedAt = publishedAt ?? new Date().toISOString();
  } else {
    publishedAt = null;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      image_path: input.image_path,
      status: input.status,
      published_at: publishedAt,
      category: input.category ?? 'standard',
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  if (input.image_path !== meta.previousImagePath && meta.previousImagePath) {
    await removePostImage(meta.previousImagePath);
  }
  return data;
}

export async function deletePost(id, imagePath) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
  if (imagePath) await removePostImage(imagePath);
}

export async function swapSortOrder(idA, idB) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  const { data: rows, error } = await supabase
    .from(TABLE)
    .select('id, sort_order')
    .in('id', [idA, idB]);
  if (error) throw error;
  const a = rows?.find((r) => r.id === idA);
  const b = rows?.find((r) => r.id === idB);
  if (!a || !b) throw new Error('Posts não encontrados');
  const { error: e1 } = await supabase.from(TABLE).update({ sort_order: b.sort_order }).eq('id', a.id);
  if (e1) throw e1;
  const { error: e2 } = await supabase.from(TABLE).update({ sort_order: a.sort_order }).eq('id', b.id);
  if (e2) throw e2;
}
