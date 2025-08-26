import React, { useState, useEffect } from 'react';
import api from '../Api'; // ✅ Centralized API import
import { useNavigate } from 'react-router-dom';

const SearchComponent = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Fetch all products from the API
  const fetchProducts = async () => {
    try {
      const response = await api.get('products/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
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
    navigate(`/search?query=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="search-component">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search ${selectedCategory || 'products'}...`}
        style={{ width: '100%' }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
          searchQuery && <div>No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
