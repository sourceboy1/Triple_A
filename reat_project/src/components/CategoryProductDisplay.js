import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import api from "../Api";
import "./CategoryProductDisplay.css";
// Import icons for scrolling (you might need to install react-icons or use simple text)
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const allCategories = [
  { id: 8, name: "Watches * Smartwatches" },
  { id: 9, name: "Video Games * Accessories" },
  { id: 16, name: "Software * Server Services" },
  { id: 7, name: "Powerbanks" },
  { id: 2, name: "Phones * Tablets" },
  { id: 4, name: "Laptops * Computers" },
  { id: 3, name: "Headsets * AirPods * Earbuds" },
  { id: 14, name: "Electronics" },
  { id: 6, name: "Cases * Screen Protector/Guard" },
  { id: 1, name: "Accessories for Phones * Tablets" },
  { id: 15, name: "Accessories for Electronics" },
  // Adding more categories for demonstration of scroll
  { id: 17, name: "Cameras * Photography" },
  { id: 18, name: "Home Appliances" },
  { id: 19, name: "Networking Devices" },
  { id: 20, name: "Drones" },
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
          acc[category.id] = responses[index].data;
          return acc;
        }, {});
        setProducts(productsObject);
        if (allCategories.length > 0) {
          setSelectedCategoryId(allCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching all category products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (accessToken) fetchAllCategoryProducts();
  }, [accessToken]);

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  const selectedCategoryName = allCategories.find(cat => cat.id === selectedCategoryId)?.name || "All Products";
  const displayedProducts = selectedCategoryId ? products[selectedCategoryId] || [] : Object.values(products).flat();

  // Function to format price in Nigerian Naira
  const formatPriceInNaira = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(price);
  };

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
          <div className="cpd-product-scroll-container"> {/* New scroll container */}
            <div className="cpd-product-grid">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => {
                  const mainImage = product.image_urls?.medium || "/media/default.jpg";
                  const secondaryImage = product.secondary_image_urls?.medium || mainImage;

                  return (
                    <div
                      key={product.product_id}
                      className="cpd-product-card"
                      onClick={() => handleProductClick(product.product_id)}
                      onMouseEnter={(e) => {
                        const imgEl = e.currentTarget.querySelector("img");
                        imgEl.src = secondaryImage;
                      }}
                      onMouseLeave={(e) => {
                        const imgEl = e.currentTarget.querySelector("img");
                        imgEl.src = mainImage;
                      }}
                    >
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="cpd-product-image"
                      />
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