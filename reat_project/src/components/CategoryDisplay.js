import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import api from '../Api'; // Import your api instance
import './CategoryDisplay.css';

// Define categories once
const categories = [
  { id: 8, name: "Accessories" },
  { id: 2, name: "Games" },
  { id: 4, name: "Headphones & Airpods" },
  { id: 7, name: "Watches" },
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
                {products[category.name] && products[category.name].map(product => (
                  <div
                    key={product.product_id}
                    className="product-card"
                    onClick={() => handleProductClick(product.product_id)}
                  >
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="product-image" />
                    ) : (
                      <p>No image available</p>
                    )}
                    <h4 className="product-title">{product.name}</h4>
                  </div>
                ))}
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
