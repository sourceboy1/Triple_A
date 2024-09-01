import React, { useState, useEffect, useContext } from 'react';
import slidingImage1 from '../pictures/sliding1.jpg';
import slidingImage2 from '../pictures/sliding2.jpg';
import slidingImage5 from '../pictures/sliding5.jpg';
import wishlistIcon from '../pictures/wishlist.jpg'; // Import your wishlist image
import wishlistIconActive from '../pictures/wishlist-active.jpg'; // Import your wishlist active image
import axios from 'axios';
import './Styling.css';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const images = [slidingImage1, slidingImage2, slidingImage5];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]); // State to keep track of wishlist items
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  useEffect(() => {
    const sliderImages = document.querySelectorAll('.slide-image');
    sliderImages.forEach((img, index) => {
      img.classList.toggle('active', index === currentIndex);
    });
  }, [currentIndex]);

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product); // Log product details
    addItemToCart(product);
  };

  const handleWishlistClick = (product) => {
    if (isInWishlist(product.product_id)) {
      removeFromWishlist(product.product_id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="home">
      <div className="slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`slide-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
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
                ₦{product.price ? new Intl.NumberFormat().format(product.price) : 'N/A'}
              </p>
            </div>
            <img
              src={isInWishlist(product.product_id) ? wishlistIconActive : wishlistIcon}
              alt="Add to Wishlist"
              className="wishlist-icon"
              onClick={() => handleWishlistClick(product)}
            />
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
