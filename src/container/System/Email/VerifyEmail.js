import React from 'react';  // Nhập thư viện React để sử dụng các tính năng của React
import { useEffect, useState } from 'react';  // Các hook của React: useEffect để thực thi mã khi component mount và useState để lưu trữ trạng thái
import { useHistory, useParams } from 'react-router-dom';  // Các hook của React Router để điều hướng (history) và lấy tham số từ URL (useParams)
import { toast } from 'react-toastify';  // Thư viện thông báo toast để hiển thị các thông báo khi có sự kiện xảy ra
import 'react-toastify/dist/ReactToastify.css';  // Nhập CSS để sử dụng kiểu dáng thông báo từ React Toastify
import './VerifyEmail.scss';  // Nhập file SCSS để định kiểu cho component VerifyEmail
import { handleVerifyEmail } from '../../../services/userService';  // Dịch vụ để gửi yêu cầu xác thực email

const VerifyEmail = () => {
    const [status, setstatus] = useState(false);  // State lưu trữ trạng thái của quá trình xác thực email (thành công hoặc thất bại)

    // useEffect được gọi khi component render lần đầu (component mount)
    useEffect(() => {
        let token = getParam("token");  // Lấy token từ URL (param 'token')
        let id = getParam("userId");  // Lấy userId từ URL (param 'userId')

        // Hàm xác thực email gọi API
        let fetchVerifyEmail = async () => {
            let res = await handleVerifyEmail({
                token: token,  // Truyền token vào API
                id: id  // Truyền userId vào API
            })
            console.log(res.errCode);  // In ra errCode của phản hồi từ API để kiểm tra trạng thái
            if (res.errCode === 0) {  // Nếu xác thực thành công
                setstatus(true);  // Cập nhật state thành true để hiển thị thông báo thành công
            }
        }
        fetchVerifyEmail();  // Gọi hàm xác thực email

    }, []);  // Mảng phụ thuộc rỗng, chỉ gọi 1 lần khi component mount

    // Hàm lấy giá trị tham số từ URL
    let getParam = (param) => {
        let url = new URL(window.location.href);  // Tạo đối tượng URL từ địa chỉ hiện tại
        return url.searchParams.get(param);  // Lấy giá trị của tham số 'param' từ query string
    }

    console.log("check status", status);  // In ra giá trị trạng thái của quá trình xác thực email

    return (
        <div className="container-verify-email">
            <h3 className="text-verify-email">
                {/* Hiển thị thông báo thành công nếu status là true, nếu không hiển thị thông báo thất bại */}
                {status === true && "Xác thực email thành công !"}
                {status === false && "Email đã được xác thực hoặc không tồn tại !"}
            </h3>
        </div>
    )
}

export default VerifyEmail;  // Xuất component VerifyEmail để có thể sử dụng ở các phần khác trong ứng dụng
