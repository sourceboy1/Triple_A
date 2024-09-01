import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import './Styling.css';
import cancelImg from '../pictures/cancel.jpg';
import markImg from '../pictures/mark.jpg';
import markedImg from '../pictures/markred.jpg';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
        setProduct(response.data);
        setSelectedImage(response.data.image_url || '');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct(); // Fetch product details on mount

    const intervalId = setInterval(fetchProduct, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [productId]);

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addItemToCart({ ...product, quantity });
    } else {
      alert('Quantity exceeds stock availability or is invalid.');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleBuyNowOnWhatsApp = () => {
    const message = `Hello, I'm interested in buying ${product.name}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A';
  const formattedDiscount = product.discount ? new Intl.NumberFormat().format(product.discount) : 'N/A';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => navigate(-1)}>
          <img src={cancelImg} alt="Close" />
        </button>

        <div className="klb-single-stock">
          {product.stock > 0 ? (
            <div className="product-stock in-stock">
              <img src={markImg} alt="In Stock" className="stock-image" />
              In Stock
            </div>
          ) : (
            <div className="product-stock out-of-stock">
              <img src={markedImg} alt="Out of Stock" className="stock-image" />
              Out of Stock
            </div>
          )}
        </div>

        <div className="product-detail-images">
          {selectedImage && (
            <img src={selectedImage} alt={product.name} className="product-detail-image" />
          )}

          <div className="product-detail-controls">
            {product.additional_images && product.additional_images.length > 0 && product.additional_images.map((img, index) => (
              <React.Fragment key={index}>
                {img.image_url && (
                  <img
                    src={img.image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.image_url)}
                  />
                )}
                {img.secondary_image_url && (
                  <img
                    src={img.secondary_image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.secondary_image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.secondary_image_url)}
                  />
                )}
                {img.tertiary_image_url && (
                  <img
                    src={img.tertiary_image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.tertiary_image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.tertiary_image_url)}
                  />
                )}
                {img.quaternary_image_url && (
                  <img
                    src={img.quaternary_image_url}
                    alt={img.description}
                    className={`product-detail-controls img ${selectedImage === img.quaternary_image_url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img.quaternary_image_url)}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="product-detail-info">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            {product.discount ? (
              <>
                <span className="discounted-price">₦{formattedPrice}</span>
                <span className="original-price">₦{formattedOriginalPrice}</span>
              </>
            ) : (
              <p>Price: ₦{formattedPrice}</p>
            )}
          </div>

          <div className="quantity-control">
            <button onClick={handleDecrease}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrease}>+</button>
          </div>

          <button onClick={handleAddToCart} className="button is-primary">
            Add to Cart
          </button>

          <button onClick={handleBuyNowOnWhatsApp} className="button is-primary" style={{ marginTop: '10px' }}>
            Buy Now on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
