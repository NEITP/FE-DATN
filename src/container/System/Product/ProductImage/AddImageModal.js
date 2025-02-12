import React from 'react'; // Import React để sử dụng JSX.
import { useEffect, useState } from 'react'; // Import các hook useEffect và useState từ React.
import CommonUtils from '../../../../utils/CommonUtils'; // Import utils để sử dụng các hàm hỗ trợ chung, như chuyển file thành base64.
import moment from 'moment'; // Import thư viện moment để xử lý thời gian (mặc dù không sử dụng trong đoạn mã này).
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo.
import Lightbox from 'react-image-lightbox'; // Import thư viện Lightbox để hiển thị ảnh trong modal.
import 'react-image-lightbox/style.css'; // Import CSS cho Lightbox.
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap'; // Import các thành phần Modal từ Reactstrap để tạo hộp thoại modal.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom"; // Import các thành phần từ react-router-dom để điều hướng trong ứng dụng.
import { getProductDetailImageByIdService } from '../../../../services/userService'; // Import dịch vụ để lấy thông tin chi tiết ảnh sản phẩm.

const AddImageModal = (props) => {
    // Khởi tạo state lưu trữ thông tin hình ảnh và các thông tin khác.
    const [inputValues, setInputValues] = useState({
        image: '', imageReview: '', caption: '', isOpen: false, isActionUpdate: false, id: ''
    });

    // Hook useEffect dùng để gọi API lấy chi tiết ảnh sản phẩm khi modal mở và khi productImageId thay đổi.
    useEffect(() => {
        let id = props.productImageId; // Lấy productImageId từ props.
        console.log("check id", id); // In ra id để kiểm tra trong console.

        // Nếu có id, thực hiện gọi API để lấy thông tin chi tiết ảnh sản phẩm.
        if (id) {
            let fetchProductImage = async () => {
                let res = await getProductDetailImageByIdService(id); // Gọi API lấy chi tiết ảnh sản phẩm.
                if (res && res.errCode === 0) {
                    // Nếu API trả về thành công, cập nhật các giá trị vào state.
                    setInputValues({
                        ...inputValues, ["isActionUpdate"]: true, ["caption"]: res.data.caption,
                        ["image"]: res.data.image, ["imageReview"]: res.data.image
                    });
                }
            };
            fetchProductImage(); // Gọi hàm fetchProductImage để lấy dữ liệu.
        }
    }, [props.isOpenModal]); // Mỗi khi modal mở, useEffect sẽ chạy lại.

    // Hàm xử lý sự kiện thay đổi giá trị trong các input (ví dụ như caption).
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường input.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật state với giá trị mới.
    };

    // Hàm xử lý thay đổi hình ảnh khi người dùng chọn file hình ảnh.
    let handleOnChangeImage = async (event) => {
        let data = event.target.files; // Lấy tệp được chọn.
        let file = data[0]; // Lấy tệp đầu tiên (vì chỉ chọn một tệp).

        // Kiểm tra dung lượng của file, nếu lớn hơn 30MB, hiển thị thông báo lỗi.
        if (file.size > 31312281) {
            toast.error("Dung lượng file bé hơn 30mb"); // Hiển thị thông báo lỗi.
        } else {
            // Chuyển đổi file thành base64 và tạo URL để xem trước ảnh.
            let base64 = await CommonUtils.getBase64(file); // Chuyển file thành base64.
            let objectUrl = URL.createObjectURL(file); // Tạo URL đối tượng để xem ảnh trước.
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl }); // Cập nhật lại state với dữ liệu ảnh mới.
        }
    };

    // Hàm mở xem trước hình ảnh trong modal Lightbox.
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return; // Nếu không có hình ảnh xem trước thì không làm gì.

        setInputValues({ ...inputValues, ["isOpen"]: true }); // Mở modal xem trước ảnh.
    };

    // Hàm gửi dữ liệu từ modal lên cha thông qua props.
    let HandleSendDataFromModal = () => {
        props.sendDataFromModal({
            image: inputValues.image, // Gửi ảnh đã chọn (base64).
            caption: inputValues.caption, // Gửi caption của ảnh.
            isActionUpdate: inputValues.isActionUpdate, // Kiểm tra xem có phải là cập nhật không.
            id: props.productImageId // ID của ảnh sản phẩm.
        });

        // Reset lại các giá trị trong state sau khi gửi dữ liệu.
        setInputValues({ ...inputValues, ["image"]: '', ["imageReview"]: '', ["caption"]: '', ["isActionUpdate"]: false });
    };

    // Hàm đóng modal và reset lại các giá trị trong state.
    let handleCloseModal = () => {
        props.closeModal(); // Đóng modal từ props.
        setInputValues({ ...inputValues, ["image"]: '', ["imageReview"]: '', ["caption"]: '', ["isActionUpdate"]: false });
    };

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Thêm hình ảnh chi tiết sản phẩm</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Tên hình ảnh</label>
                            <input value={inputValues.caption} name="caption" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Ảnh hiển thị</label>
                            <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="img-review"></div>
                        </div>
                        <div className="col-12 form-group">
                            <label>Chọn hình ảnh</label>
                            <input onChange={(event) => handleOnChangeImage(event)} type="file" accept=".jpg,.png" className="form-control form-file" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={HandleSendDataFromModal}
                    >
                        Lưu thông tin
                    </Button>
                    {' '}
                    <Button onClick={handleCloseModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div >
    )
}
export default AddImageModal;