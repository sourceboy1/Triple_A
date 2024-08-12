// src/components/ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext'; // Import the custom hook
import './Styling.css';
import cancelImg from '../pictures/cancel.jpg';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart(); // Get addItemToCart from the context

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${productId}/`)
      .then(response => {
        const mainImage = response.data.image_url || '';
        setProduct(response.data);
        setSelectedImage(mainImage);
      })
      .catch(error => {
        console.error('There was an error fetching the product!', error);
      });
  }, [productId]);

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (product && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItemToCart({ ...product, quantity }); // Add the product with the selected quantity
    }
  };
  
  if (!product) {
    return <div>Loading...</div>;
  }

  const formattedPrice = product.price ? parseFloat(product.price).toFixed(2) : 'N/A';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => navigate(-1)}>
          <img src={cancelImg} alt="Close" />
        </button>
        <div className="product-detail-images">
          {selectedImage && (
            <img src={selectedImage} alt={product.name} className="product-detail-image" />
          )}
          <div className="product-detail-controls">
            {product.additional_images && product.additional_images.map((img, index) => {
              const imageUrl = img.image_url || '';
              return (
                <img
                  key={index}
                  src={imageUrl}
                  alt={img.description}
                  className={`product-detail-controls img ${selectedImage === imageUrl ? 'active' : ''}`}
                  onClick={() => setSelectedImage(imageUrl)}
                />
              );
            })}
          </div>
        </div>
        <div className="product-detail-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${formattedPrice}</p>
          <div className="quantity-control">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>
          <button className="button is-primary" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;





















