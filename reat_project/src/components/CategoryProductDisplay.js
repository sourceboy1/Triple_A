// src/components/CategoryProductDisplay.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import api from "../Api";
import { getProductDetailsPath } from "../helpers/navigation";
import "./CategoryProductDisplay.css";

const allCategories = [
  { id: 8,  name: "Watches & Smartwatches",          icon: "⌚" },
  { id: 9,  name: "Video Games & Accessories",        icon: "🎮" },
  { id: 16, name: "Software & Server Services",       icon: "💿" },
  { id: 7,  name: "Powerbanks",                       icon: "🔋" },
  { id: 2,  name: "Phones & Tablets",                 icon: "📱" },
  { id: 4,  name: "Laptops/Computers & Accessories",  icon: "💻" },
  { id: 3,  name: "AirPods/Earbuds & Headsets",       icon: "🎧" },
  { id: 14, name: "Electronics",                      icon: "⚡" },
  { id: 6,  name: "Screen Protector/Guard & Cases",   icon: "🛡️" },
  { id: 1,  name: "Accessories for Phones & Tablets", icon: "🔌" },
  { id: 15, name: "Accessories for Electronics",      icon: "🔧" },
  { id: 17, name: "Cameras & Photography",            icon: "📷" },
  { id: 18, name: "Home Appliances",                  icon: "🏠" },
  { id: 19, name: "Networking Devices",               icon: "📡" },
  { id: 20, name: "Drones & Accessories",             icon: "🚁" },
];

const formatPriceInNaira = (price) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);

const CategoryProductDisplay = () => {
  const [products, setProducts]               = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const accessToken  = useContext(TokenContext);
  const navigate     = useNavigate();
  const [searchParams] = useSearchParams();

  /* ── read category_id from URL on mount ── */
  useEffect(() => {
    const urlCatId = searchParams.get("category_id");
    if (urlCatId) setSelectedCategoryId(Number(urlCatId));
    else if (allCategories.length > 0) setSelectedCategoryId(allCategories[0].id);
  }, [searchParams]);

  /* ── fetch products ── */
  useEffect(() => {
    if (!accessToken) return;

    const fetchAllCategoryProducts = async () => {
      setLoadingProducts(true);
      try {
        const responses = await Promise.all(
          allCategories.map((cat) =>
            api.get(`products/?category_id=${cat.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
          )
        );

        const productsObject = allCategories.reduce((acc, cat, idx) => {
          const arr      = Array.isArray(responses[idx].data) ? responses[idx].data : [];
          acc[cat.id]    = arr.filter((p) => Number(p.category_id) === Number(cat.id));
          return acc;
        }, {});

        setProducts(productsObject);
      } catch {
        setProducts({});
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchAllCategoryProducts();
  }, [accessToken]);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    setSidebarOpen(false);
  };

  const handleProductClick = (product) => navigate(getProductDetailsPath(product));

  const selectedCategory     = allCategories.find((c) => c.id === selectedCategoryId);
  const selectedCategoryName = selectedCategory?.name || "All Products";
  const displayedProducts    = selectedCategoryId ? products[selectedCategoryId] || [] : [];

  return (
    <div className="cpd-wrapper">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="cpd-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile top bar ── */}
      <div className="cpd-mobile-bar">
        <button className="cpd-menu-btn" onClick={() => setSidebarOpen(true)}>
          <span /><span /><span />
        </button>
        <span className="cpd-mobile-title">{selectedCategoryName}</span>
      </div>

      <div className="cpd-layout">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className={`cpd-sidebar ${sidebarOpen ? "cpd-sidebar--open" : ""}`}>
          <div className="cpd-sidebar-header">
            <h2>Shop by<br /><span>Category</span></h2>
            <button className="cpd-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <ul className="cpd-cat-list">
            {allCategories.map((cat) => (
              <li key={cat.id}>
                <button
                  className={`cpd-cat-btn ${selectedCategoryId === cat.id ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="cpd-cat-icon">{cat.icon}</span>
                  <span className="cpd-cat-name">{cat.name}</span>
                  {products[cat.id]?.length > 0 && (
                    <span className="cpd-cat-count">{products[cat.id].length}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="cpd-main">

          {/* Header */}
          <div className="cpd-main-header">
            <div>
              <p className="cpd-breadcrumb">Shop / <span>{selectedCategoryName}</span></p>
              <h1 className="cpd-main-title">{selectedCategoryName}</h1>
            </div>
            {!loadingProducts && (
              <span className="cpd-product-count">
                {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Grid */}
          {loadingProducts ? (
            <div className="cpd-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="cpd-skeleton-card">
                  <div className="cpd-skeleton-img" />
                  <div className="cpd-skeleton-line cpd-skeleton-line--lg" />
                  <div className="cpd-skeleton-line cpd-skeleton-line--sm" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="cpd-product-grid">
              {displayedProducts.map((product) => {
                const mainImg =
                  product.image_urls?.medium ||
                  product.secondary_image_urls?.medium ||
                  "/media/default.jpg";
                const hoverImg =
                  product.secondary_image_urls?.medium || mainImg;
                const discount =
                  product.original_price && product.price < product.original_price
                    ? Math.round(
                        ((product.original_price - product.price) /
                          product.original_price) *
                          100
                      )
                    : null;

                return (
                  <div
                    key={product.product_id}
                    className="cpd-card"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={(e) => {
                      const img = e.currentTarget.querySelector(".cpd-card-img");
                      if (img) img.src = hoverImg;
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector(".cpd-card-img");
                      if (img) img.src = mainImg;
                    }}
                  >
                    {/* Badges */}
                    <div className="cpd-card-badges">
                      {product.is_new && <span className="cpd-badge cpd-badge--new">New</span>}
                      {discount && (
                        <span className="cpd-badge cpd-badge--sale">-{discount}%</span>
                      )}
                      {product.stock === 0 && (
                        <span className="cpd-badge cpd-badge--out">Out of stock</span>
                      )}
                    </div>

                    {/* Image */}
                    <div className="cpd-card-img-wrap">
                      <img
                        src={mainImg}
                        alt={product.name}
                        className="cpd-card-img"
                        onError={(e) => { e.target.src = "/media/default.jpg"; }}
                      />
                    </div>

                    {/* Info */}
                    <div className="cpd-card-body">
                      <p className="cpd-card-category">{selectedCategoryName}</p>
                      <h3 className="cpd-card-name">{product.name}</h3>
                      <div className="cpd-card-pricing">
                        <span className="cpd-card-price">
                          {formatPriceInNaira(parseFloat(product.price))}
                        </span>
                        {product.original_price && product.price < product.original_price && (
                          <span className="cpd-card-original">
                            {formatPriceInNaira(parseFloat(product.original_price))}
                          </span>
                        )}
                      </div>
                      <button className="cpd-card-btn">View Product →</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cpd-empty">
              <div className="cpd-empty-icon">📦</div>
              <h3>No products found</h3>
              <p>We're restocking this category soon. Check back later!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryProductDisplay;