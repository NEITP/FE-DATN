import React from 'react';
import { useEffect, useState } from 'react';  // Import các hook useEffect và useState từ React
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService';  // Import các hàm dịch vụ liên quan đến API
import { toast } from 'react-toastify';  // Import thư viện thông báo
import { useParams } from "react-router-dom";  // Hook dùng để lấy tham số từ URL
import 'react-toastify/dist/ReactToastify.css';  // Import CSS cho react-toastify
import moment from 'moment';  // Thư viện để làm việc với thời gian

const AddBrand = (props) => {
    const [isActionADD, setisActionADD] = useState(true);  // state kiểm tra hành động là thêm mới hay cập nhật
    const { id } = useParams();  // Lấy tham số id từ URL

    const [inputValues, setInputValues] = useState({
        value: '',  // Tên nhãn hàng
        code: ''    // Mã code của nhãn hàng
    });

    useEffect(() => {
        // Nếu id tồn tại trong URL, tức là đang chỉnh sửa một nhãn hàng đã có
        if (id) {
            let fetchDetailCategory = async () => {
                setisActionADD(false);  // Chuyển trạng thái sang cập nhật
                let allcode = await getDetailAllcodeById(id);  // Lấy thông tin chi tiết nhãn hàng qua API
                if (allcode && allcode.errCode === 0) {
                    setInputValues({ ...inputValues, ["value"]: allcode.data.value, ["code"]: allcode.data.code });
                }
            }
            fetchDetailCategory();  // Gọi hàm lấy dữ liệu
        }
    }, []);  // useEffect chỉ chạy 1 lần khi component được mount lên

    const handleOnChange = event => {
        const { name, value } = event.target;  // Lấy tên và giá trị từ các trường input
        setInputValues({ ...inputValues, [name]: value });  // Cập nhật state inputValues
    };

    let handleSaveCategory = async () => {
        // Kiểm tra xem là thêm mới hay cập nhật nhãn hàng
        if (isActionADD === true) {
            let res = await createAllCodeService({
                value: inputValues.value,
                code: inputValues.code,
                type: 'BRAND'  // Loại nhãn hàng
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm nhãn hàng thành công");  // Hiển thị thông báo thành công
                setInputValues({  // Reset lại form sau khi thêm
                    ...inputValues,
                    ["value"]: '',
                    ["code"]: ''
                });
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage);  // Nếu lỗi có mã 2, hiển thị thông báo lỗi cụ thể
            }
            else toast.error("Thêm nhãn hàng thất bại");  // Thông báo lỗi chung
        } else {
            let res = await UpdateAllcodeService({
                value: inputValues.value,
                code: inputValues.code,
                id: id  // ID của nhãn hàng cần cập nhật
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật nhãn hàng thành công");  // Hiển thị thông báo cập nhật thành công
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage);  // Nếu lỗi có mã 2, hiển thị thông báo lỗi cụ thể
            }
            else toast.error("Cập nhật nhãn hàng thất bại");  // Thông báo lỗi chung
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhãn hàng</h1>  {/* Tiêu đề trang */}

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {/* Hiển thị tiêu đề dựa trên trạng thái của isActionADD */}
                    {isActionADD === true ? 'Thêm mới nhãn hàng' : 'Cập nhật thông tin nhãn hàng'}
                </div>
                <div className="card-body">
                    <form>
                        {/* Form nhập thông tin nhãn hàng */}
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Tên nhãn hàng</label>
                                {/* Input cho tên nhãn hàng */}
                                <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Mã code</label>
                                {/* Input cho mã code */}
                                <input type="text" value={inputValues.code} name="code" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>
                        {/* Button lưu thông tin */}
                        <button type="button" onClick={() => handleSaveCategory()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddBrand;
