import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useCart } from '../contexts/CartContext';
import './Styling.css';

const Product = ({ product_id, name, description, price, image_urls, stock }) => {
  const { addItemToCart } = useCart();

  // Format the price with commas
  const formattedPrice = price ? new Intl.NumberFormat().format(price) : 'N/A';

  const handleAddToCart = () => {
    if (stock > 0) {
      const product = { product_id, name, description, price, image_url: image_urls.large };
      addItemToCart(product);
    } else {
      alert('Product is out of stock!');
    }
  };

  return (
    <div className="product-card">
      {image_urls && image_urls.large ? (
        <img src={image_urls.large} alt={name} className="product-image" />
      ) : (
        <p>No image available</p>
      )}

      <h2 className="product-title">
        <Link to={`/product-details/${product_id}`}>{name}</Link>
      </h2>

      <p className="product-description">{description}</p>

      <p className="product-price">₦{formattedPrice}</p>

      <button
        className="button is-primary"
        onClick={handleAddToCart}
        disabled={stock === 0} // Disable button if out of stock
      >
        {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default Product;
