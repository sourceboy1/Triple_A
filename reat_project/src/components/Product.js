import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Styling.css';

const Product = ({ product_id, name, description, price, image_url }) => {
  const { addItemToCart } = useCart();

  // Format the price with commas
  const formattedPrice = price ? new Intl.NumberFormat().format(price) : 'N/A';

  const handleAddToCart = () => {
    const product = { product_id, name, description, price, image_url };
    addItemToCart(product);
  };

  return (
    <div className="product-card">
      {image_url ? (
        <img src={image_url} alt={name} className="product-image" />
      ) : (
        <p>No image available</p>
      )}
      <h2 className="product-title">{name}</h2>
      <p className="product-description">{description}</p>
      <p className="product-price">₦{formattedPrice}</p>
      <button className="button is-primary" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;








