// PaymentDebitCreditCard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api';
import './PaymentDebitCreditCard.css';
import { PaystackButton } from 'react-paystack';
import { FaShoppingCart, FaCreditCard, FaLock, FaHome, FaTimesCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // Added new icons

const PAYSTACK_PUBLIC_KEY = 'pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006'; // Your Paystack Public Key
const PAYSTACK_CHARGE_PERCENTAGE = 0.015; // 1.5%
const PAYSTACK_FIXED_CHARGE_NAIRA = 100; // ₦100 fixed charge for transactions over ₦2500
const PAYSTACK_CAP_CHARGE_NAIRA = 2000; // ₦2000 maximum charge

const PaymentDebitCreditCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCanceling, setIsCanceling] = useState(false);
    const [totalWithCharges, setTotalWithCharges] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false); // New state for payment confirmation
    const [confirmationMessage, setConfirmationMessage] = useState(''); // New state for confirmation message

    // Use a ref to ensure Paystack popup is triggered only once on initial load
    const paystackTriggeredRef = useRef(false);

    const { state } = location;
    const token = localStorage.getItem('token');

    const {
        orderId = 'N/A',
        email = 'N/A',
        phone = 'N/A',
        address = 'N/A',
        subtotal = 0,
        shippingCost = 0,
        total = 0,
        products = [],
        shippingMethod = 'N/A' // Added shippingMethod from state
    } = state || {};

    const formatPrice = (amount) => amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });

    // Function to calculate Paystack charges
    const calculatePaystackCharges = useCallback((amount) => {
        let charge = amount * PAYSTACK_CHARGE_PERCENTAGE;

        // Apply fixed charge for amounts over ₦2500
        if (amount >= 2500) {
            charge += PAYSTACK_FIXED_CHARGE_NAIRA;
        }

        // Cap the charge at ₦2000
        if (charge > PAYSTACK_CAP_CHARGE_NAIRA) {
            charge = PAYSTACK_CAP_CHARGE_NAIRA;
        }
        return charge;
    }, []);

    useEffect(() => {
        if (total > 0) {
            const charges = calculatePaystackCharges(total);
            setTotalWithCharges(total + charges);
            setIsLoading(false);
        } else if (!state) {
            setError("No order details found. Please go back to checkout.");
            setIsLoading(false);
        }
    }, [total, calculatePaystackCharges, state]);

    // This useEffect will trigger the Paystack popup
    useEffect(() => {
        if (!isLoading && totalWithCharges > 0 && !paystackTriggeredRef.current && !paymentConfirmed) {
            paystackTriggeredRef.current = true; // Mark as triggered
            // The PaystackButton will automatically open when mounted with valid props.
        }
    }, [isLoading, totalWithCharges, paymentConfirmed]);


    // Paystack configuration
    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: email,
        amount: Math.round(totalWithCharges * 100), // Amount in kobo, must be an integer
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
            order_id: orderId,
            custom_fields: [
                {
                    display_name: "Order ID",
                    variable_name: "order_id",
                    value: orderId,
                },
                {
                    display_name: "Customer Email",
                    variable_name: "customer_email",
                    value: email,
                },
                {
                    display_name: "Original Total",
                    variable_name: "original_total",
                    value: total,
                },
                {
                    display_name: "Paystack Charges",
                    variable_name: "paystack_charges",
                    value: totalWithCharges - total,
                },
            ],
        },
    };

    // Callback for successful payment
    const handleSuccess = async (response) => {
        try {
            await api.post(`/orders/${orderId}/confirm_payment/`, {
                transaction_reference: response.reference,
                payment_method: 'card',
                amount_paid: totalWithCharges, // Send the total amount including charges
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });

            setPaymentConfirmed(true); // Set payment as confirmed

            // Determine confirmation message based on shipping method
            if (shippingMethod === 'pickup') {
                setConfirmationMessage('Payment confirmed! Your order is ready for pickup at our store. You will receive an email notification shortly.');
            } else {
                setConfirmationMessage('Payment confirmed! Your order will be available for shipment soon. You will receive an email with tracking details once it\'s shipped.');
            }

            // You can optionally navigate after a short delay or let the user click a button
            // For now, let's keep the message on this page.
            // navigate('/order-success', { state: { orderId } });
        } catch (error) {
            console.error('Error confirming payment with backend:', error);
            setError('Payment successful, but there was an issue confirming with our system. Please contact support.');
            navigate('/order-failure'); // Still navigate to failure page if backend confirmation fails
        }
    };

    // Callback for payment close
    const handleClose = () => {
        // Only show alert if payment wasn't successful and not already confirmed
        if (!paymentConfirmed) {
            alert('Payment window closed. You can try again or cancel your order.');
        }
    };

    const PaystackIntegrationButton = () => (
        <PaystackButton
            {...paystackConfig}
            text="Pay Now Securely"
            onSuccess={handleSuccess}
            onClose={handleClose}
            className="paystack-pay-button"
            disabled={paymentConfirmed} // Disable button if payment is confirmed
        />
    );


    const handleCancelOrder = () => {
        setIsCanceling(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await api.post(`/orders/${orderId}/cancel/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                }
            });
            navigate('/');
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const cancelOrderDialog = (
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
    );

    if (isLoading) {
        return (
            <div className="payment-page-container loading-state">
                <div className="loading-spinner"></div>
                <p>Loading payment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-page-container error-state">
                <FaExclamationTriangle className="error-icon" />
                <h1>Error</h1>
                <p>{error}</p>
                <button className="go-home-button" onClick={() => navigate('/')}>
                    <FaHome /> Go Home
                </button>
            </div>
        );
    }

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
                        {products.length > 0 ? (
                            products.map((item) => (
                                <div key={item.product_id} className="order-item">
                                    <img src={item.image_url} alt={item.name} />
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: {formatPrice(item.price)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-products-message">No products found in this order.</p>
                        )}
                    </div>
                    <div className="summary-section">
                        <div className="summary-line">
                            <span>Subtotal:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="summary-line">
                            <span>Shipping Cost:</span>
                            <span>{formatPrice(shippingCost)}</span>
                        </div>
                        {totalWithCharges > total && (
                            <div className="summary-line paystack-charge">
                                <span>Paystack Charges:</span>
                                <span>{formatPrice(totalWithCharges - total)}</span>
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
                    {paymentConfirmed ? (
                        <div className="payment-success-message">
                            <FaCheckCircle className="success-icon" />
                            <p>{confirmationMessage}</p>
                            <button className="go-home-button" onClick={() => navigate('/')}>
                                <FaHome /> Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="payment-instruction">
                                You are about to pay for order <strong>#{orderId}</strong>. Your total due is <strong className="highlight-total">{formatPrice(totalWithCharges)}</strong>.
                            </p>
                            <p className="payment-note">
                                Please proceed to complete your payment securely via Debit/Credit Card using Paystack. Your payment includes a Paystack transaction fee of {formatPrice(totalWithCharges - total)}.
                            </p>

                            <div className="paystack-button-wrapper">
                                {totalWithCharges > 0 && <PaystackIntegrationButton />}
                                <div className="secure-info">
                                    <FaLock /> Your payment is secured by Paystack.
                                </div>
                            </div>
                        </>
                    )}

                    <div className="customer-details-block">
                        <h3>Customer Details</h3>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Billing/Shipping Address:</strong> {address}</p>
                        <p><strong>Shipping Method:</strong> {shippingMethod === 'pickup' ? 'Store Pickup' : 'Delivery'}</p>
                    </div>
                </div>
            </div>

            {!paymentConfirmed && ( // Only show action buttons if payment isn't confirmed
                <div className="action-buttons-footer">
                    <button className="go-home-button" onClick={() => navigate('/')}>
                        <FaHome /> Back to Home
                    </button>
                    <button className="cancel-order-button" onClick={handleCancelOrder}>
                        <FaTimesCircle /> Cancel Order
                    </button>
                </div>
            )}

            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default PaymentDebitCreditCard;