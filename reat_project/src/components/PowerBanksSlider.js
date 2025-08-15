import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PowerBanksSlider.css';

const BACKEND_URL = 'http://localhost:8000';

const PowerBankDisplay = () => {
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchPowerBanks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/?category_id=1`);
        const data = await response.json();
        setPowerBanks(shuffleArray(data.slice(0, fetchCount)));
      } catch (error) {
        console.error('Error fetching power banks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerBanks();

    const interval = setInterval(() => {
      setPowerBanks(prev => prev.length ? [...prev.slice(1), prev[0]] : prev);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product_id) => navigate(`/product-details/${product_id}`);
  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const formatPrice = (price) => isNaN(price) ? 'N/A' : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

  return (
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      <div className="powerbank-display">
        {loading ? (
          <p>Loading power banks...</p>
        ) : (
          <div className="powerbank-slider">
            {powerBanks.slice(0, displayCount).map((pb, index) => {
              if (!pb) return null;
              const primaryImg = pb.image_url ? `${BACKEND_URL}${pb.image_url}` : '/placeholder.jpg';
              const secondaryImg = pb.secondary_image_url ? `${BACKEND_URL}${pb.secondary_image_url}` : primaryImg;

              return (
                <div
                  className="powerbank-item"
                  key={pb.product_id || index}
                  onClick={() => handleProductClick(pb.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={hoveredIndex === index ? secondaryImg : primaryImg} alt={pb.name || 'Power Bank'} className="powerbank-image" />
                  <h3 className="powerbank-name">{pb.name}</h3>
                  <p className="powerbank-price">{formatPrice(parseFloat(pb.price))}</p>
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
