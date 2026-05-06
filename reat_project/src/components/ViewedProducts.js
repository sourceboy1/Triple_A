// src/components/ViewedProducts.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductDetailsPath } from '../helpers/navigation';
import './ViewedProducts.css';

const ViewedProducts = () => {
  const [viewedProducts, setViewedProducts] = useState([]);

  const loadViewedProducts = () => {
    const saved = localStorage.getItem('viewedProducts');
    setViewedProducts(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    loadViewedProducts();

    const handleStorageChange = (e) => {
      if (e.key === 'viewedProducts') loadViewedProducts();
    };

    window.addEventListener('viewedProductsUpdated', loadViewedProducts);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('viewedProductsUpdated', loadViewedProducts);
    };
  }, []);

  if (viewedProducts.length === 0) return null;

  const formatNaira = (price) =>
    price
      ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price)
      : null;

  return (
    <div className="vp-wrapper">

      {/* Header */}
      <div className="vp-header">
        <div>
          <span className="vp-header-tag">✦ Your History</span>
          <h2 className="vp-header-title">Recently Viewed</h2>
        </div>
        <span className="vp-count">{viewedProducts.length} item{viewedProducts.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Scrollable track */}
      <div className="vp-track">
        {viewedProducts.map((product, index) => {
          const price = formatNaira(product.price);
          return (
            <Link
              key={index}
              to={getProductDetailsPath(product)}
              className="vp-card"
            >
              <div className="vp-img-wrap">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="vp-img"
                  onError={(e) => { e.target.src = '/media/default.jpg'; }}
                />
              </div>
              <div className="vp-info">
                <p className="vp-name">{product.name}</p>
                {price && <p className="vp-price">{price}</p>}
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

export default ViewedProducts;