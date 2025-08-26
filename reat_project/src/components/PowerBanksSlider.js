import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import './PowerBanksSlider.css';

const PowerBankDisplay = () => {
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayCount = 6;
  const fetchCount = 30;
  const navigate = useNavigate();
  const hoverIntervals = useRef({}); // store hover timers

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
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const handleMouseEnter = (index) => {
    const powerBank = powerBanks[index];
    const images = [
      powerBank.image_urls?.medium,
      powerBank.secondary_image_urls?.medium,
      powerBank.tertiary_image_urls?.medium,
      powerBank.quaternary_image_urls?.medium,
    ].filter(Boolean);

    if (images.length < 2) return; // no need to cycle if only one image

    let currentImgIndex = 0;
    hoverIntervals.current[index] = setInterval(() => {
      const imgElement = document.querySelectorAll('.powerbank-item img')[index];
      if (imgElement) {
        imgElement.src = images[currentImgIndex];
        currentImgIndex = (currentImgIndex + 1) % images.length;
      }
    }, 1000); // change image every second
  };

  const handleMouseLeave = (index) => {
    clearInterval(hoverIntervals.current[index]);
    hoverIntervals.current[index] = null;

    const powerBank = powerBanks[index];
    const primaryImg = powerBank.image_urls?.medium || '/placeholder.jpg';
    const imgElement = document.querySelectorAll('.powerbank-item img')[index];
    if (imgElement) imgElement.src = primaryImg;
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
              const primaryImg = powerBank.image_urls?.medium || '/placeholder.jpg';

              return (
                <div
                  className="powerbank-item"
                  key={powerBank.product_id}
                  onClick={() => handleProductClick(powerBank.product_id)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <img
                    src={primaryImg}
                    alt={powerBank.name || "Power Bank"}
                    className="powerbank-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
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
