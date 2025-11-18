// src/components/LaptopDisplay.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { getProductDetailsPath } from '../helpers/navigation';
import './LaptopSlider.css';

const LaptopDisplay = ({ onLoaded }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const hoverIntervals = useRef({});
  const rotateInterval = useRef(null);

  // Use slug for Laptops & Computers (ensure this matches DB)
  const CATEGORY_SLUG = 'laptops-and-computers';

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchLaptops = async () => {
      try {
        const encoded = encodeURIComponent(CATEGORY_SLUG);
        const response = await Api.get(`products/?category=${encoded}`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          if (isMounted) setProducts([]);
          return;
        }

        if (isMounted) {
          const shuffled = shuffleArray(data.slice(0, fetchCount));
          setProducts(shuffled);
        }
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          if (typeof onLoaded === 'function') onLoaded();
        }
      }
    };

    fetchLaptops();

    // auto-rotate items every 12s
    rotateInterval.current = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev;
        const first = prev[0];
        return [...prev.slice(1), first];
      });
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(rotateInterval.current);
      Object.values(hoverIntervals.current).forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoaded]); // keep onLoaded as dep only

  const handleProductClick = (product) => {
    // Use helper (prefers slug)
    navigate(getProductDetailsPath(product));
  };

  const handleMouseEnter = (id, images) => {
    if (!images || images.length < 2) return;

    let currentIndex = 0;

    // clear existing
    if (hoverIntervals.current[id]) {
      clearInterval(hoverIntervals.current[id]);
    }

    hoverIntervals.current[id] = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setHoverImageIndexes((prev) => ({
        ...prev,
        [id]: currentIndex,
      }));
    }, 1000);
  };

  const handleMouseLeave = (id) => {
    if (hoverIntervals.current[id]) {
      clearInterval(hoverIntervals.current[id]);
      hoverIntervals.current[id] = null;
    }

    setHoverImageIndexes((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  if (loading) return null;

  return (
    <div className="laptop-container">
      <h2>Featured Laptops</h2>
      <div className="laptop-display">
        {products.length === 0 ? (
          <p>No laptops available at the moment.</p>
        ) : (
          <div
            className="laptop-slider"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {products.slice(0, displayCount).map((laptop) => {
              if (!laptop) return null;

              const images = [
                laptop.image_urls?.medium,
                laptop.secondary_image_urls?.medium,
                laptop.tertiary_image_urls?.medium,
                laptop.quaternary_image_urls?.medium,
              ].filter(Boolean);

              const currentImg =
                images[hoverImageIndexes[laptop.product_id] || 0] || images[0] || '/placeholder.jpg';

              return (
                <div
                  className="laptop-item"
                  key={laptop.product_id}
                  onClick={() => handleProductClick(laptop)}
                  onMouseEnter={() => handleMouseEnter(laptop.product_id, images)}
                  onMouseLeave={() => handleMouseLeave(laptop.product_id)}
                >
                  <img
                    src={currentImg || '/placeholder.jpg'}
                    alt={laptop.name || 'Laptop'}
                    className="laptop-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    loading="lazy"
                  />
                  <h3 className="laptop-name">{laptop.name}</h3>
                  <p className="laptop-price">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    }).format(parseFloat(laptop.price) || 0)}
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

export default LaptopDisplay;
