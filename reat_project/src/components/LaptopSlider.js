import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import './LaptopSlider.css';

const LaptopDisplay = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
  const displayCount = 30;
  const navigate = useNavigate();
  const intervalsRef = useRef({});

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
        const response = await api.get(`products/?category_id=4`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          setLoading(false);
          return;
        }

        const shuffledLaptops = shuffleArray(data.slice(0, displayCount));
        setLaptops(shuffledLaptops);
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();

    return () => {
      // cleanup all hover intervals
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (productId, images) => {
    if (images.length < 2) return;

    let currentImgIndex = 0;
    intervalsRef.current[productId] = setInterval(() => {
      currentImgIndex = (currentImgIndex + 1) % images.length;
      setHoverImageIndexes((prev) => ({
        ...prev,
        [productId]: currentImgIndex,
      }));
    }, 1000);
  };

  const handleMouseLeave = (productId) => {
    clearInterval(intervalsRef.current[productId]);
    intervalsRef.current[productId] = null;

    setHoverImageIndexes((prev) => ({
      ...prev,
      [productId]: 0,
    }));
  };

  return (
    <div className="laptop-container">
      <h2>Featured Laptops</h2>
      {loading ? (
        <p>Loading laptops...</p>
      ) : laptops.length === 0 ? (
        <p>No laptops available at the moment.</p>
      ) : (
        <div className="laptop-slider">
          {laptops.map((laptop, index) => {
            if (!laptop) return null;

            // Collect available images
            const images = [
              laptop.image_urls?.medium,
              laptop.secondary_image_urls?.medium,
              laptop.tertiary_image_urls?.medium,
              laptop.quaternary_image_urls?.medium,
            ].filter(Boolean);

            const currentImg =
              images[hoverImageIndexes[laptop.product_id] || 0] ||
              '/placeholder.jpg';

            return (
              <div
                className="laptop-item"
                key={laptop.product_id || index}
                onClick={() => handleProductClick(laptop.product_id)}
                onMouseEnter={() => handleMouseEnter(laptop.product_id, images)}
                onMouseLeave={() => handleMouseLeave(laptop.product_id)}
              >
                <img
                  src={currentImg}
                  alt={laptop?.name || 'Unnamed Laptop'}
                  className="laptop-image"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <h3 className="laptop-name">{laptop?.name || 'Unnamed Laptop'}</h3>
                <p className="laptop-price">{formatPrice(laptop?.price)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LaptopDisplay;
