import React, { useState, useEffect, useContext } from 'react';
import slidingImage1 from '../pictures/sliding1.jpg';
import slidingImage2 from '../pictures/sliding3.jpg';
import slidingImage5 from '../pictures/sliding4.jpg';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import CategoryDisplay from './CategoryDisplay';
import FeatureDisplay from './FeatureDisplay';
import DealsOfTheDay from './Deals_of_the_Day';
import PowerBankDisplay from './PowerBanksSlider';
import LaptopDisplay from './LaptopSlider';
import ViewedProducts from './ViewedProducts';
import PhonesTabletsDisplay from './PhonesTabletsDisplay';
import api from '../Api'; // ✅ Unified API import

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
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);
  const { cart, addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  const handleAddToCart = (product) => {
    const isProductInCart = cart.some(item => item.product_id === product.product_id);
    if (!isProductInCart) addItemToCart(product);
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
      <FeatureDisplay />

      {/* Deals of the Day Component */}
      <DealsOfTheDay />

      {/* Category Display Component */}
      <CategoryDisplay />

      {/* Power Bank Display Component */}
      <PowerBankDisplay />
       
      {/* Laptop Display Component */}
      <LaptopDisplay />
      
      {/* Phones/Tablets Display Component */}  
      <PhonesTabletsDisplay />

      {/* Viewed Products Display Component */}
      <ViewedProducts />

      {/* Product list is commented out for now */}
    </div>
  );
};

export default Home;
