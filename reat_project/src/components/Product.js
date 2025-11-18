// src/components/Product.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { useCart } from '../contexts/CartContext';
import PriceAlertModal from './PriceAlertModal';
import { getProductDetailsPath } from '../helpers/navigation';
import './Styling.css';

const Product = ({ product_id, slug, name, description, price, image_urls, stock, is_abroad_order, abroad_delivery_days }) => {
  const { addItemToCart } = useCart();
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  const formattedPrice = price ? new Intl.NumberFormat().format(price) : 'N/A';
  const imageUrl = image_urls?.large || "/media/default.jpg";

  const handleAddToCart = () => {
    if (stock > 0) {
      addItemToCart({
        product_id,
        name,
        description,
        price,
        image_url: imageUrl,
        stock,
        is_abroad_order,
        abroad_delivery_days
      });
      setShowPriceAlert(true);
    } else {
      alert("Product is out of stock!");
    }
  };

  const deliveryDisplay =
    abroad_delivery_days === 14
      ? "7-14 days"
      : `${abroad_delivery_days || 14} days`;

  // 🔥 USE UNIVERSAL HELPER
  const productPath = getProductDetailsPath({ slug, product_id });

  return (
    <>
      <Helmet>
        <title>{name} | Best Price in Nigeria | Triple A Tech</title>
        <meta
          name="description"
          content={`Buy ${name} at the best price in Nigeria. Fast delivery and quality products from Triple A Tech.`}
        />
        <meta
          name="keywords"
          content={`${name}, buy ${name} in Nigeria, ${name} price in Nigeria, phone accessories Nigeria`}
        />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${name}",
            "image": "${imageUrl}",
            "description": "${description}",
            "sku": "${product_id}",
            "offers": {
              "@type": "Offer",
              "url": "https://tripleastechng.com${productPath}",
              "priceCurrency": "NGN",
              "price": "${price}",
              "availability": "${stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}"
            }
          }
          `}
        </script>
      </Helmet>

      <div className="product-card">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="product-image" />
        ) : (
          <p>No image available</p>
        )}

        <h2 className="product-title">
          <Link to={productPath}>{name}</Link>
        </h2>

        <p className="product-description">{description}</p>

        {is_abroad_order && (
          <div className="abroad-order-tag">
            🌍 Order from Abroad (~{deliveryDisplay})
          </div>
        )}

        <p className="product-price">₦{formattedPrice}</p>

        <button
          className="button is-primary"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>

        <PriceAlertModal
          show={showPriceAlert}
          onClose={() => setShowPriceAlert(false)}
          product={{ name }}
          type="product"
        />
      </div>
    </>
  );
};

export default Product;
