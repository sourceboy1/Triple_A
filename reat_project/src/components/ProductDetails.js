import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import './ProductDetails.css';
import markImg from '../pictures/mark.jpg';
import markedImg from '../pictures/markred.jpg';
import wishlistImg from '../pictures/wishlist.jpg';
import wishlistActiveImg from '../pictures/wishlist-active.jpg';

// ✅ Helper for correct image URLs in production
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute
  return process.env.PUBLIC_URL + path.replace(/^\./, '');
};

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [stockMessage, setStockMessage] = useState('');

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
          '/media/default.jpg';

        setSelectedImage(mainImage);
        setProduct(productData);
        saveToRecentlyViewed(productData, mainImage);
      } catch (error) {
        console.error('Error fetching product:', error);
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
          image_url: selectedImage || '/media/default.jpg', // main image
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
    if (isInWishlist(product.product_id)) removeFromWishlist(product.product_id);
    else addToWishlist(product);
  };

  // WhatsApp buy
  const handleBuyNowOnWhatsApp = () => {
    const message = `Hello, I'm interested in buying ${product.name}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!product) return <div>Loading...</div>;

  // Prepare all images for thumbnails
  const thumbnails = [];

  if (product.image_urls?.large) thumbnails.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbnails.push(product.secondary_image_urls.large);

  product.additional_images?.forEach(img => {
    ['image_urls', 'secondary_image_urls', 'tertiary_image_urls', 'quaternary_image_urls'].forEach(key => {
      if (img[key]?.large) thumbnails.push(img[key].large);
    });
  });

  const uniqueThumbnails = [...new Set(thumbnails)];

  const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A';

  return (
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

        {/* Stock Info */}
        <div className="klb-single-stock">
          {product.stock > 0 ? (
            <div className="product-stock in-stock">
              <img src={getImageUrl(markImg)} alt="In Stock" className="stock-image" />
              <span>In Stock</span>
            </div>
          ) : (
            <div className="product-stock out-of-stock">
              <img src={getImageUrl(markedImg)} alt="Out of Stock" className="stock-image" />
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
              className="product-detail-image zoomable-image"
            />
          )}
          <div className="product-detail-controls">
            {uniqueThumbnails.map((url, index) => (
              <img
                key={index}
                src={url || '/media/default.jpg'}
                alt={`Thumbnail ${index + 1}`}
                className={`product-detail-controls-img ${selectedImage === url ? 'active' : ''}`}
                onClick={() => setSelectedImage(url || '/media/default.jpg')}
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
                <span className="original-price">₦{formattedOriginalPrice}</span>
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
          >
            Buy Now on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
