// src/components/Newsletter.js
import React, { useState } from 'react';
import './Newsletter.css'; // Import the CSS file for styling

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Here you would typically handle the subscription logic (e.g., API call)
        console.log(`Subscribed with email: ${email}`);
        setEmail(''); // Clear the input field after submission
    };

    return (
        <div className="newsletter-container">
            <div className="newsletter-content">
                <div>
                    <h3>Newsletter</h3>
                    <p>Subscribe to get exclusive information about products and coupons.</p>
                </div>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="newsletter-input"
                    />
                    <button type="submit" className="newsletter-button">Subscribe</button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
