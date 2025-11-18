import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { getProductDetailsPath } from '../helpers/navigation';
import './PhonesTabletsDisplay.css';

const PhonesTabletsDisplay = ({ onLoaded }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayCount = 6;
  const fetchCount = 30;

  const navigate = useNavigate();
  const hoverIntervals = useRef({});
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});

  // Use slug for Phones & Tablets category
  const CATEGORY_SLUG = 'phones-and-tablets'; // <-- important: use the normalized slug from your DB

  // Random shuffle
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPhonesAndTablets = async () => {
      try {
        // Request by slug (backend filters category__slug)
        const encodedSlug = encodeURIComponent(CATEGORY_SLUG);
        const response = await Api.get(`products/?category=${encodedSlug}`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          if (isMounted) setProducts([]);
          return;
        }

        if (isMounted) {
          const shuffledProducts = shuffleArray(data.slice(0, fetchCount));
          setProducts(shuffledProducts);
        }
      } catch (error) {
        console.error('Error fetching phones & tablets:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          if (typeof onLoaded === 'function') onLoaded();
        }
      }
    };

    fetchPhonesAndTablets();

    // Auto slider every 12 seconds (rotates the product array)
    const interval = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev;
        const firstItem = prev[0];
        return [...prev.slice(1), firstItem];
      });
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      Object.values(hoverIntervals.current).forEach(clearInterval);
    };
  }, [onLoaded]);

  const handleProductClick = (product) => {
    // navigate using the helper (will prefer slug when available)
    navigate(getProductDetailsPath(product));
  };

  const handleMouseEnter = (productId, images) => {
    if (!images || images.length < 2) return;

    let currentImgIndex = 0;

    // Clear existing interval (if any) first
    if (hoverIntervals.current[productId]) {
      clearInterval(hoverIntervals.current[productId]);
    }

    hoverIntervals.current[productId] = setInterval(() => {
      currentImgIndex = (currentImgIndex + 1) % images.length;
      setHoverImageIndexes((prev) => ({
        ...prev,
        [productId]: currentImgIndex,
      }));
    }, 1000);
  };

  const handleMouseLeave = (productId) => {
    if (hoverIntervals.current[productId]) {
      clearInterval(hoverIntervals.current[productId]);
      hoverIntervals.current[productId] = null;
    }

    setHoverImageIndexes((prev) => ({
      ...prev,
      [productId]: 0,
    }));
  };

  if (loading) return null;

  return (
    <div className="phones-tablets-container">
      <h2>Featured Phones & Tablets</h2>

      <div className="phones-tablets-display">
        {products.length === 0 ? (
          <p>No phones or tablets available at the moment.</p>
        ) : (
          <div
            className="phones-tablets-slider"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {products.slice(0, displayCount).map((product) => {
              if (!product) return null;

              const images = [
                product.image_urls?.medium,
                product.secondary_image_urls?.medium,
                product.tertiary_image_urls?.medium,
                product.quaternary_image_urls?.medium,
              ].filter(Boolean);

              const currentImg =
                images[hoverImageIndexes[product.product_id] || 0] || images[0] || '/placeholder.jpg';

              return (
                <div
                  className="phones-tablets-item"
                  key={product.product_id}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => handleMouseEnter(product.product_id, images)}
                  onMouseLeave={() => handleMouseLeave(product.product_id)}
                >
                  <img
                    src={currentImg}
                    alt={product.name || 'Phone/Tablet'}
                    className="phones-tablets-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    loading="lazy"
                  />

                  <h3 className="phones-tablets-name">{product.name}</h3>

                  <p className="phones-tablets-price">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 2,
                    }).format(parseFloat(product.price) || 0)}
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
