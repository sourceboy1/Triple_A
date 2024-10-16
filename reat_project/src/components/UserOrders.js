import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import Loading from './Loading';
import './UserOrders.css';

const UserOrders = ({ onViewOrder }) => {  // Added onViewOrder prop
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCanceling, setIsCanceling] = useState(false);
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const token = localStorage.getItem('token');

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/orders/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
    
            if (Array.isArray(response.data)) {
                const ordersWithNumericPrices = response.data.map(order => ({
                    order_id: order.order_id,
                    created_at: order.created_at,
                    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                    total_amount: Number(order.total_amount),
                    items: (order.cart_items || []).map(item => ({
                        product_id: item.product,
                        name: item.product_name,
                        price: Number(item.price),
                        quantity: item.quantity,
                        image_url: item.product_image
                    })),
                }));
    
                // Sort orders by created_at in descending order (most recent first)
                const sortedOrders = ordersWithNumericPrices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
                setOrders(sortedOrders);
            } else {
                setError('Unexpected API response format.');
            }
        } catch (error) {
            setError('Error fetching user orders.');
            console.error('Error fetching user orders:', error);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (token) {
            fetchUserOrders();
        } else {
            setError('User not authenticated.');
            setLoading(false);
        }
    }, [token]);

    const confirmCancelOrder = async (orderId) => {
        try {
            await axios.post(`http://localhost:8000/api/orders/${orderId}/cancel/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });

            fetchUserOrders();
            setIsCanceling(false);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) {
            return 'Invalid Price'; 
        }
        return numericPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    };

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {loading && <Loading />}
            {error && <p>{error}</p>}
            {!loading && orders.length === 0 && <p>No orders found.</p>}
            <div className="orders-table">
                <div className="orders-header">
                    <div>Order</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div>Total</div>
                </div>
                {orders.map((order) => (
                    <div key={order.order_id} className="orders-row">
                        <div className="order-info">
                            <div>Order #{order.order_id}</div>
                            <div>{new Date(order.created_at).toLocaleDateString()}</div>
                            <div>{order.status}</div>
                            <div>{formatPrice(order.total_amount)}</div>
                        </div>
                        <div className={`order-actions ${order.status === 'cancelled' ? 'centered' : ''}`}>
                            <button onClick={() => onViewOrder(order.order_id)}>View</button> {/* Trigger viewOrderDetails */}
                            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                <button onClick={() => {
                                    setCancelOrderId(order.order_id);
                                    setIsCanceling(true);
                                }}>Cancel Request</button>
                            )}
                        </div>
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <ul className="order-summary-items">
                                {order.items.map((item) => (
                                    <li key={item.product_id} className="order-summary-item">
                                        <img 
                                            src={item.image_url || '/path/to/default-image.jpg'} 
                                            alt={item.name} 
                                            className="order-summary-item-image" 
                                        />
                                        <div className="order-summary-item-details">
                                            <h3>{item.name}</h3>
                                            <p>Price: {formatPrice(item.price)}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total: {formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {isCanceling && (
                <div className="cancel-dialog-overlay">
                    <div className="cancel-dialog">
                        <p>Are you sure you want to cancel this order?</p>
                        <button onClick={() => confirmCancelOrder(cancelOrderId)} className="dialog-confirm-button">Yes, Cancel Order</button>
                        <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
