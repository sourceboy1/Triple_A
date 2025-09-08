import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewedProducts.css';

// Remove these imports as we are no longer using image-based arrows
// import ArrowRight from '../icons/Arrow_Right.jpg';
// import ArrowLeft from '../icons/Arrow_Left.jpg';

const ViewedProducts = () => {
    const [viewedProducts, setViewedProducts] = useState([]);
    // currentBatch and productsPerBatch are no longer needed for explicit pagination
    // The CSS will handle the horizontal scrolling of all products.

    // Fetch from localStorage
    const loadViewedProducts = () => {
        const savedProducts = localStorage.getItem('viewedProducts');
        if (savedProducts) {
            setViewedProducts(JSON.parse(savedProducts));
        } else {
            setViewedProducts([]);
        }
    };

    // Initial load + listen for changes
    useEffect(() => {
        loadViewedProducts();

        const handleStorageChange = (e) => {
            if (e.key === 'viewedProducts') {
                loadViewedProducts();
            }
        };

        // Listen for manual trigger from same tab
        window.addEventListener('viewedProductsUpdated', loadViewedProducts);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('viewedProductsUpdated', loadViewedProducts);
        };
    }, []);

    // No need for displayedProducts slice, we'll render all and let CSS scroll

    return (
        <div className="viewed-products-container">
            <h2>Recently Viewed Products</h2>
            {viewedProducts.length > 0 ? (
                // The viewed-products-list will now be horizontally scrollable
                <div className="viewed-products-list">
                    {viewedProducts.map((product, index) => ( // Map all products
                        <div key={index} className="viewed-product-item">
                            <Link to={`/product-details/${product.product_id}`}>
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