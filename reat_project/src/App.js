// src/App.js
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

// Secret admin
import RequireSuperuser from "./secret/RequireSuperuser";
import SecretProducts from "./secret/SecretProducts";

// ROOT APP
const App = () => {
  return (
    <UserProvider>
      <TokenProvider>
        <CartProvider>
          <WishlistProvider>
            <LoadingProvider>
              <Router>
                <ScrollToTop />
                <AppContent />
              </Router>
            </LoadingProvider>
          </WishlistProvider>
        </CartProvider>
      </TokenProvider>
    </UserProvider>
  );
};

// MAIN APP CONTENT (ALL HOOKS AT TOP – FIXED)
const AppContent = () => {
  // Hooks (must be unconditional)
  const { loading, setLoading } = useLoading();
  const { isSuperuser } = useUser() || {};       // <-- use isSuperuser from context
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

    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
      title: document.title
    });

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search, setLoading]);


  // AFTER HOOKS: safe conditional logic
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  // fallback read of localStorage for maintenance bypass (if context not ready yet)
  let localUserSuper = false;
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser && typeof storedUser.is_superuser !== "undefined") {
      localUserSuper = !!storedUser.is_superuser;
    }
  } catch (e) {
    localUserSuper = false;
  }

  // If app is in maintenance and neither context nor localStorage show superuser -> show Maintenance
  if (isMaintenanceMode && !(!!isSuperuser || localUserSuper)) {
    return <Maintenance />;
  }

  const isSecretAdmin = location.pathname.startsWith("/admin-x9a7-secret");

  return (
    <>
      {/* Hide navbar & footer for secret admin */}
      {!isSecretAdmin && <Navbar cartIconRef={navbarCartIconRef} />}

      {loading ? (
        <Loading />
      ) : (
        <Routes>

          {/* SECRET ADMIN ROUTE */}
          <Route
            path="/admin-x9a7-secret"
            element={
              <RequireSuperuser>
                <SecretProducts />
              </RequireSuperuser>
            }
          />

          {/* PUBLIC ROUTES */}
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
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path='/order-failure' element={<OrderFailure />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/category-full-display/" element={<CategoryProductDisplay />} />
          <Route path="/shop/:categorySlug" element={<ShopCategoryPage />} />

          {/* 404 LAST */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}

      {!isSecretAdmin && <FloatingNav />}
      {!isSecretAdmin && <Footer />}

      {flyAnimation && !isSecretAdmin && (
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
