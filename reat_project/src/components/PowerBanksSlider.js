import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import { getProductDetailsPath } from '../helpers/navigation';
import './PowerBanksSlider.css';

const PowerBankDisplay = ({ onLoaded }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const hoverIntervals = useRef({});
  const rotateInterval = useRef(null);

  // Replace this with the correct slug from your database
  const CATEGORY_SLUG = 'power-banks';

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPowerBanks = async () => {
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
        console.error('Error fetching power banks:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          if (typeof onLoaded === 'function') onLoaded();
        }
      }
    };

    fetchPowerBanks();

    // Auto rotate every 12s
    rotateInterval.current = setInterval(() => {
      setProducts((prev) => {
        if (prev.length === 0) return prev;
        return [...prev.slice(1), prev[0]];
      });
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(rotateInterval.current);
      Object.values(hoverIntervals.current).forEach(clearInterval);
    };
  }, [onLoaded]);

  const handleProductClick = (product) => {
    navigate(getProductDetailsPath(product));
  };

  const handleMouseEnter = (id, images) => {
    if (!images || images.length < 2) return;

    let currentIndex = 0;

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
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      <div className="powerbank-display">
        {products.length === 0 ? (
          <p>No power banks available at the moment.</p>
        ) : (
          <div
            className="powerbank-slider"
            style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {products.slice(0, displayCount).map((pb) => {
              if (!pb) return null;

              const images = [
                pb.image_urls?.medium,
                pb.secondary_image_urls?.medium,
                pb.tertiary_image_urls?.medium,
                pb.quaternary_image_urls?.medium,
              ].filter(Boolean);

              const currentImg =
                images[hoverImageIndexes[pb.product_id] || 0] ||
                images[0] ||
                '/placeholder.jpg';

              return (
                <div
                  className="powerbank-item"
                  key={pb.product_id}
                  onClick={() => handleProductClick(pb)}
                  onMouseEnter={() => handleMouseEnter(pb.product_id, images)}
                  onMouseLeave={() => handleMouseLeave(pb.product_id)}
                >
                  <img
                    src={currentImg}
                    alt={pb.name || 'Power Bank'}
                    className="powerbank-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    loading="lazy"
                  />

                  <h3 className="powerbank-name">{pb.name}</h3>

                  <p className="powerbank-price">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    }).format(parseFloat(pb.price) || 0)}
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

export default PowerBankDisplay;
