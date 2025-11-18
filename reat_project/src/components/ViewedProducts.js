import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductDetailsPath } from '../helpers/navigation';
import './ViewedProducts.css';

const ViewedProducts = () => {
    const [viewedProducts, setViewedProducts] = useState([]);

    // Load from localStorage
    const loadViewedProducts = () => {
        const savedProducts = localStorage.getItem('viewedProducts');
        if (savedProducts) {
            setViewedProducts(JSON.parse(savedProducts));
        } else {
            setViewedProducts([]);
        }
    };

    useEffect(() => {
        loadViewedProducts();

        const handleStorageChange = (e) => {
            if (e.key === 'viewedProducts') {
                loadViewedProducts();
            }
        };

        window.addEventListener('viewedProductsUpdated', loadViewedProducts);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('viewedProductsUpdated', loadViewedProducts);
        };
    }, []);

    return (
        <div className="viewed-products-container">
            <h2>Recently Viewed Products</h2>

            {viewedProducts.length > 0 ? (
                <div className="viewed-products-list">
                    {viewedProducts.map((product, index) => (
                        <div key={index} className="viewed-product-item">

                            <Link to={getProductDetailsPath(product)}>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="viewed-product-image"
                                />
                                <p>{product.name}</p>
                            </Link>

                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't viewed any products yet.</p>
            )}
        </div>
    );
};

export default ViewedProducts;
