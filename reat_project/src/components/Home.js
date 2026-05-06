// components/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import homeVideo from '../pictures/home5.mp4';
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

// ── Local image imports ──
import headphonesImg  from '../pictures/headphones_display.jpg';
import powerbankImg   from '../pictures/powerbank_display.jpg';
import laptopImg      from '../pictures/laptop_display.jpg';
import phoneImg       from '../pictures/phone_display.jpg';
import speakersImg    from '../pictures/Speakers_display.jpg';
import smartwatchImg  from '../pictures/smarthwatch_display.jpg';
import gamingImg      from '../pictures/Gaminggear_display.jpg';

/* ── Sidebar card data ── */
const SIDEBAR_CARDS = [
  {
    id: 2,
    label: 'Hot Deal',
    title: 'Wireless Earbuds',
    sub: 'Up to 40% off today',
    img: headphonesImg,
    path: '/category-full-display?category_id=3',   // ✅ AirPods/Earbuds & Headsets
  },
  {
    id: 3,
    label: 'Top Pick',
    title: 'Power Banks',
    sub: 'Fast-charge collection',
    img: powerbankImg,
    path: '/category-full-display?category_id=7',   // ✅ Powerbanks
  },
];

/* ── Bento grid card data ── */
const BENTO_CARDS = [
  {
    id: 1,
    label: 'Featured',
    title: 'Ultra-Thin Laptops',
    desc: 'Performance meets portability in our new thin & light collection.',
    img: laptopImg,
    cta: 'Shop Laptops',
    wide: true,
    path: '/category-full-display?category_id=4',   // ✅ Laptops/Computers & Accessories
  },
  {
    id: 3,
    label: 'Phones',
    title: 'Smartphones',
    desc: 'Latest flagships & budget picks.',
    img: phoneImg,
    cta: 'View All',
    path: '/category-full-display?category_id=2',   // ✅ Phones & Tablets
  },
  {
    id: 4,
    label: 'Audio',
    title: 'Speakers & Sound',
    desc: 'Room-filling bass, pocket-friendly price.',
    img: speakersImg,
    cta: 'Discover',
    path: '/category-full-display?category_id=14',  // ✅ Electronics
  },
  {
    id: 5,
    label: 'Wearables',
    title: 'Smart Watches',
    desc: 'Fitness tracking & smart notifications.',
    img: smartwatchImg,
    cta: 'Shop Now',
    path: '/category-full-display?category_id=8',   // ✅ Watches & Smartwatches
  },
  {
    id: 6,
    label: 'Gaming',
    title: 'Gaming Gear',
    desc: 'Controllers, headsets, and more.',
    img: gamingImg,
    cta: 'Level Up',
    path: '/category-full-display?category_id=9',   // ✅ Video Games & Accessories
  },
];

const Home = () => {
  const [loading, setLoading]     = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleShopNowClick = () => navigate('/category-full-display');

  const handleVideoError = () =>
    console.error('❌ Video failed to load. Check file or format.');

  if (loading) return <Loading />;

  return (
    <div className="home">

      {/* ── Hero: video + sidebar ──────────────────────────── */}
      <div className="hero-section">

        {/* Video card */}
        <div className="hero-video-container">
          <video
            key={homeVideo}
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            ref={videoRef}
            onError={handleVideoError}
          >
            <source src={homeVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="hero-content-overlay">
            <span className="hero-badge">✦ New Collection 2026</span>
            <h1 className="hero-title">Discover Cutting-Edge Technology.</h1>
            <p className="hero-subtitle">
              Experience innovation with every product — from laptops to accessories.
            </p>
            <div className="hero-actions">
              <button className="shop-button" onClick={handleShopNowClick}>
                Shop Now →
              </button>
              {!isPlaying && (
                <button
                  className="play-button"
                  onClick={handlePlayPauseClick}
                  aria-label="Play video"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M8 5V19L19 12L8 5Z" fill="white" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar cards */}
        <div className="hero-sidebar">
          {SIDEBAR_CARDS.map(card => (
            <div
              key={card.id}
              className="sidebar-card"
              onClick={() => navigate(card.path)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(card.path)}
            >
              <img
                src={card.img}
                alt={card.title}
                className="sidebar-card-img"
              />
              <span className="sidebar-card-arrow">↗</span>
              <div className="sidebar-card-body">
                <p className="sidebar-card-label">{card.label}</p>
                <h3 className="sidebar-card-title">{card.title}</h3>
                <p className="sidebar-card-sub">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bento grid ─────────────────────────────────────── */}
      <div className="bento-grid">
        {BENTO_CARDS.map(card => (
          <div
            key={card.id}
            className={`bento-card${card.wide ? ' bento-card--wide' : ''}`}
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(card.path)}
          >
            <img
              src={card.img}
              alt={card.title}
              className="bento-card-img"
            />
            <div className="bento-card-body">
              <p className="bento-card-label">{card.label}</p>
              <h3 className="bento-card-title">{card.title}</h3>
              <p className="bento-card-desc">{card.desc}</p>
              <span className="bento-card-cta">{card.cta} →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Existing component sections ────────────────────── */}
      <div className="home-sections">
        <FeatureDisplay />
        <DealsOfTheDay />
        <CategoryDisplay />
        <PowerBankDisplay />
        <LaptopDisplay />
        <PhonesTabletsDisplay />
        <ViewedProducts />
      </div>

    </div>
  );
};

export default Home;