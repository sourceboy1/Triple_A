import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LaptopSlider.css'; // Assuming you create a separate CSS file for laptops

const LaptopDisplay = () => {
  const [laptops, setLaptops] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which product is being hovered
  const [loading, setLoading] = useState(true); // State for loading
  const displayCount = 6; // Number of laptops to display at a time
  const fetchCount = 30; // Number of laptops to fetch from the API
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  let intervalRef = useRef(null); // Reference for interval

  // Function to shuffle laptops array randomly
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const formatPrice = (price) => {
    if (isNaN(price)) return 'N/A'; // Return 'N/A' if the price is not a valid number
    return new Intl.NumberFormat('en-NG', { // Use 'en-NG' for Nigerian English
      style: 'currency',
      currency: 'NGN', // Specify currency as Naira
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price); // Format the price
  };

  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products/?category_id=5');
        const data = await response.json();
        // Fetch and shuffle laptops
        const shuffledLaptops = shuffleArray(data.slice(0, fetchCount));
        setLaptops(shuffledLaptops);
        setLoading(false); // Set loading to false after fetching the laptops
      } catch (error) {
        console.error('Error fetching laptops:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchLaptops();

    // Set up an interval to rotate laptops
    intervalRef.current = setInterval(() => {
      setLaptops((prev) => {
        const firstItem = prev[0];
        const newItems = prev.slice(1).concat(firstItem); // Move the first item to the back
        return newItems;
      });
    }, 12000); // Change every 12 seconds

    return () => {
      clearInterval(intervalRef.current); // Cleanup interval on unmount
    };
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

  // Function to handle touch start
  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;

    const handleTouchMove = (e) => {
      const touchEndX = e.touches[0].clientX;
      const diff = touchStartX - touchEndX;

      // Swipe left to slide
      if (diff > 30) {
        setLaptops((prev) => {
          const firstItem = prev[0];
          const newItems = prev.slice(1).concat(firstItem);
          return newItems;
        });
        clearInterval(intervalRef.current); // Clear interval on user interaction
      }

      // Swipe right to slide back (optional)
      if (diff < -30) {
        setLaptops((prev) => {
          const lastItem = prev[prev.length - 1];
          const newItems = [lastItem].concat(prev.slice(0, prev.length - 1));
          return newItems;
        });
        clearInterval(intervalRef.current); // Clear interval on user interaction
      }

      sliderRef.current.removeEventListener('touchmove', handleTouchMove); // Cleanup
    };

    sliderRef.current.addEventListener('touchmove', handleTouchMove);
  };

  return (
    <div className="laptop-container">
      <h2>Featured Laptops</h2>
      <div className="laptop-display" ref={sliderRef} onTouchStart={handleTouchStart}>
        {loading ? ( // Show loading message or spinner while loading
          <p>Loading laptops...</p>
        ) : (
          <div className="laptop-slider">
            {/* Display only the first 'displayCount' number of laptops */}
            {laptops.slice(0, displayCount).map((laptop, index) => (
              <div
                className="laptop-item"
                key={laptop.product_id}  // Ensure unique key
                onClick={() => handleProductClick(laptop.product_id)}
                onMouseEnter={() => handleMouseEnter(index)}  // Show secondary image on hover
                onMouseLeave={handleMouseLeave}  // Revert to primary image on mouse leave
              >
                <img
                  src={hoveredIndex === index && laptop.secondary_image_url ? laptop.secondary_image_url : laptop.image_url}
                  alt={laptop.name}
                  className="laptop-image"
                />
                <h3 className="laptop-name">{laptop.name}</h3>
                <p className="laptop-price">{formatPrice(laptop.price)}</p> {/* Add formatted price here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopDisplay;
