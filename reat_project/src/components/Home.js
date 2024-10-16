import React, { useState, useEffect, useContext } from 'react';
import slidingImage1 from '../pictures/sliding1.jpg';
import slidingImage2 from '../pictures/sliding2.jpg';
import slidingImage5 from '../pictures/sliding5.jpg';
import wishlistIcon from '../pictures/wishlist.jpg';
import wishlistIconActive from '../pictures/wishlist-active.jpg';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CategoryDisplay from './CategoryDisplay'; // Import CategoryDisplay
import FeatureDisplay from './FeatureDisplay'; // Import the FeatureDisplay component
import DealsOfTheDay from './Deals_of_the_Day'; // Import DealsOfTheDay component
import PowerBankDisplay from './PowerBanksSlider'; // Import PowerBankDisplay component

// Images, captions, and button text
const images = [slidingImage1, slidingImage2, slidingImage5];
const captions = [
  "Discover the latest smartphones!",
  "Exclusive deals on gadgets!",
  "Upgrade your tech today!"
];
const buttonTexts = [
  "Shop Smartphones",
  "Grab the Deals",
  "Upgrade Now"
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]); // Still fetch products but don't display them
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);
  const { cart, addItemToCart } = useCart();
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
    }, 20000); // Change interval to 20 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  const handleAddToCart = (product) => {
    const isProductInCart = cart.some(item => item.product_id === product.product_id);
    if (!isProductInCart) {
      addItemToCart(product);
    }
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
          <div key={index} className={`slide-container ${index === currentIndex ? 'active' : ''}`}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className={`slide-image ${index === currentIndex ? 'active' : ''}`}
            />
            {index === currentIndex && (
              <div className="slider-caption fade-in">
                <h2 className="slider-text">{captions[index]}</h2>
                <button className="shop-button">{buttonTexts[index]}</button>
              </div>
            )}
          </div>
        ))}
        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Feature Display Component */}
      <FeatureDisplay /> {/* Added FeatureDisplay above CategoryDisplay */}

      {/* Deals of the Day Component */}
      <DealsOfTheDay /> {/* Added DealsOfTheDay below the slider */}

      {/* Category Display Component */}
      <CategoryDisplay /> {/* Add the CategoryDisplay component here */}

      {/* Power Bank Display Component */}
      <PowerBankDisplay /> {/* Added PowerBankDisplay below CategoryDisplay */}
       
      {/* Commented out the product list */}
      {/* <div className="product-list">
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
      </div> */}
    </div>
  );
};

export default Home;
