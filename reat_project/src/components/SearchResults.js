import React, { useState, useEffect } from 'react';
import api from '../Api';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';
import Loading from './Loading';
import { getProductDetailsPath } from '../helpers/navigation';

const SearchResults = () => {
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage                = 10;

  const location  = useLocation();
  const navigate  = useNavigate();
  const query     = new URLSearchParams(location.search).get('query');
  const category  = new URLSearchParams(location.search).get('category');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query)    params.query    = query;
        if (category) params.category = category;
        const response = await api.get('products/', { params });
        setResults(response.data);
        setCurrentPage(1);
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

  const indexOfLast    = currentPage * resultsPerPage;
  const indexOfFirst   = indexOfLast - resultsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);
  const totalPages     = Math.ceil(results.length / resultsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  // ── Same navigation pattern as DealsOfTheDay ──
  const handleProductClick = (product) => {
    navigate(getProductDetailsPath(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

  if (loading) return <Loading />;

  return (
    <div className="sr-page">

      {/* ── Header ── */}
      <div className="sr-header">
        <div className="sr-header-inner">
          <div className="sr-breadcrumb">
            <span onClick={() => navigate('/')} className="sr-breadcrumb-home">Home</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            <span>Search Results</span>
          </div>

          <h1 className="sr-title">
            {category && category !== 'All' ? (
              <>Products in <em>"{category}"</em>{query && <> matching <em>"{query}"</em></>}</>
            ) : query ? (
              <>Results for <em>"{query}"</em></>
            ) : (
              'All Products'
            )}
          </h1>

          <p className="sr-count">
            {results.length > 0
              ? `${results.length} product${results.length !== 1 ? 's' : ''} found`
              : 'No products found'}
          </p>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="sr-body">
        {currentResults.length > 0 ? (
          <div className="sr-list">
            {currentResults.map((product) => {
              const image =
                product.image_urls?.large ||
                product.image_urls?.medium ||
                product.image_urls?.small ||
                '/placeholder.png';

              return (
                <div
                  key={product.product_id}
                  className="sr-card"
                  onClick={() => handleProductClick(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleProductClick(product)}
                >
                  {/* Image */}
                  <div className="sr-card-img-wrap">
                    <img
                      src={image}
                      alt={product.name}
                      className="sr-card-img"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="sr-card-info">
                    <span className="sr-card-category">
                      {product.category_name || 'Electronics'}
                    </span>
                    <h2 className="sr-card-name">{product.name}</h2>
                    {product.description && (
                      <p className="sr-card-desc">{product.description}</p>
                    )}
                    <div className="sr-card-footer">
                      <span className="sr-card-price">{formatPrice(product.price)}</span>
                      <button
                        className="sr-card-btn"
                        onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}
                      >
                        View Product
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="sr-empty">
            <div className="sr-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <h3>No products found</h3>
            <p>
              {query
                ? `We couldn't find anything matching "${query}". Try a different search term.`
                : 'Try searching for something above.'}
            </p>
            <button className="sr-empty-btn" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="sr-pagination">
            <button
              className="sr-page-btn sr-page-btn--nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 18l-6-6 6-6"/></svg>
              Prev
            </button>

            <div className="sr-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="sr-page-ellipsis">…</span>
                  ) : (
                    <button
                      key={p}
                      className={`sr-page-btn ${currentPage === p ? 'sr-page-btn--active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              className="sr-page-btn sr-page-btn--nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;