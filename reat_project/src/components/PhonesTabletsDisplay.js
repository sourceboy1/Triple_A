import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import './PhonesTabletsDisplay.css';

const PhonesTabletsDisplay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
  const fetchCount = 30;
  const navigate = useNavigate();
  const intervalsRef = useRef({});

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
        const response = await api.get(`products/?category_id=2`);
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

    return () => {
      clearInterval(interval);
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

  const formatPrice = (price) => {
    if (isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
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
          <div className="phones-tablets-slider">
            {products.map((product) => {
              if (!product || !product.image_urls?.medium) return null;

              const images = [
                product.image_urls?.medium,
                product.secondary_image_urls?.medium,
                product.tertiary_image_urls?.medium,
                product.quaternary_image_urls?.medium,
              ].filter(Boolean);

              const currentImg =
                images[hoverImageIndexes[product.product_id] || 0] || images[0];

              return (
                <div
                  className="phones-tablets-item"
                  key={product.product_id}
                  onClick={() => handleProductClick(product.product_id)}
                  onMouseEnter={() =>
                    handleMouseEnter(product.product_id, images)
                  }
                  onMouseLeave={() => handleMouseLeave(product.product_id)}
                >
                  <img
                    src={currentImg || '/placeholder.jpg'}
                    alt={product.name || 'Phone/Tablet'}
                    className="phones-tablets-image"
                  />
                  <h3 className="phones-tablets-name">{product.name}</h3>
                  <p className="phones-tablets-price">
                    {formatPrice(parseFloat(product.price))}
                  </p>
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
