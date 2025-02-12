import React from 'react';
import { useEffect, useState } from 'react';
import { getDetailAddressUserByIdService } from '../../services/userService';

// Các thành phần Modal từ thư viện 'reactstrap' để hiển thị popup
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';

const AddressUsersModal = (props) => {
    // Khai báo state để lưu trữ thông tin các giá trị nhập vào từ người dùng
    const [inputValues, setInputValues] = useState({
        shipName: '',        // Tên người nhận
        shipAdress: '',      // Địa chỉ người nhận
        shipEmail: '',       // Email người nhận
        shipPhonenumber: '', // Số điện thoại người nhận
        isActionUpdate: false // Cờ xác định có phải là thao tác cập nhật thông tin không
    });

    // useEffect sẽ được chạy khi props.isOpenModal thay đổi (hiển thị hoặc đóng modal)
    useEffect(() => {
        // Lấy id từ props (id của địa chỉ người dùng cần xem hoặc sửa)
        let id = props.addressUserId
        // Nếu có id thì thực hiện fetch chi tiết địa chỉ người dùng từ server
        if (id) {
            let fetchDetailAddress = async () => {
                // Gọi API để lấy thông tin chi tiết địa chỉ của người dùng
                let res = await getDetailAddressUserByIdService(id)
                // Nếu có kết quả và mã lỗi là 0 (thành công), thì cập nhật giá trị vào state
                if (res && res.errCode === 0) {
                    setInputValues({
                        ...inputValues, // Giữ nguyên các giá trị cũ trong inputValues
                        ["isActionUpdate"]: true, // Đặt cờ cho biết đây là thao tác sửa (update)
                        ["shipName"]: res.data.shipName,       // Cập nhật tên người nhận
                        ["shipAdress"]: res.data.shipAdress,   // Cập nhật địa chỉ
                        ["shipEmail"]: res.data.shipEmail,     // Cập nhật email
                        ["shipPhonenumber"]: res.data.shipPhonenumber // Cập nhật số điện thoại
                    })
                }
            }
            // Gọi hàm fetch dữ liệu
            fetchDetailAddress()
        }
    }, [props.isOpenModal]); // Chạy lại khi modal được mở/đóng (props.isOpenModal thay đổi)

    // Hàm xử lý thay đổi dữ liệu nhập vào từ người dùng
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường nhập
        // Cập nhật giá trị mới vào state inputValues
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm đóng modal khi người dùng nhấn nút đóng
    let handleCloseModal = () => {
        props.closeModaAddressUser(); // Gọi hàm từ props để đóng modal
        // Reset lại các giá trị trong inputValues để modal không còn chứa thông tin cũ
        setInputValues({
            ...inputValues,
            ["isActionUpdate"]: false, // Đặt lại cờ thao tác cập nhật
            ["shipName"]: '',
            ["shipAdress"]: '',
            ["shipEmail"]: '',
            ["shipPhonenumber"]: ''
        });
    };

    // Hàm lưu thông tin khi người dùng nhấn lưu
    let handleSaveInfor = () => {
        // Gửi dữ liệu đã nhập từ modal ra ngoài (gửi lên server hoặc component cha)
        props.sendDataFromModalAddress({
            shipName: inputValues.shipName,        // Tên người nhận
            shipAdress: inputValues.shipAdress,    // Địa chỉ người nhận
            shipEmail: inputValues.shipEmail,      // Email người nhận
            shipPhonenumber: inputValues.shipPhonenumber, // Số điện thoại người nhận
            id: props.addressUserId,               // ID địa chỉ người dùng
            isActionUpdate: inputValues.isActionUpdate, // Cờ xác định là thao tác cập nhật hay không
        });

        // Reset lại các giá trị trong inputValues sau khi lưu xong
        setInputValues({
            ...inputValues,
            ["shipName"]: '',
            ["shipAdress"]: '',
            ["shipEmail"]: '',
            ["shipPhonenumber"]: '',
            ["isActionUpdate"]: false
        });
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Địa chỉ mới</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">

                        <div className="col-6 form-group">
                            <label>Họ và tên</label>
                            <input value={inputValues.shipName} name="shipName" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>Số điện thoại</label>
                            <input value={inputValues.shipPhonenumber} name="shipPhonenumber" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Email</label>
                            <input value={inputValues.shipEmail} name="shipEmail" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Địa chỉ cụ thể</label>
                            <input value={inputValues.shipAdress} name="shipAdress" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={handleSaveInfor}
                    >
                        Lưu thông tin
                    </Button>
                    {' '}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>

        </div >
    )
}
export default AddressUsersModal;