import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./TokenContext";
import Api from "../Api"; // Capital A
import { getProductDetailsPath } from "../helpers/navigation";
import "./CategoryProductDisplay.css";
// Import icons for scrolling (you might need to install react-icons or use simple text)
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const allCategories = [
  { slug: "watches-and-smartwatches", name: "Watches & Smartwatches" },
  { slug: "video-games-and-accessories", name: "Video Games & Accessories" },
  { slug: "software-and-server-services", name: "Software & Server Services" },
  { slug: "powerbanks", name: "Powerbanks" },
  { slug: "phones-and-tablets", name: "Phones & Tablets" },
  { slug: "laptops-and-computers", name: "Laptops & Computers" },
  { slug: "headsets-airpods-earbuds", name: "Headsets & AirPods & Earbuds" },
  { slug: "electronics", name: "Electronics" },
  { slug: "cases-and-screen-protector-guard", name: "Cases & Screen Protector/Guard" },
  { slug: "accessories-for-phones-and-tablets", name: "Accessories for Phones & Tablets" },
  { slug: "accessories-for-electronics", name: "Accessories for Electronics" },
  { slug: "cameras-and-photography", name: "Cameras & Photography" },
  { slug: "home-appliances", name: "Home Appliances" },
  { slug: "networking-devices", name: "Networking Devices" },
  { slug: "drones-and-accessories", name: "Drones & Accessories" },
];

const CategoryProductDisplay = () => {
  const [products, setProducts] = useState({});
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const accessToken = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategoryProducts = async () => {
      setLoadingProducts(true);
      try {
        const responses = await Promise.all(
          allCategories.map((category) =>
            Api.get(`products/?category=${category.slug}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
          )
        );

        const productsObject = allCategories.reduce((acc, category, index) => {
          acc[category.slug] = responses[index].data;
          return acc;
        }, {});

        setProducts(productsObject);
        if (allCategories.length > 0) {
          setSelectedCategorySlug(allCategories[0].slug);
        }
      } catch (error) {
        console.error("Error fetching all category products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (accessToken) fetchAllCategoryProducts();
  }, [accessToken]);

  const handleCategoryClick = (slug) => {
    setSelectedCategorySlug(slug);
  };

  const handleProductClick = (product) => {
    navigate(getProductDetailsPath(product));
  };

  const selectedCategoryName =
    allCategories.find((cat) => cat.slug === selectedCategorySlug)?.name || "All Products";

  const displayedProducts = selectedCategorySlug
    ? products[selectedCategorySlug] || []
    : Object.values(products).flat();

  // Function to format price in Nigerian Naira
  const formatPriceInNaira = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
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
              key={category.slug}
              className={`cpd-category-item ${
                selectedCategorySlug === category.slug ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.slug)}
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
