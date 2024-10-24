import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Deals_of_the_Day.css'; // Import the CSS file
import cartIcon from '../pictures/cart.jpg';
import wishlistIcon from '../pictures/wishlist.jpg';
import wishlistActiveIcon from '../pictures/wishlist-active.jpg';
import arrowRight from '../icons/Arrow_Right.jpg';
import arrowLeft from '../icons/Arrow_Left.jpg';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading'; // Import the Loading component

const DealsOfTheDay = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/deals_of_the_day/')
      .then(response => {
        setDeals(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error('Error fetching the deals of the day:', error);
        setLoading(false); // Stop loading if there is an error
      });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const toggleWishlist = (deal) => {
    if (isInWishlist(deal.product_id)) {
      removeFromWishlist(deal.product_id);
    } else {
      addToWishlist(deal);
    }
  };

  const handleAddToCart = (deal) => {
    const product = {
      product_id: deal.product_id,
      name: deal.name,
      description: deal.description,
      price: deal.price,
      image_url: deal.image_url,
      stock: deal.stock,
    };
    addItemToCart(product);
    console.log(`Added ${deal.name} to cart`);
  };

  const handleProductClick = (product_id) => {
    navigate(`/product-details/${product_id}`);
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === deals.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return deals.length - 1;
      }
      return prevIndex - 1;
    });
  };

  const displayedDeals = [...deals, ...deals];

  return (
    <div className="deals-container">
      <h2>Deals of the Day</h2>
      {loading ? (
        <Loading /> // Display loading spinner if loading is true
      ) : (
        <div className="deals-slider">
          <div className="arrow-container left-arrow" onClick={slideLeft}>
            <img src={arrowLeft} alt="Left Arrow" className="deal-arrow" />
          </div>
          <div className="deals-list" style={{ transform: `translateX(-${(currentIndex * 100) / displayedDeals.length}%)` }}>
            {displayedDeals.map((deal, index) => (
              <div
                key={index}
                className="deal-item"
                onClick={() => handleProductClick(deal.product_id)}
                onMouseEnter={(e) => e.currentTarget.querySelector('img').src = deal.secondary_image_url}
                onMouseLeave={(e) => e.currentTarget.querySelector('img').src = deal.image_url}
              >
                <img src={deal.image_url} alt={deal.name} />
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
                  <span className='deal_price'>{formatPrice(deal.price)}</span><br />
                  <span style={{ textDecoration: 'line-through', marginRight: '5px' }}>
                    {formatPrice(deal.original_price)}
                  </span>
                </p>
                {deal.discount && (
                  <p><strong>Discount: </strong>{Math.floor(deal.discount)}% off</p>
                )}
              </div>
            ))}
          </div>
          <div className="arrow-container right-arrow" onClick={slideRight}>
            <img src={arrowRight} alt="Right Arrow" className="deal-arrow" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsOfTheDay;
