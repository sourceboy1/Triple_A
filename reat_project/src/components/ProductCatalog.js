// src/components/ProductCatalog.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useCart } from '../contexts/CartContext';
import { TokenContext } from './TokenContext';
import api from '../Api';
import './ProductCatalog.css';
import { useNavigate } from 'react-router-dom';
import { getProductDetailsPath } from '../helpers/navigation';

const FEATURED_PRODUCT_IDS = [22, 23, 24, 81, 82];

const formatNaira = (price) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const { addItemToCart }       = useCart();
  const accessToken             = useContext(TokenContext);
  const navigate                = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const fetched = [];
        for (const id of FEATURED_PRODUCT_IDS) {
          try {
            const res = await api.get(`products/${id}/`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetched.push(res.data);
          } catch { /* skip 404 */ }
        }
        if (isMounted) setProducts(fetched);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProducts();
    return () => { isMounted = false; };
  }, [accessToken]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addItemToCart({
        product_id: product.product_id,
        name: product.name,
        image_url: product.image_urls?.large || '/placeholder.jpg',
        price: product.price,
        stock: product.stock,
        quantity: 1,
      });
    }
  };

  const handleProductClick = (product) => navigate(getProductDetailsPath(product));

  if (loading) return (
    <div className="pc-loading-screen">
      <div className="pc-spinner" />
      <p>Loading products…</p>
    </div>
  );

  if (error) return (
    <div className="pc-error-screen">
      <span>⚠️</span>
      <p>Something went wrong. Please try again.</p>
    </div>
  );

  if (products.length === 0) return (
    <div className="pc-empty-screen">
      <span>📦</span>
      <p>No featured products found.</p>
    </div>
  );

  return (
    <div className="pc-page">

      {/* ── Hero heading ── */}
      <div className="pc-hero">
        <span className="pc-hero-tag">✦ Featured Collection</span>
        <h1 className="pc-hero-title">All models.<br />Take your pick.</h1>
        <p className="pc-hero-sub">Hand-picked products. Unbeatable quality.</p>
      </div>

      {/* ── Product grid ── */}
      <div className="pc-grid">
        {products.map((product, i) => {
          const mainImg   = product.image_urls?.large || product.secondary_image_urls?.large || '/placeholder.jpg';
          const hoverImg  = product.secondary_image_urls?.large || mainImg;
          const tag       = product.is_new ? 'NEW' : product.is_featured ? 'FEATURED' : null;
          const discount  =
            product.original_price && product.price < product.original_price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : null;
          const isHovered = hoveredId === product.product_id;

          return (
            <div
              key={product.product_id}
              className="pc-card"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => handleProductClick(product)}
              onMouseEnter={() => setHoveredId(product.product_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Badges */}
              <div className="pc-card-badges">
                {tag && <span className="pc-badge pc-badge--tag">{tag}</span>}
                {discount && <span className="pc-badge pc-badge--sale">-{discount}%</span>}
                {product.stock === 0 && <span className="pc-badge pc-badge--out">Sold Out</span>}
              </div>

              {/* Image */}
              <div className="pc-card-img-wrap">
                <img
                  src={isHovered ? hoverImg : mainImg}
                  alt={product.name}
                  className="pc-card-img"
                  onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                />
              </div>

              {/* Info */}
              <div className="pc-card-body">
                <h2 className="pc-card-name">{product.name}</h2>
                <div className="pc-card-pricing">
                  <span className="pc-card-price">{formatNaira(product.price)}</span>
                  {product.original_price && product.price < product.original_price && (
                    <span className="pc-card-original">{formatNaira(product.original_price)}</span>
                  )}
                </div>

                <div className="pc-card-actions">
                  <button
                    className="pc-btn-cart"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? '+ Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    className="pc-btn-view"
                    onClick={() => handleProductClick(product)}
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCatalog;