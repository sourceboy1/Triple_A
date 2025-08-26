import React, { useState, useEffect } from 'react';
import api from '../Api'; // ✅ Centralized API import
import { useLocation } from 'react-router-dom';
import './SearchResults.css';
import Loading from './Loading';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const location = useLocation();

  const categoryId = new URLSearchParams(location.search).get('category_id');
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = categoryId ? { category_id: categoryId } : { query };
        const response = await api.get('products/', { params });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [categoryId, query, location.search]);

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
      {categoryId ? (
        <h2>Products in Selected Category</h2>
      ) : (
        <h2>Search Results for "{query}"</h2>
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
