// components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import homeVideo from '../pictures/home1.mp4';
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
  const [isPlaying, setIsPlaying] = useState(true); // Added: State to control play/pause
  const videoRef = useRef(null); // Added: Ref for the video element
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Added: Handle video play/pause
  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
          src={homeVideo}
          autoPlay={isPlaying} // Controlled by isPlaying state
          loop
          muted // Crucial for mobile autoplay, can be toggled if user interaction is needed for sound
          playsInline // Crucial for mobile autoplay
          preload="auto"
          ref={videoRef} // Added: Attach the ref to the video element
          onEnded={() => { // Added: Handle video ending
            setIsPlaying(false); // Set to paused state
            videoRef.current.currentTime = 0; // Reset video to start
          }}
        >
          Your browser does not support the video tag.
        </video>
        <div className="hero-content-overlay">
          <h1 className="hero-title">Discover cutting-edge technology.</h1>
          <p className="hero-subtitle">Experience innovation with every product.</p>
          <button className="shop-button" onClick={handleShopNowClick}>
            Shop Now
          </button>
          {/* Added: Play button, visible when video is paused */}
          {!isPlaying && (
            <button className="play-button" onClick={handlePlayPauseClick} aria-label="Play video">
                {/* You can use an icon here, for example: */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
            </button>
          )}
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