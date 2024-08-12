import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SignUpForm from './SignUpForm';
import Login from './components/Login';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import ProductDetails from './components/ProductDetails';
import ProductList from './components/ProductList';
import { TokenProvider } from './components/TokenContext';
import CategoryProducts from './components/CategoryProducts';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { CartProvider } from './contexts/CartContext'; // Import CartProvider

const App = () => {
  return (
    <TokenProvider>
      <CartProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/request-password-reset" element={<PasswordResetRequest />} />
              <Route path="/reset-password/:uid/:token" element={<PasswordReset />} />
              <Route path="/product-details/:productId" element={<ProductDetails />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/shop/:categoryName" element={<CategoryProducts />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </TokenProvider>
  );
};

export default App;






