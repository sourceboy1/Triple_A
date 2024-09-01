import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import emptyWishlistImage from '../pictures/emptywishlist.jpg';
import markImg from '../pictures/mark.jpg';
import markedImg from '../pictures/markred.jpg';
import './Wishlist.css';
import axios from 'axios';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const [updatedWishlist, setUpdatedWishlist] = useState(wishlist);

  const handleReturnToShop = () => {
    navigate('/'); // Navigate to the home page
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const handleAddToCart = (item) => {
    addItemToCart(item);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`); // Corrected path to match routing setup
  };

  useEffect(() => {
    const fetchUpdatedWishlist = async () => {
      try {
        const updatedWishlistPromises = wishlist.map(item =>
          axios.get(`http://localhost:8000/api/products/${item.product_id}/`)
        );
        const responses = await Promise.all(updatedWishlistPromises);
        setUpdatedWishlist(responses.map(response => response.data));
      } catch (error) {
        console.error('Error fetching updated wishlist:', error);
      }
    };

    fetchUpdatedWishlist(); // Fetch updated wishlist on mount

    const intervalId = setInterval(fetchUpdatedWishlist, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [wishlist]);

  return (
    <div className="wishlist-page">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist-container">
          <img src={emptyWishlistImage} alt="Empty Wishlist" className="empty-wishlist-image" />
          <p>Your wishlist is currently empty.</p>
          <button className="return-to-shop-button" onClick={handleReturnToShop}>
            Return to Shop
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div 
              key={item.product_id} 
              className="wishlist-item"
              onClick={() => handleProductClick(item.product_id)} // Navigate to product details page
            >
              <div className="wishlist-item-content">
                <img src={item.image_url} alt={item.name} className="wishlist-item-image" />
                <div className="wishlist-item-info">
                  <h2 className="wishlist-item-name">{item.name}</h2>
                  <p className="wishlist-item-price">{formatPrice(item.price)}</p>
                  <p className="wishlist-item-date">{item.date}</p>
                  <div className="wishlist-item-stock-container">
                    <img
                      src={item.stock > 0 ? markImg : markedImg}
                      alt={item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      className="wishlist-item-stock-image"
                    />
                    <div className={`wishlist-item-stock ${item.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  {item.stock > 0 && (
                    <button
                      className="wishlist-item-add-to-cart"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the product click handler
                        handleAddToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                  <button
                    className="wishlist-item-remove"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the product click handler
                      removeFromWishlist(item.product_id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
