/**
 * Migração única: public/posts.json → Supabase (tabela `posts` + bucket `post-images`).
 * Requer: VITE_SUPABASE_URL (ou SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY
 *
 * Windows (PowerShell):
 *   $env:SUPABASE_SERVICE_ROLE_KEY="..."; $env:SUPABASE_URL="https://xxx.supabase.co"; npm run migrate:posts
 */

import { readFileSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { slugify } from '../src/lib/slugify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Defina SUPABASE_URL (ou VITE_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function uniqueSlug(title, used) {
  let base = slugify(title);
  let s = base;
  let n = 2;
  while (used.has(s)) {
    s = `${base}-${n}`;
    n += 1;
  }
  used.add(s);
  return s;
}

async function main() {
  const jsonPath = join(root, 'public', 'posts.json');
  const raw = readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  const posts = Array.isArray(data.posts) ? data.posts : [];
  const usedSlugs = new Set();

  let sort = 0;
  const { data: maxRow } = await supabase
    .from('posts')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (maxRow && typeof maxRow.sort_order === 'number') {
    sort = maxRow.sort_order + 1;
  }

  for (const p of posts) {
    const rel = String(p.image).replace(/^\//, '');
    const abs = join(root, 'public', rel);
    if (!existsSync(abs)) {
      console.warn(`Imagem em falta, a ignorar post "${p.title}": ${abs}`);
      continue;
    }
    const buf = readFileSync(abs);
    const ext = rel.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const path = `migrated/${slugify(p.id)}.${ext}`;

    const { error: upErr } = await supabase.storage.from('post-images').upload(path, buf, {
      contentType: mime,
      upsert: true,
    });
    if (upErr) {
      console.error(`Falha no upload (${p.title}):`, upErr.message);
      continue;
    }

    const slug = uniqueSlug(p.title, usedSlugs);
    const now = new Date().toISOString();

    const { error: insErr } = await supabase.from('posts').insert({
      slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      image_path: path,
      status: 'published',
      published_at: now,
      sort_order: sort,
    });

    if (insErr) {
      console.error(`Falha ao inserir (${p.title}):`, insErr.message);
      await supabase.storage.from('post-images').remove([path]);
      continue;
    }

    console.log(`OK: ${p.title} → slug "${slug}"`);
    sort += 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
