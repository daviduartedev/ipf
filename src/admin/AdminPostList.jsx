import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  deletePost,
  fetchAllPostsForAdmin,
} from '../services/postsApi.js';
import { resolvePostImageUrl } from '../lib/postImageUrl.js';
import { formatPostDate } from '../lib/formatPostDate.js';

export default function AdminPostList() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchAllPostsForAdmin();
      setRows(data);
    } catch (e) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(row) {
    const ok = window.confirm(`Eliminar "${row.title}"?`);
    if (!ok) return;
    setError('');
    try {
      await deletePost(row.id, row.image_path);
      await load();
    } catch (e) {
      setError(String(e?.message ?? e));
    }
  }

  if (loading) {
    return <p className="admin-muted">A carregar…</p>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-actions">
        <button type="button" onClick={() => navigate('/adminipf/new')}>
          Nova postagem
        </button>
        <button type="button" onClick={() => load()}>
          Atualizar lista
        </button>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Imagem</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="admin-muted">
                  {row.published_at || row.updated_at
                    ? formatPostDate(row.published_at || row.updated_at)
                    : '-'}
                </div>
              </td>
              <td>
                <img
                  src={resolvePostImageUrl(row.image_path)}
                  alt=""
                  width={56}
                  height={56}
                  style={{ objectFit: 'cover', border: '1px solid var(--primary)' }}
                />
              </td>
              <td>
                <div>{row.title}</div>
                <div className="admin-muted">{row.slug}</div>
              </td>
              <td>{row.status === 'published' ? 'Publicado' : 'Rascunho'}</td>
              <td>
                <div className="admin-row-inline">
                  <Link to={`/adminipf/edit/${row.id}`}>Editar</Link>
                  <button type="button" onClick={() => handleDelete(row)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="admin-muted">Sem postagens ainda. Crie a primeira.</p>
      ) : null}
    </div>
  );
}
