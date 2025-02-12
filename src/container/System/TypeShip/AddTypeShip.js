import React from 'react';
import { useEffect, useState } from 'react';
import { createNewTypeShipService, getDetailTypeShipByIdService, updateTypeShipService } from '../../../services/userService';

import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import moment from 'moment';

// Định nghĩa component AddTypeShip
const AddTypeShip = (props) => {

    // Trạng thái để xác định hành động là thêm mới hay cập nhật
    const [isActionADD, setisActionADD] = useState(true);

    // Lấy tham số id từ URL (nếu có)
    const { id } = useParams();

    // Trạng thái để lưu trữ các giá trị đầu vào (tên loại ship và giá tiền)
    const [inputValues, setInputValues] = useState({
        type: '',
        price: ''
    });

    // Hook useEffect dùng để lấy dữ liệu loại ship khi có id
    useEffect(() => {
        // Kiểm tra nếu có id, tức là đang cập nhật thông tin
        if (id) {
            let fetchDetailTypeShip = async () => {
                // Đặt trạng thái là cập nhật
                setisActionADD(false);

                // Lấy thông tin chi tiết loại ship từ API
                let typeship = await getDetailTypeShipByIdService(id);
                // Kiểm tra phản hồi từ API
                if (typeship && typeship.errCode === 0) {
                    // Nếu thành công, gán dữ liệu vào inputValues
                    setInputValues({
                        ...inputValues,
                        ["type"]: typeship.data.type,
                        ["price"]: typeship.data.price
                    });
                }
            }
            // Gọi hàm fetchDetailTypeShip khi có id
            fetchDetailTypeShip();
        }
    }, []);  // Hook chỉ chạy khi component được render lần đầu tiên hoặc khi id thay đổi

    // Xử lý sự kiện thay đổi giá trị input
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm để lưu thông tin loại ship (thêm mới hoặc cập nhật)
    let handleSaveTypeShip = async () => {
        // Nếu là thêm mới loại ship
        if (isActionADD === true) {
            // Gọi API để tạo mới loại ship
            let res = await createNewTypeShipService({
                type: inputValues.type,
                price: inputValues.price,
            });
            // Kiểm tra phản hồi từ API
            if (res && res.errCode === 0) {
                toast.success("Thêm loại ship thành công"); // Hiển thị thông báo thành công
                // Reset lại các giá trị đầu vào sau khi lưu thành công
                setInputValues({
                    ...inputValues,
                    ["type"]: '',
                    ["price"]: ''
                });
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Hiển thị thông báo lỗi nếu có
            }
            else toast.error("Thêm loại ship thất bại"); // Thông báo lỗi khi thêm mới thất bại
        }
        else { // Nếu là cập nhật loại ship
            // Gọi API để cập nhật thông tin loại ship
            let res = await updateTypeShipService({
                type: inputValues.type,
                price: inputValues.price,
                id: id // Truyền id để cập nhật loại ship cụ thể
            });
            // Kiểm tra phản hồi từ API
            if (res && res.errCode === 0) {
                toast.success("Cập nhật loại ship thành công"); // Thông báo thành công
            }
            else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Thông báo lỗi nếu có
            }
            else toast.error("Cập nhật loại ship thất bại"); // Thông báo lỗi khi cập nhật thất bại
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại ship</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD === true ? 'Thêm mới loại ship' : 'Cập nhật thông tin loại ship'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            {/* Tên loại ship */}
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Tên loại ship</label>
                                <input type="text" value={inputValues.type} name="type" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            {/* Giá tiền */}
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Giá tiền</label>
                                <input type="text" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>
                        {/* Nút Lưu thông tin */}
                        <button type="button" onClick={() => handleSaveTypeShip()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTypeShip;
