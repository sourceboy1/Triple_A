import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ViewedProducts.css';

// No need to import ArrowRight and ArrowLeft anymore
// import ArrowRight from '../icons/Arrow_Right.jpg';
// import ArrowLeft from '../icons/Arrow_Left.jpg';

const ViewedProducts = () => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(0); // Track single product index

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
                setCurrentProductIndex(0); // Reset index when products change
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

    // Handlers for single product navigation
    const handleNextProduct = () => {
        if (currentProductIndex < viewedProducts.length - 1) {
            setCurrentProductIndex(currentProductIndex + 1);
        }
    };

    const handlePreviousProduct = () => {
        if (currentProductIndex > 0) {
            setCurrentProductIndex(currentProductIndex - 1);
        }
    };

    // Determine the product to display
    const displayedProduct = viewedProducts[currentProductIndex];

    return (
        <div className="viewed-products-container">
            <h2>Recently Viewed Products</h2>
            {viewedProducts.length > 0 ? (
                <>
                    <div className="single-product-display"> {/* New container for single product */}
                        {displayedProduct && ( // Ensure displayedProduct exists before rendering
                            <div className="viewed-product-item">
                                <Link to={`/product-details/${displayedProduct.product_id}`}>
                                    <img
                                        src={displayedProduct.image_url}
                                        alt={displayedProduct.name}
                                        className="viewed-product-image"
                                    />
                                    <p>{displayedProduct.name}</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="pagination-controls"> {/* Re-purposing for single product navigation */}
                        <button onClick={handlePreviousProduct} disabled={currentProductIndex === 0} className="scroll-btn">
                            &#10094; {/* Left arrow character */}
                        </button>
                        <button
                            onClick={handleNextProduct}
                            disabled={currentProductIndex === viewedProducts.length - 1}
                            className="scroll-btn"
                        >
                            &#10095; {/* Right arrow character */}
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