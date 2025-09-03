import React, { useState, useEffect, useContext, useRef } from 'react'; 
import slidingImage1 from '../pictures/sliding8.jpg';
import slidingImage2 from '../pictures/sliding6.jpg';
import slidingImage5 from '../pictures/sliding7.jpg';
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

import Loading from './Loading'; // ✅ your loading component

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
  const [loading, setLoading] = useState(true); // ✅ global loading
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);
  const { cart, addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ✅ Simulate waiting for ALL child components (mock: 2s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 22000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setCurrentIndex(prev => (prev + 1) % images.length);
    } else if (touchStartX.current - touchEndX.current < -50) {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  // ✅ show loading first
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home">
      <div 
        className="slider" 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className={`slide-container ${index === currentIndex ? 'active' : ''}`}>
            <img src={image} alt={`Slide ${index + 1}`} className={`slide-image ${index === currentIndex ? 'active' : ''}`} />
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

      {/* ✅ children render only AFTER loading finishes */}
      <FeatureDisplay />
      <DealsOfTheDay />
      <CategoryDisplay />
      <PowerBankDisplay />
      <LaptopDisplay />
      <PhonesTabletsDisplay />
      <ViewedProducts />
    </div>
  );
};

export default Home;
