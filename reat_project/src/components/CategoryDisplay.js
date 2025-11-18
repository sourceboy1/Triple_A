import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import Api from '../Api'; // Capital A
import { getProductDetailsPath } from '../helpers/navigation';
import './CategoryDisplay.css'; // Updated CSS file

const categories = [
  { slug: "accessories-for-phones-tablets", name: "Accessories for Phones & Tablets" },
  { slug: "video-games-and-accessories", name: "Video Games & Accessories" },
  { slug: "headsets-airpods-earbuds", name: "Headsets, AirPods & Earbuds" },
  { slug: "watches-and-smartwatches", name: "Watches & Smartwatches" },
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const CategoryDisplay = () => {
  const [products, setProducts] = useState({});
  const navigate = useNavigate();
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responses = await Promise.all(
          categories.map(category =>
            Api.get(`products/?category=${category.slug}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            })
          )
        );

        const productsData = responses.map(response => shuffleArray(response.data).slice(0, 4));

        const productsObject = categories.reduce((acc, category, index) => {
          acc[category.name] = productsData[index];
          return acc;
        }, {});

        setProducts(productsObject);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const handleViewAllCategories = () => {
    navigate('/category-full-display');
  };

  const handleProductClick = (product) => {
    navigate(getProductDetailsPath(product));
  };

  return (
    <div className="category-display">
      {categories.map(category => (
        <div key={category.slug} className="category-section">
          <h3 className="category-title">{category.name}</h3>
          <div className="product-row">
            {products[category.name] && products[category.name].map(product => {
              const mainImage = product.image_urls?.medium || '/media/default.jpg';
              const secondaryImage = product.secondary_image_urls?.medium || mainImage;

              return (
                <div
                  key={product.product_id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={(e) => {
                    const imgEl = e.currentTarget.querySelector('.product-image');
                    if (imgEl) imgEl.src = secondaryImage;
                  }}
                  onMouseLeave={(e) => {
                    const imgEl = e.currentTarget.querySelector('.product-image');
                    if (imgEl) imgEl.src = mainImage;
                  }}
                >
                  <img src={mainImage} alt={product.name} className="product-image" />
                  <h4 className="product-name">{product.name}</h4>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="category-display-footer">
        <button
          className="view-all-categories-btn"
          onClick={handleViewAllCategories}
        >
          View All Categories
        </button>
      </div>
    </div>
  );
};

export default CategoryDisplay;
