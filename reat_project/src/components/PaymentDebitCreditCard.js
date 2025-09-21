// PaymentDebitCreditCard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api';
import './PaymentDebitCreditCard.css';
import { PaystackButton } from 'react-paystack';
import {
  FaShoppingCart,
  FaCreditCard,
  FaLock,
  FaHome,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const PAYSTACK_PUBLIC_KEY = 'pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006';
const PAYSTACK_CHARGE_PERCENTAGE = 0.015;
const PAYSTACK_FIXED_CHARGE_NAIRA = 100;
const PAYSTACK_CAP_CHARGE_NAIRA = 2000;

const PaymentDebitCreditCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCanceling, setIsCanceling] = useState(false);
  const [totalWithCharges, setTotalWithCharges] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paystackClosed, setPaystackClosed] = useState(false);

  const paystackTriggeredRef = useRef(false);
  const paystackWrapperRef = useRef(null);
  const paymentSucceededRef = useRef(false);
  const confirmGuardRef = useRef(false);

  const { state } = location;
  const token = localStorage.getItem('token');

  const {
    orderId = 'N/A',
    email: initialEmail = 'N/A',
    phone: initialPhone = 'N/A',
    address: initialAddress = 'N/A',
    subtotal: initialSubtotal = 0,
    shippingCost: initialShippingCost = 0,
    total: initialTotal = 0,
    products: initialProducts = [],
    shippingMethod: initialShippingMethod = '',
    autoOpen = false,
  } = state || {};

  const [localProducts, setLocalProducts] = useState(initialProducts);
  const [localSubtotal, setLocalSubtotal] = useState(initialSubtotal);
  const [localShippingCost, setLocalShippingCost] = useState(initialShippingCost);
  const [localTotal, setLocalTotal] = useState(initialTotal);
  const [localEmail, setLocalEmail] = useState(initialEmail);
  const [localPhone, setLocalPhone] = useState(initialPhone);
  const [localAddress, setLocalAddress] = useState(initialAddress);
  const [localShippingMethod, setLocalShippingMethod] = useState(initialShippingMethod);

  const formatPrice = (amount) =>
    Number(amount).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

  const calculatePaystackCharges = useCallback((amount) => {
    let charge = amount * PAYSTACK_CHARGE_PERCENTAGE;
    if (amount >= 2500) charge += PAYSTACK_FIXED_CHARGE_NAIRA;
    if (charge > PAYSTACK_CAP_CHARGE_NAIRA) charge = PAYSTACK_CAP_CHARGE_NAIRA;
    return charge;
  }, []);

  useEffect(() => {
    const shouldFetch = (!!orderId && (!state || Object.keys(state).length === 0 || !state.total));
    if (!shouldFetch) return;

    let cancelled = false;
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/orders/${orderId}/details/`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (cancelled) return;

        const orderPayload = res.data?.order ?? res.data ?? {};
        const serverProducts = orderPayload.cart_items || orderPayload.items || orderPayload.order_items || initialProducts || [];
        const serverTotal = Number(orderPayload.total_amount ?? orderPayload.total ?? orderPayload.order_total ?? orderPayload.amount ?? initialTotal ?? 0);
        const serverSubtotal = Number(orderPayload.subtotal ?? orderPayload.sub_total ?? orderPayload.subtotal_amount ?? serverTotal ?? initialSubtotal ?? 0);
        const serverShippingCost = Number(orderPayload.shipping_cost ?? orderPayload.shipping ?? initialShippingCost ?? 0);
        const serverEmail = orderPayload.email ?? orderPayload.customer_email ?? initialEmail;
        const shippingAddress = res.data?.shipping_address;
        const serverPhone = orderPayload.phone ?? shippingAddress?.phone ?? initialPhone;
        const serverAddress = shippingAddress
          ? `${shippingAddress.first_name ?? ''} ${shippingAddress.last_name ?? ''} ${shippingAddress.address ?? ''} ${shippingAddress.city ? ', ' + shippingAddress.city : ''} ${shippingAddress.state ? ', ' + shippingAddress.state : ''}`.trim()
          : orderPayload.address ?? initialAddress;
        const serverShippingMethod = orderPayload.shipping_method ?? localShippingMethod;

        setLocalProducts(serverProducts);
        setLocalTotal(serverTotal);
        setLocalSubtotal(serverSubtotal);
        setLocalShippingCost(serverShippingCost);
        setLocalEmail(serverEmail);
        setLocalPhone(serverPhone);
        setLocalAddress(serverAddress);
        setLocalShippingMethod(serverShippingMethod);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to fetch order details. Please try again or contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
    return () => { cancelled = true; };
  }, [orderId]);

  useEffect(() => {
    if (localTotal && Number(localTotal) > 0) {
      const charges = calculatePaystackCharges(Number(localTotal));
      setTotalWithCharges(Number(localTotal) + charges);
      setIsLoading(false);
    } else if (!state || (!state && !orderId)) {
      setError('No order details found. Please go back to checkout.');
      setIsLoading(false);
    }
  }, [localTotal, calculatePaystackCharges, state, orderId]);

  useEffect(() => {
    if (!isLoading && totalWithCharges > 0 && !paystackTriggeredRef.current) {
      setTimeout(() => {
        try {
          const wrapper = paystackWrapperRef.current;
          const btn = wrapper ? wrapper.querySelector('button') : null;
          if (btn) {
            paystackTriggeredRef.current = true;
            btn.click();
          }
        } catch (err) {
          console.warn('Auto-open paystack failed:', err);
        }
      }, 500);
    }
  }, [isLoading, totalWithCharges, autoOpen]);

  const amountInKobo = Math.round(totalWithCharges * 100); // ✅ exact kobo integer

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: localEmail,
    amount: amountInKobo,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      order_id: orderId,
      custom_fields: [
        { display_name: 'Order ID', variable_name: 'order_id', value: orderId },
        { display_name: 'Customer Email', variable_name: 'customer_email', value: localEmail },
        { display_name: 'Original Total', variable_name: 'original_total', value: localTotal },
        { display_name: 'Paystack Charges', variable_name: 'paystack_charges', value: totalWithCharges - localTotal },
      ],
    },
  };

  const handleSuccess = async (response) => {
    if (isConfirming || confirmGuardRef.current) return;
    confirmGuardRef.current = true;
    setIsConfirming(true);
    setPaystackClosed(false);

    try {
      const requestBody = {
        transaction_reference: response.reference,
        payment_method: 'card',
        amount_paid: amountInKobo, // ✅ exact kobo sent to backend
      };

      if (localShippingMethod) requestBody.shipping_method = localShippingMethod;
      else if (localShippingCost === 0) requestBody.shipping_method = 'pickup';

      const verifyResponse = await api.post(
        `/orders/${orderId}/confirm_payment/`,
        requestBody,
        { headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` } }
      );

      const backendData = verifyResponse.data || {};
      const status2xx = verifyResponse.status >= 200 && verifyResponse.status < 300;

      const bodySaysSuccess =
        backendData &&
        (
          backendData.status === 'success' ||
          backendData.success === true ||
          backendData.verified === true ||
          backendData.payment_confirmed === true
        );

      const successDetected = bodySaysSuccess || (status2xx && !backendData?.status === 'failed');

      if (successDetected) {
        paymentSucceededRef.current = true;
        const isPickup = (localShippingMethod && localShippingMethod.toLowerCase().includes('pick')) || localShippingCost === 0;
        const successMessage =
          backendData.success_message ||
          (isPickup ? 'Your order is confirmed and will be ready for pickup soon.' : 'Your order is confirmed and will be processed and shipped soon.');

        navigate('/order-success', { state: { orderId, successMessage } });
      } else {
        const errMsg = backendData.error || backendData.message || 'Payment verification failed.';
        const retryData = {
          orderId,
          email: localEmail,
          phone: localPhone,
          address: localAddress,
          subtotal: localSubtotal,
          shippingCost: localShippingCost,
          total: localTotal,
          products: localProducts,
          shippingMethod: localShippingMethod,
        };
        navigate('/order-failure', { state: { errorMessage: errMsg, orderId, retryData } });
      }
    } catch (err) {
      console.error('Error confirming payment with backend:', err);
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Payment reported successful by Paystack but confirmation with our server failed.';
      const retryData = {
        orderId,
        email: localEmail,
        phone: localPhone,
        address: localAddress,
        subtotal: localSubtotal,
        shippingCost: localShippingCost,
        total: localTotal,
        products: localProducts,
        shippingMethod: localShippingMethod,
      };
      navigate('/order-failure', { state: { errorMessage: serverMsg, orderId, retryData } });
    } finally {
      setIsConfirming(false);
      confirmGuardRef.current = false;
    }
  };

  const handleClose = () => {
    if (paymentSucceededRef.current) return;
    setPaystackClosed(true);
  };

  const PaystackIntegrationButton = () => (
    <div ref={paystackWrapperRef} className="paystack-wrapper">
      <PaystackButton
        {...paystackConfig}
        text={isConfirming ? 'Confirming...' : 'Pay Now Securely'}
        onSuccess={handleSuccess}
        onClose={handleClose}
        className="paystack-pay-button"
      />
    </div>
  );

  const handleCancelOrder = () => setIsCanceling(true);
  const confirmCancelOrder = async () => {
    try {
      await api.post(`/orders/${orderId}/cancel/`, {}, {
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      });
      navigate('/');
    } catch (err) {
      console.error('Error canceling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="payment-page-container loading-state">
      <div className="loading-spinner" />
      <p>Loading payment details...</p>
    </div>
  );

  if (error) return (
    <div className="payment-page-container error-state">
      <FaExclamationTriangle className="error-icon" />
      <h1>Error</h1>
      <p>{error}</p>
      <button className="go-home-button" onClick={() => navigate('/')}>
        <FaHome /> Go Home
      </button>
    </div>
  );

  return (
    <div className="payment-page-container">
      <div className="header-section">
        <h1>Secure Payment <FaLock className="header-lock-icon" /></h1>
        <p className="subtitle">Order ID: <strong>#{orderId}</strong></p>
        <p className="tagline">Your final step to a successful purchase!</p>
      </div>

      <div className="content-wrapper">
        <div className="order-details-card glassmorphism">
          <h2><FaShoppingCart /> Order Summary</h2>
          <div className="order-items-list">
            {localProducts && localProducts.length > 0 ? (
              localProducts.map((item) => (
                <div key={item.product_id ?? item.id ?? Math.random()} className="order-item">
                  {item.image_url && <img src={item.image_url} alt={item.name} />}
                  <div className="item-info">
                    <h3>{item.name ?? item.product_name}</h3>
                    <p>Quantity: {item.quantity ?? item.qty ?? 1}</p>
                    <p>Price: {formatPrice(item.price ?? item.unit_price ?? 0)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">No products found in this order.</p>
            )}
          </div>

          <div className="summary-section">
            <div className="summary-line"><span>Subtotal:</span><span>{formatPrice(localSubtotal)}</span></div>
            <div className="summary-line"><span>Shipping Cost:</span><span>{formatPrice(localShippingCost)}</span></div>
            {totalWithCharges > localTotal && (
              <div className="summary-line paystack-charge">
                <span>Paystack Charges:</span>
                <span>{formatPrice(totalWithCharges - localTotal)}</span>
              </div>
            )}
            <div className="summary-line total-amount-final">
              <span>Total (incl. Charges):</span>
              <span>{formatPrice(totalWithCharges)}</span>
            </div>
          </div>
        </div>

        <div className="customer-info-card glassmorphism">
          <h2><FaCreditCard /> Payment Information</h2>
          <p className="payment-instruction">
            You are about to pay for order <strong>#{orderId}</strong>. Your total due is <strong className="highlight-total">{formatPrice(totalWithCharges)}</strong>.
          </p>
          <p className="payment-note">
            Please proceed to complete your payment securely via Debit/Credit Card using Paystack. Your payment includes a Paystack transaction fee of {formatPrice(totalWithCharges - localTotal)}.
          </p>

          <div className="paystack-button-wrapper">
            {totalWithCharges > 0 && <PaystackIntegrationButton />}
            <div className="secure-info">
              <FaLock /> Your payment is secured by Paystack.
            </div>
          </div>

          {paystackClosed && (
            <p className="hint-note">
              You closed the payment popup. Click <strong>Pay Now Securely</strong> to try again.
            </p>
          )}

          {isConfirming && (
            <p className="hint-note">Verifying payment with server... please wait.</p>
          )}

          <div className="customer-details-block">
            <h3>Customer Details</h3>
            <p><strong>Email:</strong> {localEmail}</p>
            <p><strong>Phone:</strong> {localPhone}</p>
            <p><strong>Billing/Shipping Address:</strong> {localAddress}</p>
          </div>
        </div>
      </div>

      <div className="action-buttons-footer">
        <button className="go-home-button" onClick={() => navigate('/')}>
          <FaHome /> Back to Home
        </button>
        <button className="cancel-order-button" onClick={handleCancelOrder}>
          <FaTimesCircle /> Cancel Order
        </button>
      </div>

      {isCanceling && (
        <div className="cancel-dialog-overlay">
          <div className="cancel-dialog">
            <FaExclamationTriangle className="dialog-icon warning" />
            <p>Are you sure you want to cancel this order?</p>
            <div className="dialog-buttons">
              <button onClick={confirmCancelOrder} className="dialog-confirm-button">Yes, Cancel Order</button>
              <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDebitCreditCard;
