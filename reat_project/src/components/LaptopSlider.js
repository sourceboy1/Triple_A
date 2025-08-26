import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api'; // ✅ Use centralized API
import './LaptopSlider.css';

const LaptopDisplay = () => {
  const [laptops, setLaptops] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const formatPrice = (price) => {
    if (isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await api.get('/products/', { params: { category_id: 3 } });
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          setLoading(false);
          return;
        }

        const shuffledLaptops = shuffleArray(data.slice(0, fetchCount));
        setLaptops(shuffledLaptops);
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();

    intervalRef.current = setInterval(() => {
      setLaptops((prev) => {
        if (prev.length === 0) return prev;
        const firstItem = prev[0];
        return prev.slice(1).concat(firstItem);
      });
    }, 12000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;

    const handleTouchMove = (e) => {
      const touchEndX = e.touches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (diff > 30) {
        setLaptops((prev) => {
          if (prev.length === 0) return prev;
          const firstItem = prev[0];
          return prev.slice(1).concat(firstItem);
        });
        clearInterval(intervalRef.current);
      }

      if (diff < -30) {
        setLaptops((prev) => {
          if (prev.length === 0) return prev;
          const lastItem = prev[prev.length - 1];
          return [lastItem].concat(prev.slice(0, prev.length - 1));
        });
        clearInterval(intervalRef.current);
      }

      sliderRef.current.removeEventListener('touchmove', handleTouchMove);
    };

    sliderRef.current.addEventListener('touchmove', handleTouchMove);
  };

  return (
    <div className="laptop-container">
      <h2>Featured Laptops</h2>
      <div className="laptop-display" ref={sliderRef} onTouchStart={handleTouchStart}>
        {loading ? (
          <p>Loading laptops...</p>
        ) : laptops.length === 0 ? (
          <p>No laptops available at the moment.</p>
        ) : (
          <div className="laptop-slider">
            {laptops.slice(0, displayCount).map((laptop, index) => {
              const primaryImg = laptop.image_urls?.medium || '/placeholder.jpg';
              const secondaryImg = laptop.secondary_image_urls?.medium || primaryImg;

              return (
                <div
                  className="laptop-item"
                  key={laptop.product_id || index}
                  onClick={() => handleProductClick(laptop.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={hoveredIndex === index ? secondaryImg : primaryImg}
                    alt={laptop?.name || 'Unnamed Laptop'}
                    className="laptop-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                  <h3 className="laptop-name">{laptop?.name || 'Unnamed Laptop'}</h3>
                  <p className="laptop-price">{formatPrice(laptop?.price)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopDisplay;
