import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewedProducts.css';

import ArrowRight from '../icons/Arrow_Right.jpg';
import ArrowLeft from '../icons/Arrow_Left.jpg';

const ViewedProducts = () => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [productsPerBatch, setProductsPerBatch] = useState(getProductsPerBatch());

    // Function to determine products per batch based on window size
    function getProductsPerBatch() {
        const width = window.innerWidth;
        if (width <= 375) return 2;
        if (width <= 425) return 4;
        if (width <= 768) return 5;
        return 6;
    }

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

        const handleResize = () => setProductsPerBatch(getProductsPerBatch());
        const handleStorageChange = (e) => {
            if (e.key === 'viewedProducts') {
                loadViewedProducts();
            }
        };

        // Listen for manual trigger from same tab
        window.addEventListener('viewedProductsUpdated', loadViewedProducts);
        window.addEventListener('resize', handleResize);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('viewedProductsUpdated', loadViewedProducts);
        };
    }, []);

    const displayedProducts = viewedProducts.slice(
        currentBatch * productsPerBatch,
        (currentBatch + 1) * productsPerBatch
    );

    const handleNextBatch = () => {
        if ((currentBatch + 1) * productsPerBatch < viewedProducts.length) {
            setCurrentBatch(currentBatch + 1);
        }
    };

    const handlePreviousBatch = () => {
        if (currentBatch > 0) {
            setCurrentBatch(currentBatch - 1);
        }
    };

    return (
        <div className="viewed-products-container">
            <h2>Recently Viewed Products</h2>
            {viewedProducts.length > 0 ? (
                <>
                    <div className="viewed-products-list">
                        {displayedProducts.map((product, index) => (
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

                    <div className="pagination-controls">
                        <button onClick={handlePreviousBatch} disabled={currentBatch === 0} className="arrow-btn">
                            <img src={ArrowLeft} alt="Previous" className="arrow-icon" />
                        </button>
                        <button
                            onClick={handleNextBatch}
                            disabled={(currentBatch + 1) * productsPerBatch >= viewedProducts.length}
                            className="arrow-btn"
                        >
                            <img src={ArrowRight} alt="Next" className="arrow-icon" />
                        </button>
                    </div>
                </>
            ) : (
                <p>You haven't viewed any products yet.</p>
            )}
        </div>
    );
};

export default ViewedProducts;
