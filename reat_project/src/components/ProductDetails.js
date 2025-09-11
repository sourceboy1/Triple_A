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
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [stockMessage, setStockMessage] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is missing from the URL.");
        setLoading(false);
        return;
      }

      setLoading(true); // Start loading
      setError(null);    // Clear any previous errors
      try {
        const response = await api.get(`products/${productId}/`);
        const productData = response.data;

        // Ensure we always have an image, falling back to default
        const mainImage =
          productData.image_urls?.large ||
          productData.secondary_image_urls?.large ||
          (productData.additional_images?.[0]?.image_urls?.large) ||
          '/media/default.jpg';

        setSelectedImage(mainImage);
        setProduct(productData);
        saveToRecentlyViewed(productData, mainImage);

        // Show price alert only if product successfully loaded
        // Assuming this is for a general product alert, not cart addition.
        // If it's specifically for cart, move it into handleAddToCart.
        // For product details load, you might want to consider if this alert is relevant.
        // setShowPriceAlert(true); // Decide if you want this here or only on add to cart.

      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message || error);
        setProduct(null); // Clear product data if fetch fails
        setError('Failed to load product details. Please try again.'); // Set user-friendly error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProduct();
  }, [productId]); // Re-fetch when productId changes

  const saveToRecentlyViewed = (productData, mainImage) => {
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    // Remove if already exists to move it to the front
    viewedProducts = viewedProducts.filter(p => p.product_id !== productData.product_id);

    viewedProducts.unshift({
      product_id: productData.product_id,
      name: productData.name,
      image_url: mainImage || '/media/default.jpg', // Ensure default image if not present
      price: productData.price
    });

    // Keep only the last 20 viewed products
    if (viewedProducts.length > 20) viewedProducts = viewedProducts.slice(0, 20);
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
  };

  const handleIncrease = () => {
    // Only increase if product exists and quantity is less than available stock
    if (product && quantity < product.stock) {
      setQuantity(prevQuantity => prevQuantity + 1);
      setStockMessage(''); // Clear stock message
    } else if (product && quantity >= product.stock) {
      setStockMessage(`Cannot add more than available stock (${product.stock}).`);
    }
  };

  const handleDecrease = () => {
    // Only decrease if quantity is greater than 1
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
      setStockMessage(''); // Clear stock message if quantity is now valid
    }
  };

  const handleAddToCart = () => {
    if (product) {
      if (quantity > 0 && quantity <= product.stock) {
        const cartProduct = {
          product_id: product.product_id,
          name: product.name,
          image_url: selectedImage || '/media/default.jpg',
          price: product.price,
          stock: product.stock, // Pass stock for cart validation
          quantity: quantity,
          is_abroad_order: product.is_abroad_order, // Pass new prop to cart
          abroad_delivery_days: product.abroad_delivery_days // Pass new prop to cart
        };
        addItemToCart(cartProduct);
        setStockMessage(''); // Clear any previous stock messages
        setShowPriceAlert(true); // Show alert confirming item added to cart
      } else if (product.stock === 0) {
        setStockMessage('This item is currently out of stock.');
      } else {
        setStockMessage(`Cannot add more than available stock (${product.stock}).`);
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
      // Consistent display for abroad delivery days for WhatsApp message
      const deliveryDays = product.abroad_delivery_days === 14 ? '7-14' : (product.abroad_delivery_days ? `${product.abroad_delivery_days}` : '7-14');
      let message = `Hello, I'm interested in buying ${product.name}.`;
      if (product.is_abroad_order) {
        message += ` This is an abroad order item with an estimated delivery of ${deliveryDays} business days.`;
      }
      message += ` Please provide more details.`;
      const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Display loading state
  if (loading) return <div className="loading-product-details">Loading product details...</div>;

  // Display error state if product couldn't be loaded
  if (error) return <div className="error-product-details" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;

  // If not loading and no product (which means error but not caught or productId was missing)
  if (!product) return <div className="error-product-details" style={{ color: 'orange', textAlign: 'center', padding: '20px' }}>Product not found.</div>;

  // --- Image Handling for Thumbnails ---
  const thumbnails = [];
  if (product.image_urls?.large) thumbnails.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbnails.push(product.secondary_image_urls.large);

  // Add additional images, checking all possible URLs
  product.additional_images?.forEach(img => {
    const imageCandidates = [
      img.image_urls?.large,
      img.secondary_image_urls?.large,
      img.tertiary_image_urls?.large,
      img.quaternary_image_urls?.large
    ].filter(Boolean); // Filter out any null/undefined URLs

    imageCandidates.forEach(url => {
      if (url && !thumbnails.includes(url)) { // Ensure URL is valid and not a duplicate
        thumbnails.push(url);
      }
    });
  });

  // Fallback for default image if no images are found
  if (thumbnails.length === 0) {
    thumbnails.push('/media/default.jpg');
  }

  const uniqueThumbnails = [...new Set(thumbnails)]; // Ensure only unique thumbnails are displayed

  // --- Formatting Price ---
  const formattedPrice = product.price !== undefined ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price !== undefined ? new Intl.NumberFormat().format(product.original_price) : 'N/A';

  // --- Consistent Abroad Delivery Display ---
  // If abroad_delivery_days is 14, display "7-14 business days", otherwise display its value or a default "7-14"
  const deliveryDisplayDetail = product.abroad_delivery_days === 14 ? '7-14 business days' : `${product.abroad_delivery_days || '7-14'} business days`;


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
                onClick={() => setIsZoomed(!isZoomed)} // Toggle zoom on click
              />
            )}
            <div className="product-detail-controls">
              {uniqueThumbnails.map((url, index) => (
                <img
                  key={index}
                  src={url || '/media/default.jpg'} // Fallback for thumbnail
                  alt={`Thumbnail ${index + 1}`}
                  className={`product-detail-controls-img ${selectedImage === url ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImage(url || '/media/default.jpg');
                    setIsZoomed(false); // Reset zoom when changing image
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
                        Estimated delivery: **{deliveryDisplayDetail}.**
                    </p>
                </div>
            )}

            <div className="product-price">
              {product.discount ? ( // Display discounted price if discount exists
                <>
                  <span className="discounted-price">₦{formattedPrice}</span>
                  {product.original_price !== undefined && <span className="original-price">₦{formattedOriginalPrice}</span>}
                </>
              ) : ( // Otherwise, just display the regular price
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
              disabled={product.stock === 0} // Disable if out of stock
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleBuyNowOnWhatsApp}
              className="button is-primary"
              style={{ marginTop: '10px' }}
              disabled={!product} // Disable if product data isn't loaded
            >
              Buy Now on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Price Alert Modal */}
      <PriceAlertModal
        show={showPriceAlert}
        onClose={() => setShowPriceAlert(false)}
        product={product ? { name: product.name } : null} // Pass product name if available
        type="price" // Changed type here, confirm if this is correct for your modal
      />
    </div>
  );
};

export default ProductDetails;