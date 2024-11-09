import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import './OrderDetails.css';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Scroll to the top of the page whenever the component is loaded
    useEffect(() => {
        window.scrollTo(0, 0);  // Scroll to top (0, 0) position
    }, []);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/orders/${orderId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setOrder(response.data);
            } catch (error) {
                setError('Error fetching order details.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrderDetails();
    }, [orderId, token]);

    const formatPrice = (price) => {
        return Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    };

    const getPaymentMethodName = (paymentMethodId) => {
        switch (paymentMethodId) {
            case 4:
                return 'Direct Bank Transfer';
            case 3:
                return 'Debit/Credit Cards';
            default:
                return 'Unknown Payment Method';
        }
    };

    if (loading) return <Loading />;
    if (error) return <p>{error}</p>;
    if (!order) return <p>No order details found.</p>;

    return (
        <div className="order-details-container">
            <button onClick={() => navigate(-1)} className="back-button">Back to Orders</button>

            <h2>Order #{order.order_id} was placed on {new Date(order.created_at).toLocaleDateString()} and is currently {order.status}.</h2>

            <h3>Products</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                {order.cart_items.map(item => (
                    <tr key={item.product_id}>
                        <td>
                            {item.product_name ? `${item.product_name} × ${item.quantity}` : `Product Name Missing × ${item.quantity}`}
                        </td>
                        <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Order Summary</h3>
            <table className="order-summary-table">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td>{formatPrice(order.total_amount)}</td>
                    </tr>
                    <tr>
                        <td>Shipping</td>
                        <td>{order.shipping_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</td>
                    </tr>
                    <tr>
                        <td>Payment method</td>
                        <td>{getPaymentMethodName(order.payment_method_id)}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>{formatPrice(order.total_amount)}</td>
                    </tr>
                    <tr>
                        <td>Note</td>
                        <td>{order.order_note || 'No additional notes'}</td>
                    </tr>
                </tbody>
            </table>

            <div className="address-section">
                <div className="address-box">
                    <h3>Billing Address</h3>
                    <p>{order.first_name} {order.last_name}</p>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.state}</p>
                    <p>{order.phone}</p>
                    <p>{order.email}</p>
                </div>
                <div className="address-box">
                    <h3>Shipping Address</h3>
                    <p>{order.first_name} {order.last_name}</p>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.state}</p>
                    <p>{order.phone}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
