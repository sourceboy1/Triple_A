import React, { useState, useEffect } from 'react';
import api from '../Api';
import Product from './Product';

const ProductList = ({ category, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('products/', {
          params: {
            category,
            query: searchQuery, // ✅ matches Django view's request.GET.get('query')
          },
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
            slug={product.slug}
            name={product.name}
            description={product.description}
            price={product.price}
            image_urls={product.image_urls}         // ✅ correct prop name (plural, object)
            stock={product.stock}                   // ✅ was missing
            is_abroad_order={product.is_abroad_order}
            abroad_delivery_days={product.abroad_delivery_days}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;