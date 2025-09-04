import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
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
        const response = await api.get(`products/?category_id=7`);
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
  }, [onLoaded]);

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleMouseEnter = (id, images) => {
    if (images.length < 2) return;

    let currentIndex = 0;
    hoverIntervals.current[id] = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setHoverImageIndexes((prev) => ({
        ...prev,
        [id]: currentIndex,
      }));
    }, 1000);
  };

  const handleMouseLeave = (id) => {
    clearInterval(hoverIntervals.current[id]);
    hoverIntervals.current[id] = null;

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
              if (!pb || !pb.image_urls?.medium) return null;

              const images = [
                pb.image_urls?.medium,
                pb.secondary_image_urls?.medium,
                pb.tertiary_image_urls?.medium,
                pb.quaternary_image_urls?.medium,
              ].filter(Boolean);

              const currentImg =
                images[hoverImageIndexes[pb.product_id] || 0] || images[0];

              return (
                <div
                  className="powerbank-item"
                  key={pb.product_id}
                  onClick={() => handleProductClick(pb.product_id)}
                  onMouseEnter={() => handleMouseEnter(pb.product_id, images)}
                  onMouseLeave={() => handleMouseLeave(pb.product_id)}
                >
                  <img
                    src={currentImg || '/placeholder.jpg'}
                    alt={pb.name || 'Power Bank'}
                    className="powerbank-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
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
