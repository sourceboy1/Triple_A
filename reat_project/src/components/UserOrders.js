import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import api from '../Api';
import './UserOrders.css';

/* ── Animated loading dots ── */
const LoadingDots = () => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length === 3 ? '' : prev + '.'));
    }, 300);
    return () => clearInterval(interval);
  }, []);
  return <span>Loading{dots}</span>;
};

/* ── Status pill colour map ── */
const STATUS_COLORS = {
  pending:          { bg: '#fef9c3', color: '#854d0e' },
  processing:       { bg: '#dbeafe', color: '#1e40af' },
  shipped:          { bg: '#e0e7ff', color: '#3730a3' },
  delivered:        { bg: '#dcfce7', color: '#15803d' },
  cancelled:        { bg: '#fee2e2', color: '#b91c1c' },
  ready_for_pickup: { bg: '#fce7f3', color: '#9d174d' },
};

const getStatusStyle = (status = '') => {
  const key = status.toLowerCase().replace(/\s+/g, '_');
  return STATUS_COLORS[key] || { bg: '#f1f5f9', color: '#475569' };
};

const UserOrders = ({ onViewOrder }) => {
  const { token } = useUser();
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [isCanceling, setIsCanceling]     = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [canceling, setCanceling]         = useState(false);
  const [cancelError, setCancelError]     = useState(null);

  /* ── Fetch orders ──
     api.js interceptor already attaches Bearer token automatically,
     so no manual Authorization header needed here.
  ── */
  const fetchUserOrders = async () => {
    try {
      const response = await api.get('/user/orders/');

      if (Array.isArray(response.data)) {
        const formatted = response.data.map(order => ({
          order_id:     order.order_id,
          created_at:   order.created_at,
          status:       order.status.charAt(0).toUpperCase() + order.status.slice(1),
          total_amount: Number(order.total_amount),
          items: (order.cart_items || []).map(item => ({
            product_id: item.product,
            name:       item.product_name,
            price:      Number(item.price),
            quantity:   item.quantity,
            image_url:  item.product_image,
          })),
        }));
        setOrders(formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setError(null);
      } else {
        setError('Unexpected response format from server.');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.status === 401
        ? 'You must be logged in to view your orders.'
        : 'Error fetching your orders. Please try again.');
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

  /* ─────────────────────────────────────────────────────────
     ROOT CAUSE OF THE 400 ERROR:
     ─────────────────────────────────────────────────────────
     Your backend cancel_signed action has:
       authentication_classes=[]
       permission_classes=[]
       ...and requires ?token=<signed_token> in the URL.

     It does NOT read Authorization headers at all.
     So the frontend's JWT is ignored and the backend returns
     400 {"error": "Missing token"} every time.

     FIX — Add this new action to your OrderViewSet in views.py:

       @action(detail=True, methods=['post'], url_path='cancel-auth')
       def cancel_auth(self, request, pk=None):
           order = self.get_object()
           if order.user_id_id != request.user.id:
               return Response({'error': 'Not authorized.'}, status=403)
           if order.status in ['cancelled', 'delivered']:
               return Response({'error': 'Cannot cancel this order.'}, status=400)
           order.status = 'cancelled'
           order.save()
           return Response({'message': f'Order #{order.order_id} cancelled.'})

     This uses normal DRF JWT authentication — your api.js
     interceptor sends the Bearer token automatically so it
     will just work with no extra code on the frontend.

     Also fix PaymentBankTransfer.jsx the same way — replace:
       api.post(`/orders/${orderId}/cancel/`, {}, { headers: { Authorization: `Token ${token}` }})
     with:
       api.post(`/orders/${orderId}/cancel-auth/`)
     (the interceptor handles auth automatically)
  ───────────────────────────────────────────────────────── */
  const confirmCancelOrder = async (orderId) => {
    setCanceling(true);
    setCancelError(null);
    try {
      // cancel-auth uses standard JWT auth (interceptor handles it)
      await api.post(`/orders/${orderId}/cancel-auth/`);
      setIsCanceling(false);
      setCancelOrderId(null);
      await fetchUserOrders();
    } catch (err) {
      console.error('Cancel error:', err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to cancel order. Please try again.';
      setCancelError(msg);
    } finally {
      setCanceling(false);
    }
  };

  const canCancel = (status) =>
    !['cancelled', 'delivered', 'shipped', 'ready_for_pickup']
      .includes(status.toLowerCase());

  const formatPrice = (price) =>
    Number(price).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  return (
    <div className="uo-container">
      <h2 className="uo-title">Your Orders</h2>

      {/* Loading */}
      {loading && (
        <div className="uo-state">
          <div className="uo-spinner" />
          <p><LoadingDots /></p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="uo-state uo-state--error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="uo-state uo-state--empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>No orders yet. Start shopping!</p>
        </div>
      )}

      {/* Orders table */}
      {!loading && !error && orders.length > 0 && (
        <div className="uo-table">
          <div className="uo-thead">
            <div>Order</div>
            <div>Date</div>
            <div>Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>

          {orders.map((order) => {
            const st = getStatusStyle(order.status);
            return (
              <div key={order.order_id} className="uo-row">
                <div className="uo-cell">
                  <span className="uo-cell-label">Order</span>
                  <span className="uo-order-id">#{order.order_id}</span>
                </div>
                <div className="uo-cell">
                  <span className="uo-cell-label">Date</span>
                  <span>{new Date(order.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}</span>
                </div>
                <div className="uo-cell">
                  <span className="uo-cell-label">Status</span>
                  <span className="uo-status-pill"
                    style={{ background: st.bg, color: st.color }}>
                    {order.status}
                  </span>
                </div>
                <div className="uo-cell">
                  <span className="uo-cell-label">Total</span>
                  <span className="uo-amount">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="uo-cell uo-actions">
                  <button className="uo-btn uo-btn--view"
                    onClick={() => onViewOrder(order.order_id)}>
                    View
                  </button>
                  {canCancel(order.status) && (
                    <button className="uo-btn uo-btn--cancel"
                      onClick={() => {
                        setCancelOrderId(order.order_id);
                        setCancelError(null);
                        setIsCanceling(true);
                      }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation dialog */}
      {isCanceling && (
        <div className="uo-overlay">
          <div className="uo-dialog">
            <div className="uo-dialog-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>Cancel Order #{cancelOrderId}?</h3>
            <p>This action cannot be undone. The order will be marked as cancelled.</p>
            {cancelError && <p className="uo-dialog-error">{cancelError}</p>}
            <div className="uo-dialog-btns">
              <button className="uo-btn uo-btn--confirm-cancel"
                onClick={() => confirmCancelOrder(cancelOrderId)}
                disabled={canceling}>
                {canceling ? 'Canceling…' : 'Yes, Cancel Order'}
              </button>
              <button className="uo-btn uo-btn--keep"
                onClick={() => {
                  setIsCanceling(false);
                  setCancelOrderId(null);
                  setCancelError(null);
                }}
                disabled={canceling}>
                No, Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;