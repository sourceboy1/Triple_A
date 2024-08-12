import React from 'react';
import { useCart } from '../contexts/CartContext'; // Import the useCart hook
import './Styling.css'; // Ensure correct styles are applied

const Product = ({ product_id, name, description, price, image_url }) => {
  const { addItemToCart } = useCart(); // Get the addItemToCart function from context

  const formattedPrice = price ? parseFloat(price).toFixed(2) : 'N/A';

  const handleAddToCart = () => {
    const product = { product_id, name, description, price, image_url };
    addItemToCart(product); // Add the product to the cart
  };

  return (
    <div className="product-card"> {/* Same class as in Home */}
      {image_url ? (
        <img src={image_url} alt={name} className="product-image" /> 
      ) : (
        <p>No image available</p>
      )}
      <h2 className="product-title">{name}</h2>
      <p className="product-description">{description}</p>
      <p className="product-price">
        #{formattedPrice}
      </p>
      <button className="button is-primary" onClick={handleAddToCart}>
        Add to Cart
      </button> {/* Same button style */}
    </div>
  );
};

export default Product;






