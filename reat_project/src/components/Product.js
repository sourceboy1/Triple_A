import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Styling.css';

const BACKEND_URL = 'http://localhost:8000'; // Change this for production

const Product = ({ product_id, name, description, price, image_url }) => {
  const { addItemToCart } = useCart();

  const formattedPrice = price ? new Intl.NumberFormat().format(price) : 'N/A';

  const handleAddToCart = () => {
    const product = { product_id, name, description, price, image_url };
    addItemToCart(product);
  };

  const fullImageUrl = image_url ? `${BACKEND_URL}${image_url}` : '/placeholder.jpg';

  return (
    <div className="product-card">
      <img src={fullImageUrl} alt={name || 'Product'} className="product-image" />
      <h2 className="product-title">
        <Link to={`/product-details/${product_id}`}>{name}</Link>
      </h2>
      <p className="product-description">{description}</p>
      <p className="product-price">₦{formattedPrice}</p>
      <button className="button is-primary" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
