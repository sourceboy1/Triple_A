import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const category = new URLSearchParams(location.search).get('category');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch filtered results based on the query parameter
        const response = await axios.get('http://localhost:8000/api/products/', {
          params: {
            query,
            category
          }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, category]);

  return (
    <div className="search-results-page">
      <h1>Results</h1>
      <p>Check each product page for other buying options.</p>
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="results-container">
          {results.length > 0 ? (
            results.map(product => (
              <div key={product.product_id} className="result-item">
                <img src={product.image_url} alt={product.name} className="product-image" />
                <div className="result-info">
                  <a href={`/product-details/${product.product_id}`}>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <p className="price">₦{new Intl.NumberFormat().format(product.price)}</p>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;












