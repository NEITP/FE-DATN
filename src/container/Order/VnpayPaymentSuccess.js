import React, { useEffect, useState } from 'react';  // Import React và các hook cần thiết
import { Link, NavLink, useHistory, useParams, useLocation } from 'react-router-dom';  // Các hook của React Router để điều hướng

import {
    paymentOrderVnpaySuccessService, confirmOrderVnpay
} from '../../services/userService';  // Import các service để xử lý thành công thanh toán và xác nhận đơn hàng

import './OrderHomePage.scss';  // Import file CSS cho giao diện

import { toast } from 'react-toastify';  // Thư viện thông báo cho người dùng

import CommonUtils from '../../utils/CommonUtils';  // Các hàm tiện ích chung

// Custom hook để lấy tham số truy vấn từ URL
function useQuery() {
    const { search } = useLocation();  // Lấy phần search (query string) từ URL
    return React.useMemo(() => new URLSearchParams(search), [search]);  // Trả về các tham số query dưới dạng URLSearchParams
}

function VnpayPaymentSuccess(props) {
    let query = useQuery();  // Lấy tham số truy vấn từ URL

    // useEffect được gọi khi component được render, dùng để xác nhận thanh toán
    useEffect(() => {
        // Tạo đối tượng chứa các tham số trả về từ VNPAY (lấy từ query string)
        let objectParam = {
            vnp_Amount: query.get('vnp_Amount'),  // Số tiền giao dịch
            vnp_BankCode: query.get('vnp_BankCode'),  // Mã ngân hàng
            vnp_BankTranNo: query.get('vnp_BankTranNo'),  // Số giao dịch ngân hàng
            vnp_CardType: query.get('vnp_CardType'),  // Loại thẻ
            vnp_OrderInfo: query.get('vnp_OrderInfo'),  // Thông tin đơn hàng
            vnp_PayDate: query.get('vnp_PayDate'),  // Ngày thanh toán
            vnp_ResponseCode: query.get('vnp_ResponseCode'),  // Mã phản hồi của VNPAY
            vnp_TmnCode: query.get('vnp_TmnCode'),  // Mã đơn vị
            vnp_TransactionNo: query.get('vnp_TransactionNo'),  // Số giao dịch VNPAY
            vnp_TransactionStatus: query.get('vnp_TransactionStatus'),  // Trạng thái giao dịch
            vnp_TxnRef: query.get('vnp_TxnRef'),  // Mã tham chiếu giao dịch
            vnp_SecureHash: query.get('vnp_SecureHash')  // Mã bảo mật
        };

        // Hàm xác nhận thanh toán sau khi nhận được các tham số từ VNPAY
        let confirm = async () => {
            let orderData = JSON.parse(localStorage.getItem("orderData"));  // Lấy dữ liệu đơn hàng từ localStorage
            localStorage.removeItem("orderData");  // Xóa dữ liệu đơn hàng khỏi localStorage để tránh trùng lặp

            if (orderData) {
                // Gọi API để xác nhận thanh toán
                let res = await confirmOrderVnpay(objectParam);
                if (res && res.errCode === 0) {
                    // Nếu xác nhận thành công, tạo đơn hàng mới
                    createNewOrder(orderData);
                }
            }
        };
        confirm();  // Gọi hàm xác nhận thanh toán ngay khi component được render
    }, []);  // Chạy effect chỉ một lần sau khi component render

    // Hàm tạo đơn hàng mới sau khi thanh toán thành công
    let createNewOrder = async (data) => {
        // Gọi API để tạo đơn hàng mới sau khi thanh toán thành công
        let res = await paymentOrderVnpaySuccessService(data);
        if (res && res.errCode === 0) {
            // Nếu tạo đơn hàng thành công, thông báo cho người dùng và chuyển hướng đến trang đơn hàng của người dùng
            toast.success("Thanh toán hóa đơn thành công");
            const userData = JSON.parse(localStorage.getItem('userData'));  // Lấy thông tin người dùng từ localStorage
            setTimeout(() => {
                // Sau 2 giây, chuyển hướng đến trang đơn hàng của người dùng
                window.location.href = '/user/order/' + userData.id;
            }, 2000);
        } else {
            // Nếu có lỗi khi tạo đơn hàng, thông báo lỗi cho người dùng
            toast.error(res.errMessgae);
        }
    };
    return (

        <>

            <div className="wrap-order">
                <div className="wrap-heading-order">
                    <NavLink to="/" className="navbar-brand logo_h">
                        <img src="/resources/img/logo.png" alt="" />
                    </NavLink>
                    <span>Thanh Toán VNPAY</span>
                </div>

                <div className="wrap-order-item">
                    <section className="cart_area">
                        <div className="container">
                            <div className="cart_inner">
                                <div className="col-md-12">
                                    <div className="p-3 py-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="text-right">Thông tin thanh toán</h4>
                                        </div>



                                    </div>
                                </div>
                            </div>



                        </div>


                    </section>
                </div>


            </div>
            <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>
        </>

    );
}

export default VnpayPaymentSuccess;