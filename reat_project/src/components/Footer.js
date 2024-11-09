import React from 'react';  
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import './Footer.css';
import { useUser } from '../contexts/UserContext'; // Import the UserContext
import UserOrders from './UserOrders';
import TwitterIcon from '../pictures/twitter.jpg';
import FacebookIcon from '../pictures/facebook.jpg';
import InstagramIcon from '../pictures/instagram.jpg';
import TiktokIcon from '../pictures/tiktok.jpg';
import YoutubeIcon from '../pictures/youtube.jpg';
import Newsletter from './Newsletter';
import FooterSection from './FooterSection'; // Import the FooterSection component

const Footer = () => {
    const navigate = useNavigate(); // useNavigate hook for programmatic navigation
    const { isLoggedIn } = useUser(); // Destructure isLoggedIn from UserContext

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scrolling
        });
    };

    const handleNavigation = (path) => {
        navigate(path);
        scrollToTop(); // Scroll to the top when a link is clicked
    };

    const handleProtectedNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
            scrollToTop(); // Navigate to the page and scroll to top
        } else {
            navigate('/signin'); // Redirect to login page if not logged in
            scrollToTop();
        }
    };

    const handleShopClick = () => {
        // Navigate to the search page and show all products
        navigate('/search?query=&category=All');
        scrollToTop();
    };

    return (
        <footer className="footer-container">
            <Newsletter /> {/* Add the Newsletter component here */}
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Triple A's Technology</h3>
                    <p>Call us 24/7</p>
                    <p>+2348034593459</p>
                    <p>2 Oba Akran, Ikeja, Lagos.</p>
                    <p>contact@Tripleastechnology.com</p>
                </div>
                <div className="footer-section">
                    <h3>INFORMATION</h3>
                    <p onClick={() => handleNavigation('/faq')} style={{ cursor: 'pointer' }}>FAQ</p>
                    <p onClick={() => handleNavigation('/return-refund-policy')} style={{ cursor: 'pointer' }}>Returns Policy</p>
                </div>
                <div className="footer-section">
                    <h3>OUR SERVICES</h3>
                    <p onClick={handleShopClick} style={{ cursor: 'pointer' }}>Shop</p> {/* Updated to trigger product search */}
                </div>
                <div className="footer-section">
                    <h3>MY ACCOUNT</h3>
                    <p onClick={() => handleProtectedNavigation('/account/details')} style={{ cursor: 'pointer' }}>My Account details</p>
                    <p onClick={() => handleProtectedNavigation('/user/orders')} style={{ cursor: 'pointer' }}>My Orders</p>
                    <p onClick={() => handleNavigation('/wishlist')} style={{ cursor: 'pointer' }}>Wishlist</p>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="footer-social-media">
                <a href="https://x.com/tripleastech?s=11&t=fpHCoGLBs-DgMJyhC-HBYg" target="_blank" rel="noopener noreferrer">
                    <img src={TwitterIcon} alt="Twitter" className="social-icon" />
                </a>
                <a href="https://www.facebook.com/kinyemzy?mibextid=kFxxJD" target="_blank" rel="noopener noreferrer">
                    <img src={FacebookIcon} alt="Facebook" className="social-icon" />
                </a>
                <a href="https://www.instagram.com/triple_as_tech/profilecard/?igsh=NTdydjBnNGdhd3ky" target="_blank" rel="noopener noreferrer">
                    <img src={InstagramIcon} alt="Instagram" className="social-icon" />
                </a>
                <a href="https://www.tiktok.com/@tripleastech?_t=8qb1rTps9DS" target="_blank" rel="noopener noreferrer">
                    <img src={TiktokIcon} alt="TikTok" className="social-icon" />
                </a>
                <a href="https://youtube.com/@tripleastech-n9u?si=9XbMK9e1O9YCFtmo" target="_blank" rel="noopener noreferrer">
                    <img src={YoutubeIcon} alt="YouTube" className="social-icon" />
                </a>
            </div>

            {/* Add the FooterSection below the social media icons */}
            <FooterSection />
        </footer>
    );
};

export default Footer;
