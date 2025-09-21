import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import api from '../Api';
import './OrderDetails.css';

const OrderDetails = ({ orderId: propOrderId, onBack }) => {
  const { orderId: paramOrderId } = useParams();
  const orderId = propOrderId || paramOrderId;
  const { token } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/orders/${orderId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) fetchOrderDetails();
  }, [orderId, token]);

  const formatPrice = (price) =>
    Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const getPaymentMethodName = (paymentMethodId) => {
    switch (paymentMethodId) {
      case 1: return 'Bank Transfer';
      case 2: return 'Debit/Credit Cards';
      default: return 'Unknown Payment Method';
    }
  };

  const handlePaymentClick = () => {
    const orderPayload = {
      orderId: order.order_id,
      email: order.email,
      phone: order.phone,
      address: `${order.first_name} ${order.last_name}, ${order.address}, ${order.city}, ${order.state}`,
      subtotal: order.total_amount,
      shippingCost: 0,
      total: order.total_amount,
      products: order.cart_items || [],
      shippingMethod: order.shipping_method,
    };

    if (order.payment_method_id === 1) {
      navigate('/payment/bank-transfer', { state: orderPayload });
    } else if (order.payment_method_id === 2) {
      navigate('/payment/debit-credit-card', { state: orderPayload });
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>No order details found.</p>;

  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  return (
    <div className="order-details-container">
      <div className="order-header">
        <button onClick={() => onBack ? onBack() : navigate(-1)} className="back-button">
          ← Back to Orders
        </button>
        <h2>
          Order #{order.order_id}{' '}
          <span className={`status ${isCancelled ? 'cancelled' : ''}`}>
            ({order.status})
          </span>
        </h2>
        <p className="order-date">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      <h3>Products</h3>
      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {(order.cart_items || []).map((item) => (
            <tr key={item.product}>
              <td>{item.product_name || 'Product Missing'} × {item.quantity}</td>
              <td>{formatPrice(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Order Summary</h3>
      <table className="order-summary-table">
        <tbody>
          <tr><td>Subtotal</td><td>{formatPrice(order.total_amount)}</td></tr>
          <tr><td>Shipping</td><td>{order.shipping_method === 'store_pickup' ? 'Store Pickup' : 'Standard Shipping'}</td></tr>
          <tr><td>Payment method</td><td>{getPaymentMethodName(order.payment_method_id)}</td></tr>
          <tr className="total-row"><td>Total</td><td>{formatPrice(order.total_amount)}</td></tr>
          <tr><td>Note</td><td>{order.order_note || 'No additional notes'}</td></tr>
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

      {/* Cancelled Orders */}
      {isCancelled && (
        <div className="payment-status cancelled-status">
          <h3>❌ Order Cancelled</h3>
          <p>This order has been cancelled and cannot be paid for.</p>
        </div>
      )}

      {/* Show Payment button only if not cancelled and not confirmed */}
      {!order.payment_confirmed && !isCancelled && (
        <div className="payment-actions">
          <h3>Complete Your Payment</h3>
          <button className="payment-btn" onClick={handlePaymentClick}>
            {order.payment_method_id === 1
              ? 'Pay via Bank Transfer'
              : 'Pay with Debit/Credit Card'}
          </button>
        </div>
      )}

      {/* Payment confirmed */}
      {order.payment_confirmed && (
        <div className="payment-status success-status">
          <h3>✅ Payment Confirmed</h3>
          <p>Thank you! Your payment has been confirmed.</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
