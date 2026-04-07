// components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import homeVideo from '../pictures/home2.mp4';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Play / Pause handler
  const handlePlayPauseClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleShopNowClick = () => {
    navigate('/product-catalog');
  };

  // 🔥 Debug: check if video loads
  const handleVideoError = () => {
    console.error('❌ Video failed to load. Check file or format.');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home">
      <div className="hero-video-container">
        <video
          key={homeVideo} // 🔥 forces reload when video changes
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          onError={handleVideoError}
        >
          {/* ✅ Better compatibility */}
          <source src={homeVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content-overlay">
          <h1 className="hero-title">Discover cutting-edge technology.</h1>
          <p className="hero-subtitle">Experience innovation with every product.</p>

          <button className="shop-button" onClick={handleShopNowClick}>
            Shop Now
          </button>

          {/* Play button when paused */}
          {!isPlaying && (
            <button
              className="play-button"
              onClick={handlePlayPauseClick}
              aria-label="Play video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
            </button>
          )}
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