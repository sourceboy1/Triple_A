import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import PriceAlertModal from './PriceAlertModal';
import './ProductDetails.css';
import wishlistImg from '../pictures/wishlist.jpg';
import wishlistActiveImg from '../pictures/wishlist-active.jpg';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [stockMessage, setStockMessage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await api.get(`products/${productId}/`);
        const productData = response.data;

        const mainImage =
          productData.image_urls?.large ||
          productData.secondary_image_urls?.large ||
          (productData.additional_images?.[0]?.image_urls?.large) ||
          '/media/default.jpg';

        setSelectedImage(mainImage);
        setProduct(productData);
        saveToRecentlyViewed(productData, mainImage);

        setShowPriceAlert(true);
      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message || error);
      }
    };

    fetchProduct();
  }, [productId]);

  const saveToRecentlyViewed = (productData, mainImage) => {
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    viewedProducts = viewedProducts.filter(p => p.product_id !== productData.product_id);

    viewedProducts.unshift({
      product_id: productData.product_id,
      name: productData.name,
      image_url: mainImage || '/media/default.jpg',
      price: productData.price
    });

    if (viewedProducts.length > 20) viewedProducts = viewedProducts.slice(0, 20);
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    if (product) {
      if (quantity > 0 && quantity <= product.stock) {
        const cartProduct = {
          product_id: product.product_id,
          name: product.name,
          image_url: selectedImage || '/media/default.jpg',
          price: product.price,
          stock: product.stock,
          quantity: quantity,
          is_abroad_order: product.is_abroad_order, // Pass new prop to cart
          abroad_delivery_days: product.abroad_delivery_days // Pass new prop to cart
        };
        addItemToCart(cartProduct);
        setStockMessage('');
        setShowPriceAlert(true);
      } else {
        setStockMessage('No available stock.');
      }
    }
  };

  const toggleWishlist = () => {
    if (product) {
        if (isInWishlist(product.product_id)) {
            removeFromWishlist(product.product_id);
        } else {
            addToWishlist(product);
        }
    }
  };

  const handleBuyNowOnWhatsApp = () => {
    if (product) {
      let message = `Hello, I'm interested in buying ${product.name}.`;
      if (product.is_abroad_order) {
        message += ` This is an abroad order item with an estimated delivery of ${product.abroad_delivery_days || 10} days.`;
      }
      message += ` Please provide more details.`;
      const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!product) return <div className="loading-product-details">Loading product details...</div>;

  const thumbnails = [];

  if (product.image_urls?.large) thumbnails.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbnails.push(product.secondary_image_urls.large);

  product.additional_images?.forEach(img => {
    const imageCandidates = [
      img.image_urls?.large,
      img.secondary_image_urls?.large,
      img.tertiary_image_urls?.large,
      img.quaternary_image_urls?.large
    ].filter(Boolean);

    imageCandidates.forEach(url => {
      if (!thumbnails.includes(url)) {
        thumbnails.push(url);
      }
    });
  });

  if (thumbnails.length === 0) {
    thumbnails.push('/media/default.jpg');
  }

  const uniqueThumbnails = [...new Set(thumbnails)];

  const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A';

  return (
    <div className="product-detail-page-wrapper">
      <div className="product-detail">
        <div className="product-detail-header">
          {/* Stock Info */}
          <div className="klb-single-stock">
            {product.stock > 0 ? (
              <div className="product-stock in-stock">
                <span>In Stock</span>
              </div>
            ) : (
              <div className="product-stock out-of-stock">
                <span>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <div className="wishlist-icon1" onClick={toggleWishlist}>
            <img
              src={isInWishlist(product.product_id) ? wishlistActiveImg : wishlistImg}
              alt="Wishlist"
              className="wishlist-image2"
            />
          </div>
        </div>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-detail-images">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className={`product-detail-image ${isZoomed ? 'zoomed' : ''}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            )}
            <div className="product-detail-controls">
              {uniqueThumbnails.map((url, index) => (
                <img
                  key={index}
                  src={url || '/media/default.jpg'}
                  alt={`Thumbnail ${index + 1}`}
                  className={`product-detail-controls-img ${selectedImage === url ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImage(url || '/media/default.jpg');
                    setIsZoomed(false);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>

            {/* Abroad Order Message */}
            {product.is_abroad_order && (
                <div className="abroad-order-detail-message">
                    <p>
                        <span role="img" aria-label="airplane">✈️</span> This item is ordered from abroad.
                        Estimated delivery: **{product.abroad_delivery_days || 10} business days.**
                    </p>
                </div>
            )}

            <div className="product-price">
              {product.discount ? (
                <>
                  <span className="discounted-price">₦{formattedPrice}</span>
                  {product.original_price && <span className="original-price">₦{formattedOriginalPrice}</span>}
                </>
              ) : (
                <p>Price: ₦{formattedPrice}</p>
              )}
            </div>

            {/* Quantity Control */}
            <div className="quantity-control">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>

            {stockMessage && <p className="stock-message" style={{ color: 'red' }}>{stockMessage}</p>}

            {/* Buttons */}
            <button
              onClick={handleAddToCart}
              className="button is-primary"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleBuyNowOnWhatsApp}
              className="button is-primary"
              style={{ marginTop: '10px' }}
              disabled={!product}
            >
              Buy Now on WhatsApp
            </button>
          </div>
        </div>
      </div>

      <PriceAlertModal
        show={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        product={product ? { name: product.name } : null}
        type="product"
      />
    </div>
  );
};

export default ProductDetails;