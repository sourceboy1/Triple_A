import React, { useEffect, useState, useRef } from 'react'; 
import './Deals_of_the_Day.css';
import cartIcon from '../pictures/cart.jpg';
import wishlistIcon from '../pictures/wishlist.jpg';
import wishlistActiveIcon from '../pictures/wishlist-active.jpg';
import arrowRight from '../icons/Arrow_Right.jpg';
import arrowLeft from '../icons/Arrow_Left.jpg';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import api from '../Api';
import Loading from './Loading';
import { getProductDetailsPath } from '../helpers/navigation';

const DealsOfTheDay = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const dealsListRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await api.get('/deals_of_the_day/');
        setDeals(response.data);
      } catch (error) {
        console.error('Error fetching deals of the day:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const toggleWishlist = (deal) => {
    if (isInWishlist(deal.product_id)) {
      removeFromWishlist(deal.product_id);
    } else {
      addToWishlist(deal);
    }
  };

  const handleAddToCart = (deal) => {
    addItemToCart({
      product_id: deal.product_id,
      name: deal.name,
      description: deal.description,
      price: deal.price,
      image_url: deal.image_urls?.medium || '',
      stock: deal.stock,
    });
  };

  // 🔥 FIXED: Use universal helper
  const handleProductClick = (deal) => {
    navigate(getProductDetailsPath(deal));
  };

  const slideRight = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === deals.length - 1 ? 0 : prevIndex + 1
    );

  const slideLeft = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? deals.length - 1 : prevIndex - 1
    );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) slideRight();
    else if (diff < -50) slideLeft();
  };

  const displayedDeals = deals;

  if (loading) return <Loading />;

  return (
    <div className="deals-container">
      <h2>Deals of the Day</h2>
      <div className="deals-slider">
        <div className="arrow-container left-arrow" onClick={slideLeft}>
          <img src={arrowLeft} alt="Left Arrow" className="deal-arrow" />
        </div>

        <div
          className="deals-list"
          ref={dealsListRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${(currentIndex * 100) / displayedDeals.length}%)`,
          }}
        >
          {displayedDeals.map((deal, index) => (
            <div
              key={index}
              className="deal-item"
              onClick={() => handleProductClick(deal)}
              onMouseEnter={(e) => {
                const imgEl = e.currentTarget.querySelector('img');
                if (deal.secondary_image_urls?.medium) {
                  imgEl.src = deal.secondary_image_urls.medium;
                }
              }}
              onMouseLeave={(e) => {
                const imgEl = e.currentTarget.querySelector('img');
                imgEl.src = deal.image_urls?.medium || '';
              }}
            >
              <img src={deal.image_urls?.medium || ''} alt={deal.name} />

              <div className="icon-container">
                <img
                  src={isInWishlist(deal.product_id) ? wishlistActiveIcon : wishlistIcon}
                  alt="Wishlist Icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(deal);
                  }}
                />
                <img
                  src={cartIcon}
                  alt="Cart Icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(deal);
                  }}
                />
              </div>

              <h4>{deal.name}</h4>
              <p>
                <strong>Price: </strong>
                <span className="deal_price">{formatPrice(deal.price)}</span>
                <br />
                <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>
                  {formatPrice(deal.original_price)}
                </span>
              </p>

              {deal.discount && (
                <p>
                  <strong>Discount: </strong>
                  {Math.floor(deal.discount)}% off
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="arrow-container right-arrow" onClick={slideRight}>
          <img src={arrowRight} alt="Right Arrow" className="deal-arrow" />
        </div>
      </div>
    </div>
  );
};

export default DealsOfTheDay;
