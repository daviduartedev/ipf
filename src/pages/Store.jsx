import { useState, useEffect } from 'react';
import './Store.css';

const base = import.meta.env.BASE_URL;

const productsData = [
  {
    name: "Camiseta - Sucesso",
    price: "R$ 89,90 + Frete",
    images: [
      `${base}img/store/sucesso_frente.png`,
      `${base}img/store/sucesso_verso.png`
    ],
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Camiseta,%20Sucesso",
    badge: "LANÇAMENTO"
  },
  {
    name: "Camiseta - Louder, Faster, Heavier",
    price: "R$ 89,90 + Frete",
    images: [
      `${base}img/store/louder, faster, heavier - frente.png`,
      `${base}img/store/louder, faster, heavier - verso.png`
    ],
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Camiseta,%20Louder,%20Faster,%20Heavier"
  },
  {
    name: "Camiseta - Toupeira",
    price: "R$ 89,90 + Frete",
    images: [
      `${base}img/store/toupeira_frente.png`,
      `${base}img/store/toupeira_verso.png`
    ],
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20Camiseta,%20Toupeira"
  },
  {
    name: "Bottom - Apoie a Cena",
    price: "R$ 19,90 + Frete Grátis",
    images: [`${base}img/store/bottom - apoie a cena.png`],
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Bottom%20-%20Apoie%20a%20Cena"
  },
  {
    name: "Bottom Personalizável",
    price: "R$ 7,00 + Frete",
    images: [`${base}img/store/bottom personalizavel.png`],
    link: "https://wa.me/5548996196699?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Bottom%20Personaliz%C3%A1vel"
  }
];



function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel">
      {images.length > 1 && (
        <>
          <button className="carousel-arrow left" onClick={prevSlide}>◀</button>
          <button className="carousel-arrow right" onClick={nextSlide}>▶</button>
        </>
      )}
      {images.map((img, i) => (
        <img 
          key={i} 
          src={img} 
          className={`carousel-img ${i === currentIndex ? 'active' : ''}`} 
          alt={`Produto imagem ${i + 1}`} 
        />
      ))}
    </div>
  );
}

export default function Store() {
  return (
    <div className="store-container">
      <div className="product-grid">
        {productsData.map((prod, index) => (
          <div key={index} className="product-card">
            {prod.badge && <div className="product-badge">{prod.badge}</div>}
            <Carousel images={prod.images} />
            <div className="product-info">
              <h2 className="product-name">{prod.name}</h2>
              <div className="product-price">{prod.price}</div>
              <button className="buy-button" onClick={() => window.open(prod.link, '_blank')}>
                COMPRAR AGORA
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
