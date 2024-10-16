import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CategoryDisplay.css'; // Ensure you have this CSS file
import { TokenContext } from './TokenContext';

// Updated to use category IDs
const categories = [
  { id: 8, name: "Accessories", apiUrl: "http://localhost:8000/api/products/?category_id=8" },
  { id: 1, name: "Games", apiUrl: "http://localhost:8000/api/products/?category_id=1" },
  { id: 3, name: "Headphones & Airpods", apiUrl: "http://localhost:8000/api/products/?category_id=3" },
  { id: 6, name: "Watches", apiUrl: "http://localhost:8000/api/products/?category_id=6" },
];

// Function to shuffle the products array
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
            axios.get(`http://localhost:8000/api/products/?category_id=${category.id}`, {  
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
          )
        );
        const productsData = responses.map(response => {
          const shuffledProducts = shuffleArray(response.data);  // Shuffle the products
          return shuffledProducts.slice(0, 4);  // Get 4 random products
        });
        const productsObject = categories.reduce((acc, category, index) => {
          acc[category.name] = productsData[index];
          return acc;
        }, {});
        setProducts(productsObject);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
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
      {categories.map(category => (
        <div key={category.name} className="category-container">
          <h3 className="category-title">{category.name}</h3>
          <div className="product-grid">
            {products[category.name] && products[category.name].map(product => (
              <div 
                key={product.product_id} 
                className="product-card" 
                onClick={() => handleProductClick(product.product_id)} // Navigate on click
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
          <div className="see-more-link" onClick={() => handleViewAll(category.id)}>  
            See More
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryDisplay;
