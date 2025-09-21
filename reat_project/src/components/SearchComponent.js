// This component's logic is already quite close to what's needed for category-specific search.
// If this is not intended to be the Navbar's search, then no changes are strictly necessary here
// based on the initial request.
import React, { useState, useEffect } from 'react';
import api from '../Api'; // ✅ Centralized API import
import { useNavigate } from 'react-router-dom';

const SearchComponent = ({ selectedCategory }) => { // Assuming selectedCategory is passed as a prop
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Fetch all products from the API
  const fetchProducts = async () => {
    try {
      const response = await api.get('products/'); // Removed 'params' here as it's for all products
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
        (selectedCategory === 'All' || !selectedCategory || product.category_name === selectedCategory) // Adjusted logic for 'All'
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
        placeholder={`Search ${selectedCategory !== 'All' ? selectedCategory : 'products'}...`}
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
                  {/* You need to ensure result.image_url exists in your product data */}
                  <img src={result.image_url || '/placeholder.png'} alt={result.name} className="product-image" />
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