import React from 'react';
import './FooterSection.css'; // Import the CSS file

// Import your debit card image
import DebitCard from '../pictures/debitcard.jpg';

const FooterSection = () => {
    return (
        <div className="footer-section-container"> {/* Use a unique class */}
            <p>© 2024 Triple A's Technology. | All rights reserved.</p>
            <img src={DebitCard} alt="Debit Card" className="footer-debit-card" /> {/* Image at the end */}
        </div>
    );
};

export default FooterSection;
