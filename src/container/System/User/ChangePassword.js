import React from "react";
import { useEffect, useState } from 'react';
import './ChangePassword.scss';  // Import file CSS cho trang thay đổi mật khẩu
import { handleChangePassword } from '../../../services/userService';  // Import hàm thay đổi mật khẩu từ dịch vụ
import { toast } from "react-toastify";  // Thư viện thông báo lỗi hoặc thành công
import { useParams } from "react-router";  // Dùng để lấy tham số từ URL

const ChangePassword = () => {
    const { id } = useParams();  // Lấy tham số id từ URL
    const [inputValues, setInputValues] = useState({
        newpassword: '', confirmpassword: '', oldpassword: ''  // Khởi tạo các state cho mật khẩu cũ, mới, và nhập lại mật khẩu
    });

    // Hàm xử lý khi thay đổi giá trị của input
    const handleOnChange = event => {
        const { name, value } = event.target;  // Lấy tên và giá trị của trường nhập liệu
        setInputValues({ ...inputValues, [name]: value });  // Cập nhật lại giá trị cho input
    };

    // Hàm xử lý lưu mật khẩu
    let handleSavePassword = async () => {
        // Kiểm tra nếu có trường nào bị trống
        if (!inputValues.newpassword || !inputValues.confirmpassword || !inputValues.oldpassword) {
            toast.error("Không được để thông tin trống");  // Thông báo nếu có trường trống
        }
        // Kiểm tra mật khẩu mới và mật khẩu nhập lại có khớp không
        else if (inputValues.newpassword !== inputValues.confirmpassword) {
            toast.error("Mật khẩu nhập lại không trùng khớp !");  // Thông báo nếu mật khẩu không khớp
        }
        else {
            // Gọi API thay đổi mật khẩu
            let res = await handleChangePassword({
                id: id,  // Truyền id người dùng
                password: inputValues.confirmpassword,  // Truyền mật khẩu mới
                oldpassword: inputValues.oldpassword  // Truyền mật khẩu cũ
            })
            if (res && res.errCode === 0) {
                toast.success("Đổi mật khẩu thành công");  // Thông báo thành công
                setInputValues({ ...inputValues, ["newpassword"]: '', ["confirmpassword"]: '', ["oldpassword"]: '' })  // Reset các input về rỗng
            } else {
                toast.error(res.errMessage)  // Thông báo lỗi nếu không thành công
            }
        }
    }

    return (
        <div className="container">
            <div className="container-fluid px-4">
                <h4 className="mt-4">Thay đổi thông tin tài khoản</h4>  {/* Tiêu đề trang */}

                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Đổi mật khẩu  {/* Tiêu đề phần đổi mật khẩu */}
                    </div>
                    <div className="card-body">
                        <form>
                            {/* Nhập mật khẩu cũ */}
                            <div className="form-group col-6">
                                <label htmlFor="exampleInputEmail1">Mật khẩu cũ</label>
                                <input type="password" value={inputValues.oldpassword} name="oldpassword" onChange={(event) => handleOnChange(event)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            {/* Nhập mật khẩu mới */}
                            <div className="form-group col-6">
                                <label htmlFor="exampleInputEmail1">Mật khẩu mới</label>
                                <input type="password" value={inputValues.newpassword} name="newpassword" onChange={(event) => handleOnChange(event)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            {/* Nhập lại mật khẩu */}
                            <div className="form-group col-6">
                                <label htmlFor="exampleInputPassword1">Nhập lại mật khẩu</label>
                                <input type="password" value={inputValues.confirmpassword} name="confirmpassword" onChange={(event) => handleOnChange(event)} className="form-control" id="exampleInputPassword1" />
                            </div>

                            {/* Nút lưu thông tin */}
                            <button onClick={() => handleSavePassword()} type="button" className="btn btn-primary ml-3">Lưu thông tin</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;
