import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './PowerBanksSlider.css'; 

const PowerBankDisplay = () => {
  const [powerBanks, setPowerBanks] = useState([]);
  const displayCount = 6; // Number of power banks to display at a time
  const fetchCount = 10; // Number of power banks to fetch from the API
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPowerBanks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products/?category_id=2');
        const data = await response.json();
        // Fetch 10 power banks
        setPowerBanks(data.slice(0, fetchCount));
      } catch (error) {
        console.error('Error fetching power banks:', error);
      }
    };

    fetchPowerBanks();

    // Set up an interval to rotate power banks
    const interval = setInterval(() => {
      setPowerBanks((prev) => {
        const firstItem = prev[0];
        const newItems = prev.slice(1).concat(firstItem); // Move the first item to the back
        return newItems;
      });
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  return (
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      <div className="powerbank-display">
        {powerBanks.length > 0 ? (
          <div className="powerbank-slider">
            {/* Display only the first 'displayCount' number of power banks */}
            {powerBanks.slice(0, displayCount).map((powerBank) => (
              <div 
                className="powerbank-item" 
                key={powerBank.product_id}  // Ensure unique key
                onClick={() => handleProductClick(powerBank.product_id)} 
              >
                <img src={powerBank.image_url} alt={powerBank.name} className="powerbank-image" />
                <h3 className="powerbank-name">{powerBank.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading power banks...</p>
        )}
      </div>
    </div>
  );
};

export default PowerBankDisplay;
