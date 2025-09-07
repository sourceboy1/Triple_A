import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import api from '../Api'; // Import your api instance
import './CategoryDisplay.css';

// Define categories once
const categories = [
  { id: 1, name: "Accessories" },
  { id: 9, name: "Games" },
  { id: 3, name: "Headphones & Airpods" },
  { id: 8, name: "Watches" },
];

// Utility to shuffle arrays
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

  const handleViewAll = (categoryId) => {
    navigate(`/search?category_id=${categoryId}`);
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
              <div
                className="see-more-link"
                onClick={() => handleViewAll(category.id)}
              >
                See More
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CategoryDisplay;