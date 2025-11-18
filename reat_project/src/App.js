import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { TokenProvider } from './components/TokenContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SignUpForm from './SignUpForm';
import SignIn from './components/Login';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import ProductCatalog from './components/ProductCatalog';
import ProductDetails from './components/ProductDetails';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import SearchResults from './components/SearchResults';
import ReturnRefundPolicy from './components/ReturnRefundPolicy';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import PaymentDebitCreditCard from './components/PaymentDebitCreditCard';
import PaymentBankTransfer from './components/PaymentBankTransfer';
import Account from './components/Account';
import Wishlist from './components/Wishlist';
import AccountDetails from './components/AccountDetails';
import OrderDetails from './components/OrderDetails';
import PowerBankDisplay from './components/PowerBanksSlider';
import Footer from './components/Footer';
import UserOrderParent from './components/UserOrderParent';
import FloatingNav from './components/FloatingNav';
import NotFoundPage from './components/404Page';
import ScrollToTop from './components/ScrollToTop';
import Maintenance from './components/Maintenance';
import OrderSuccess from './components/OrderSuccess/OrderSuccess';
import OrderFailure from './components/OrderFailure/OrderFailure';
import CategoryProductDisplay from './components/CategoryProductDisplay';
import ShopCategoryPage from './components/ShopCategoryPage';
import FlyToCart from './components/FlyToCart';
import ReactGA from 'react-ga4';

const App = () => {
  return (
    <UserProvider>
      <TokenProvider>
        <CartProvider>
          <WishlistProvider>
            <LoadingProvider>
              <Router>
                <ScrollToTop />
                <MaintenanceWrapper />
              </Router>
            </LoadingProvider>
          </WishlistProvider>
        </CartProvider>
      </TokenProvider>
    </UserProvider>
  );
};

const MaintenanceWrapper = () => {
  const { user } = useUser();
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode && !(user && user.is_staff)) {
    return <Maintenance />;
  }
  return <AppContent />;
};

const AppContent = () => {
  const { loading, setLoading } = useLoading();
  const location = useLocation();

  const [flyAnimation, setFlyAnimation] = useState(null);
  const navbarCartIconRef = useRef(null);

  const handleFlyToCart = useCallback((startPos, image) => {
    if (navbarCartIconRef.current) {
      const endRect = navbarCartIconRef.current.getBoundingClientRect();
      const endPos = { top: endRect.top + endRect.height / 2, left: endRect.left + endRect.width / 2 };
      setFlyAnimation({ startPos, endPos, image });
    }
  }, []);

  const handleAnimationEnd = useCallback(() => setFlyAnimation(null), []);

  useEffect(() => {
    setLoading(true);

    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: document.title });

    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, setLoading]);

  return (
    <>
      <Helmet>
        <title>Triple A Tech | Buy Electronics & Gadgets in Nigeria</title>
        <meta name="description" content="Shop original tech products in Nigeria. Phones, laptops, power banks, accessories and more at best prices. Fast delivery!" />
        <meta name="keywords" content="phones, laptops, power banks, gadgets, electronics, Nigeria, buy tech" />
        <link rel="canonical" href={`https://tripleastechng.com${location.pathname}`} />
      </Helmet>

      <Navbar cartIconRef={navbarCartIconRef} />
      {loading ? <Loading /> : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/request-password-reset" element={<PasswordResetRequest />} />
          <Route path="/reset-password/:uid/:token" element={<PasswordReset />} />
          <Route path="/product-catalog" element={<ProductCatalog />} />
          <Route path="/product/:slug" element={<ProductDetails onFlyToCart={handleFlyToCart} />} /> 
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/payment/debit-credit-card" element={<PaymentDebitCreditCard />} />
          <Route path="/payment/bank-transfer" element={<PaymentBankTransfer />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account/details" element={<AccountDetails />} />
          <Route path="/user/orders" element={<UserOrderParent />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path='/order-failure' element= {<OrderFailure />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/category-full-display/" element={<CategoryProductDisplay />} />
          <Route path="/shop/:categorySlug" element={<ShopCategoryPage />} />
        </Routes>
      )}
      <FloatingNav />
      <Footer />

      {flyAnimation && (
        <FlyToCart
          startPos={flyAnimation.startPos}
          endPos={flyAnimation.endPos}
          image={flyAnimation.image}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
    </>
  );
};

export default App;
