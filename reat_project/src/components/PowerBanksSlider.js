import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PowerBanksSlider.css';


const PowerBankDisplay = () => {
  const [powerBanks, setPowerBanks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which product is being hovered
  const displayCount = 6; // Number of power banks to display at a time
  const fetchCount = 30; // Number of power banks to fetch from the API
  const navigate = useNavigate(); 

  // Function to shuffle the array randomly
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
        const response = await fetch('http://localhost:8000/api/products/?category_id=2');
        const data = await response.json();
        // Fetch and shuffle power banks
        const shuffledPowerBanks = shuffleArray(data.slice(0, fetchCount));
        setPowerBanks(shuffledPowerBanks);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching power banks:', error);
        setLoading(false); // Set loading to false in case of error
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
    }, 12000); // Change every 12 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  // Handle mouse enter event to set hovered index
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  // Handle mouse leave event to unset hovered index
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Function to format price using Intl.NumberFormat
  const formatPrice = (price) => { 
    if (isNaN(price)) return 'N/A'; // Return 'N/A' if the price is not a valid number
    return new Intl.NumberFormat('en-NG', { // Use 'en-NG' for Nigerian English
      style: 'currency',
      currency: 'NGN', // Specify currency as Naira
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price); // Format the price
};

  return (
    <div className="powerbank-container">
      <h2>Featured Power Banks</h2>
      <div className="powerbank-display">
        {  (
          <div className="powerbank-slider">
            {/* Display only the first 'displayCount' number of power banks */}
            {powerBanks.slice(0, displayCount).map((powerBank, index) => (
              <div 
                className="powerbank-item" 
                key={powerBank.product_id}  // Ensure unique key
                onClick={() => handleProductClick(powerBank.product_id)} 
                onMouseEnter={() => handleMouseEnter(index)}  // Show secondary image on hover
                onMouseLeave={handleMouseLeave}  // Revert to primary image on mouse leave
              >
                <img 
                  src={hoveredIndex === index && powerBank.secondary_image_url ? powerBank.secondary_image_url : powerBank.image_url} 
                  alt={powerBank.name} 
                  className="powerbank-image" 
                />
                <h3 className="powerbank-name">{powerBank.name}</h3>
                <p className="powerbank-price">
                  {formatPrice(parseFloat(powerBank.price))} {/* Format the price */}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerBankDisplay;
