import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api'; // ✅ Use centralized API
import './PhonesTabletsDisplay.css';

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
    const fetchPhonesAndTablets = async () => {
      try {
        const response = await api.get('/products/', { params: { category_id: 6 } });
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          setLoading(false);
          return;
        }

        const shuffledProducts = shuffleArray(data.slice(0, fetchCount));
        setProducts(shuffledProducts);
      } catch (error) {
        console.error('Error fetching phones and tablets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhonesAndTablets();

    const interval = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev;
        const firstItem = prev[0];
        return [...prev.slice(1), firstItem];
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const formatPrice = (price) => {
    if (isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Touch handlers for sliding
  const handleTouchStart = (event) => {
    setStartX(event.touches[0].clientX);
    setCurrentTranslate(0);
  };

  const handleTouchMove = (event) => {
    const currentX = event.touches[0].clientX;
    const diffX = currentX - startX;
    setCurrentTranslate(diffX);
  };

  const handleTouchEnd = () => {
    if (currentTranslate > 50) {
      // Swipe right
      setProducts((prev) => {
        const firstItem = prev[0];
        return [...prev.slice(1), firstItem];
      });
    } else if (currentTranslate < -50) {
      // Swipe left
      setProducts((prev) => {
        const lastItem = prev[prev.length - 1];
        return [lastItem, ...prev.slice(0, -1)];
      });
    }
    setCurrentTranslate(0);
  };

  return (
    <div className="phones-tablets-container">
      <h2>Featured Phones & Tablets</h2>
      <div className="phones-tablets-display">
        {loading ? (
          <p>Loading phones and tablets...</p>
        ) : products.length === 0 ? (
          <p>No phones or tablets available at the moment.</p>
        ) : (
          <div
            className="phones-tablets-slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${currentTranslate}px)`, transition: 'transform 0.3s ease-in-out' }}
          >
            {products.slice(0, displayCount).map((product, index) => {
              if (!product || !product.image_url) return null;

              return (
                <div
                  className="phones-tablets-item"
                  key={product.product_id}
                  onClick={() => handleProductClick(product.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={hoveredIndex === index && product.secondary_image_url ? product.secondary_image_url : product.image_url}
                    alt={product.name || 'Phone/Tablet'}
                    className="phones-tablets-image"
                  />
                  <h3 className="phones-tablets-name">{product.name}</h3>
                  <p className="phones-tablets-price">{formatPrice(parseFloat(product.price))}</p>
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
