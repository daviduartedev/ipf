# Ciclo 2 — Posts + NUKE DB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce Markdown body rendering with safe links, post category `LIVE` with home filter, Supabase `category` column, NUKE DB field `titulo` (rename from `album`), `work_type` value `live`, and visible **Tipo** column on `/db`.

**Architecture:** Schema-first: add `posts.category` via SQL migration, extend `postsApi` and legacy mappers, then `PostBody` (react-markdown + gfm + sanitize) and admin UX (category + link helper), then home filter and optional badge. NUKE DB changes are isolated to `src/services/data.js`, `Database.jsx`, and specs. Large `data.js` key renames are done with a one-off Node script committed under `scripts/` for auditability.

**Tech Stack:** React 19, Vite, Supabase JS client, Vitest; new deps: `react-markdown`, `remark-gfm`, `rehype-sanitize`.

**Note:** The writing-plans skill suggests a dedicated git worktree for execution; create one if you want isolation from other local changes.

---

### Task 1: SQL migration — `posts.category`

**Files:**
- Create: `supabase/migrations/20260510120000_posts_category.sql`
- Modify: `scripts/run-migration-sql.mjs` (only if your project requires registering new files — otherwise no change)

- [ ] **Step 1: Add migration file**

Create `supabase/migrations/20260510120000_posts_category.sql`:

```sql
-- Ciclo 2: categoria editorial (ex.: LIVE)
alter table public.posts
  add column if not exists category text not null default 'standard';

alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (category in ('standard', 'live'));

comment on column public.posts.category is 'Editorial category: standard | live';
```

- [ ] **Step 2: Apply on hosted Supabase**

Run your usual process (`npm run db:migrate-sql` or SQL editor). Confirm: `\d public.posts` (or Supabase UI) shows `category` with default `standard`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260510120000_posts_category.sql
git commit -m "feat(db): add posts.category for LIVE editorial filter"
```

---

### Task 2: Rename NUKE DB field `album` → `titulo` in source data

**Files:**
- Create: `scripts/rename-album-to-titulo-in-data.mjs`
- Modify: `src/services/data.js` (after script run)

- [ ] **Step 1: Add script**

Create `scripts/rename-album-to-titulo-in-data.mjs`:

```javascript
/**
 * One-off: replace object key `album` with `titulo` in src/services/data.js RAW_DB_DATA.
 * Run from repo root: node scripts/rename-album-to-titulo-in-data.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '..', 'src', 'services', 'data.js');
let s = readFileSync(path, 'utf8');
const before = s;
// Only lines like `{ album:` or `  album:` inside objects — avoid touching prose comments
s = s.replace(/^\s*album\s*:/gm, (m) => m.replace(/album\s*:/, 'titulo:'));
if (s === before) {
  console.error('No replacements made; check file format.');
  process.exit(1);
}
writeFileSync(path, s);
console.log('Updated album: keys to titulo: in', path);
```

- [ ] **Step 2: Run script**

Run: `node scripts/rename-album-to-titulo-in-data.mjs`

Expected: console prints success; `grep \"album:\" src/services/data.js` returns **no** property keys (only allowed if inside strings/comments — should be none).

- [ ] **Step 3: Commit**

```bash
git add scripts/rename-album-to-titulo-in-data.mjs src/services/data.js
git commit -m "refactor(nuke-db): rename album field to titulo in catalog data"
```

---

### Task 3: Extend `work_type` with `live` + helper label

**Files:**
- Modify: `src/services/data.js` (`WORK_TYPE_OPTIONS` near top)

- [ ] **Step 1: Add option**

After existing entries in `WORK_TYPE_OPTIONS`, add:

```javascript
  { value: 'live', label: 'Live' },
```

Ensure `WORK_TYPE_VALUES` still derives from `WORK_TYPE_OPTIONS` (no manual edits needed if it uses `.map`).

- [ ] **Step 2: Commit**

```bash
git add src/services/data.js
git commit -m "feat(nuke-db): add live work_type"
```

---

### Task 4: Vitest — label resolver for `work_type`

**Files:**
- Create: `src/services/workTypeLabel.js`
- Create: `src/services/workTypeLabel.test.js`

- [ ] **Step 1: Create resolver**

`src/services/workTypeLabel.js`:

```javascript
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
```

- [ ] **Step 2: Write failing test**

`src/services/workTypeLabel.test.js`:

```javascript
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
```

- [ ] **Step 3: Run test**

Run: `npm test -- src/services/workTypeLabel.test.js`

Expected: **PASS**

- [ ] **Step 4: Commit**

```bash
git add src/services/workTypeLabel.js src/services/workTypeLabel.test.js
git commit -m "test(nuke-db): work_type label helper"
```

---

### Task 5: `/db` table — column Título + Tipo + search uses `titulo`

**Files:**
- Modify: `src/pages/Database.jsx`

- [ ] **Step 1: Import helper**

Add:

```javascript
import { workTypeLabel } from '../services/workTypeLabel.js';
```

- [ ] **Step 2: Fix filter predicate**

Replace references to `d.album` with `d.titulo`:

```javascript
(d.titulo && d.titulo.toLowerCase().includes(q))
```

- [ ] **Step 3: Sort handler**

Where `handleSort('album')` existed, use `'titulo'`:

```javascript
<th onClick={() => handleSort('titulo')}>
  TÍTULO <span className="sort">▲▼</span>
</th>
```

- [ ] **Step 4: Add Tipo header and cells**

Inside `<thead><tr>`, after RELEASE header, add:

```javascript
<th>TIPO</th>
```

Inside tbody `<tr>`:

```javascript
<td title={workTypeLabel(item.work_type)}>{workTypeLabel(item.work_type)}</td>
```

- [ ] **Step 5: Mobile cards**

In `.record-card`, after album/title line, show tipo:

```javascript
<div className="record-type">{workTypeLabel(item.work_type)}</div>
```

Rename JSX class `record-album` content to use `item.titulo` (keep class name or rename for clarity — optional).

- [ ] **Step 6: Manual smoke**

Run `npm run dev`, open `/db`, confirm headers, sorting on TÍTULO, Tipo column populated, mobile layout shows tipo.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Database.jsx
git commit -m "feat(db): titulo field, tipo column, live types in UI"
```

---

### Task 6: Install Markdown dependencies

**Files:**
- Modify: `package.json` / `package-lock.json`

- [ ] **Step 1: Install**

Run:

```bash
npm install react-markdown remark-gfm rehype-sanitize
```

Expected: `package.json` lists the three packages under `dependencies`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: react-markdown remark-gfm rehype-sanitize for post bodies"
```

---

### Task 7: `PostBody` component — safe Markdown + external links

**Files:**
- Create: `src/components/PostBody.jsx`
- Create: `src/components/PostBody.css` (optional if you prefer inline in `Post.css`)

- [ ] **Step 1: Implement component**

`src/components/PostBody.jsx`:

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import './PostBody.css';

function linkProps(href) {
  if (!href || !/^https?:\/\//i.test(href)) {
    return {};
  }
  return { target: '_blank', rel: 'noopener noreferrer' };
}

export default function PostBody({ markdown }) {
  return (
    <div className="post-body-md">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...rest }) => (
            <a href={href} {...rest} {...linkProps(href)} className="content-link">
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
```

- [ ] **Step 2: Minimal CSS**

`src/components/PostBody.css`:

```css
.post-body-md {
  line-height: 1.6;
}

.post-body-md p {
  margin: 0 0 1em;
}

.post-body-md p:last-child {
  margin-bottom: 0;
}

.post-body-md a.content-link {
  text-decoration: underline;
  font-weight: 600;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PostBody.jsx src/components/PostBody.css
git commit -m "feat(posts): PostBody Markdown renderer with sanitized HTML"
```

---

### Task 8: Wire `Post.jsx` to `PostBody`

**Files:**
- Modify: `src/pages/Post.jsx`
- Modify: `src/pages/Post.css` if removing obsolete `.post-detail-content` rules

- [ ] **Step 1: Replace paragraph split logic**

Remove the `split('\n').map` block. Inside `<article>`, use:

```jsx
import PostBody from '../components/PostBody.jsx';

// ...

<div className="post-detail-content">
  <PostBody markdown={post.content} />
</div>
```

- [ ] **Step 2: Run dev check**

Open a legacy post from `posts.json` via fallback; confirm paragraphs and Google Forms URL render as clickable link (GFM autolink).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Post.jsx src/pages/Post.css
git commit -m "feat(posts): render detail content as Markdown"
```

---

### Task 9: `postsApi.js` — load `category`, map legacy defaults

**Files:**
- Modify: `src/services/postsApi.js`
- Modify: `src/lib/legacyPosts.js`

- [ ] **Step 1: Extend selects**

Add `category` to Supabase `.select(...)` lists used for published feed and detail, e.g.:

```javascript
'id, slug, title, excerpt, image_path, published_at, updated_at, sort_order, status, category'
```

- [ ] **Step 2: Map home view**

In `mapRowToHomeView`:

```javascript
category: row.category ?? 'standard',
```

- [ ] **Step 3: Map public view**

In `mapRowToPublicView`, include `category` if needed for future; optional for detail page.

- [ ] **Step 4: createPost / updatePost**

Extend insert/update payloads:

```javascript
category: input.category ?? 'standard',
```

JSDoc `@param` types for `input` should include `category?: 'standard'|'live'`.

- [ ] **Step 5: Legacy JSON**

In `legacyPosts.js`, map optional `p.category`:

```javascript
category: p.category === 'live' ? 'live' : 'standard',
```

- [ ] **Step 6: Commit**

```bash
git add src/services/postsApi.js src/lib/legacyPosts.js
git commit -m "feat(posts): persist and load post category"
```

---

### Task 10: Admin form — category + hyperlink helper

**Files:**
- Modify: `src/admin/AdminPostForm.jsx`

- [ ] **Step 1: State**

Add:

```javascript
const [category, setCategory] = useState('standard');
```

Load from row in `useEffect` when editing: `setCategory(row.category ?? 'standard')`.

- [ ] **Step 2: Submit payload**

Pass `category` into `createPost` / `updatePost`.

- [ ] **Step 3: UI — category**

Before or after Estado:

```jsx
<label>
  Categoria
  <select value={category} onChange={(e) => setCategory(e.target.value)}>
    <option value="standard">Padrão</option>
    <option value="live">LIVE</option>
  </select>
</label>
```

- [ ] **Step 4: Link helper**

Add `function wrapLink()` that uses `textarea` ref or `prompt` for URL + uses `textarea.selectionStart/End` to wrap selection with `[${sel || 'texto'}](url)`. Attach to `type="button"` beside Conteúdo.

Minimal implementation with `prompt`:

```javascript
function insertMarkdownLink() {
  const ta = contentRef.current;
  if (!ta) return;
  const url = window.prompt('URL do link');
  if (!url) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const sel = content.slice(start, end) || 'texto';
  const insertion = `[${sel}](${url})`;
  const next = content.slice(0, start) + insertion + content.slice(end);
  setContent(next);
}
```

Wire `ref={contentRef}` on the content `<textarea>`.

- [ ] **Step 5: Helper hint**

Paragraph under label Conteúdo: «Markdown simples: parágrafos em branco; use o botão para criar links.»

- [ ] **Step 6: Commit**

```bash
git add src/admin/AdminPostForm.jsx
git commit -m "feat(admin): post category LIVE and Markdown link helper"
```

---

### Task 11: Home — category filter + optional LIVE badge

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/PostCard.jsx`
- Modify: `src/components/PostCard.css` or co-located styles

- [ ] **Step 1: State**

```javascript
const [categoryFilter, setCategoryFilter] = useState('all');
```

- [ ] **Step 2: Filter logic**

Inside `filteredPosts` filter callback, after `matchesText`:

```javascript
if (categoryFilter === 'live' && post.category !== 'live') return false;
```

(`standard` and missing category should not match `live`.)

- [ ] **Step 3: UI control**

Add `<select>` in filter panel:

```jsx
<label className="home-filter-field">
  <span className="home-filter-label">Categoria</span>
  <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
    <option value="all">Todas as categorias</option>
    <option value="live">LIVE</option>
  </select>
</label>
```

- [ ] **Step 4: Clear filters**

Include `setCategoryFilter('all')` in clear handler.

- [ ] **Step 5: PostCard badge**

Props: `showLiveBadge={post.category === 'live'}`. Render small «LIVE» span when true.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/components/PostCard.jsx
git commit -m "feat(home): LIVE category filter and card badge"
```

---

### Task 12: Migrate script + feature specs

**Files:**
- Modify: `scripts/migrate-posts.mjs` (insert `category: 'standard'`)
- Modify: `spec/features/admin-posts/readme.md`
- Modify: `spec/features/public-site/readme.md`
- Modify: `spec/features/nuke-db/readme.md`

- [ ] **Step 1: migrate-posts insert**

In `.insert({...})` add:

```javascript
category: 'standard',
```

- [ ] **Step 2: admin-posts spec**

Document: `content` is Markdown; `category` enum `standard|live`; links policy.

- [ ] **Step 3: public-site spec**

Document category filter dropdown and AND semantics with search/period.

- [ ] **Step 4: nuke-db spec**

Replace field `album` with `titulo` in tables; add `live` to enum and labels; document visible Tipo column.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-posts.mjs spec/features/admin-posts/readme.md spec/features/public-site/readme.md spec/features/nuke-db/readme.md
git commit -m "docs: align specs and migrate script with ciclo 2"
```

---

### Task 13: Verification gate

**Files:** (none)

- [ ] **Step 1: Lint**

Run: `npm run lint`

Expected: exit code 0

- [ ] **Step 2: Tests**

Run: `npm test`

Expected: all tests pass

- [ ] **Step 3: Build**

Run: `npm run build`

Expected: successful Vite build

- [ ] **Step 4: Commit** (only if fixes were needed)

```bash
git add -A
git commit -m "fix: ciclo 2 verification cleanup"
```

---

## Self-review (plan vs spec)

| Requirement | Task |
|-------------|------|
| Markdown + links + spacing | Task 6–8, 10 |
| LIVE post category + filter | Task 1, 9–11 |
| External links `target/_blank` + rel | Task 7 |
| NUKE `titulo` | Task 2, 5 |
| NUKE `live` + Tipo column | Task 3–5 |
| Legacy compatibility | Task 9, 11 (category default), Task 8 (MD) |
| Docs | Task 12 + root design spec already in `docs/superpowers/specs/` |

Placeholder scan: none intentional.

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-10-cyclo-2-implementation.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach do you want?**
