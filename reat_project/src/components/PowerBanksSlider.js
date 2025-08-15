import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api'; // ✅ Use centralized API
import './PowerBanksSlider.css';

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
        const response = await api.get('/products/', { params: { category_id: 1 } });
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

    const interval = setInterval(() => {
      setPowerBanks((prev) => {
        if (prev.length === 0) return prev;
        const firstItem = prev[0];
        return prev.slice(1).concat(firstItem);
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

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
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      <div className="powerbank-display">
        {loading ? (
          <p>Loading power banks...</p>
        ) : powerBanks.length === 0 ? (
          <p>No power banks available at the moment.</p>
        ) : (
          <div className="powerbank-slider">
            {powerBanks.slice(0, displayCount).map((powerBank, index) => {
              if (!powerBank || !powerBank.image_url) return null;

              return (
                <div 
                  className="powerbank-item" 
                  key={powerBank.product_id}
                  onClick={() => handleProductClick(powerBank.product_id)} 
                  onMouseEnter={() => handleMouseEnter(index)}  
                  onMouseLeave={handleMouseLeave}
                >
                  <img 
                    src={
                      hoveredIndex === index && powerBank.secondary_image_url 
                        ? powerBank.secondary_image_url 
                        : powerBank.image_url
                    }
                    alt={powerBank.name || "Power Bank"} 
                    className="powerbank-image" 
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
    </div>
  );
};

export default PowerBankDisplay;
