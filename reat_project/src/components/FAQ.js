import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const [openIndexes, setOpenIndexes] = useState([]);

    const toggleDropdown = (index) => {
        if (openIndexes.includes(index)) {
            setOpenIndexes(openIndexes.filter(i => i !== index));
        } else {
            setOpenIndexes([...openIndexes, index]);
        }
    };

    const isOpen = (index) => openIndexes.includes(index);

    return (
        <div className="faq-container">
            <h1>Frequently Asked Questions</h1>
            <p>Most frequent questions and answers</p>

            <h2>Order & Payment</h2>

            <div className={`faq-item ${isOpen(0) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(0)}>What currencies does Triple A's technology accept?</h3>
                {isOpen(0) && <p>We only accept Naira. Need help placing an order? Call our Order Line – 08034593459. Operating Hours: Mon-Fri, 8am-6pm; Saturday, 8am-6pm; Public Holidays, 9am-5pm.</p>}
            </div>

            <div className={`faq-item ${isOpen(1) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(1)}>What steps does Triple A's technology take to prevent card fraud?</h3>
                {isOpen(1) && <p>Fraud detection and prevention are very important to us. We take all steps to ensure that transactions are genuine and that our customer’s details are completely secure. Online payments are monitored continuously for suspicious activity, and some transactions are verified manually if we feel that it is not authorized by the owner of the card.</p>}
            </div>

            <div className={`faq-item ${isOpen(2) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(2)}>Does Triple A's technology offer payment in installments?</h3>
                {isOpen(2) && <p>Sorry, we don’t offer payment in installments at this moment.</p>}
            </div>

            <div className={`faq-item ${isOpen(3) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(3)}>Do I need an account to purchase from Triple A's technology ?</h3>
                {isOpen(3) && <p>yes, you need to have an account to shop on Triple A's technology. </p>}
            </div>

            <div className={`faq-item ${isOpen(4) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(4)}>What are Triple A's technology Working Hours?</h3>
                {isOpen(4) && <p>Need help placing an order? Call our Order Line – 08034593459. Operating Hours: Mon-Fri, 8am-6pm; Saturday, 8am-6pm; Public Holidays, 9am-5pm.</p>}
            </div>

            <div className={`faq-item ${isOpen(5) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(5)}>How do I register as a customer on Triple A's technology ?</h3>
                {isOpen(5) && (
                    <div>
                        <p>That’s easy! You can register as a customer by following the simple steps below:</p>
                        <ol>
                            <li>Visit our homepage</li>
                            <li>Click on Login in the top right corner of the Triple A's technology home</li>
                            <li>Click on CREATE AN ACCOUNT with Email</li>
                            <li>You will be asked to provide some basic information.</li>
                            <li>Once you have provided the required information, click on SUBMIT to complete the registration process.</li>
                        </ol>
                        <p>We will send you an email to verify your account and welcome you to Nonsman. Then you can start shopping.</p>
                        <p>Need help placing an order? Call our Order Line – 08034593459. Operating Hours: Mon-Fri, 8am-6pm; Saturday, 8am-6pm; Public Holidays, 9am-5pm.</p>
                    </div>
                )}
            </div>

            <div className={`faq-item ${isOpen(6) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(6)}>Why do I have to provide my email address to register?</h3>
                {isOpen(6) && <p>Your e-mail address helps us to inform you in good time about your order. It also serves as a username and allows you to log in to your account.</p>}
            </div>

            <h2>Track & Shipping</h2>

            <div className={`faq-item ${isOpen(7) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(7)}>Will all of the items in my order arrive separately?</h3>
                {isOpen(7) && <p>No, all orders placed at the same time and same day arrive at the same time. If mistakenly an order is placed when others are shipped, immediate arrangement is done for the next shipment. (T&C applies)</p>}
            </div>

            <div className={`faq-item ${isOpen(8) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(8)}>What is buyer protection?</h3>
                {isOpen(8) && <p>We offer all our customers ultimate peace of mind. We have you covered 100% on every eligible purchase.</p>}
            </div>

            <div className={`faq-item ${isOpen(9) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(9)}>What is the estimated delivery time?</h3>
                {isOpen(9) && <p>Triple A's technology delivers products to customers all over Nigeria. Lagos 24hrs & 2 working days other states. Within some western states like Ibadan and Ogun State is same-day delivery (T&C applies). Other states are 48-72hrs delivery.</p>}
            </div>

            <div className={`faq-item ${isOpen(10) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(10)}>Who will deliver my order?</h3>
                {isOpen(10) && <p>We use Gokada, Uber Package, or Bolt for same-day delivery within Lagos. You may be called prior to or on the same day as delivery to see if you are available to receive your order.</p>}
            </div>

            <div className={`faq-item ${isOpen(11) ? 'open' : ''}`}>
                <h3 onClick={() => toggleDropdown(11)}>How do I track my order?</h3>
                {isOpen(11) && <p>You can track your order online 24 hours/7 days by following the steps below:</p>}
            </div>
        </div>
    );
};

export default FAQ;
