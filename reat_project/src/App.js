import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SignUpForm from './SignUpForm';
import SignIn from './components/Login';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import ProductDetails from './components/ProductDetails';
import ProductList from './components/ProductList';
import { TokenProvider } from './components/TokenContext';
import { CartProvider } from './contexts/CartContext'; 
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
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
import { WishlistProvider } from './contexts/WishlistContext';
import Wishlist from './components/Wishlist';
import AccountDetails from './components/AccountDetails';
import OrderDetails from './components/OrderDetails';
import PowerBankDisplay from './components/PowerBanksSlider';
import Footer from './components/Footer';
import UserOrders from './components/UserOrders';
import FloatingNav from './components/FloatingNav';

const App = () => {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <TokenProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div>
                <Navbar />
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
                  <Route path="/" element={<PowerBankDisplay />} />
                  <Route path="user/orders" element={<UserOrders />} />
                </Routes>
                <FloatingNav />
                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </TokenProvider>
    </UserProvider>
  );
};

export default App;
