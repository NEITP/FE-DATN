import React from 'react';
import { useEffect, useState } from 'react';
import { createNewUser, getDetailUserById, UpdateUserService } from '../../../services/userService';
import DatePicker from '../../../component/input/DatePicker';  // Thư viện chọn ngày
import { toast } from 'react-toastify';  // Thông báo lỗi hoặc thành công
import { useParams } from "react-router-dom";  // Dùng để lấy tham số từ URL
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';  // Hook để lấy mã danh mục
import localization from 'moment/locale/vi';  // Thư viện hỗ trợ định dạng thời gian
import moment from 'moment';  // Thư viện xử lý thời gian

const Adduser = (props) => {

    // Khởi tạo state cho các trường dữ liệu của người dùng
    const [birthday, setbirthday] = useState('');  // Ngày sinh
    const [isActionADD, setisActionADD] = useState(true);  // Trạng thái hành động thêm hay sửa
    const [isChangeDate, setisChangeDate] = useState(false);  // Trạng thái thay đổi ngày sinh
    const { id } = useParams();  // Lấy id từ URL

    // Khởi tạo các giá trị đầu vào cho form
    const [inputValues, setInputValues] = useState({
        email: '', password: '', firstName: '', lastName: '', address: '', phonenumber: '', genderId: '', roleId: '', id: '', dob: ''
    });

    // Hàm để thiết lập lại state người dùng khi đã có dữ liệu
    let setStateUser = (data) => {
        setInputValues({
            ...inputValues,
            ["firstName"]: data.firstName,
            ["lastName"]: data.lastName,
            ["address"]: data.address,
            ["phonenumber"]: data.phonenumber,
            ["genderId"]: data.genderId,
            ["roleId"]: data.roleId,
            ["email"]: data.email,
            ["id"]: data.id,
            ["dob"]: data.dob
        })
        setbirthday(moment.unix(+data.dob / 1000).locale('vi').format('DD/MM/YYYY'));  // Định dạng ngày sinh
    }

    // Sử dụng useEffect để tải dữ liệu người dùng nếu có id từ URL
    useEffect(() => {
        if (id) {
            let fetchUser = async () => {
                setisActionADD(false);  // Đặt trạng thái thành sửa khi có id
                let user = await getDetailUserById(id);
                if (user && user.errCode === 0) {
                    setStateUser(user.data);  // Gọi hàm setStateUser nếu dữ liệu hợp lệ
                }
            }
            fetchUser();
        }
    }, []);

    // Hàm để xử lý khi thay đổi giá trị của input form
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });  // Cập nhật lại giá trị tương ứng trong state
    };

    // Dùng hook để lấy danh sách mã giới tính và mã quyền
    const { data: dataGender } = useFetchAllcode('GENDER');
    const { data: dataRole } = useFetchAllcode('ROLE');

    // Thiết lập giá trị mặc định cho giới tính và quyền nếu chưa có
    if (dataGender && dataGender.length > 0 && inputValues.genderId === '' && dataRole && dataRole.length > 0 && inputValues.roleId === '') {
        setInputValues({ ...inputValues, ["genderId"]: dataGender[0].code, ["roleId"]: dataRole[0].code });
    }

    // Hàm xử lý khi người dùng thay đổi ngày sinh từ DatePicker
    let handleOnChangeDatePicker = (date) => {
        setbirthday(date[0]);  // Lưu lại ngày sinh
        setisChangeDate(true);  // Đánh dấu là đã thay đổi ngày sinh
    }

    // Hàm lưu thông tin người dùng (thêm mới hoặc cập nhật)
    let handleSaveUser = async () => {
        if (isActionADD === true) {  // Nếu là thêm mới người dùng
            let res = await createNewUser({
                email: inputValues.email,
                password: inputValues.password,
                firstName: inputValues.firstName,
                lastName: inputValues.lastName,
                address: inputValues.address,
                roleId: inputValues.roleId,
                genderId: inputValues.genderId,
                phonenumber: inputValues.phonenumber,
                dob: new Date(birthday).getTime(),  // Chuyển đổi ngày sinh sang timestamp
            })
            if (res && res.errCode === 0) {
                toast.success("Thêm mới người dùng thành công");  // Thông báo thành công
                setInputValues({
                    ...inputValues,
                    ["firstName"]: '',
                    ["lastName"]: '',
                    ["address"]: '',
                    ["phonenumber"]: '',
                    ["genderId"]: '',
                    ["roleId"]: '',
                    ["email"]: '',
                });
                setbirthday('');  // Đặt lại giá trị ngày sinh
            } else {
                toast.error(res.errMessage);  // Thông báo lỗi nếu thêm thất bại
            }
        } else {  // Nếu là sửa thông tin người dùng
            let res = await UpdateUserService({
                id: inputValues.id,
                firstName: inputValues.firstName,
                lastName: inputValues.lastName,
                address: inputValues.address,
                roleId: inputValues.roleId,
                genderId: inputValues.genderId,
                phonenumber: inputValues.phonenumber,
                dob: isChangeDate === false ? inputValues.dob : new Date(birthday).getTime()  // Nếu ngày sinh có thay đổi, dùng ngày mới
            })
            if (res && res.errCode === 0) {
                toast.success("Cập nhật người dùng thành công");  // Thông báo thành công
            } else {
                toast.error(res.errMessage);  // Thông báo lỗi nếu cập nhật thất bại
            }
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý người dùng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {isActionADD === true ? 'Thêm mới người dùng' : 'Cập nhật thông tin người dùng'}
                </div>
                <div className="card-body">
                    <form>
                        {/* Form nhập thông tin người dùng */}
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Email</label>
                                <input type="email" value={inputValues.email} disabled={isActionADD === true ? false : true} name="email" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Password</label>
                                <input type="password" disabled={isActionADD === true ? false : true} name="password" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-4">
                                <label htmlFor="inputEmail4">Họ</label>
                                <input type="text" value={inputValues.firstName} name="firstName" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="inputEmail4">Tên</label>
                                <input type="text" value={inputValues.lastName} name="lastName" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="inputEmail4">Số điện thoại</label>
                                <input type="text" value={inputValues.phonenumber} name="phonenumber" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputAddress">Địa chỉ</label>
                            <input type="text" value={inputValues.address} name="address" onChange={(event) => handleOnChange(event)} className="form-control" id="inputAddress" />
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputCity">Ngày sinh</label>
                                <DatePicker className="form-control" onChange={handleOnChangeDatePicker} value={birthday} />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputState">Giới tính</label>
                                <select value={inputValues.genderId} name="genderId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataGender && dataGender.length > 0 &&
                                        dataGender.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="form-group col-md-4">
                                <label htmlFor="inputState">Chức vụ</label>
                                <select value={inputValues.roleId} name="roleId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataRole && dataRole.length > 0 &&
                                        dataRole.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        {/* Nút lưu */}
                        <button type="button" onClick={() => handleSaveUser()} className="btn btn-primary">Lưu</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Adduser;
