import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext'; // Import WishlistContext
import './ProductDetails.css';
import markImg from '../pictures/mark.jpg';
import markedImg from '../pictures/markred.jpg';
import wishlistImg from '../pictures/wishlist.jpg'; // Inactive wishlist image
import wishlistActiveImg from '../pictures/wishlist-active.jpg'; // Active wishlist image

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addItemToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // Access WishlistContext
    const [stockMessage, setStockMessage] = useState('');
    
    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            try {
                const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
                const productData = response.data;
                setProduct(productData);
                setSelectedImage(productData.image_url || '');
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    // Handle quantity increase and decrease
    const handleIncrease = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
            setStockMessage('');
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setStockMessage('');
        }
    };

    // Add product to cart
    const handleAddToCart = () => {
        if (product) {
            if (quantity > 0 && quantity <= product.stock) {
                addItemToCart({ ...product, quantity });
                setStockMessage('');
            } else {
                setStockMessage('No available stock.');
            }
        }
    };

    // Toggle wishlist status
    const toggleWishlist = () => {
        if (isInWishlist(product.product_id)) {
            removeFromWishlist(product.product_id); // Remove from wishlist if already added
        } else {
            addToWishlist(product); // Add to wishlist
        }
    };

    // Redirect to WhatsApp for purchasing
    const handleBuyNowOnWhatsApp = () => {
        const message = `Hello, I'm interested in buying ${product.name}. Please provide more details.`;
        const whatsappUrl = `https://wa.me/2348034593459?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    const formattedPrice = product.price ? new Intl.NumberFormat().format(product.price) : 'N/A';
    const formattedOriginalPrice = product.original_price ? new Intl.NumberFormat().format(product.original_price) : 'N/A';

    return (
        <div className="product-detail">
            <div className="product-detail-content">
                {/* Wishlist Icon */}
                <div className="wishlist-icon1" onClick={toggleWishlist}>
                    <img 
                        src={isInWishlist(product.product_id) ? wishlistActiveImg : wishlistImg} 
                        alt="Wishlist" 
                        className="wishlist-image2" 
                    />
                </div>

                <div className="klb-single-stock">
                    {product.stock > 0 ? (
                        <div className="product-stock in-stock">
                            <img src={markImg} alt="In Stock" className="stock-image" />
                            <span>In Stock</span>
                        </div>
                    ) : (
                        <div className="product-stock out-of-stock">
                            <img src={markedImg} alt="Out of Stock" className="stock-image" />
                            <span>Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="product-detail-images">
                    {selectedImage && (
                        <img 
                            src={selectedImage} 
                            alt={product.name} 
                            className="product-detail-image zoomable-image"
                        />
                    )}
                    <div className="product-detail-controls">
                        {product.additional_images?.map((img, index) => (
                            <img
                                key={index}
                                src={img.image_url}
                                alt={img.description}
                                className={`product-detail-controls-img ${selectedImage === img.image_url ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img.image_url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail-info">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                        {product.discount ? (
                            <>
                                <span className="discounted-price">₦{formattedPrice}</span>
                                <span className="original-price">₦{formattedOriginalPrice}</span>
                            </>
                        ) : (
                            <p>Price: ₦{formattedPrice}</p>
                        )}
                    </div>

                    <div className="quantity-control">
                        <button onClick={handleDecrease}>-</button>
                        <span>{quantity}</span>
                        <button onClick={handleIncrease}>+</button>
                    </div>

                    {stockMessage && <p className="stock-message" style={{ color: 'red' }}>{stockMessage}</p>} 

                    <button 
                        onClick={handleAddToCart} 
                        className="button is-primary" 
                        disabled={product.stock === 0}
                    >
                        Add to Cart
                    </button>

                    <button onClick={handleBuyNowOnWhatsApp} className="button is-primary" style={{ marginTop: '10px' }}>
                        Buy Now on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
