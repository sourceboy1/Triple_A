import React, { useState, useEffect } from 'react';
import api from '../Api'; // ✅ Centralized API import
import Product from './Product';
import { useCart } from '../contexts/CartContext';

const ProductList = ({ category, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('api/products/', {
          params: { category, searchQuery },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('There was an error fetching the products!', err);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{category} Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <Product
            key={product.product_id}
            product_id={product.product_id}
            name={product.name}
            description={product.description}
            price={product.price}
            image_url={product.image_url}
            addItemToCart={addItemToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
