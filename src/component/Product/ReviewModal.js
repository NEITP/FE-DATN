import React, { useState } from 'react';  // Import các hook và thư viện cần thiết
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';  // Thư viện để tạo modal trong React
import { toast } from 'react-toastify';  // Thư viện để hiển thị thông báo toast khi có lỗi hoặc thông tin

// Định nghĩa component ReviewModal
const ReviewModal = (props) => {
    // Dùng useState để quản lý trạng thái inputValues, khởi tạo với giá trị content là chuỗi rỗng
    const [inputValues, setInputValues] = useState({
        content: ''  // Trường "content" để nhập phản hồi của người dùng
    });

    // Hàm xử lý thay đổi giá trị của input (textarea)
    const handleOnChange = event => {
        const { name, value } = event.target;  // Lấy name và value từ event
        setInputValues({ ...inputValues, [name]: value });  // Cập nhật giá trị content trong inputValues
    };

    // Hàm đóng modal, được gọi khi người dùng nhấn nút đóng
    let handleCloseModal = () => {
        props.closeModal();  // Gọi props.closeModal() từ component cha để đóng modal
        setInputValues({ ...inputValues, ["content"]: '' });  // Reset content khi đóng modal
    };

    // Hàm xử lý khi người dùng lưu thông tin phản hồi
    let handleSaveInfor = () => {
        setInputValues({ ...inputValues, ["content"]: '' });  // Reset content sau khi lưu
        props.sendDataFromReViewModal(inputValues.content);  // Gửi dữ liệu phản hồi lên component cha thông qua props.sendDataFromReViewModal
    };

    return (
        <div className="">
            {/* Modal để hiển thị form nhập phản hồi */}
            <Modal
                isOpen={props.isOpenModal}  // Kiểm tra modal có được mở hay không
                className={'booking-modal-container'}  // CSS class để tuỳ chỉnh modal
                size="md"  // Kích thước modal là vừa
                centered  // Căn giữa modal trên màn hình
            >
                <div className="modal-header">
                    {/* Tiêu đề modal */}
                    <h5 className="modal-title">Viết phản hồi đánh giá sản phẩm</h5>
                    {/* Nút đóng modal */}
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            {/* Label và input (textarea) cho việc nhập phản hồi */}
                            <label>Phản hồi</label>
                            <textarea
                                name="content"  // Tên của trường nhập liệu
                                value={inputValues.content}  // Gán giá trị của textarea từ state
                                onChange={(event) => handleOnChange(event)}  // Xử lý sự kiện thay đổi nội dung của textarea
                                className="form-control"  // Thêm class CSS cho textarea
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* Nút Lưu thông tin */}
                    <Button
                        color="primary"
                        onClick={handleSaveInfor}  // Lưu thông tin và gửi phản hồi lên component cha
                    >
                        Lưu thông tin
                    </Button>
                    {' '}
                    {/* Nút Hủy để đóng modal mà không lưu */}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </div >
    )
}

export default ReviewModal;
