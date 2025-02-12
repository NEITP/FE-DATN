import React, { useEffect, useState } from 'react';  // Import React và các hook cần thiết.
import { toast } from 'react-toastify';  // Import thư viện toast để thông báo.
import { paymentOrderSuccessService } from '../../services/userService';  // Import service xử lý thanh toán thành công.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useLocation
} from "react-router-dom";  // Import các component và hooks của react-router-dom để quản lý routing.

function useQuery() {
    const { search } = useLocation();  // Hook lấy thông tin search (query string) từ URL.

    return React.useMemo(() => new URLSearchParams(search), [search]);  // Trả về các tham số query dưới dạng một URLSearchParams.
}

// Component PaymentSuccess: Xử lý khi thanh toán thành công.
function PaymentSuccess(props) {
    let query = useQuery();  // Gọi hook useQuery để lấy các tham số từ query string.

    useEffect(() => {  // Hook useEffect để xử lý logic sau khi component được render.
        let orderData = JSON.parse(localStorage.getItem("orderData"));  // Lấy dữ liệu đơn hàng từ localStorage.
        localStorage.removeItem("orderData");  // Sau khi lấy xong thì xóa dữ liệu khỏi localStorage.

        if (orderData) {  // Nếu có dữ liệu đơn hàng trong localStorage.
            orderData.paymentId = query.get("paymentId");  // Lấy paymentId từ query string và gán vào orderData.
            orderData.token = query.get("token");  // Lấy token từ query string và gán vào orderData.
            orderData.PayerID = query.get("PayerID");  // Lấy PayerID từ query string và gán vào orderData.

            createNewOrder(orderData);  // Gọi hàm createNewOrder để xử lý việc tạo đơn hàng mới với dữ liệu đã lấy được.
        }
    }, []);  // Chạy một lần khi component mount.

    // Hàm xử lý việc tạo đơn hàng mới sau khi thanh toán thành công.
    let createNewOrder = async (data) => {
        let res = await paymentOrderSuccessService(data);  // Gọi service paymentOrderSuccessService để xử lý thanh toán.

        if (res && res.errCode == 0) {  // Kiểm tra nếu thanh toán thành công (errCode == 0).
            toast.success("Thanh toán hóa đơn thành công");  // Hiển thị thông báo thanh toán thành công.
            const userData = JSON.parse(localStorage.getItem('userData'));  // Lấy thông tin người dùng từ localStorage.
            setTimeout(() => {  // Sau 2 giây, chuyển hướng đến trang đơn hàng của người dùng.
                window.location.href = '/user/order/' + userData.id;
            }, 2000);
        } else {  // Nếu có lỗi trong quá trình thanh toán.
            toast.error(res.errMessage);  // Hiển thị thông báo lỗi.
        }
    }

    return (
        <div style={{ height: '50vh', textAlign: 'center' }}>
            {/* Phần này hiển thị giao diện của trang thanh toán thành công. */}
        </div>
    );
}

export default PaymentSuccess;
