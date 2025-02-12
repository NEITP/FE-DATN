import React from 'react';
import { useEffect, useState } from 'react';
import DatePicker from '../../../component/input/DatePicker'; // Nhập component DatePicker để chọn ngày
import { toast } from 'react-toastify'; // Sử dụng thư viện thông báo toast để hiển thị thông báo
import { useParams } from "react-router-dom"; // Để lấy tham số URL từ router
import 'react-toastify/dist/ReactToastify.css';
import { getSelectTypeVoucher, createNewVoucherService, getDetailVoucherByIdService, updateVoucherService } from '../../../services/userService'; // Các service liên quan đến việc tạo, lấy chi tiết và cập nhật voucher
import moment from 'moment'; // Sử dụng thư viện moment.js để xử lý ngày tháng

const AddVoucher = (props) => {
    // State để lưu trữ danh sách loại voucher và thông tin input
    const [dataTypeVoucher, setdataTypeVoucher] = useState([])

    // Lấy tham số 'id' từ URL nếu có (để sử dụng khi chỉnh sửa voucher đã có)
    const { id } = useParams();

    // State để lưu trữ thông tin của voucher đang thao tác
    const [inputValues, setInputValues] = useState({
        fromDate: '', toDate: '', typeVoucherId: '', amount: '', codeVoucher: '', isChangeFromDate: false, isChangeToDate: false, isActionADD: true,
        fromDateUpdate: '', toDateUpdate: ''
    });

    // Kiểm tra và gán giá trị mặc định cho typeVoucherId nếu có dữ liệu loại voucher
    if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucherId === '') {
        setInputValues({ ...inputValues, ["typeVoucherId"]: dataTypeVoucher[0].id })
    }

    useEffect(() => {
        // Lấy danh sách loại voucher
        let fetchTypeVoucher = async () => {
            let typevoucher = await getSelectTypeVoucher()
            if (typevoucher && typevoucher.errCode === 0) {
                setdataTypeVoucher(typevoucher.data)
            }
        }
        fetchTypeVoucher()

        // Nếu có id (chỉnh sửa voucher), fetch chi tiết voucher
        if (id) {
            let fetchVoucher = async () => {
                let voucher = await getDetailVoucherByIdService(id)
                if (voucher && voucher.errCode === 0) {
                    setStateVoucher(voucher.data)
                }
            }
            fetchVoucher()
        }
    }, []) // Chạy khi component mount hoặc khi id thay đổi

    // Hàm set state cho voucher sau khi lấy thông tin chi tiết
    let setStateVoucher = (data) => {
        console.log(data.toDate)
        setInputValues({
            ...inputValues,
            ["fromDate"]: moment.unix(+data.fromDate / 1000).locale('vi').format('DD/MM/YYYY'), // Định dạng ngày bắt đầu
            ["toDate"]: moment.unix(+data.toDate / 1000).locale('vi').format('DD/MM/YYYY'), // Định dạng ngày kết thúc
            ["typeVoucherId"]: data.typeVoucherId,
            ["amount"]: data.amount,
            ["codeVoucher"]: data.codeVoucher,
            ["isActionADD"]: false, // Thay đổi trạng thái hành động từ "Thêm mới" sang "Cập nhật"
            ["fromDateUpdate"]: data.fromDate,
            ["toDateUpdate"]: data.toDate
        })
    }

    // Hàm xử lý thay đổi giá trị trong các input (ngày tháng, số lượng, mã voucher)
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm xử lý thay đổi ngày bắt đầu từ DatePicker
    let handleOnChangeDatePickerFromDate = (date) => {
        setInputValues({
            ...inputValues,
            ["fromDate"]: date[0], // Lưu giá trị ngày bắt đầu
            ["isChangeFromDate"]: true // Đánh dấu đã thay đổi ngày bắt đầu
        })
    }

    // Hàm xử lý thay đổi ngày kết thúc từ DatePicker
    let handleOnChangeDatePickerToDate = (date) => {
        setInputValues({
            ...inputValues,
            ["toDate"]: date[0], // Lưu giá trị ngày kết thúc
            ["isChangeToDate"]: true // Đánh dấu đã thay đổi ngày kết thúc
        })
    }

    // Hàm lưu thông tin voucher, thực hiện tạo mới hoặc cập nhật dựa trên isActionADD
    let handleSaveInforVoucher = async () => {
        if (inputValues.isActionADD === true) {
            // Tạo voucher mới
            let response = await createNewVoucherService({
                fromDate: new Date(inputValues.fromDate).getTime(), // Chuyển đổi ngày sang định dạng timestamp
                toDate: new Date(inputValues.toDate).getTime(),
                typeVoucherId: inputValues.typeVoucherId,
                amount: inputValues.amount,
                codeVoucher: inputValues.codeVoucher
            })
            if (response && response.errCode === 0) {
                toast.success("Tạo mã voucher thành công !") // Hiển thị thông báo thành công
                setInputValues({
                    ...inputValues,
                    ["fromDate"]: '',
                    ["toDate"]: '',
                    ["typeVoucherId"]: '',
                    ["amount"]: '',
                    ["codeVoucher"]: '',
                })
            } else {
                toast.error(response.errMessage) // Hiển thị thông báo lỗi
            }
        } else {
            // Cập nhật voucher đã có
            let response = await updateVoucherService({
                toDate: inputValues.isChangeToDate === false ? inputValues.toDateUpdate : new Date(inputValues.toDate).getTime(),
                fromDate: inputValues.isChangeFromDate === false ? inputValues.fromDateUpdate : new Date(inputValues.fromDate).getTime(),

                typeVoucherId: inputValues.typeVoucherId,
                amount: inputValues.amount,
                codeVoucher: inputValues.codeVoucher,
                id: id // Cập nhật theo id voucher
            })
            if (response && response.errCode === 0) {
                toast.success("Cập nhật voucher thành công !")
            } else toast.error(response.errMessage)
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý mã voucher</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD === true ? 'Thêm mới mã voucher' : 'Cập nhật thông tin mã voucher'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            {/* Form nhập ngày bắt đầu */}
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Ngày bắt đầu</label>
                                <DatePicker className="form-control" onChange={handleOnChangeDatePickerFromDate} value={inputValues.fromDate} />
                            </div>

                            {/* Form nhập ngày kết thúc */}
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Ngày kết thúc</label>
                                <DatePicker className="form-control" onChange={handleOnChangeDatePickerToDate} value={inputValues.toDate} />
                            </div>

                            {/* Form nhập loại voucher */}
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Loại voucher</label>
                                <select value={inputValues.typeVoucherId} name="typeVoucherId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                        dataTypeVoucher.map((item, index) => {
                                            let name = `${item.value} ${item.typeVoucherData.value}`
                                            return (
                                                <option key={index} value={item.id}>{name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            {/* Form nhập số lượng mã voucher */}
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Số lượng mã</label>
                                <input type="number" value={inputValues.amount} name="amount" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>

                            {/* Form nhập mã voucher */}
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Mã voucher</label>
                                <input type="text" value={inputValues.codeVoucher} name="codeVoucher" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>

                        {/* Button lưu thông tin */}
                        <button onClick={() => handleSaveInforVoucher()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddVoucher;
