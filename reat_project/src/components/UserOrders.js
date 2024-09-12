import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in local storage

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/orders/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    params: {
                        user_id: userId, // Pass user_id as a query parameter
                    },
                });
                setOrders(response.data);
            } catch (error) {
                setError('Error fetching user orders.');
                console.error('Error fetching user orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token && userId) {
            fetchUserOrders();
        }
    }, [token, userId]);

    const handleViewOrder = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.post(`/api/cancel-order/${orderId}/`, {}, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            // Update the order status to "Cancelled" in the UI
            setOrders(orders.map(order => 
                order.order_id === orderId ? { ...order, status: 'Cancelled' } : order
            ));
        } catch (error) {
            setError('Error cancelling order.');
            console.error('Error cancelling order:', error);
        }
    };

    const formatPrice = (price) => {
        return price.toFixed(2); // Format price to 2 decimal places
    };

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {loading && <p>Loading orders...</p>}
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
                            <div>₦{formatPrice(order.total_amount)}</div>
                        </div>
                        <div className="order-actions">
                            <button onClick={() => handleViewOrder(order.order_id)}>View</button>
                            {order.status !== 'Cancelled' && (
                                <button onClick={() => handleCancelOrder(order.order_id)}>Cancel Request</button>
                            )}
                        </div>
                        <div className="order-summary">
                            <h2>Order Summary</h2>
                            <ul className="order-summary-items">
                                {order.items.map((item) => (
                                    <li key={item.product_id} className="order-summary-item">
                                        <img src={item.image_url || '/path/to/default-image.jpg'} alt={item.name} className="order-summary-item-image" />
                                        <div className="order-summary-item-details">
                                            <h3>{item.name}</h3>
                                            <p>Price: ₦{formatPrice(item.price)}</p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Total: ₦{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
