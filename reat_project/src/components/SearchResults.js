import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';
import Loading from './Loading';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [resultsPerPage] = useState(10);  // Set the number of results per page
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

  // Calculate the current products to show
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate the total number of pages
  const totalPages = Math.ceil(results.length / resultsPerPage);

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
        <Loading />
      ) : (
        <div className="results-container">
          {currentResults.length > 0 ? (
            currentResults.map(product => (
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

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
