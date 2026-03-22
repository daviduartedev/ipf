import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Post.css';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}posts.json`)
      .then(res => res.json())
      .then(data => {
        const found = data.posts.find(p => p.id === id);
        setPost(found);
      })
      .catch(err => console.error("Erro ao carregar post:", err));
  }, [id]);

  if (!post) return <div className="post-detail-container">Carregando...</div>;

  return (
    <article className="post-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>◀ VOLTAR</button>
      <img className="post-detail-img" src={`${import.meta.env.BASE_URL}${post.image}`} alt={post.title} />
      <h1 className="post-detail-title cinzel">{post.title}</h1>
      <div className="post-detail-content">
        {post.content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </article>
  );
}
