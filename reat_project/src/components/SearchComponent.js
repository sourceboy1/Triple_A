import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Fetch all products from the API
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/products/');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

const SearchComponent = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data when component mounts
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter products based on search query and selected category
      const filteredResults = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!selectedCategory || product.category === selectedCategory)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products, selectedCategory]);

  const handleSearch = () => {
    // Navigate to search results page
    navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleProductClick = (productId) => {
    // Navigate to product details page
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search ${selectedCategory}...`}
        style={{ width: '100%' }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter key
      />
      <div className="search-results">
        {searchQuery && searchResults.length > 0 ? (
          searchResults.map(result => (
            <div key={result.product_id} className="search-result-item">
              <div 
                className="search-result-link" 
                onClick={() => handleProductClick(result.product_id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="search-result-item-info">
                  <img src={result.image_url} alt={result.name} className="product-image" />
                  <div>{result.name}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;







