import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import './PhonesTabletsDisplay.css';

const PhonesTabletsDisplay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const hoverIntervals = useRef({});
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

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (index) => {
    const product = products[index];
    const images = [
      product.image_urls?.medium,
      product.secondary_image_urls?.medium,
      product.tertiary_image_urls?.medium,
      product.quaternary_image_urls?.medium,
    ].filter(Boolean);

    if (images.length < 2) return;

    let currentImgIndex = 0;
    hoverIntervals.current[index] = setInterval(() => {
      const imgElement = document.querySelectorAll('.phones-tablets-item img')[index];
      if (imgElement) {
        imgElement.src = images[currentImgIndex];
        currentImgIndex = (currentImgIndex + 1) % images.length;
      }
    }, 1000);
  };

  const handleMouseLeave = (index) => {
    clearInterval(hoverIntervals.current[index]);
    hoverIntervals.current[index] = null;

    const product = products[index];
    const primaryImg = product.image_urls?.medium || '/placeholder.jpg';
    const imgElement = document.querySelectorAll('.phones-tablets-item img')[index];
    if (imgElement) imgElement.src = primaryImg;
  };

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
      setProducts((prev) => {
        const firstItem = prev[0];
        return [...prev.slice(1), firstItem];
      });
    } else if (currentTranslate < -50) {
      setProducts((prev) => {
        const lastItem = prev[prev.length - 1];
        return [lastItem, ...prev.slice(0, -1)];
      });
    }
    setCurrentTranslate(0);
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
          <div
            className="phones-tablets-slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${currentTranslate}px)`, transition: 'transform 0.3s ease-in-out' }}
          >
            {products.slice(0, displayCount).map((product, index) => {
              if (!product || !product.image_urls?.medium) return null;

              return (
                <div
                  className="phones-tablets-item"
                  key={product.product_id}
                  onClick={() => handleProductClick(product.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={product.image_urls?.medium || '/placeholder.jpg'}
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
