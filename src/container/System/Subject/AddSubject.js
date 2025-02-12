import React from 'react';
import { useEffect, useState } from 'react'; // import hook từ React
import { createAllCodeService, getDetailAllcodeById, UpdateAllcodeService } from '../../../services/userService'; // import các service cần thiết

import { toast } from 'react-toastify'; // để thông báo thành công/ thất bại
import { useParams } from "react-router-dom"; // hook dùng để lấy tham số từ URL

import 'react-toastify/dist/ReactToastify.css'; // để sử dụng thư viện toast thông báo

import moment from 'moment'; // thư viện xử lý thời gian

const AddSubject = (props) => {
    // State quản lý hành động thêm hay cập nhật
    const [isActionADD, setisActionADD] = useState(true);

    // Lấy id từ URL (dùng để xác định xem là thêm mới hay cập nhật)
    const { id } = useParams();

    // State lưu trữ giá trị của các input
    const [inputValues, setInputValues] = useState({
        value: '', code: '' // Các trường nhập liệu cho chủ đề
    });

    useEffect(() => {
        // Kiểm tra nếu id tồn tại, thực hiện lấy chi tiết của chủ đề cần cập nhật
        if (id) {
            let fetchDetailSubject = async () => {
                setisActionADD(false); // Đổi sang chế độ chỉnh sửa
                let allcode = await getDetailAllcodeById(id); // Gọi API lấy thông tin chủ đề theo id
                if (allcode && allcode.errCode === 0) {
                    // Cập nhật giá trị từ response vào input
                    setInputValues({ ...inputValues, ["value"]: allcode.data.value, ["code"]: allcode.data.code });
                }
            };
            fetchDetailSubject();
        }
    }, []); // useEffect này chỉ chạy khi component mount

    // Hàm xử lý thay đổi giá trị input
    const handleOnChange = event => {
        const { name, value } = event.target; // lấy tên và giá trị của input
        setInputValues({ ...inputValues, [name]: value }); // cập nhật state
    };

    // Hàm xử lý lưu thông tin chủ đề
    let handleSaveSubject = async () => {
        if (isActionADD === true) {
            // Thực hiện thêm mới chủ đề
            let res = await createAllCodeService({
                value: inputValues.value,
                code: inputValues.code,
                type: 'SUBJECT'
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm chủ đề thành công"); // Hiển thị thông báo thành công
                setInputValues({
                    ...inputValues,
                    ["value"]: '', // Reset lại các giá trị input
                    ["code"]: ''
                });
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Hiển thị lỗi từ API nếu có
            }
            else toast.error("Thêm chủ đề thất bại"); // Nếu không thành công
        } else {
            // Thực hiện cập nhật chủ đề
            let res = await UpdateAllcodeService({
                value: inputValues.value,
                code: inputValues.code,
                id: id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật chủ đề thành công"); // Hiển thị thông báo thành công
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Hiển thị lỗi từ API nếu có
            }
            else toast.error("Cập nhật chủ đề thất bại"); // Nếu không thành công
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chủ đề</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD === true ? 'Thêm mới chủ đề' : 'Cập nhật thông tin chủ đề'}
                    {/* Hiển thị tiêu đề tùy thuộc vào chế độ thêm mới hay chỉnh sửa */}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Tên chủ đề</label>
                                <input
                                    type="text"
                                    value={inputValues.value}
                                    name="value"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputEmail4"
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Mã code</label>
                                <input
                                    type="text"
                                    value={inputValues.code}
                                    name="code"
                                    onChange={(event) => handleOnChange(event)}
                                    className="form-control"
                                    id="inputPassword4"
                                />
                            </div>
                        </div>
                        <button type="button" onClick={() => handleSaveSubject()} className="btn btn-primary">Lưu thông tin</button>
                        {/* Nút lưu thông tin, gọi hàm xử lý khi nhấn */}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddSubject;
