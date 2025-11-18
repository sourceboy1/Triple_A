// src/components/ShopCategoryPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../Api"; // capital A
import { getProductDetailsPath } from "../helpers/navigation";
import "./ShopCategoryPage.css";

export default function ShopCategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const encodedSlug = encodeURIComponent(categorySlug);
        const res = await Api.get(`products/?category=${encodedSlug}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
        setCurrentPage(1); // reset to first page when category changes
      }
    }

    if (categorySlug) fetchProducts();
  }, [categorySlug]);

  const formatPrice = (price) => {
    if (!price) return "";
    return `₦${Number(price).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <p className="loading">Loading products...</p>;
  if (error) return <p className="error">Error loading products.</p>;
  if (!products.length) return <p className="no-products">No products found in this category.</p>;

  return (
    <div className="shop-category-page">
      <h2 className="category-title">{categorySlug.replace(/-/g, " ")}</h2>
      
      <div className="products-grid">
        {paginatedProducts.map((product) => (
          <Link
            key={product.product_id}
            to={getProductDetailsPath(product)}
            className="product-card-link"
          >
            <div className="product-card">
              <div className="product-image">
                <img
                  src={product.image_urls?.medium ?? product.image}
                  alt={product.name}
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
