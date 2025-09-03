import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import './PowerBanksSlider.css';

const PowerBankDisplay = () => {
  const [powerBanks, setPowerBanks] = useState([]);
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
    const fetchPowerBanks = async () => {
      try {
        const response = await api.get(`products/?category_id=7`);
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          setLoading(false);
          return;
        }

        const shuffledPowerBanks = shuffleArray(data.slice(0, fetchCount));
        setPowerBanks(shuffledPowerBanks);
      } catch (error) {
        console.error('Error fetching power banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerBanks();

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
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      {loading ? (
        <p>Loading power banks...</p>
      ) : powerBanks.length === 0 ? (
        <p>No power banks available at the moment.</p>
      ) : (
        <div className="powerbank-slider">
          {powerBanks.map((powerBank, index) => {
            if (!powerBank) return null;

            // Collect available images
            const images = [
              powerBank.image_urls?.medium,
              powerBank.secondary_image_urls?.medium,
              powerBank.tertiary_image_urls?.medium,
              powerBank.quaternary_image_urls?.medium,
            ].filter(Boolean);

            const currentImg =
              images[hoverImageIndexes[powerBank.product_id] || 0] ||
              '/placeholder.jpg';

            return (
              <div
                className="powerbank-item"
                key={powerBank.product_id || index}
                onClick={() => handleProductClick(powerBank.product_id)}
                onMouseEnter={() =>
                  handleMouseEnter(powerBank.product_id, images)
                }
                onMouseLeave={() => handleMouseLeave(powerBank.product_id)}
              >
                <img
                  src={currentImg}
                  alt={powerBank.name || 'Power Bank'}
                  className="powerbank-image"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <h3 className="powerbank-name">{powerBank.name}</h3>
                <p className="powerbank-price">
                  {formatPrice(parseFloat(powerBank.price))}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PowerBankDisplay;
