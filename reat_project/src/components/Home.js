// components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
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

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home">
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          src={homeVideo}
          loop
          muted
          playsInline
          preload="auto"
        >
          Your browser does not support the video tag.
        </video>

        {/* Mobile Play Button Overlay */}
        {!isPlaying && (
          <div className="mobile-play-overlay" onClick={handlePlayClick}>
            ►
          </div>
        )}

        <div className="hero-content-overlay">
          <h1 className="hero-title">Discover cutting-edge technology.</h1>
          <p className="hero-subtitle">Experience innovation with every product.</p>
          <button className="shop-button" onClick={handleShopNowClick}>
            Shop Now
          </button>
        </div>
      </div>

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
