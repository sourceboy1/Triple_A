// src/components/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import PriceAlertModal from './PriceAlertModal';
import './ProductDetails.css';
import wishlistImg from '../pictures/wishlist.jpg';
import wishlistActiveImg from '../pictures/wishlist-active.jpg';

const ProductDetails = () => {
  const { slug } = useParams();
  const productId = slug;   // re-use same variable so rest of your code works
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
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

      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`products/${productId}/`);
        const productData = response.data;

        // normalize image fields (robust)
        const mainImage =
          productData.image_urls?.large ||
          productData.secondary_image_urls?.large ||
          (productData.additional_images?.[0]?.image_url) ||
          '/media/default.jpg';

        setSelectedImage(mainImage);
        setProduct(productData);
        saveToRecentlyViewed(productData, mainImage);

        // If the API returned product.slug but the URL used productId numeric, optionally redirect to slug URL
        // (Keeps canonical URLs consistent)
        if (productData.slug && !isNaN(Number(productId))) {
          // redirect to slug URL
          navigate(`/product/${productData.slug}`, { replace: true });
        }
      } catch (err) {
        console.error('Error fetching product:', err.response?.data || err.message || err);
        setProduct(null);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const saveToRecentlyViewed = (productData, mainImage) => {
    let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    viewedProducts = viewedProducts.filter(p => p.product_id !== productData.product_id);

    viewedProducts.unshift({
      product_id: productData.product_id,
      slug: productData.slug,
      name: productData.name,
      image_url: mainImage || '/media/default.jpg',
      price: productData.price
    });

    if (viewedProducts.length > 20) viewedProducts = viewedProducts.slice(0, 20);
    localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
      setStockMessage('');
    } else if (product && quantity >= product.stock) {
      setStockMessage(`Cannot add more than available stock (${product.stock}).`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
      setStockMessage('');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > 0 && quantity <= product.stock) {
      const cartProduct = {
        product_id: product.product_id,
        name: product.name,
        image_url: selectedImage || '/media/default.jpg',
        price: product.price,
        stock: product.stock,
        quantity,
        is_abroad_order: product.is_abroad_order,
        abroad_delivery_days: product.abroad_delivery_days
      };
      addItemToCart(cartProduct);
      setStockMessage('');
      setShowPriceAlert(true);
    } else if (product.stock === 0) {
      setStockMessage('This item is currently out of stock.');
    } else {
      setStockMessage(`Cannot add more than available stock (${product.stock}).`);
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.product_id)) removeFromWishlist(product.product_id);
    else addToWishlist(product);
  };

  const handleBuyNowOnWhatsApp = () => {
    if (!product) return;
    const deliveryDays = product.abroad_delivery_days === 14 ? '7-14' : (product.abroad_delivery_days ? `${product.abroad_delivery_days}` : '7-14');
    let message = `Hello, I'm interested in buying ${product.name}.`;
    if (product.is_abroad_order) {
      message += ` This is an abroad order item with an estimated delivery of ${deliveryDays} business days.`;
    }
    message += ` Please provide more details.`;
    const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <div className="loading-product-details">Loading product details...</div>;
  if (error) return <div className="error-product-details" style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  if (!product) return <div className="error-product-details" style={{ color: 'orange', textAlign: 'center', padding: '20px' }}>Product not found.</div>;

  // build thumbnails
  const thumbnails = [];
  if (product.image_urls?.large) thumbnails.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbnails.push(product.secondary_image_urls.large);
  product.additional_images?.forEach(img => {
    if (img.image_url) thumbnails.push(img.image_url);
    if (img.secondary_image) thumbnails.push(img.secondary_image);
  });
  if (thumbnails.length === 0) thumbnails.push('/media/default.jpg');
  const uniqueThumbnails = [...new Set(thumbnails)];

  const formattedPrice = product.price !== undefined ? new Intl.NumberFormat().format(product.price) : 'N/A';
  const formattedOriginalPrice = product.original_price !== undefined ? new Intl.NumberFormat().format(product.original_price) : null;
  const deliveryDisplayDetail = product.abroad_delivery_days === 14 ? '7-14 business days' : `${product.abroad_delivery_days || '7-14'} business days`;

  const canonicalUrl = product.slug ? `https://tripleastechng.com/product/${product.slug}` : `https://tripleastechng.com/product-details/${product.product_id}`;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image_urls?.large || product.secondary_image_urls?.large || (product.additional_images?.[0]?.image_url) || "https://tripleastechng.com/media/default.jpg",
    "description": product.description || '',
    "sku": String(product.product_id),
    "brand": product.brand || undefined,
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "NGN",
      "price": product.price || 0,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Best Price in Nigeria | Triple A Tech</title>
        <meta name="description" content={`Buy ${product.name} at the best price in Nigeria. Fast delivery and original quality from Triple A Tech.`} />
        <meta name="keywords" content={`Buy ${product.name} Nigeria, ${product.name} price, tech gadgets Nigeria`} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} | Triple A Tech`} />
        <meta property="og:description" content={`Buy ${product.name} at the best price in Nigeria.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={productJsonLd.image} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Triple A Tech`} />
        <meta name="twitter:description" content={`Buy ${product.name} at the best price in Nigeria. Fast delivery.`} />
        <meta name="twitter:image" content={productJsonLd.image} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <div className="product-detail-page-wrapper">
        <div className="product-detail">
          <div className="product-detail-header">
            <div className="klb-single-stock">
              {product.stock > 0 ? (
                <div className="product-stock in-stock"><span>In Stock</span></div>
              ) : (
                <div className="product-stock out-of-stock"><span>Out of Stock</span></div>
              )}
            </div>

            <div className="wishlist-icon1" onClick={toggleWishlist} style={{ cursor: 'pointer' }}>
              <img src={isInWishlist(product.product_id) ? wishlistActiveImg : wishlistImg} alt="Wishlist" className="wishlist-image2" />
            </div>
          </div>

          <div className="product-detail-content">
            <div className="product-detail-images">
              {selectedImage && (
                <img src={selectedImage} alt={product.name} className={`product-detail-image ${isZoomed ? 'zoomed' : ''}`} onClick={() => setIsZoomed(!isZoomed)} />
              )}

              <div className="product-detail-controls">
                {uniqueThumbnails.map((url, i) => (
                  <img
                    key={i}
                    src={url || '/media/default.jpg'}
                    alt={`Thumbnail ${i + 1}`}
                    className={`product-detail-controls-img ${selectedImage === url ? 'active' : ''}`}
                    onClick={() => { setSelectedImage(url || '/media/default.jpg'); setIsZoomed(false); }}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>

            <div className="product-detail-info">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">{product.description}</p>

              {product.is_abroad_order && (
                <div className="abroad-order-detail-message">
                  <p><span role="img" aria-label="airplane">✈️</span> This item is ordered from abroad. Estimated delivery: {deliveryDisplayDetail}.</p>
                </div>
              )}

              <div className="product-price">
                {product.discount ? (
                  <>
                    <span className="discounted-price">₦{formattedPrice}</span>
                    {formattedOriginalPrice && <span className="original-price">₦{formattedOriginalPrice}</span>}
                  </>
                ) : (
                  <p>Price: ₦{formattedPrice}</p>
                )}
              </div>

              <div className="quantity-control">
                <button onClick={handleDecrease} aria-label="Decrease quantity">-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease} aria-label="Increase quantity">+</button>
              </div>

              {stockMessage && <p className="stock-message" style={{ color: 'red' }}>{stockMessage}</p>}

              <button onClick={handleAddToCart} className="button is-primary" disabled={product.stock === 0}>
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button onClick={handleBuyNowOnWhatsApp} className="button is-primary" style={{ marginTop: 10 }}>
                Buy Now on WhatsApp
              </button>
            </div>
          </div>
        </div>

        <PriceAlertModal show={showPriceAlert} onClose={() => setShowPriceAlert(false)} product={product ? { name: product.name } : null} type="price" />
      </div>
    </>
  );
};

export default ProductDetails;
