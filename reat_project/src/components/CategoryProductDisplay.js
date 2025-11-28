// src/components/CategoryProductDisplay.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import api from "../Api";
import { getProductDetailsPath } from "../helpers/navigation";
import "./CategoryProductDisplay.css";

const allCategories = [
  { id: 8, name: "Watches & Smartwatches" },
  { id: 9, name: "Video Games & Accessories" },
  { id: 16, name: "Software & Server Services" },
  { id: 7, name: "Powerbanks" },
  { id: 2, name: "Phones & Tablets" },
  { id: 4, name: "Laptops/Computers & Accessories" },
  { id: 3, name: "AirPods/Earbuds & Headsets" },
  { id: 14, name: "Electronics" },
  { id: 6, name: "Screen Protector/Guard & Cases" },
  { id: 1, name: "Accessories for Phones & Tablets" },
  { id: 15, name: "Accessories for Electronics" },
  { id: 17, name: "Cameras & Photography" },
  { id: 18, name: "Home Appliances" },
  { id: 19, name: "Networking Devices" },
  { id: 20, name: "Drones & Accessories" },
];

const CategoryProductDisplay = () => {
  const [products, setProducts] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const accessToken = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategoryProducts = async () => {
      setLoadingProducts(true);
      try {
        const responses = await Promise.all(
          allCategories.map((category) =>
            api.get(`products/?category_id=${category.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
          )
        );

        const productsObject = allCategories.reduce((acc, category, index) => {
          const arr = Array.isArray(responses[index].data) ? responses[index].data : [];
          // Strict filter using category_id from serializer
          const filtered = arr
            .filter((p) => Number(p.category_id) === Number(category.id))
            .slice(0, 4); // max 4 per category
          acc[category.id] = filtered;
          return acc;
        }, {});

        setProducts(productsObject);
        if (allCategories.length > 0) setSelectedCategoryId(allCategories[0].id);
      } catch {
        setProducts({});
      } finally {
        setLoadingProducts(false);
      }
    };

    if (accessToken) fetchAllCategoryProducts();
  }, [accessToken]);

  const handleCategoryClick = (id) => setSelectedCategoryId(id);
  const handleProductClick = (product) => navigate(getProductDetailsPath(product));

  const selectedCategoryName =
    allCategories.find((cat) => cat.id === selectedCategoryId)?.name || "All Products";

  const displayedProducts = selectedCategoryId ? products[selectedCategoryId] || [] : Object.values(products).flat();

  const formatPriceInNaira = (price) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 2 }).format(price);

  return (
    <div className="cpd-main-layout">
      <aside className="cpd-sidebar">
        <h2>Categories</h2>
        <ul className="cpd-category-list">
          {allCategories.map((category) => (
            <li
              key={category.id}
              className={`cpd-category-item ${selectedCategoryId === category.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="cpd-content-area">
        <h2 className="cpd-content-title">{selectedCategoryName}</h2>
        {loadingProducts ? (
          <div className="cpd-loading-spinner"></div>
        ) : (
          <div className="cpd-product-scroll-container">
            <div className="cpd-product-grid">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => {
                  const mainImage = product.image_urls?.medium || "/media/default.jpg";
                  const secondaryImage = product.secondary_image_urls?.medium || mainImage;

                  return (
                    <div
                      key={product.product_id}
                      className="cpd-product-card"
                      onClick={() => handleProductClick(product)}
                      onMouseEnter={(e) => {
                        const imgEl = e.currentTarget.querySelector("img");
                        if (imgEl) imgEl.src = secondaryImage;
                      }}
                      onMouseLeave={(e) => {
                        const imgEl = e.currentTarget.querySelector("img");
                        if (imgEl) imgEl.src = mainImage;
                      }}
                    >
                      <img src={mainImage} alt={product.name} className="cpd-product-image" />
                      <h4 className="cpd-product-title">{product.name}</h4>
                      <p className="cpd-product-price">{formatPriceInNaira(parseFloat(product.price))}</p>
                    </div>
                  );
                })
              ) : (
                <p className="cpd-no-products">No products found in this category.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryProductDisplay;
