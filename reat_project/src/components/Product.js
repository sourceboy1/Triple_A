// Product.jsx
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import PriceAlertModal from './PriceAlertModal'; // Import the modal
import './Styling.css'; // Assuming your general styling

const Product = ({ product_id, name, description, price, image_urls, stock }) => {
  const { addItemToCart } = useCart();
  const [showPriceAlert, setShowPriceAlert] = useState(false); // State for modal visibility

  // Format the price with commas
  const formattedPrice = price ? new Intl.NumberFormat().format(price) : 'N/A';

  const handleAddToCart = () => {
    if (stock > 0) {
      const productToAdd = { product_id, name, description, price, image_url: image_urls.large, stock }; // Pass stock
      addItemToCart(productToAdd);
      setShowPriceAlert(true); // Show alert after adding to cart
    } else {
      alert('Product is out of stock!');
    }
  };

  // Function to view product details and show alert
  const handleProductClick = () => {
    setShowPriceAlert(true); // Show alert when clicking on product name/link
  };

  return (
    <div className="product-card">
      {image_urls && image_urls.large ? (
        <img src={image_urls.large} alt={name} className="product-image" />
      ) : (
        <p>No image available</p>
      )}

      <h2 className="product-title">
        {/* Wrap Link in an onClick to show the alert */}
        <Link to={`/product-details/${product_id}`} onClick={handleProductClick}>
          {name}
        </Link>
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

      {/* Price Alert Modal */}
      <PriceAlertModal
        show={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        product={{ name }} // Pass product name for specific WhatsApp message
        type="product" // Indicate this is from a product page
      />
    </div>
  );
};

export default Product;