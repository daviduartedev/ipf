import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}posts.json`)
      .then(res => res.json())
      .then(data => setPosts(data.posts))
      .catch(err => console.error("Erro ao carregar posts:", err));
  }, []);

  return (
    <div className="home-container">
      <section className="featured-product">
        <div className="product-card featured" onClick={() => window.open("https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Camiseta,%20Sucesso", "_blank")}>
          <img className="product-img" src={`${import.meta.env.BASE_URL}img/store/sucesso_frente.png`} alt="Camiseta - Sucesso" />
          <div className="product-info">
            <h2 className="product-name">Camiseta - Sucesso</h2>
            <div className="product-price">R$ 89,90 + Frete</div>
            <button className="buy-button">COMPRAR AGORA</button>
          </div>
        </div>
      </section>

      <section className="posts" id="postsContainer">
        {posts.map(post => (
          <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
            <img className="post-img" src={`${import.meta.env.BASE_URL}${post.image}`} alt={post.title} />
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );

}
