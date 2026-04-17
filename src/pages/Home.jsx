import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const BANNERS = [
  {
    desktop: `${import.meta.env.BASE_URL}img/banners/banner_desktop.png`,
    mobile: `${import.meta.env.BASE_URL}img/banners/banner_mobile.png`,
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20vi%20o%20banner%20de%20anuncie%20aqui%20no%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.",
    alt: "Anuncie Aqui"
  },
  {
    desktop: `${import.meta.env.BASE_URL}img/banners/banner-ink-web.jpg`,
    mobile: `${import.meta.env.BASE_URL}img/banners/banner-ink-mobile.jpg`, // Using web version as fallback until mobile is uploaded
    link: "https://wa.me/5548998096699?text=Ol%C3%A1%2C%20vi%20seu%20banner%20no%20site%20Inaudit%C3%ADvel%20Por%20Favor%20%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio.",
    alt: "89 Ink Tattoo"
  }
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}posts.json`)
      .then(res => res.json())
      .then(data => setPosts(data.posts))
      .catch(err => console.error("Erro ao carregar posts:", err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="banner-container">
        <div
          className="home-banner"
          onClick={() => window.open(BANNERS[currentBanner].link, "_blank")}
        >
          <picture key={currentBanner}>
            <source media="(max-width: 768px)" srcSet={BANNERS[currentBanner].mobile} />
            <img
              src={BANNERS[currentBanner].desktop}
              alt={BANNERS[currentBanner].alt}
              className="carousel-image"
            />
          </picture>
        </div>
        <div className="banner-dots">
          {BANNERS.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentBanner === index ? 'active' : ''}`}
              onClick={() => setCurrentBanner(index)}
            ></span>
          ))}
        </div>
      </div>

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
    </>
  );
}
