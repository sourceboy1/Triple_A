import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import api from '../Api';
import './CategoryDisplay.css'; // Make sure this CSS file is linked

const categories = [
  { id: 1, name: "Accessories for Phones & Tablets" }, // Changed * to & for better display
  { id: 9, name: "Video Games & Accessories" },        // Changed * to & for better display
  { id: 3, name: "Headsets, AirPods & Earbuds" },      // Changed * to & for better display
  { id: 8, name: "Watches & Smartwatches" },           // Changed * to & for better display
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

  const handleViewAllCategories = () => {
    navigate('/category-full-display');
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="category-display">
      {categories.map(category => (
        <div key={category.id} className="category-section">
          <h3 className="category-title">{category.name}</h3>
          <div className="product-row">
            {products[category.name] && products[category.name].map(product => {
              const mainImage = product.image_urls?.medium || '/media/default.jpg';
              const secondaryImage = product.secondary_image_urls?.medium || mainImage;
              return (
                <div
                  key={product.product_id}
                  className="product-card"
                  onClick={() => handleProductClick(product.product_id)}
                  onMouseEnter={(e) => {
                    const imgEl = e.currentTarget.querySelector('.product-image'); // Target specific image
                    if (imgEl) imgEl.src = secondaryImage;
                  }}
                  onMouseLeave={(e) => {
                    const imgEl = e.currentTarget.querySelector('.product-image'); // Target specific image
                    if (imgEl) imgEl.src = mainImage;
                  }}
                >
                  <img src={mainImage} alt={product.name} className="product-image" />
                  <h4 className="product-name">{product.name}</h4>
                  {/* You can add price or other details here if needed */}
                </div>
              );
            })}
          </div>
        </div>
      ))}
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