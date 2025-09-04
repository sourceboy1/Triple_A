import React, { useEffect, Suspense, lazy } from 'react'; // Added Suspense and lazy for potential future use or better performance
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TokenProvider } from './components/TokenContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import Loading from './components/Loading';

// Import Maintenance component directly
import Maintenance from './components/Maintenance';

// Lazy load components for better performance on larger apps
// For smaller apps, direct import is fine, but good practice to consider
const Navbar = lazy(() => import('./components/Navbar'));
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const SignUpForm = lazy(() => import('./SignUpForm'));
const SignIn = lazy(() => import('./components/Login'));
const PasswordResetRequest = lazy(() => import('./components/PasswordResetRequest'));
const PasswordReset = lazy(() => import('./components/PasswordReset'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ProductList = lazy(() => import('./components/ProductList'));
const CategoryProducts = lazy(() => import('./components/CategoryProducts'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const ReturnRefundPolicy = lazy(() => import('./components/ReturnRefundPolicy'));
const FAQ = lazy(() => import('./components/FAQ'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const PaymentDebitCreditCard = lazy(() => import('./components/PaymentDebitCreditCard'));
const PaymentBankTransfer = lazy(() => import('./components/PaymentBankTransfer'));
const Account = lazy(() => import('./components/Account'));
const Wishlist = lazy(() => import('./components/Wishlist'));
const AccountDetails = lazy(() => import('./components/AccountDetails'));
const OrderDetails = lazy(() => import('./components/OrderDetails'));
const PowerBankDisplay = lazy(() => import('./components/PowerBanksSlider')); // Not used in AppContent, but kept for completeness
const Footer = lazy(() => import('./components/Footer'));
const UserOrderParent = lazy(() => import('./components/UserOrderParent'));
const FloatingNav = lazy(() => import('./components/FloatingNav'));
const NotFoundPage = lazy(() => import('./components/404Page'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));

const App = () => {
  return (
    <UserProvider>
      <TokenProvider>
        <CartProvider>
          <WishlistProvider>
            <LoadingProvider>
              <Router>
                <ScrollToTop />
                {/* Check for maintenance mode BEFORE rendering anything else */}
                <MaintenanceWrapper />
              </Router>
            </LoadingProvider>
          </WishlistProvider>
        </CartProvider>
      </TokenProvider>
    </UserProvider>
  );
};

/**
 * This wrapper decides if maintenance mode should be applied.
 * - If REACT_APP_MAINTENANCE_MODE=true AND user is NOT staff → show Maintenance
 * - Otherwise → load normal app
 */
const MaintenanceWrapper = () => {
  const { user } = useUser();
  // Check if the environment variable is explicitly 'true'
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  // If maintenance mode is on AND user is not staff → show maintenance
  // Note: user and user.is_staff might be undefined/null initially
  // so `user && user.is_staff` correctly handles that.
  if (isMaintenanceMode && (!user || !user.is_staff)) {
    return <Maintenance />;
  }

  // Otherwise → show app content
  return <AppContent />;
};

const AppContent = () => {
  const { loading, setLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Add a small delay for perceived loading, adjust as needed
    const timer = setTimeout(() => setLoading(false), 500); // Shorter delay
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Suspense fallback={<Loading />}> {/* Fallback for lazy loaded components */}
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
      </Suspense>
    </>
  );
};

export default App;