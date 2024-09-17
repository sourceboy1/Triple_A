import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import './OrderDetails.css';

const OrderDetails = () => {
    const { orderId } = useParams(); // Get orderId from the URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/orders/${orderId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                setOrder(response.data); // Set the fetched order details
            } catch (error) {
                setError('Error fetching order details.');
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, token]);

    const formatPrice = (price) => {
        return Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!order) {
        return <p>No order details found.</p>;
    }

    return (
        <div className="order-details-container">
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
                            <td>{item.name} × {item.quantity}</td>
                            <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="order-summary">
                <p>Subtotal: {formatPrice(order.total_amount)}</p>
                <p>Shipping: {order.shipping_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</p>
                <p>Payment method: {order.payment_method_id}</p>
                <p>Total: {formatPrice(order.total_amount)}</p>
                <p>Note: {order.order_note || 'No additional notes'}</p>
            </div>

            <h3>Billing Address</h3>
            <p>{order.first_name} {order.last_name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>

            <h3>Shipping Address</h3>
            <p>{order.first_name} {order.last_name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state}</p>
            <p>{order.phone}</p>
        </div>
    );
};

export default OrderDetails;
