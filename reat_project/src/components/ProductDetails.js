import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import './Styling.css';
import cancelImg from '../pictures/cancel.jpg';

const ProductDetails = () => {
  const { productId } = useParams();  // Get productId from URL
  const navigate = useNavigate();  // Use navigate to go back to the previous page
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  useEffect(() => {
    // Fetch the product details based on the productId
    axios.get(`http://localhost:8000/api/products/${productId}/`)
      .then((response) => {
        const data = response.data;
        setProduct(data);
        setSelectedImage(data.image_url || '');  // Set the initial selected image
      })
      .catch((error) => {
        console.error('There was an error fetching the product!', error);
      });
  }, [productId]);

  // Function to increase quantity
  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Function to decrease quantity
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Function to add the product to the cart
  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addItemToCart({ ...product, quantity });
    } else {
      alert('Quantity exceeds stock availability or is invalid.');
    }
  };

  // If the product is still loading
  if (!product) {
    return <div>Loading...</div>;
  }

  // Format the price with commas for better readability
  const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close button to navigate back */}
        <button className="close-button" onClick={() => navigate(-1)}>
          <img src={cancelImg} alt="Close" />
        </button>

        {/* Product images */}
        <div className="product-detail-images">
          {selectedImage && (
            <img src={selectedImage} alt={product.name} className="product-detail-image" />
          )}

          {/* Additional images to select from */}
          <div className="product-detail-controls">
            {product.additional_images && product.additional_images.map((img, index) => (
              <React.Fragment key={index}>
                {/* Primary image */}
                {img.image_url && (
                  <img
                    src={img.image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.image_url)}  // Update selected image
                  />
                )}

                {/* Secondary image */}
                {img.secondary_image_url && (
                  <img
                    src={img.secondary_image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.secondary_image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.secondary_image_url)}  // Update selected image
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Product information */}
        <div className="product-detail-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ₦{formattedPrice}</p>

          {/* Quantity control */}
          <div className="quantity-control">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>

          {/* Add to Cart button */}
          <button onClick={handleAddToCart} className="button is-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
