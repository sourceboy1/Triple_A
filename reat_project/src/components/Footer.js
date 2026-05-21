import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import { useUser } from '../contexts/UserContext';
import TwitterIcon from '../pictures/twitter.jpg';
import FacebookIcon from '../pictures/facebook.jpg';
import InstagramIcon from '../pictures/instagram.jpg';
import TiktokIcon from '../pictures/tiktok.jpg';
import YoutubeIcon from '../pictures/youtube.jpg';
import WhatsappIcon from '../pictures/whatsapp.jpg';
import Newsletter from './Newsletter';
import FooterSection from './FooterSection';

const Footer = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavigation = (path) => {
        navigate(path);
        scrollToTop();
    };

    const handleProtectedNavigation = (path) => {
        if (isLoggedIn) {
            navigate(path);
            scrollToTop();
        } else {
            navigate('/signin');
            scrollToTop();
        }
    };

    const handleShopClick = () => {
        navigate('/category-full-display');
        scrollToTop();
    };

    const socials = [
        { href: 'https://x.com/tripleastech?s=11&t=fpHCoGLBs-DgMJyhC-HBYg', icon: TwitterIcon, label: 'Twitter' },
        { href: 'https://www.facebook.com/kinyemzy?mibextid=kFxxJD', icon: FacebookIcon, label: 'Facebook' },
        { href: 'https://www.instagram.com/triple_as_tech/profilecard/?igsh=NTdydjBnNGdhd3ky', icon: InstagramIcon, label: 'Instagram' },
        { href: 'https://www.tiktok.com/@tripleastech?_t=8qb1rTps9DS', icon: TiktokIcon, label: 'TikTok' },
        { href: 'https://youtube.com/@tripleastech-n9u?si=9XbMK9e1O9YCFtmo', icon: YoutubeIcon, label: 'YouTube' },
        { href: 'https://wa.me/2348034593459', icon: WhatsappIcon, label: 'WhatsApp' },
    ];

    return (
        <footer className="footer-container">
            <Newsletter />

            <div className="footer-content">
                {/* Brand / Contact */}
                <div className="footer-section">
                    <h3>Triple A's Technology</h3>
                    <p>Available 24/7 to assist you</p>
                    <p>+2348034593459</p>
                    <p>+2348023975782</p>
                    <p>2 Oba Akran, Ikeja, Lagos.</p>
                    <p>tripleastech518@gmail.com</p>
                </div>

                {/* Information */}
                <div className="footer-section">
                    <h3>Information</h3>
                    <p onClick={() => handleNavigation('/faq')} style={{ cursor: 'pointer' }}>FAQ</p>
                    <p onClick={() => handleNavigation('/return-refund-policy')} style={{ cursor: 'pointer' }}>Returns Policy</p>
                </div>

                {/* Services */}
                <div className="footer-section">
                    <h3>Our Services</h3>
                    <p onClick={handleShopClick} style={{ cursor: 'pointer' }}>Shop</p>
                </div>

                {/* Account */}
                <div className="footer-section">
                    <h3>My Account</h3>
                    <p onClick={() => handleProtectedNavigation('/account/details')} style={{ cursor: 'pointer' }}>Account Details</p>
                    <p onClick={() => handleProtectedNavigation('/user/orders')} style={{ cursor: 'pointer' }}>My Orders</p>
                    <p onClick={() => handleNavigation('/wishlist')} style={{ cursor: 'pointer' }}>Wishlist</p>
                </div>
            </div>

            {/* Social Media */}
            <div className="footer-social-media">
                {socials.map(({ href, icon, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon-link"
                        aria-label={label}
                    >
                        <img src={icon} alt={label} className="social-icon" />
                    </a>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Triple A's Technology. All rights reserved.</p>
                <p>2 Oba Akran Avenuex , Ikeja, Lagos.</p>
            </div>
            <FooterSection />
        </footer>
    );
};

export default Footer;