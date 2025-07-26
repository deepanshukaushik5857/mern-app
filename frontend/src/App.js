import "./App.css";
import axios from "axios";
import React, { useState } from "react";
import Header from "./components/layout/Header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import webfont from "webfontloader";
import Footer from "./components/layout/Foooter/Footer";
import Home from "./components/Home/Home";
import Loader from "./components/layout/Loader/Loader";
import ProductDetails from "./components/product/ProductDetails";
import Products from "./components/product/Products";
import Search from "./components/product/Search";
import LoginSignup from "./components/User/LoginSignup";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile.js";
import ProtectedRoute from "./components/Route/ProtectedRoute.js";
import UpdateProfile from "./components/User/UpdateProfile.js";
import UpdatePassword from "./components/User/UpdatePassword.js";
import ForgotPassword from "./components/User/ForgotPassword.js";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping.js";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js";
import Payment from "./components/Cart/Payment.js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import OrderSuccess from "./components/Cart/OrderSuccess.js";
import MyOrder from "./components/Order/MyOrder";
import OrderDetails from "./components/Order/OrderDetails";
import Dashboard from "./components/admin/Dashboard.js";

// Axios setup
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const [stripePromise, setStripePromise] = useState(null);

  async function getStripeApiKey() {
    const { data } = await axios.get(`/stripeapikey`);
    const promise = await loadStripe(data.stripeApiKey);
    setStripePromise(promise);
  }

  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      {stripePromise && (
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/process/payment" element={
              <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
                <Payment />
              </ProtectedRoute>
            } />
          </Routes>
        </Elements>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sad" element={<Loader />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/account" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/me/update" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <UpdateProfile />
          </ProtectedRoute>
        } />
        <Route path="/password/update" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <UpdatePassword />
          </ProtectedRoute>
        } />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login/shipping" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <Shipping />
          </ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <MyOrder />
          </ProtectedRoute>
        } />
        <Route path="/order/:id" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/order/confirm" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <ConfirmOrder />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute isAdmin={true} isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
