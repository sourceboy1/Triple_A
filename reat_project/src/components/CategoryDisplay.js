import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import api from '../Api';
import './CategoryDisplay.css';

const categories = [
  { id: 1, name: "Accessories for Phones * Tablets" },
  { id: 9, name: "Video Games * Accessories	" },
  { id: 3, name: "Headsets * AirPods * Earbuds	" },
  { id: 8, name: "Watches * Smartwatches" },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CategoryDisplay = () => {
  const [products, setProducts] = useState({});
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          categories.map(category =>
            api.get(`products/?category_id=${category.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
          )
        );

        const productsData = responses.map(response => shuffleArray(response.data).slice(0, 4));
        const productsObject = categories.reduce((acc, category, index) => {
          acc[category.name] = productsData[index];
          return acc;
        }, {});
        setProducts(productsObject);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  // NEW: Handler for navigating to CategoryProductDisplay without a specific category ID
  const handleViewAllCategories = () => {
    navigate('/category-full-display'); // Navigate to the base path for full display
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="category-display">
      {[0, 2].map(rowStartIndex => (
        <div key={rowStartIndex} className="category-row">
          {categories.slice(rowStartIndex, rowStartIndex + 2).map(category => (
            <div key={category.id} className="category-container">
              <h3 className="category-title">{category.name}</h3>
              <div className="product-grid">
                {products[category.name] && products[category.name].map(product => {
                  const mainImage = product.image_urls?.medium || '/media/default.jpg';
                  const secondaryImage = product.secondary_image_urls?.medium || mainImage;
                  return (
                    <div
                      key={product.product_id}
                      className="product-card"
                      onClick={() => handleProductClick(product.product_id)}
                      onMouseEnter={(e) => {
                        const imgEl = e.currentTarget.querySelector('img');
                        imgEl.src = secondaryImage;
                      }}
                      onMouseLeave={(e) => {
                        const imgEl = e.currentTarget.querySelector('img');
                        imgEl.src = mainImage;
                      }}
                    >
                      <img src={mainImage} alt={product.name} className="product-image" />
                      <h4 className="product-title">{product.name}</h4>
                    </div>
                  );
                })}
              </div>
              {/* Removed individual "See More" and "View All Products in Category" links here */}
            </div>
          ))}
        </div>
      ))}
      {/* NEW: Single "View All Categories" button at the bottom */}
      <div className="category-display-footer">
        <button
          className="view-all-categories-btn"
          onClick={handleViewAllCategories}
        >
          View All Categories
        </button>
      </div>
    </div>
  );
};

export default CategoryDisplay;