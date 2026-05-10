// src/components/PhonesTabletsDisplay.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { getProductDetailsPath } from '../helpers/navigation';
import './PhonesTabletsDisplay.css';

const PhonesTabletsDisplay = ({ onLoaded }) => {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
  const displayCount   = 6;
  const fetchCount     = 30;
  const navigate       = useNavigate();
  const hoverIntervals = useRef({});
  const CATEGORY_ID    = 2;

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
        const response = await Api.get(`products/?category_id=${CATEGORY_ID}`);
        const data     = Array.isArray(response.data) ? response.data : [];
        if (isMounted) {
          const filtered = data.filter((p) => {
            const id = p.category_id ?? p.category?.category_id ?? p.category?.id ?? null;
            return id === CATEGORY_ID;
          });
          setProducts(shuffleArray(filtered.slice(0, fetchCount)));
        }
      } catch {
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
          if (typeof onLoaded === 'function') onLoaded();
        }
      }
    };

    fetchPhonesAndTablets();

    const interval = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev;
        return [...prev.slice(1), prev[0]];
      });
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      Object.values(hoverIntervals.current).forEach(clearInterval);
    };
  }, [onLoaded]);

  const handleProductClick = (product) => navigate(getProductDetailsPath(product));

  const handleMouseEnter = (id, images) => {
    if (!images || images.length < 2) return;
    let idx = 0;
    if (hoverIntervals.current[id]) clearInterval(hoverIntervals.current[id]);
    hoverIntervals.current[id] = setInterval(() => {
      idx = (idx + 1) % images.length;
      setHoverImageIndexes((prev) => ({ ...prev, [id]: idx }));
    }, 1000);
  };

  const handleMouseLeave = (id) => {
    if (hoverIntervals.current[id]) {
      clearInterval(hoverIntervals.current[id]);
      hoverIntervals.current[id] = null;
    }
    setHoverImageIndexes((prev) => ({ ...prev, [id]: 0 }));
  };

  if (loading) return null;

  return (
    <div className="phones-tablets-container">
      <h2>Featured Phones & Tablets</h2>
      <div className="phones-tablets-display">
        {products.length === 0 ? (
          <p>No phones or tablets available at the moment.</p>
        ) : (
          /* ✅ NO inline style — CSS handles all scroll behaviour */
          <div className="phones-tablets-slider">
            {products.slice(0, displayCount).map((product) => {
              if (!product) return null;
              const images = [
                product.image_urls?.medium,
                product.secondary_image_urls?.medium,
                product.tertiary_image_urls?.medium,
                product.quaternary_image_urls?.medium,
              ].filter(Boolean);
              const currentImg = images[hoverImageIndexes[product.product_id] || 0] || images[0] || '/placeholder.jpg';

              return (
                <div
                  key={product.product_id}
                  className="phones-tablets-item"
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
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(parseFloat(product.price) || 0)}
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