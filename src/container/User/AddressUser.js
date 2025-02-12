import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';  // Thư viện để thông báo kết quả hành động (thêm, sửa, xóa)
import { getAllAddressUserByUserIdService, createNewAddressUserrService, deleteAddressUserService, editAddressUserService } from '../../services/userService'; // Các hàm gọi API để quản lý địa chỉ người dùng
import AddressUsersModal from '../ShopCart/AdressUserModal';  // Modal để thêm, sửa địa chỉ người dùng
import './AddressUser.scss'; // CSS cho AddressUser

function AddressUser(props) {

    const [dataAddressUser, setdataAddressUser] = useState([]);  // State chứa danh sách địa chỉ người dùng
    const [addressUserId, setaddressUserId] = useState('');  // State lưu ID của địa chỉ người dùng khi cần sửa
    const [isOpenModalAddressUser, setisOpenModalAddressUser] = useState(false);  // State xác định trạng thái mở modal

    // Dùng useEffect để gọi API lấy danh sách địa chỉ người dùng khi component được render
    useEffect(() => {
        let userId = props.id; // Lấy id của người dùng từ props
        if (userId) {
            let fetchDataAddress = async () => {
                let res = await getAllAddressUserByUserIdService(userId);  // Gọi API để lấy danh sách địa chỉ của người dùng
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);  // Cập nhật danh sách địa chỉ vào state
                }
            }
            fetchDataAddress();
        }
    }, []); // Chỉ chạy khi component được mount lần đầu

    // Hàm xử lý khi người dùng gửi dữ liệu từ modal
    let sendDataFromModalAddress = async (data) => {
        setisOpenModalAddressUser(false); // Đóng modal sau khi xử lý
        setaddressUserId('');  // Reset ID địa chỉ
        if (data.isActionUpdate === false) {
            // Nếu là hành động thêm địa chỉ mới
            let res = await createNewAddressUserrService({
                shipName: data.shipName,
                shipAdress: data.shipAdress,
                shipEmail: data.shipEmail,
                shipPhonenumber: data.shipPhonenumber,
                userId: props.id,  // Gửi id người dùng
            });
            if (res && res.errCode === 0) {
                toast.success("Thêm địa chỉ thành công !");  // Hiển thị thông báo thành công
                let res = await getAllAddressUserByUserIdService(props.id);  // Lấy lại danh sách địa chỉ
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);  // Cập nhật lại danh sách địa chỉ
                }
            } else {
                toast.error(res.errMessage);  // Hiển thị thông báo lỗi
            }
        } else {
            // Nếu là hành động cập nhật địa chỉ
            let res = await editAddressUserService({
                id: data.id,
                shipName: data.shipName,
                shipAdress: data.shipAdress,
                shipEmail: data.shipEmail,
                shipPhonenumber: data.shipPhonenumber,
                userId: props.id,
            });
            if (res && res.errCode === 0) {
                toast.success("Cập nhật địa chỉ thành công !");  // Thông báo cập nhật thành công
                let res = await getAllAddressUserByUserIdService(props.id);  // Cập nhật lại danh sách địa chỉ
                if (res && res.errCode === 0) {
                    setdataAddressUser(res.data);  // Cập nhật state
                }
            } else {
                toast.error(res.errMessage);  // Thông báo lỗi nếu không thành công
            }
        }
    }

    // Hàm đóng modal khi người dùng nhấn vào nút đóng
    let closeModaAddressUser = () => {
        setisOpenModalAddressUser(false);  // Đóng modal
        setaddressUserId('');  // Reset ID
    }

    // Hàm mở modal để thêm địa chỉ mới
    let handleOpenAddressUserModal = async () => {
        setisOpenModalAddressUser(true);  // Mở modal
    }

    // Hàm xử lý xóa địa chỉ người dùng
    let handleDeleteAddress = async (id) => {
        let res = await deleteAddressUserService({
            data: { id: id },  // Gửi ID của địa chỉ cần xóa
        });
        if (res && res.errCode === 0) {
            toast.success("Xóa địa chỉ user thành công");  // Thông báo thành công
            let res = await getAllAddressUserByUserIdService(props.id);  // Lấy lại danh sách địa chỉ
            if (res && res.errCode === 0) {
                setdataAddressUser(res.data);  // Cập nhật danh sách
            }
        } else {
            toast.error("Xóa địa chỉ user thất bại");  // Thông báo lỗi
        }
    }

    // Hàm xử lý sửa địa chỉ người dùng
    let handleEditAddress = (id) => {
        setaddressUserId(id);  // Lưu ID của địa chỉ để sửa
        setisOpenModalAddressUser(true);  // Mở modal sửa địa chỉ
    }

    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-12 border-right border-left">
                    <div className="box-heading">
                        <div className="content-left">
                            <span>Địa chỉ của tôi</span>  {/* Tiêu đề "Địa chỉ của tôi" */}
                        </div>
                        <div className="content-right">
                            <div onClick={() => handleOpenAddressUserModal()} className="wrap-add-address">
                                <i className="fas fa-plus"></i>
                                <span>Thêm địa chỉ mới</span>  {/* Nút "Thêm địa chỉ mới" */}
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị danh sách địa chỉ người dùng */}
                    {dataAddressUser && dataAddressUser.length > 0 &&
                        dataAddressUser.map((item, index) => {
                            return (
                                <div key={index} className="box-address-user">
                                    <div className='content-left'>
                                        <div className='box-label'>
                                            <div className='label'>
                                                <div>Họ Và Tên</div>
                                                <div>Số Điện Thoại</div>
                                                <div>Địa Chỉ</div>
                                            </div>
                                            <div className='content'>
                                                <div>{item.shipName}</div>
                                                <div>{item.shipPhonenumber}</div>
                                                <div>{item.shipAdress}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='content-right'>
                                        <span onClick={() => handleEditAddress(item.id)} className='text-underline'>Sửa</span>  {/* Nút sửa */}
                                        <span onClick={() => handleDeleteAddress(item.id)} className='text-underline'>Xóa</span>  {/* Nút xóa */}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            {/* Modal để thêm hoặc sửa địa chỉ */}
            <AddressUsersModal addressUserId={addressUserId} sendDataFromModalAddress={sendDataFromModalAddress} isOpenModal={isOpenModalAddressUser} closeModaAddressUser={closeModaAddressUser} />
        </div>
    );
}

export default AddressUser;
