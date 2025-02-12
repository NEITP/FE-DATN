import React from 'react';
import { useEffect, useState } from 'react'; // Hook để quản lý trạng thái và side-effects
import { createNewSupplierService, getDetailSupplierByIdService, updateSupplierService } from '../../../services/userService'; // Import các dịch vụ API liên quan đến nhà cung cấp

import { toast } from 'react-toastify'; // Thư viện thông báo cho các phản hồi thành công/ thất bại
import { useParams } from "react-router-dom"; // Hook để lấy tham số từ URL (như id)
import 'react-toastify/dist/ReactToastify.css'; // CSS của thư viện react-toastify để hiển thị thông báo

import moment from 'moment'; // Thư viện xử lý thời gian

const AddSupplier = (props) => {
    const [isActionADD, setisActionADD] = useState(true); // Trạng thái để phân biệt giữa thêm mới và chỉnh sửa
    const { id } = useParams(); // Lấy id nhà cung cấp từ URL (dùng trong trường hợp chỉnh sửa)

    const [inputValues, setInputValues] = useState({ // Quản lý các giá trị nhập vào từ form
        name: '',
        address: '',
        phonenumber: '',
        email: ''
    });

    // useEffect hook để fetch dữ liệu khi component mount hoặc id thay đổi
    useEffect(() => {
        if (id) { // Nếu có id (chỉnh sửa), lấy thông tin nhà cung cấp
            let fetchDetailSupplier = async () => {
                setisActionADD(false); // Đổi trạng thái để chuyển sang chế độ sửa
                let supplier = await getDetailSupplierByIdService(id); // Lấy thông tin nhà cung cấp từ API
                if (supplier && supplier.errCode === 0) { // Nếu lấy được dữ liệu thành công
                    setInputValues({
                        ...inputValues,
                        ["name"]: supplier.data.name,
                        ["address"]: supplier.data.address,
                        ["phonenumber"]: supplier.data.phonenumber,
                        ["email"]: supplier.data.email
                    });
                }
            }
            fetchDetailSupplier(); // Gọi hàm lấy dữ liệu
        }
    }, []); // Chạy 1 lần khi component mount

    // Hàm xử lý sự kiện thay đổi giá trị input
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy name và value từ input
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật lại giá trị tương ứng trong state
    };

    // Hàm lưu thông tin nhà cung cấp
    let handleSaveSupplier = async () => {
        if (isActionADD === true) { // Nếu là hành động thêm mới
            let res = await createNewSupplierService({
                name: inputValues.name,
                address: inputValues.address,
                email: inputValues.email,
                phonenumber: inputValues.phonenumber,
            });
            if (res && res.errCode === 0) { // Nếu thêm mới thành công
                toast.success("Thêm nhà cung cấp thành công");
                setInputValues({
                    ...inputValues,
                    ["name"]: '',
                    ["address"]: '',
                    ["email"]: '',
                    ["phonenumber"]: ''
                }); // Reset các giá trị trong form
            }
            else if (res && res.errCode === 2) { // Nếu có lỗi từ API
                toast.error(res.errMessage); // Hiển thị lỗi
            }
            else toast.error("Thêm nhà cung cấp thất bại");
        } else { // Nếu là hành động sửa
            let res = await updateSupplierService({
                name: inputValues.name,
                address: inputValues.address,
                email: inputValues.email,
                phonenumber: inputValues.phonenumber,
                id: id // Cung cấp id để cập nhật đúng nhà cung cấp
            });
            if (res && res.errCode === 0) { // Nếu cập nhật thành công
                toast.success("Cập nhật nhà cung cấp thành công");
            }
            else if (res && res.errCode === 2) { // Nếu có lỗi từ API
                toast.error(res.errMessage); // Hiển thị lỗi
            }
            else toast.error("Cập nhật nhà cung cấp thất bại");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhà cung cấp</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {/* Hiển thị tiêu đề tùy theo hành động thêm hay sửa */}
                    {isActionADD === true ? 'Thêm mới nhà cung cấp' : 'Cập nhật thông tin nhà cung cấp'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Tên nhà cung cấp</label>
                                <input
                                    type="text"
                                    value={inputValues.name}
                                    name="name"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputEmail4"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Địa chỉ email</label>
                                <input
                                    type="text"
                                    value={inputValues.email}
                                    name="email"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputPassword4"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={inputValues.address}
                                    name="address"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputEmail4"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={inputValues.phonenumber}
                                    name="phonenumber"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputPassword4"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSaveSupplier()}
                            className="btn btn-primary">
                            Lưu thông tin
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddSupplier;
