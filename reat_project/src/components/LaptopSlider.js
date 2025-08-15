import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LaptopSlider.css';

const BACKEND_URL = 'http://localhost:8000';

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
        const response = await fetch(`${BACKEND_URL}/api/products/?category_id=3`);
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          setLoading(false);
          return;
        }
        setLaptops(shuffleArray(data.slice(0, fetchCount)));
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();

    intervalRef.current = setInterval(() => {
      setLaptops((prev) => prev.length ? [...prev.slice(1), prev[0]] : prev);
    }, 12000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleProductClick = (product_id) => navigate(`/product-details/${product_id}`);
  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <div className="laptop-container">
      <h2>Featured Laptops</h2>
      <div className="laptop-display" ref={sliderRef}>
        {loading ? (
          <p>Loading laptops...</p>
        ) : laptops.length === 0 ? (
          <p>No laptops available at the moment.</p>
        ) : (
          <div className="laptop-slider">
            {laptops.slice(0, displayCount).map((laptop, index) => {
              const primaryImg = laptop?.image_url ? `${BACKEND_URL}${laptop.image_url}` : '/placeholder.jpg';
              const secondaryImg = laptop?.secondary_image_url ? `${BACKEND_URL}${laptop.secondary_image_url}` : primaryImg;

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
                    onError={(e) => e.target.src = '/placeholder.jpg'}
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
