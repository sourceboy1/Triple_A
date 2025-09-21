import React, { useState, useEffect } from 'react';
import api from '../Api'; 
import { useLocation, Link } from 'react-router-dom';
import './SearchResults.css';
import Loading from './Loading';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');
  const category = new URLSearchParams(location.search).get('category'); 

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query) {
          params.query = query;
        }
        // Always pass category, even if 'All', so the backend can handle it
        if (category) {
          params.category = category; 
        }

        const response = await api.get('products/', { params });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query, category, location.search]); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="search-results-page">
      <h1>Results</h1>
      <p>Check each product page for other buying options.</p>
      {category && category !== 'All' ? (
        <h2>Products in "{category}" {query && ` for "${query}"`}</h2>
      ) : query ? (
        <h2>Search Results for "{query}" (All Categories)</h2>
      ) : (
        <h2>All Products</h2>
      )}


      <div className="results-container">
        {currentResults.length > 0 ? (
          currentResults.map(product => (
            <div key={product.product_id} className="result-item">
              <img
                src={product.image_urls?.large || product.image_urls?.small || '/placeholder.png'}
                alt={product.name}
                className="product-image"
              />

              <div className="result-info">
                <Link to={`/product-details/${product.product_id}`}>
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">₦{new Intl.NumberFormat().format(product.price)}</p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>
            {query && category && category !== 'All' 
              ? `No products matching "${query}" found in the "${category}" category.`
              : query 
              ? `No products matching "${query}" found.`
              : "No results found."
            }
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default SearchResults;