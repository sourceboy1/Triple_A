import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import emptyWishlistImage from '../pictures/emptywishlist.jpg';
import markImg from '../pictures/mark.jpg'; // In stock icon
import markedImg from '../pictures/markred.jpg'; // Out of stock icon
import './Wishlist.css';
import api from '../Api'; // ✅ Use centralized API config

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();
  const [updatedWishlist, setUpdatedWishlist] = useState(wishlist);

  const handleReturnToShop = () => {
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const handleAddToCart = (item) => {
    addItemToCart(item);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  useEffect(() => {
    const fetchUpdatedWishlist = async () => {
      try {
        const updatedWishlistPromises = wishlist.map(item =>
          api.get(`products/${item.product_id}/`) // ✅ Use baseURL from api.js
        );
        const responses = await Promise.all(updatedWishlistPromises);
        setUpdatedWishlist(responses.map(response => response.data));
      } catch (error) {
        console.error('Error fetching updated wishlist:', error);
      }
    };

    fetchUpdatedWishlist();

    const intervalId = setInterval(fetchUpdatedWishlist, 30000);
    return () => clearInterval(intervalId);
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
          {updatedWishlist.map((item) => (
            <div 
              key={item.product_id} 
              className="wishlist-item"
              onClick={() => handleProductClick(item.product_id)}
            >
              <div className="wishlist-item-content">
                <img src={item.image_url} alt={item.name} className="wishlist-item-image" />
                <div className="wishlist-item-info">
                  <h2 className="wishlist-item-name">{item.name}</h2>
                  <p className="wishlist-item-price">{formatPrice(item.price)}</p>
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

                  {item.stock > 0 ? (
                    <button
                      className="wishlist-item-add-to-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button className="wishlist-item-add-to-cart" disabled>
                      Out of Stock
                    </button>
                  )}

                  <button
                    className="wishlist-item-remove"
                    onClick={(e) => {
                      e.stopPropagation();
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
