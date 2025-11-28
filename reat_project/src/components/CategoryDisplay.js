// src/components/CategoryDisplay.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import api from "../Api"; // your axios instance
import { getProductDetailsPath } from "../helpers/navigation";
import "./CategoryDisplay.css";

const categories = [
  { id: 1, name: "Accessories for Phones & Tablets" },
  { id: 9, name: "Video Games & Accessories" },
  { id: 3, name: "AirPods/Earbuds & Headsets" },
  { id: 8, name: "Watches & Smartwatches" },
];

const CategoryDisplay = () => {
  const [products, setProducts] = useState({}); // { [categoryName]: [product,...] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    let mounted = true;

    const fetchProductsForCategory = async (category) => {
      const path = `products/?category_id=${category.id}`;
      try {
        const res = await api.get(path);
        const arr = Array.isArray(res.data) ? res.data : [];
        const filtered = arr.filter((p) => {
          const pid = p.category_id ?? p.category?.category_id ?? p.category?.id ?? null;
          return pid !== null && Number(pid) === Number(category.id);
        });
        return filtered;
      } catch {
        return [];
      }
    };

    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(categories.map((c) => fetchProductsForCategory(c)));

        const usedIds = new Set();
        const mapped = {};
        categories.forEach((cat, idx) => {
          const items = results[idx] || [];
          const uniq = [];
          for (const p of items) {
            if (!usedIds.has(p.product_id)) {
              uniq.push(p);
              usedIds.add(p.product_id);
            }
            if (uniq.length >= 4) break;
          }
          mapped[cat.name] = uniq.slice(0, 4);
        });

        if (mounted) {
          setProducts(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load categories. Check console for details.");
          setLoading(false);
        }
      }
    };

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const handleViewAllCategories = () => navigate("/category-full-display");
  const handleProductClick = (product) => navigate(getProductDetailsPath(product));

  if (loading) return <div className="category-loading">Loading categories...</div>;
  if (error) return <div className="category-error">{error}</div>;

  return (
    <div className="category-display">
      {categories.map((category) => (
        <div key={category.id} className="category-section">
          <h3 className="category-title">{category.name}</h3>

          <div className="product-row">
            {products[category.name] && products[category.name].length > 0 ? (
              products[category.name].map((product) => {
                const mainImage = product.image_urls?.medium || "/media/default.jpg";
                const secondaryImage = product.secondary_image_urls?.medium || mainImage;

                return (
                  <div
                    key={product.product_id}
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={(e) => {
                      const img = e.currentTarget.querySelector(".product-image");
                      if (img) img.src = secondaryImage;
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector(".product-image");
                      if (img) img.src = mainImage;
                    }}
                  >
                    <img src={mainImage} alt={product.name} className="product-image" />
                    <h4 className="product-name">{product.name}</h4>
                  </div>
                );
              })
            ) : (
              <p className="no-products">No products found in this category.</p>
            )}
          </div>
        </div>
      ))}

      <div className="category-display-footer">
        <button className="view-all-categories-btn" onClick={handleViewAllCategories}>
          View All Categories
        </button>
      </div>
    </div>
  );
};

export default CategoryDisplay;
