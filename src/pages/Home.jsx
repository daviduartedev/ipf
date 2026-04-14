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
    <>
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

      <div className="home-banner">
        <img className="banner-desktop" src={`${import.meta.env.BASE_URL}img/banners/banner_desktop.png`} alt="Anuncie Aqui" />
        <img className="banner-mobile" src={`${import.meta.env.BASE_URL}img/banners/banner_mobile.png`} alt="Anuncie Aqui" />
      </div>
    </>
  );



}
