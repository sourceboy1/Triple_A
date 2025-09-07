// components/Home.jsx
import React, { useState, useEffect } from 'react';
import homeVideo from '../pictures/home.mp4';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import CategoryDisplay from './CategoryDisplay';
import FeatureDisplay from './FeatureDisplay';
import DealsOfTheDay from './Deals_of_the_Day';
import PowerBankDisplay from './PowerBanksSlider';
import LaptopDisplay from './LaptopSlider';
import ViewedProducts from './ViewedProducts';
import PhonesTabletsDisplay from './PhonesTabletsDisplay';

import Loading from './Loading';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleShopNowClick = () => {
    navigate('/product-catalog');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home">
      <div className="hero-video-container">
        <video
          className="hero-video"
          loop
          muted
          playsInline
          preload="auto"
          onCanPlay={(e) => {
            const video = e.currentTarget;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => console.log("Autoplay prevented:", error));
            }
          }}
        >
          <source src={homeVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content-overlay">
          <h1 className="hero-title">Discover cutting-edge technology.</h1>
          <p className="hero-subtitle">Experience innovation with every product.</p>
          <button className="shop-button" onClick={handleShopNowClick}>
            Shop Now
          </button>
        </div>
      </div>

      {/* Children render after loading finishes */}
      {/* FeatureDisplay is the one we want to add space above */}
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