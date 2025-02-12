import React, { useEffect, useState } from 'react';
import { createNewTypeVoucherService, getDetailTypeVoucherByIdService, updateTypeVoucherService } from '../../../services/userService'; // Nhập các dịch vụ để thao tác với API
import { toast } from 'react-toastify'; // Thư viện để hiển thị thông báo
import { useParams } from "react-router-dom"; // Hook để lấy tham số từ URL
import 'react-toastify/dist/ReactToastify.css'; // Thư viện thông báo sử dụng CSS mặc định
import { useFetchAllcode } from '../../customize/fetch'; // Hook tùy chỉnh để lấy danh sách loại voucher
import moment from 'moment'; // Thư viện xử lý ngày tháng

const AddTypeVoucher = (props) => {
    // Lấy dữ liệu về các loại voucher từ API
    const { data: dataTypeVoucher } = useFetchAllcode('DISCOUNT');

    // Trạng thái cho biết đây là thao tác thêm mới (ADD) hay cập nhật (UPDATE)
    const [isActionADD, setisActionADD] = useState(true);

    // Lấy id từ URL để xác định xem có phải đang cập nhật loại voucher không
    const { id } = useParams();

    // State lưu trữ các giá trị đầu vào của form
    const [inputValues, setInputValues] = useState({
        typeVoucher: '', value: '', maxValue: '', minValue: ''
    });

    // Nếu chưa có giá trị loại voucher, thiết lập mặc định
    if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucher === '') {
        setInputValues({ ...inputValues, ["typeVoucher"]: dataTypeVoucher[0].code });
    }

    useEffect(() => {
        // Nếu có id trong URL, đây là thao tác cập nhật
        if (id) {
            let fetchDetailTypeShip = async () => {
                setisActionADD(false); // Đánh dấu đang trong chế độ cập nhật
                let typevoucher = await getDetailTypeVoucherByIdService(id); // Gọi API để lấy chi tiết loại voucher theo id
                if (typevoucher && typevoucher.errCode === 0) {
                    // Cập nhật state với dữ liệu lấy được từ API
                    setInputValues({
                        ...inputValues,
                        ["typeVoucher"]: typevoucher.data.typeVoucher,
                        ["value"]: typevoucher.data.value,
                        ["maxValue"]: typevoucher.data.maxValue,
                        ["minValue"]: typevoucher.data.minValue
                    });
                }
            };
            fetchDetailTypeShip();
        }
    }, [id]); // useEffect chỉ chạy khi có sự thay đổi ở id

    // Hàm xử lý thay đổi dữ liệu đầu vào
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm lưu thông tin loại voucher
    let handleSaveTypeVoucher = async () => {
        if (isActionADD) {
            // Nếu là thao tác thêm mới
            let res = await createNewTypeVoucherService({
                typeVoucher: inputValues.typeVoucher,
                value: inputValues.value,
                maxValue: inputValues.maxValue,
                minValue: inputValues.minValue
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm loại voucher thành công"); // Hiển thị thông báo thành công
                // Reset lại các trường dữ liệu trong form
                setInputValues({
                    typeVoucher: '',
                    value: '',
                    maxValue: '',
                    minValue: ''
                });
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Hiển thị thông báo lỗi từ API
            } else {
                toast.error("Thêm loại voucher thất bại");
            }
        } else {
            // Nếu là thao tác cập nhật
            let res = await updateTypeVoucherService({
                typeVoucher: inputValues.typeVoucher,
                value: inputValues.value,
                maxValue: inputValues.maxValue,
                minValue: inputValues.minValue,
                id: id
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật loại voucher thành công"); // Hiển thị thông báo thành công
            } else if (res && res.errCode === 2) {
                toast.error(res.errMessage); // Hiển thị thông báo lỗi từ API
            } else {
                toast.error("Cập nhật loại voucher thất bại");
            }
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại voucher</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {/* Tùy thuộc vào thao tác là thêm mới hay cập nhật mà hiển thị tiêu đề khác nhau */}
                    {isActionADD === true ? 'Thêm mới loại voucher' : 'Cập nhật thông tin loại voucher'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Loại voucher</label>
                                {/* Dropdown chọn loại voucher */}
                                <select value={inputValues.typeVoucher} name="typeVoucher" onChange={handleOnChange} id="inputState" className="form-control">
                                    {dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                        dataTypeVoucher.map((item, index) => (
                                            <option key={index} value={item.code}>{item.value}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Giá trị</label>
                                <input type="text" value={inputValues.value} name="value" onChange={handleOnChange} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Giá trị tối thiểu</label>
                                <input type="number" value={inputValues.minValue} name="minValue" onChange={handleOnChange} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Giá trị tối đa</label>
                                <input type="number" value={inputValues.maxValue} name="maxValue" onChange={handleOnChange} className="form-control" id="inputPassword4" />
                            </div>
                        </div>
                        {/* Nút lưu thông tin */}
                        <button type="button" onClick={handleSaveTypeVoucher} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTypeVoucher;
