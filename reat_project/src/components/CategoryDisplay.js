// src/components/CategoryDisplay.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import api from "../Api";
import { getProductDetailsPath } from "../helpers/navigation";
import "./CategoryDisplay.css";

const categories = [
  { id: 1, name: "Accessories for Phones & Tablets", icon: "🔌" },
  { id: 9, name: "Video Games & Accessories",        icon: "🎮" },
  { id: 3, name: "AirPods/Earbuds & Headsets",       icon: "🎧" },
  { id: 8, name: "Watches & Smartwatches",           icon: "⌚" },
];

const CategoryDisplay = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();
  const accessToken             = useContext(TokenContext);

  useEffect(() => {
    let mounted = true;

    const fetchProductsForCategory = async (category) => {
      try {
        const res = await api.get(`products/?category_id=${category.id}`);
        const arr = Array.isArray(res.data) ? res.data : [];
        return arr.filter((p) => {
          const pid = p.category_id ?? p.category?.category_id ?? p.category?.id ?? null;
          return pid !== null && Number(pid) === Number(category.id);
        });
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
        const mapped  = {};
        categories.forEach((cat, idx) => {
          const items = results[idx] || [];
          const uniq  = [];
          for (const p of items) {
            if (!usedIds.has(p.product_id)) {
              uniq.push(p);
              usedIds.add(p.product_id);
            }
            if (uniq.length >= 4) break;
          }
          mapped[cat.name] = uniq.slice(0, 4);
        });
        if (mounted) { setProducts(mapped); setLoading(false); }
      } catch {
        if (mounted) { setError("Failed to load categories."); setLoading(false); }
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, []);

  const handleViewAll      = () => navigate("/category-full-display");
  const handleProductClick = (product) => navigate(getProductDetailsPath(product));
  const handleCategoryClick = (catId) => navigate(`/category-full-display?category_id=${catId}`);

  if (loading) return (
    <div className="cd-loading">
      <div className="cd-spinner" />
      <p>Loading categories…</p>
    </div>
  );

  if (error) return <div className="cd-error"><span>⚠️</span><p>{error}</p></div>;

  return (
    <div className="cd-wrapper">

      {/* ── Section header ── */}
      <div className="cd-header">
        <div>
          <span className="cd-header-tag">✦ Browse</span>
          <h2 className="cd-header-title">Shop by Category</h2>
        </div>
        <button className="cd-view-all-btn" onClick={handleViewAll}>
          View All →
        </button>
      </div>

      {/* ── Category sections ── */}
      {categories.map((category) => {
        const catProducts = products[category.name] || [];
        return (
          <div key={category.id} className="cd-category-section">

            {/* Category row header */}
            <div className="cd-cat-header">
              <div className="cd-cat-title-wrap">
                <span className="cd-cat-icon">{category.icon}</span>
                <h3 className="cd-cat-title">{category.name}</h3>
              </div>
              <button
                className="cd-cat-see-more"
                onClick={() => handleCategoryClick(category.id)}
              >
                See all →
              </button>
            </div>

            {/* Product cards */}
            <div className="cd-product-row">
              {catProducts.length > 0 ? (
                catProducts.map((product) => {
                  const mainImg      = product.image_urls?.medium || "/media/default.jpg";
                  const secondaryImg = product.secondary_image_urls?.medium || mainImg;
                  const formattedPrice = product.price
                    ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(product.price)
                    : null;

                  return (
                    <div
                      key={product.product_id}
                      className="cd-product-card"
                      onClick={() => handleProductClick(product)}
                      onMouseEnter={(e) => {
                        const img = e.currentTarget.querySelector(".cd-product-img");
                        if (img) img.src = secondaryImg;
                      }}
                      onMouseLeave={(e) => {
                        const img = e.currentTarget.querySelector(".cd-product-img");
                        if (img) img.src = mainImg;
                      }}
                    >
                      {product.is_new && <span className="cd-badge">New</span>}
                      <div className="cd-product-img-wrap">
                        <img
                          src={mainImg}
                          alt={product.name}
                          className="cd-product-img"
                          onError={(e) => { e.target.src = "/media/default.jpg"; }}
                        />
                      </div>
                      <div className="cd-product-info">
                        <h4 className="cd-product-name">{product.name}</h4>
                        {formattedPrice && (
                          <p className="cd-product-price">{formattedPrice}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="cd-no-products">No products available yet.</p>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Footer CTA ── */}
      <div className="cd-footer">
        <button className="cd-footer-btn" onClick={handleViewAll}>
          Explore All Categories →
        </button>
      </div>
    </div>
  );
};

export default CategoryDisplay;