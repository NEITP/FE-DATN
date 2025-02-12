// Import các thư viện cần thiết và các component vào ứng dụng
import React, { Component, Fragment, useEffect, useState } from 'react';
import './css/App.css'; // CSS cho ứng dụng
import Header from './container/Header/Header'; // Header của trang
import Footer from './container/Footer/Footer'; // Footer của trang
import HomePage from './container/Home/HomePage'; // Trang chủ
import ShopPage from './container/Shop/ShopPage'; // Trang cửa hàng
import DetailProductPage from './container/DetailProduct/DetailProductPage'; // Trang chi tiết sản phẩm
import ShopCartPage from './container/ShopCart/ShopCartPage'; // Trang giỏ hàng
import BlogPage from './container/Blog/BlogPage'; // Trang blog
import DetailBlog from './container/Blog/DetailBlog'; // Trang chi tiết bài viết blog

// Các trang liên quan đến hệ thống quản lý
import HomePageAdmin from './container/System/HomePageAdmin'; // Trang chủ admin
import { path } from '../src/utils/constant' // Các đường dẫn được khai báo trong utils/constant
import { ToastContainer } from 'react-toastify'; // Hiển thị thông báo Toast
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"; // Thư viện quản lý routing trong React

import { Redirect } from 'react-router'; // Redirect nếu không có quyền
import VerifyEmail from './container/System/Email/VerifyEmail'; // Trang xác thực email
import LoginWebPage from './container/Login/LoginWebPage'; // Trang đăng nhập
import UserHomePage from './container/User/UseHomePage'; // Trang chủ người dùng
import CustomScrollbars from './component/input/CustomScrollbars'; // Thành phần cuộn tùy chỉnh
import VoucherHomePage from './container/Voucher/VoucherHomePage'; // Trang voucher
import OrderHomePage from './container/Order/OrderHomePage'; // Trang đơn hàng
import TopMenu from './container/Header/TopMenu'; // Menu trên cùng
import PaymentSuccess from './container/User/PaymentSuccess'; // Trang thành công thanh toán
import MessagePage from './container/Message/MessagePage'; // Trang tin nhắn
import VnpayPaymentPage from './container/Order/VnpayPaymentPage'; // Trang thanh toán VNPay
import VnpayPaymentSuccess from './container/Order/VnpayPaymentSuccess'; // Trang thành công thanh toán VNPay

// Hàm App chính
function App() {
  return (
    <Router>
      <Switch>
        <div className="App">
          {/* Route cho trang chủ */}
          <Route exact path="/">
            <Header />
            <HomePage />
            <Footer />
          </Route>

          {/* Route cho trang cửa hàng */}
          <Route path="/shop">
            <Header />
            <ShopPage />
            <Footer />
          </Route>

          {/* Route cho chi tiết sản phẩm */}
          <Route path="/detail-product/:id">
            <Header />
            <DetailProductPage />
            <Footer />
          </Route>

          {/* Route cho trang admin, kiểm tra quyền người dùng */}
          <Route path="/admin/" render={() => {
            if (JSON.parse(localStorage.getItem("userData")) && (JSON.parse(localStorage.getItem("userData")).roleId === "R1" || JSON.parse(localStorage.getItem("userData")).roleId === "R4")) {
              return <HomePageAdmin />
            } else return <Redirect to={"/login"} /> // Nếu không có quyền, redirect đến trang login
          }}></Route>

          {/* Route cho trang người dùng, kiểm tra người dùng đã đăng nhập chưa */}
          <Route path="/user/" render={() => {
            return JSON.parse(localStorage.getItem("userData")) ? <div>
              <Header />
              <UserHomePage />
              <Footer />
            </div> : <Redirect to={"/login"} /> // Nếu chưa đăng nhập, redirect đến trang login
          }}></Route>

          {/* Route cho giỏ hàng */}
          <Route path="/shopcart">
            <Header />
            <ShopCartPage />
            <Footer />
          </Route>

          {/* Route cho trang thanh toán thành công */}
          <Route exact path="/payment/success">
            <Header />
            <PaymentSuccess />
            <Footer />
          </Route>

          {/* Route cho trang thanh toán VNPay */}
          <Route exact path="/payment/vnpay">
            <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
            <VnpayPaymentPage />
            <Footer />
          </Route>

          {/* Route cho trang thanh toán thành công VNPay */}
          <Route exact path="/payment/vnpay_return">
            <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
            <VnpayPaymentSuccess />
            <Footer />
          </Route>

          {/* Route cho trang đăng nhập */}
          <Route path="/login">
            <Header />
            <LoginWebPage />
            <Footer />
          </Route>

          {/* Route cho trang voucher */}
          <Route path="/voucher">
            <Header />
            <VoucherHomePage />
            <Footer />
          </Route>

          {/* Route cho trang blog */}
          <Route path="/blog">
            <Header />
            <BlogPage />
            <Footer />
          </Route>

          {/* Route cho chi tiết bài viết blog */}
          <Route path="/blog-detail/:id">
            <Header />
            <DetailBlog />
            <Footer />
          </Route>

          {/* Route cho trang "Giới thiệu" */}
          <Route path="/about">
            <Header />
            <Footer />
          </Route>

          {/* Route cho trang xác thực email */}
          <Route path="/verify-email">
            <Header />
            <VerifyEmail />
            <Footer />
          </Route>

          {/* Route cho trang đơn hàng của người dùng */}
          <Route path="/order/:userId">
            <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
            <OrderHomePage />
            <Footer />
          </Route>

          {/* Container cho Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Switch>
    </Router>
  );
}

export default App;
