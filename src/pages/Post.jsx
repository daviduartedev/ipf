import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatPostDate } from '../lib/formatPostDate.js';
import { fetchPublishedPostBySlug } from '../services/postsApi.js';
import './Post.css';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError('');
      const result = await fetchPublishedPostBySlug(slug);
      if (cancelled) return;
      if (!result.ok) {
        setPost(null);
        setError(result.error || 'Post não encontrado');
        return;
      }
      setPost(result.post);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!post && !error) {
    return <div className="post-detail-container">Carregando...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          ◀ VOLTAR
        </button>
        <p>{error || 'Post não encontrado'}</p>
      </div>
    );
  }

  const published = post.publishedAt ? formatPostDate(post.publishedAt) : '';
  const updated = post.updatedAt ? formatPostDate(post.updatedAt) : '';

  return (
    <article className="post-detail-container">
      <button className="back-btn" type="button" onClick={() => navigate(-1)}>
        ◀ VOLTAR
      </button>
      <img className="post-detail-img" src={post.imageUrl} alt={post.title} />
      <h1 className="post-detail-title cinzel">{post.title}</h1>
      {(published || updated) && (
        <div className="post-meta">
          {published ? <span>Publicado: {published}</span> : null}
          {published && updated ? <span className="post-meta-sep"> · </span> : null}
          {updated ? <span>Atualizado: {updated}</span> : null}
        </div>
      )}
      <div className="post-detail-content">
        {post.content.split('\n').map((line, i) => {
          if (line.includes('docs.google.com') || line.startsWith('http')) {
            const url = line.trim();
            return (
              <p key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="content-link">
                  Clique aqui
                </a>
              </p>
            );
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    </article>
  );
}
