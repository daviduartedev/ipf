import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../lib/slugify.js';
import { validateImageFile } from '../lib/validateImageFile.js';
import { resolvePostImageUrl } from '../lib/postImageUrl.js';
import {
  createPost,
  fetchPostByIdForAdmin,
  updatePost,
  uploadPostImage,
} from '../services/postsApi.js';

export default function AdminPostForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('standard');
  const [status, setStatus] = useState('draft');
  const contentRef = useRef(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [file, setFile] = useState(null);
  const [existingPath, setExistingPath] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const row = await fetchPostByIdForAdmin(id);
        if (cancelled || !row) return;
        setTitle(row.title);
        setSlug(row.slug);
        setExcerpt(row.excerpt);
        setContent(row.content);
        setCategory(row.category === 'live' ? 'live' : 'standard');
        setStatus(row.status);
        setExistingPath(row.image_path);
        setSlugTouched(true);
      } catch (e) {
        if (!cancelled) setError(String(e?.message ?? e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  useEffect(() => {
    if (slugTouched || !isNew) return;
    setSlug(slugify(title));
  }, [title, slugTouched, isNew]);

  function handleTitleBlur() {
    if (!slugTouched && isNew) {
      setSlug(slugify(title));
    }
  }

  function insertMarkdownLink() {
    const ta = contentRef.current;
    const url = window.prompt('URL do link');
    if (!url || !url.trim()) return;
    const trimmed = url.trim();
    if (!ta) {
      const sel = 'texto';
      setContent((c) => `${c}[${sel}](${trimmed})`);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = content.slice(start, end) || 'texto';
    const insertion = `[${sel}](${trimmed})`;
    const next = content.slice(0, start) + insertion + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      try {
        ta.focus();
        const pos = start + insertion.length;
        ta.setSelectionRange(pos, pos);
      } catch {
        /* ignore */
      }
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const supabasePath = existingPath;
    if (isNew && !file) {
      setError('Selecione uma imagem para o post.');
      return;
    }
    if (file) {
      const v = validateImageFile(file);
      if (!v.ok) {
        setError(v.message);
        return;
      }
    }
    setSaving(true);
    try {
      let imagePath = supabasePath;
      if (file) {
        imagePath = await uploadPostImage(file);
      }
      if (!imagePath) {
        setError('Imagem em falta.');
        setSaving(false);
        return;
      }
      if (isNew) {
        await createPost({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: content,
          status,
          image_path: imagePath,
          category,
        });
      } else {
        const row = await fetchPostByIdForAdmin(id);
        if (!row) {
          setError('Post não encontrado.');
          return;
        }
        await updatePost(
          id,
          {
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content,
            status,
            image_path: imagePath,
            category,
          },
          {
            previousPublishedAt: row.published_at,
            previousImagePath: row.image_path,
          },
        );
      }
      navigate('/adminipf');
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="admin-muted">A carregar…</p>;
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h2 className="cinzel" style={{ color: 'var(--secondary)' }}>
        {isNew ? 'Nova postagem' : 'Editar postagem'}
      </h2>
      <label>
        Título
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          required
        />
      </label>
      <label>
        Slug (URL)
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </label>
      <label>
        Resumo (uma frase)
        <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required maxLength={300} />
      </label>
      <label>
        Conteúdo
        <p className="admin-muted" style={{ margin: '0 0 6px', fontSize: '0.85rem' }}>
          Markdown simples: parágrafos separados por linha em branco; use o botão para inserir hiperligações.
        </p>
        <div style={{ marginBottom: '8px' }}>
          <button type="button" className="admin-inline-btn" onClick={insertMarkdownLink}>
            Inserir hiperligação
          </button>
        </div>
        <textarea
          ref={contentRef}
          className="admin-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>
      <label>
        Categoria
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="standard">Padrão</option>
          <option value="live">LIVE</option>
        </select>
      </label>
      <label>
        Estado
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </label>
      <label>
        Imagem (JPEG ou PNG, máx. 5 MB)
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {!isNew && existingPath ? (
        <div>
          <p className="admin-muted">Imagem atual</p>
          <img
            src={resolvePostImageUrl(existingPath)}
            alt=""
            style={{ maxWidth: '240px', border: '1px solid var(--primary)' }}
          />
        </div>
      ) : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'A guardar…' : 'Guardar'}
        </button>
        <button type="button" onClick={() => navigate('/adminipf')} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
