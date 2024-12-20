import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhonesTabletsDisplay.css'; // Assuming you have a separate CSS file

const PhonesTabletsDisplay = () => {
  const [products, setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track which product is being hovered
  const [loading, setLoading] = useState(true); // State for loading
  const displayCount = 6; // Number of products to display at a time
  const fetchCount = 30; // Number of products to fetch from the API
  const navigate = useNavigate();
  const sliderRef = useRef(null); // Reference to the slider div
  const [startX, setStartX] = useState(0); // Start position of touch
  const [currentTranslate, setCurrentTranslate] = useState(0); // Current translate value for sliding

  // Function to shuffle the array randomly
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchPhonesAndTablets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products/?category_id=4');
        const data = await response.json();
        // Fetch and shuffle phones and tablets
        const shuffledProducts = shuffleArray(data.slice(0, fetchCount));
        setProducts(shuffledProducts);
        setLoading(false); // Set loading to false after fetching products
      } catch (error) {
        console.error('Error fetching phones and tablets:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchPhonesAndTablets();

    // Set up an interval to rotate products
    const interval = setInterval(() => {
      setProducts((prev) => {
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
    if (isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Touch event handlers
  const handleTouchStart = (event) => {
    setStartX(event.touches[0].clientX);
    setCurrentTranslate(0); // Reset current translate on touch start
  };

  const handleTouchMove = (event) => {
    const currentX = event.touches[0].clientX;
    const diffX = currentX - startX;
    setCurrentTranslate(diffX); // Update translate based on touch movement
  };

  const handleTouchEnd = () => {
    if (currentTranslate > 50) {
      // Swipe right
      setProducts((prev) => {
        const firstItem = prev[0];
        return [...prev.slice(1), firstItem]; // Move the first item to the back
      });
    } else if (currentTranslate < -50) {
      // Swipe left
      setProducts((prev) => {
        const lastItem = prev[prev.length - 1];
        return [lastItem, ...prev.slice(0, -1)]; // Move the last item to the front
      });
    }
    setCurrentTranslate(0); // Reset current translate
  };

  return (
    <div className="phones-tablets-container">
      <h2>Featured Phones & Tablets</h2>
      <div className="phones-tablets-display">
        {loading ? (
          <p>Loading phones and tablets...</p>
        ) : (
          <div
            className="phones-tablets-slider"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${currentTranslate}px)`, transition: 'transform 0.3s ease-in-out' }} // Apply translation for sliding effect
          >
            {products.slice(0, displayCount).map((product, index) => (
              <div
                className="phones-tablets-item"
                key={product.product_id}
                onClick={() => handleProductClick(product.product_id)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={
                    hoveredIndex === index && product.secondary_image_url
                      ? product.secondary_image_url
                      : product.image_url
                  }
                  alt={product.name}
                  className="phones-tablets-image"
                />
                <h3 className="phones-tablets-name">{product.name}</h3>
                <p className="phones-tablets-price">
                  {formatPrice(parseFloat(product.price))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhonesTabletsDisplay;
