import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Get 'category_id' and 'query' from the URL search params
  const categoryId = new URLSearchParams(location.search).get('category_id');
  const query = new URLSearchParams(location.search).get('query');
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // If categoryId is present, filter by category
        const params = categoryId 
          ? { category_id: categoryId }  // Only send the category_id if it's present
          : { query };  // Otherwise, use the search query
        
        const response = await axios.get('http://localhost:8000/api/products/', { params });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [categoryId, query]);

  return (
    <div className="search-results-page">
      <h1>Results</h1>
      <p>Check each product page for other buying options.</p>
      {categoryId ? (
        <h2>Products in Selected Category</h2>
      ) : (
        <h2>Search Results for "{query}"</h2>
      )}
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
