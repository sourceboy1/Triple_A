import React, { useEffect, useState, useContext, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { TokenContext } from './TokenContext';
import api from '../Api';
import './ProductCatalog.css';

const FEATURED_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useCart();
  const accessToken = useContext(TokenContext);

  const hoverIntervals = useRef({});
  const [hoverImageIndexes, setHoverImageIndexes] = useState({});
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
      Object.values(hoverIntervals.current).forEach(clearInterval);
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
    window.location.href = `/product-details/${productId}`;
  };

  const handleMouseEnter = (productId, images) => {
    if (images.length < 2) return;
    let currentImgIndex = 0;
    hoverIntervals.current[productId] = setInterval(() => {
      currentImgIndex = (currentImgIndex + 1) % images.length;
      setHoverImageIndexes(prev => ({ ...prev, [productId]: currentImgIndex }));
    }, 1000);
  };

  const handleMouseLeave = (productId) => {
    clearInterval(hoverIntervals.current[productId]);
    hoverIntervals.current[productId] = null;
    setHoverImageIndexes(prev => ({ ...prev, [productId]: 0 }));
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
            const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price);

            const images = [
              product.image_urls?.large,
              product.secondary_image_urls?.large,
              product.tertiary_image_urls?.large,
              product.quaternary_image_urls?.large
            ].filter(Boolean);

            const currentImg = images[hoverImageIndexes[product.product_id] || 0] || '/placeholder.jpg';

            return (
              <div
                key={product.product_id}
                className="product-card"
                onClick={() => handleProductClick(product.product_id)}
                onMouseEnter={() => handleMouseEnter(product.product_id, images)}
                onMouseLeave={() => handleMouseLeave(product.product_id)}
              >
                {productTagline && <p className="product-tagline">{productTagline}</p>}
                <h2 className="product-name">{productName}</h2>
                <p className="product-card-price">{formattedPrice}</p>
                <div className="product-image-container">
                  <img
                    src={currentImg}
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
