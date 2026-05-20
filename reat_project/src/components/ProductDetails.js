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

const formatNaira = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(n);

const ProductDetails = () => {
  const { slug }   = useParams();
  const productId  = slug;
  const navigate   = useNavigate();

  const [product, setProduct]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity]           = useState(1);
  const [stockMsg, setStockMsg]           = useState('');
  const [isZoomed, setIsZoomed]           = useState(false);
  const [showAlert, setShowAlert]         = useState(false);
  const [activeTab, setActiveTab]         = useState('description');

  const { addItemToCart }                                      = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist }    = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) { setError('Product ID missing.'); setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const res  = await api.get(`products/${productId}/`);
        const data = res.data;
        const mainImg =
          data.image_urls?.large ||
          data.secondary_image_urls?.large ||
          data.additional_images?.[0]?.image_urls?.large ||
          '/media/default.jpg';
        setSelectedImage(mainImg);
        setProduct(data);
        saveRecentlyViewed(data, mainImg);
        if (data.slug && !isNaN(Number(productId))) {
          navigate(`/product/${data.slug}`, { replace: true });
        }
      } catch (err) {
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [productId]);

  const saveRecentlyViewed = (data, img) => {
    let viewed = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    viewed     = viewed.filter((p) => p.product_id !== data.product_id);
    viewed.unshift({ product_id: data.product_id, slug: data.slug, name: data.name, image_url: img, price: data.price });
    if (viewed.length > 20) viewed = viewed.slice(0, 20);
    localStorage.setItem('viewedProducts', JSON.stringify(viewed));
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) { setQuantity((q) => q + 1); setStockMsg(''); }
    else setStockMsg(`Max stock: ${product?.stock}`);
  };

  const handleDecrease = () => { if (quantity > 1) { setQuantity((q) => q - 1); setStockMsg(''); } };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > 0 && quantity <= product.stock) {
      addItemToCart({
        product_id: product.product_id,
        name: product.name,
        image_url: selectedImage,
        price: product.price,
        stock: product.stock,
        quantity,
        is_abroad_order: product.is_abroad_order,
        abroad_delivery_days: product.abroad_delivery_days,
      });
      setStockMsg('');
      setShowAlert(true);
    } else if (product.stock === 0) {
      setStockMsg('This item is currently out of stock.');
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    isInWishlist(product.product_id) ? removeFromWishlist(product.product_id) : addToWishlist(product);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const days = product.abroad_delivery_days === 14 ? '7-14' : (product.abroad_delivery_days || '7-14');
    let msg    = `Hello, I'm interested in buying ${product.name}.`;
    if (product.is_abroad_order) msg += ` This is an abroad order item with estimated delivery of ${days} business days.`;
    msg += ` Please provide more details.`;
    window.open(`https://wa.me/2348034593459?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* ── States ── */
  if (loading) return (
    <div className="pd-state-screen">
      <div className="pd-spinner" />
      <p>Loading product…</p>
    </div>
  );

  if (error) return (
    <div className="pd-state-screen pd-state-screen--error">
      <span>⚠️</span><p>{error}</p>
    </div>
  );

  if (!product) return (
    <div className="pd-state-screen">
      <span>📦</span><p>Product not found.</p>
    </div>
  );

  /* ── Thumbnails ── */
  const thumbs = [];
  if (product.image_urls?.large)           thumbs.push(product.image_urls.large);
  if (product.secondary_image_urls?.large) thumbs.push(product.secondary_image_urls.large);

  // ✅ FIXED: use correct serializer field names for all 4 image slots
  product.additional_images?.forEach((img) => {
    if (img.image_urls?.large)            thumbs.push(img.image_urls.large);
    if (img.secondary_image_urls?.large)  thumbs.push(img.secondary_image_urls.large);
    if (img.tertiary_image_urls?.large)   thumbs.push(img.tertiary_image_urls.large);
    if (img.quaternary_image_urls?.large) thumbs.push(img.quaternary_image_urls.large);
  });

  if (!thumbs.length) thumbs.push('/media/default.jpg');
  const uniqueThumbs = [...new Set(thumbs)];

  const discount = product.original_price && product.price < product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const inWishlist   = isInWishlist(product.product_id);
  const deliveryDays = product.abroad_delivery_days === 14 ? '7–14' : (product.abroad_delivery_days || '7–14');
  const canonicalUrl = product.slug
    ? `https://tripleastechng.com/product/${product.slug}`
    : `https://tripleastechng.com/product-details/${product.product_id}`;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image_urls?.large || '/media/default.jpg',
    description: product.description || '',
    sku: String(product.product_id),
    brand: product.brand || undefined,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "NGN",
      price: product.price || 0,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Best Price in Nigeria | Triple A Tech</title>
        <meta name="description" content={`Buy ${product.name} at the best price in Nigeria.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title"       content={`${product.name} | Triple A Tech`} />
        <meta property="og:description" content={`Buy ${product.name} at the best price in Nigeria.`} />
        <meta property="og:url"         content={canonicalUrl} />
        <meta property="og:type"        content="product" />
        <meta property="og:image"       content={productJsonLd.image} />
        <meta name="twitter:card"       content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      </Helmet>

      <div className="pd-page">

        {/* ── Back button ── */}
        <button className="pd-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="pd-container">

          {/* ══════════ LEFT — Images ══════════ */}
          <div className="pd-images-col">

            {/* Main image */}
            <div
              className={`pd-main-img-wrap ${isZoomed ? 'pd-main-img-wrap--zoomed' : ''}`}
              onClick={() => setIsZoomed((z) => !z)}
            >
              {product.stock === 0 && <div className="pd-sold-out-ribbon">Sold Out</div>}
              {discount && <div className="pd-discount-badge">-{discount}%</div>}
              <img
                src={selectedImage}
                alt={product.name}
                className="pd-main-img"
                onError={(e) => { e.target.src = '/media/default.jpg'; }}
              />
              <span className="pd-zoom-hint">{isZoomed ? 'Click to zoom out' : '🔍 Click to zoom'}</span>
            </div>

            {/* Thumbnails */}
            {uniqueThumbs.length > 1 && (
              <div className="pd-thumbs">
                {uniqueThumbs.map((url, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${selectedImage === url ? 'pd-thumb--active' : ''}`}
                    onClick={() => { setSelectedImage(url); setIsZoomed(false); }}
                  >
                    <img
                      src={url}
                      alt={`View ${i + 1}`}
                      onError={(e) => { e.target.src = '/media/default.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══════════ RIGHT — Info ══════════ */}
          <div className="pd-info-col">

            {/* Top row: stock + wishlist */}
            <div className="pd-top-row">
              <span className={`pd-stock-tag ${product.stock > 0 ? 'pd-stock-tag--in' : 'pd-stock-tag--out'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✕ Out of Stock'}
              </span>
              <button className="pd-wishlist-btn" onClick={toggleWishlist} aria-label="Toggle wishlist">
                <img src={inWishlist ? wishlistActiveImg : wishlistImg} alt="Wishlist" />
              </button>
            </div>

            {/* Name */}
            <h1 className="pd-product-name">{product.name}</h1>

            {/* Rating placeholder */}
            <div className="pd-rating">
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
              <span className="pd-rating-count">Featured Product</span>
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <span className="pd-price">{formatNaira(product.price)}</span>
              {product.original_price && product.price < product.original_price && (
                <>
                  <span className="pd-original-price">{formatNaira(product.original_price)}</span>
                  <span className="pd-you-save">You save {formatNaira(product.original_price - product.price)}</span>
                </>
              )}
            </div>

            {/* Abroad tag */}
            {product.is_abroad_order && (
              <div className="pd-abroad-tag">
                <span>✈️</span>
                <p>Abroad order — estimated delivery <strong>{deliveryDays} business days</strong></p>
              </div>
            )}

            {/* Quantity */}
            <div className="pd-quantity-row">
              <span className="pd-quantity-label">Quantity</span>
              <div className="pd-quantity-ctrl">
                <button onClick={handleDecrease} aria-label="Decrease">−</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease} aria-label="Increase">+</button>
              </div>
            </div>

            {stockMsg && <p className="pd-stock-msg">{stockMsg}</p>}

            {/* Actions */}
            <div className="pd-actions">
              <button
                className="pd-btn pd-btn--cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
              </button>
              <button className="pd-btn pd-btn--whatsapp" onClick={handleWhatsApp}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Buy on WhatsApp
              </button>
            </div>

            {/* Tabs */}
            <div className="pd-tabs">
              <div className="pd-tab-nav">
                {['description', 'details'].map((tab) => (
                  <button
                    key={tab}
                    className={`pd-tab-btn ${activeTab === tab ? 'pd-tab-btn--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="pd-tab-content">
                {activeTab === 'description' && (
                  <p className="pd-description">
                    {product.description || 'No description available for this product.'}
                  </p>
                )}
                {activeTab === 'details' && (
                  <ul className="pd-details-list">
                    <li><span>Product ID</span><span>{product.product_id}</span></li>
                    {product.brand && <li><span>Brand</span><span>{product.brand}</span></li>}
                    <li><span>Stock</span><span>{product.stock} units</span></li>
                    {product.is_abroad_order && (
                      <li><span>Delivery</span><span>{deliveryDays} business days</span></li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceAlertModal
        show={showAlert}
        onClose={() => setShowAlert(false)}
        product={product ? { name: product.name } : null}
        type="price"
      />
    </>
  );
};

export default ProductDetails;