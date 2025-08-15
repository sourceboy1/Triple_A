import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhonesTabletsDisplay.css';

const BACKEND_URL = 'http://localhost:8000';

const PhonesTabletsDisplay = () => {
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/?category_id=6`);
        const data = await response.json();
        setProducts(shuffleArray(data.slice(0, fetchCount)));
      } catch (error) {
        console.error('Error fetching phones and tablets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const interval = setInterval(() => {
      setProducts(prev => prev.length ? [...prev.slice(1), prev[0]] : prev);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product_id) => navigate(`/product-details/${product_id}`);
  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const formatPrice = (price) => isNaN(price) ? 'N/A' : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setCurrentTranslate(e.touches[0].clientX - startX);
  const handleTouchEnd = () => {
    if (currentTranslate > 50) setProducts(prev => prev.length ? [...prev.slice(1), prev[0]] : prev);
    else if (currentTranslate < -50) setProducts(prev => prev.length ? [prev[prev.length - 1], ...prev.slice(0, -1)] : prev);
    setCurrentTranslate(0);
  };

  return (
    <div className="phones-tablets-container">
      <h2>Featured Phones & Tablets</h2>
      <div className="phones-tablets-display">
        {loading ? (
          <p>Loading phones and tablets...</p>
        ) : (
          <div
            className="phones-tablets-slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${currentTranslate}px)`, transition: 'transform 0.3s ease-in-out' }}
          >
            {products.slice(0, displayCount).map((p, index) => {
              const primaryImg = p.image_url ? `${BACKEND_URL}${p.image_url}` : '/placeholder.jpg';
              const secondaryImg = p.secondary_image_url ? `${BACKEND_URL}${p.secondary_image_url}` : primaryImg;

              return (
                <div
                  className="phones-tablets-item"
                  key={p.product_id || index}
                  onClick={() => handleProductClick(p.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={hoveredIndex === index ? secondaryImg : primaryImg} alt={p.name} className="phones-tablets-image" />
                  <h3 className="phones-tablets-name">{p.name}</h3>
                  <p className="phones-tablets-price">{formatPrice(parseFloat(p.price))}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonesTabletsDisplay;
