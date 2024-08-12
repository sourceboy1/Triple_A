import React from 'react';
import { useCart } from '../contexts/CartContext';
import cartIcon from '../pictures/cart.jpg'; // Path to your cart icon image
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Add your styles for CartIcon

const CartIcon = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div className="cart-icon" onClick={handleClick}>
      <img src={cartIcon} alt="Cart" />
      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
    </div>
  );
};

export default CartIcon;
