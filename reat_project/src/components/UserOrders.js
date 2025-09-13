import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext'; // ✅ use UserContext
import api from '../Api';
import './UserOrders.css';

// New LoadingDots component
const LoadingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length === 3) {
          return '';
        }
        return prevDots + '.';
      });
    }, 300); // Change dot every 300ms
    return () => clearInterval(interval);
  }, []);

  return (
    <span>Loading{dots}</span>
  );
};


const UserOrders = ({ onViewOrder }) => {
  const { token } = useUser(); // ✅ get token
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const fetchUserOrders = async () => {
    try {
      const response = await api.get('/user/orders/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        const formattedOrders = response.data.map(order => ({
          order_id: order.order_id,
          created_at: order.created_at,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          total_amount: Number(order.total_amount),
          items: (order.cart_items || []).map(item => ({
            product_id: item.product,
            name: item.product_name,
            price: Number(item.price),
            quantity: item.quantity,
            image_url: item.product_image,
          })),
        }));

        setOrders(
          formattedOrders.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
        setError(null); // ✅ clear any previous error
      } else {
        setError('Unexpected API response format.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);

      if (err.response?.status === 401) {
        setError('You must be logged in to view your orders.');
      } else {
        setError('Error fetching your orders.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    } else {
      setError('You must be logged in to view your orders.');
      setLoading(false);
    }
  }, [token]);

  const confirmCancelOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/cancel/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserOrders();
      setIsCanceling(false);
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order. Try again.');
    }
  };

  const formatPrice = (price) =>
    Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {loading && <p><LoadingDots /></p>} {/* Use the new component here */}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-table">
          <div className="orders-header">
            <div>Order</div>
            <div>Date</div>
            <div>Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>

          {orders.map(order => (
            <div key={order.order_id} className="orders-row">
              <div>#{order.order_id}</div>
              <div>{new Date(order.created_at).toLocaleDateString()}</div>
              <div>{order.status}</div>
              <div>{formatPrice(order.total_amount)}</div>
              <div className="order-actions">
                <button onClick={() => onViewOrder(order.order_id)}>View</button>
                {/* Changed condition here to hide Cancel for 'Cancelled', 'Delivered', and 'Shipped' */}
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && order.status !== 'Shipped' && (
                  <button onClick={() => {
                    setCancelOrderId(order.order_id);
                    setIsCanceling(true);
                  }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isCanceling && (
        <div className="cancel-dialog-overlay">
          <div className="cancel-dialog">
            <p>Are you sure you want to cancel this order?</p>
            <button onClick={() => confirmCancelOrder(cancelOrderId)} className="dialog-confirm-button">
              Yes, Cancel Order
            </button>
            <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">
              No, Keep Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;