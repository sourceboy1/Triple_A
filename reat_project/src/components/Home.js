import React, { useState, useEffect, useRef } from 'react';
import slidingImage1 from '../pictures/sliding8.jpg';
import slidingImage2 from '../pictures/sliding6.jpg';
import slidingImage5 from '../pictures/sliding7.jpg';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import Loading from './Loading';
import CategoryDisplay from './CategoryDisplay';
import FeatureDisplay from './FeatureDisplay';
import DealsOfTheDay from './Deals_of_the_Day';
import PowerBankDisplay from './PowerBanksSlider';
import LaptopDisplay from './LaptopSlider';
import ViewedProducts from './ViewedProducts';
import PhonesTabletsDisplay from './PhonesTabletsDisplay';

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

  // We will wait for these 3 children to finish fetching:
  const totalChildrenToWait = 3; // PowerBank, Laptop, PhonesTablets
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const safetyTimerRef = useRef(null);
  const navigate = useNavigate();

  // slider auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 22000);
    return () => clearInterval(interval);
  }, []);

  // When loadedCount reaches totalChildrenToWait => ready
  useEffect(() => {
    if (loadedCount >= totalChildrenToWait) {
      // small delay so the user sees a stable UI
      const t = setTimeout(() => setIsReady(true), 150);
      return () => clearTimeout(t);
    }
  }, [loadedCount]);

  // Safety timeout: if something never calls onLoaded, we still proceed
  useEffect(() => {
    // 10 seconds safety window — adjust if you expect longer loads
    safetyTimerRef.current = setTimeout(() => {
      setIsReady(true);
    }, 10000);

    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  // callback to pass to children
  const handleChildLoaded = () => {
    setLoadedCount((c) => c + 1);
  };

  // if not ready, show full-screen Loading
  if (!isReady) {
    return <Loading />;
  }

  // === actual page render after all children have loaded ===
  return (
    <div className="home">
      <div className="slider">
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

      {/* Non-fetching children can render normally */}
      <FeatureDisplay />
      <DealsOfTheDay />
      <CategoryDisplay />

      {/* These 3 are fetching children: pass onLoaded to each */}
      <PowerBankDisplay onLoaded={handleChildLoaded} />
      <LaptopDisplay onLoaded={handleChildLoaded} />
      <PhonesTabletsDisplay onLoaded={handleChildLoaded} />

      <ViewedProducts />
    </div>
  );
};

export default Home;
