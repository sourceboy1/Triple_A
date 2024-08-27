import React from 'react';
import guaranteeIcon from '../icons/guarantee-icon.jpg';
import fastShipIcon from '../icons/fast-ship-icon.jpg';
import qualityAssuredIcon from '../icons/quality-assured-icon.jpg';
import customerServiceIcon from '../icons/customer-service-icon.jpg';
import './PaymentDebitCreditCard.css'; // New CSS file

const PaymentPage = () => {
    return (
        <div className="payment-page-container">
            <div className="payment-info-section">
                <div className="payment-info">
                    <h2>Complete your order</h2>
                    <p><strong>Order number:</strong> 31045</p>
                    <p><strong>Date:</strong> August 25, 2024</p>
                    <p><strong>Total:</strong> ₦27,900.00</p>
                    <p><strong>Payment method:</strong> Debit/Credit Cards</p>
                    <p>Thank you for your order, please click the button below to pay with Paystack.</p>
                </div>

                <div className="info-section">
                    <h1>Your reliable IT Gadgets & Accessories Store</h1>

                    <div className="info-block">
                        <img src={guaranteeIcon} alt="Guaranteed Product Satisfaction" />
                        <div>
                            <h4>Guaranteed Product Satisfaction</h4>
                            <p>
                                Nonsman Global values your patronage. If you're not satisfied with your purchase, please review our Return/Refund or Exchange Policy.
                            </p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={fastShipIcon} alt="Your Preferred Delivery Option" />
                        <div>
                            <h4>Your Preferred Delivery Option</h4>
                            <p>
                                Choose how you want your order delivered. Get as much access as scheduling your delivery. Check Our FAQ.
                            </p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={qualityAssuredIcon} alt="Guaranteed Buyers Protection" />
                        <div>
                            <h4>Guaranteed Buyers Protection</h4>
                            <p>
                                We offer all our customers ultimate peace of mind. We have you covered 100% on every eligible purchase.
                            </p>
                        </div>
                    </div>

                    <div className="info-block">
                        <img src={customerServiceIcon} alt="Passionate Customer Service" />
                        <div>
                            <h4>Passionate Customer Service</h4>
                            <p>
                                Walk in: Ikeja - Lagos Office 22 Obafemi Awolowo Way, Ikeja, Lagos. 5 Saka Tinubu St, Victoria Island, Lagos.
                            </p>
                            <p>Or Call: +2347082946661</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="payment-buttons">
                <button>Pay with Paystack</button>
                <button>Cancel order & restore cart</button>
            </div>
        </div>
    );
};

export default PaymentPage;
