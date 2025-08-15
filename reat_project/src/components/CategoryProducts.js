import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { TokenContext } from './TokenContext';
import Loading from './Loading';
import api from '../Api'; // Centralized API instance
import './Styling.css';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = useContext(TokenContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/products/', {
          params: { category: categoryName },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, accessToken]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="category-products">
      <h1>{categoryName} Products</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.product_id} className="product-card">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="product-image" />
              ) : (
                <p>No image available</p>
              )}
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                #{parseFloat(product.price).toFixed(2)}
              </p>
              <button className="button is-primary">Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
