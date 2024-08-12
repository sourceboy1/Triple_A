import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import { useCart } from '../contexts/CartContext'; // Import the custom hook

const ProductList = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItemToCart } = useCart(); // Get addItemToCart from the context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/', {
          params: { category },
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
  }, [category]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{category} Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <Product
            key={product.product_id}
            product={product}
            addItemToCart={addItemToCart} // Pass addItemToCart to the Product component
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;












