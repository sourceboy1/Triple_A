import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
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
  const [isZoomed, setIsZoomed] = useState(false); // ✅ zoom state

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await api.get(`products/${productId}/`);
        const productData = response.data;

        // Set initial main image (use first available)
        const mainImage =
          productData.image_urls?.large ||
          productData.secondary_image_urls?.large ||
          (productData.additional_images?.[0]?.image_urls?.large) ||
          '/media/default.jpg'; // Ensure a default if no images

        setSelectedImage(mainImage);
        setProduct(productData);
        saveToRecentlyViewed(productData, mainImage);
      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message || error);
        // Consider setting product to null or showing an error state here if fetch fails
      }
    };

    fetchProduct();
  }, [productId]);

  // Save product to recently viewed in localStorage
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

  // Quantity controls
  const handleIncrease = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (product) {
      if (quantity > 0 && quantity <= product.stock) {
        const cartProduct = {
          product_id: product.product_id,
          name: product.name,
          image_url: selectedImage || '/media/default.jpg',
          price: product.price,
          stock: product.stock,
          quantity: quantity
        };
        addItemToCart(cartProduct);
        setStockMessage('');
      } else {
        setStockMessage('No available stock.');
      }
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    if (product) { // Ensure product is not null before accessing its properties
        if (isInWishlist(product.product_id)) {
            removeFromWishlist(product.product_id);
        } else {
            addToWishlist(product);
        }
    }
  };


  // WhatsApp buy
  const handleBuyNowOnWhatsApp = () => {
    if (product) { // Ensure product is not null
      const message = `Hello, I'm interested in buying ${product.name}. Please provide more details.`;
      const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!product) return <div className="loading-product-details">Loading product details...</div>;

  // Prepare all images for thumbnails
  const thumbnails = [];

  // Consolidated image parsing logic
  // Prioritize primary and secondary directly from productData
  if (product.image_urls?.large) thumbnails.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbnails.push(product.secondary_image_urls.large);

  // Then add from additional_images, ensuring uniqueness
  product.additional_images?.forEach(img => {
    // Collect all available 'large' images from each tier
    const imageCandidates = [
      img.image_urls?.large,
      img.secondary_image_urls?.large,
      img.tertiary_image_urls?.large,
      img.quaternary_image_urls?.large
    ].filter(Boolean); // Filter out any undefined/null values

    imageCandidates.forEach(url => {
      if (!thumbnails.includes(url)) { // Add only if not already present
        thumbnails.push(url);
      }
    });
  });

  // Fallback for thumbnails if product has no images defined at all
  if (thumbnails.length === 0) {
    thumbnails.push('/media/default.jpg');
  }

  const uniqueThumbnails = [...new Set(thumbnails)]; // Ensure absolute uniqueness in case of overlaps

  const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A';

  return (
    <div className="product-detail-page-wrapper"> {/* Added a wrapper for overall layout */}
      <div className="product-detail">
        <div className="product-detail-content">

          {/* Wishlist Icon */}
          <div className="wishlist-icon1" onClick={toggleWishlist}>
            <img
              src={isInWishlist(product.product_id) ? wishlistActiveImg : wishlistImg}
              alt="Wishlist"
              className="wishlist-image2"
            />
          </div>

          {/* Stock Info - NO MARK IMAGES */}
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

          {/* Product Images */}
          <div className="product-detail-images">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className={`product-detail-image ${isZoomed ? 'zoomed' : ''}`}
                onClick={() => setIsZoomed(!isZoomed)} // ✅ toggle zoom on tap
              />
            )}
            <div className="product-detail-controls">
              {uniqueThumbnails.map((url, index) => (
                <img
                  key={index}
                  src={url || '/media/default.jpg'} // Ensure default if URL is bad
                  alt={`Thumbnail ${index + 1}`}
                  className={`product-detail-controls-img ${selectedImage === url ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedImage(url || '/media/default.jpg');
                    setIsZoomed(false); // reset zoom when changing image
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-info">
            <h2 className="product-title">{product.name}</h2>
            <p className="product-description">{product.description}</p>

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
              disabled={!product} // Disable if product data not loaded
            >
              Buy Now on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;