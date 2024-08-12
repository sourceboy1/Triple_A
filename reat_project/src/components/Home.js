import React, { useState, useEffect, useContext } from 'react';
import slidingImage1 from '../pictures/sliding1.jpg';
import slidingImage2 from '../pictures/sliding2.jpg';
import axios from 'axios';
import './Styling.css';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext'; // Import TokenContext
import { useCart } from '../contexts/CartContext'; // Import useCart hook

const images = [slidingImage1, slidingImage2];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext); // Get the token from context
  const { addItemToCart } = useCart(); // Destructure addItemToCart from useCart

  useEffect(() => {
    // Fetch product data from the backend
    axios.get('http://localhost:8000/api/products/', {
      headers: {
        Authorization: `Bearer ${accessToken}` // Use the token from context
      }
    })
      .then(response => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [accessToken]); // Add accessToken as dependency

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product); // Log product details
    addItemToCart(product);
  };
  ;

  return (
    <div className="home">
      <div className="slider">
        <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide-image" />
        <div className="slider-caption">
          <h2 className="slider-text">All New Phones<br />up to 25% Flat Sale</h2>
          <button className="shop-button">Shop Now</button>
        </div>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.product_id} className="product-card">
            <div onClick={() => handleProductClick(product.product_id)}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <p>No image available</p>
              )}
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                #{parseFloat(product.price).toFixed(2)}
              </p>
            </div>
            <button
              className="button is-primary"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


















