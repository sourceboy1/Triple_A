import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import CategoryProducts from './components/CategoryProducts';
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

// Import ReactGA for tracking
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

  // Effect to handle loading state AND Google Analytics page views
  useEffect(() => {
    // Start loading animation
    setLoading(true);

    // Send page view to Google Analytics 4
    // You can also send more detailed events here if needed
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search, title: document.title });

    // End loading animation after a delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, setLoading]); // Depend on location.pathname and location.search

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/request-password-reset" element={<PasswordResetRequest />} />
          <Route path="/reset-password/:uid/:token" element={<PasswordReset />} />
          <Route path="/product-catalog" element={<ProductCatalog />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/shop/:categoryName" element={<CategoryProducts />} />
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
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/user/orders" element={<UserOrderParent />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
      <FloatingNav />
      <Footer />
    </>
  );
};

export default App;