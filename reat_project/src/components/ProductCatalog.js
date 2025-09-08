import React, { useEffect, useState, useContext, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { TokenContext } from './TokenContext';
import api from '../Api';
import './ProductCatalog.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FEATURED_PRODUCT_IDS = [22, 23, 24];

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useCart();
  const accessToken = useContext(TokenContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const sliderRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProducts = async () => {
      try {
        const fetchedProducts = [];
        for (const id of FEATURED_PRODUCT_IDS) {
          try {
            const response = await api.get(`products/${id}/`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            fetchedProducts.push(response.data);
          } catch (err) {
            // ignore 404 errors
          }
        }
        if (isMounted) setProducts(fetchedProducts);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      const cartProduct = {
        product_id: product.product_id,
        name: product.name,
        image_url: product.image_urls?.large || '/placeholder.jpg',
        price: product.price,
        stock: product.stock,
        quantity: 1
      };
      addItemToCart(cartProduct);
    } else {
      alert('Product is out of stock!');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`); // Use navigate instead of window.location.href
  };

  if (loading) return <div className="product-catalog-loading">Loading products...</div>;
  if (error) return <div className="product-catalog-error">Error: {error.message}</div>;
  if (products.length === 0) return <div className="product-catalog-empty">No featured products found.</div>;

  return (
    <div className="product-catalog-page">
      <h1 className="catalog-main-title">All models. Take your pick.</h1>
      <div className="product-slider-wrapper">
        <div className="product-slider" ref={sliderRef}>
          {products.map(product => {
            const productName = product.name;
            const productTagline = product.is_new ? 'NEW' : (product.is_featured ? 'FEATURED' : 'APPLE INTELLIGENCE');

            const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price);

            const mainImage = product.image_urls?.large || product.secondary_image_urls?.large || '/placeholder.jpg';

            return (
              <div
                key={product.product_id}
                className="product-card"
                onClick={() => handleProductClick(product.product_id)} // Correctly calls handleProductClick
              >
                {productTagline && <p className="product-tagline">{productTagline}</p>}
                <h2 className="product-name">{productName}</h2>
                <p className="product-card-price">{formattedPrice}</p>
                <div className="product-image-container">
                  <img
                    src={mainImage}
                    alt={productName}
                    className="product-image"
                    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                  />
                </div>
                <div className="product-details">
                  <button
                    className="add-to-cart-button"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;