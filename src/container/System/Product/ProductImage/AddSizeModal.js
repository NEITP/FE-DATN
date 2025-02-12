import React from 'react'; // Import React để sử dụng JSX.
import { useEffect, useState } from 'react'; // Import các hook useEffect và useState từ React.
import CommonUtils from '../../../../utils/CommonUtils'; // Import utils để sử dụng các hàm hỗ trợ chung.
import moment from 'moment'; // Import thư viện moment để xử lý thời gian.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo.
import Lightbox from 'react-image-lightbox'; // Import thư viện Lightbox để hiển thị ảnh trong modal.
import 'react-image-lightbox/style.css'; // Import CSS cho Lightbox.
import { useFetchAllcode } from '../../../customize/fetch'; // Import hook tuỳ chỉnh để lấy dữ liệu mã.
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap'; // Import các thành phần Modal từ Reactstrap để tạo hộp thoại modal.
import { getProductDetailSizeByIdService } from '../../../../services/userService'; // Import dịch vụ để lấy thông tin chi tiết kích thước sản phẩm.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom"; // Import các thành phần từ react-router-dom để điều hướng trong ứng dụng.

const AddSizeModal = (props) => {
    const { data: dataSize } = useFetchAllcode('SIZE'); // Lấy danh sách các kích thước (size) từ API.

    // Khởi tạo state để lưu trữ thông tin nhập liệu.
    const [inputValues, setInputValues] = useState({
        sizeId: '', width: '', height: '', isActionUpdate: false, id: '', weight: ''
    });

    // Hàm xử lý sự kiện thay đổi giá trị input.
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị từ event.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật giá trị mới cho input trong state.
    };

    // Kiểm tra nếu dataSize có giá trị và chưa chọn sizeId, thì tự động chọn size đầu tiên.
    if (dataSize && dataSize.length > 0 && inputValues.sizeId === '') {
        setInputValues({ ...inputValues, ["sizeId"]: dataSize[0].code });
    }

    // Hook useEffect để thực hiện gọi API khi modal mở và khi props thay đổi.
    useEffect(() => {
        let id = props.productSizeId; // Lấy ID kích thước sản phẩm từ props.

        // Nếu có ID, thực hiện gọi API để lấy thông tin chi tiết của sản phẩm.
        if (id) {
            let fetchDetailProductSize = async () => {
                let res = await getProductDetailSizeByIdService(id); // Gọi API lấy thông tin kích thước sản phẩm.
                if (res && res.errCode === 0) {
                    // Nếu API trả về thành công, cập nhật thông tin vào state.
                    setInputValues({
                        ...inputValues, ["isActionUpdate"]: true, ["sizeId"]: res.data.sizeId, ["width"]: res.data.width,
                        ["height"]: res.data.height, ["weight"]: res.data.weight
                    });
                }
            };
            fetchDetailProductSize(); // Gọi hàm fetchDetailProductSize.
        }
    }, [props.isOpenModal]); // Mỗi khi modal mở, thực hiện lại useEffect.

    // Hàm xử lý lưu thông tin khi người dùng nhấn nút lưu.
    let handleSaveInfor = () => {
        props.sendDataFromModalSize({
            sizeId: inputValues.sizeId, // Truyền dữ liệu từ state vào props gửi lên Modal.
            width: inputValues.width,
            height: inputValues.height,
            isActionUpdate: inputValues.isActionUpdate,
            id: props.productSizeId, // ID sản phẩm.
            weight: inputValues.weight
        });
        // Reset lại các giá trị input trong state sau khi lưu.
        setInputValues({ ...inputValues, ["sizeId"]: '', ["width"]: '', ["height"]: '', ["weight"]: '', ["isActionUpdate"]: false });
    };

    // Hàm đóng modal và reset lại input values.
    let handleCloseModal = () => {
        props.closeModal(); // Đóng modal từ props.
        setInputValues({ ...inputValues, ["sizeId"]: '', ["width"]: '', ["height"]: '', ["weight"]: '', ["isActionUpdate"]: false });
    };
    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'}
                size="md" centered
            >
                <div className="modal-header">
                    <h5 className="modal-title">Thêm kích thước chi tiết sản phẩm</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Kích thước</label>
                            <select value={inputValues.sizeId} name="sizeId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                {dataSize && dataSize.length > 0 &&
                                    dataSize.map((item, index) => {
                                        return (
                                            <option key={index} value={item.code}>{item.value}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều rộng</label>
                            <input value={inputValues.width} name="width" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều dài</label>
                            <input value={inputValues.height} name="height" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Khối lượng</label>
                            <input value={inputValues.weight} name="weight" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
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
export default AddSizeModal;