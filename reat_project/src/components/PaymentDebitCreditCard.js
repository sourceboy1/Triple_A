import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api';
import './PaymentDebitCreditCard.css'; // Create a new CSS file for this component's specific styling
import { PaystackButton } from 'react-paystack';
import { FaShoppingCart, FaCreditCard, FaLock, FaHome, FaTimesCircle } from 'react-icons/fa'; // Import icons

const PAYSTACK_PUBLIC_KEY = 'pk_live_465faeaf26bb124923dde0c51f9f2b6a1b9ee006'; // Your Paystack Public Key
const PAYSTACK_CHARGE_PERCENTAGE = 0.015; // 1.5%
const PAYSTACK_FIXED_CHARGE_NAIRA = 100; // ₦100 fixed charge for transactions over ₦2500
const PAYSTACK_CAP_CHARGE_NAIRA = 2000; // ₦2000 maximum charge

const PaymentDebitCreditCard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCanceling, setIsCanceling] = useState(false);
    const [showPaystackPopup, setShowPaystackPopup] = useState(false);
    const [totalWithCharges, setTotalWithCharges] = useState(0);

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
        products = []
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
            setShowPaystackPopup(true); // Trigger Paystack popup immediately
        }
    }, [total, calculatePaystackCharges]);

    // Paystack configuration
    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: email,
        amount: totalWithCharges * 100, // Amount in kobo, including charges
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
            alert('Payment successful! Your order has been confirmed.');
            navigate('/order-success', { state: { orderId } });
        } catch (error) {
            console.error('Error confirming payment with backend:', error);
            alert('Payment successful, but there was an issue confirming with our system. Please contact support.');
            navigate('/order-failure');
        }
    };

    // Callback for payment close
    const handleClose = () => {
        alert('Payment window closed. You can try again or cancel your order.');
        // Optionally, you might want to redirect or show a message
        // navigate('/checkout'); // Example: redirect back to checkout
    };

    const componentProps = {
        ...paystackConfig,
        text: 'Proceed to Pay',
        onSuccess: handleSuccess,
        onClose: handleClose,
    };

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
                <p>Are you sure you want to cancel this order?</p>
                <div className="dialog-buttons">
                    <button onClick={confirmCancelOrder} className="dialog-confirm-button">Yes, Cancel Order</button>
                    <button onClick={() => setIsCanceling(false)} className="dialog-cancel-button">No, Keep Order</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="payment-page-container">
            <div className="header-section">
                <h1>Secure Payment</h1>
                <p>Order ID: <strong>#{orderId}</strong></p>
                <p>Thank you for your purchase!</p>
            </div>

            <div className="content-wrapper">
                <div className="order-details-card">
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
                                    <span className="item-total">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))
                        ) : (
                            <p>No products found in this order.</p>
                        )}
                    </div>
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

                <div className="customer-info-card">
                    <h2><FaCreditCard /> Payment Information</h2>
                    <p>You are about to pay for order <strong>#{orderId}</strong>. Your total due is <strong>{formatPrice(totalWithCharges)}</strong>.</p>
                    <p>
                        Click the button below to complete your payment securely via Debit/Credit Card using Paystack.
                        Your payment includes a Paystack transaction fee of {formatPrice(totalWithCharges - total)}.
                    </p>

                    <div className="paystack-button-wrapper">
                        {showPaystackPopup && (
                            <PaystackButton {...componentProps} className="paystack-pay-button" />
                        )}
                    </div>

                    <div className="secure-info">
                        <FaLock /> Your payment is secured by Paystack.
                    </div>

                    <div className="customer-details-block">
                        <h3>Customer Details</h3>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Billing/Shipping Address:</strong> {address}</p>
                    </div>
                </div>
            </div>

            <div className="action-buttons-footer">
                <button className="go-home-button" onClick={() => navigate('/')}>
                    <FaHome /> Go Home
                </button>
                <button className="cancel-order-button" onClick={handleCancelOrder}>
                    <FaTimesCircle /> Cancel Order
                </button>
            </div>

            {isCanceling && cancelOrderDialog}
        </div>
    );
};

export default PaymentDebitCreditCard;