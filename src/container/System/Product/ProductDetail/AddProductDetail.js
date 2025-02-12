import React from 'react'; // Import React để sử dụng JSX.
import { useEffect, useState } from 'react'; // Import các hook useEffect và useState từ React.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo thành công hoặc lỗi.
import { useParams } from "react-router-dom"; // Import useParams để lấy tham số từ URL.
import 'react-toastify/dist/ReactToastify.css'; // Import stylesheet của react-toastify để sử dụng thông báo.
import CommonUtils from '../../../../utils/CommonUtils'; // Import các hàm tiện ích chung (để sử dụng getBase64).
import '../AddProduct.scss'; // Import stylesheet cho component.
import Lightbox from 'react-image-lightbox'; // Import thư viện để xem ảnh phóng to (lightbox).
import 'react-image-lightbox/style.css'; // Import stylesheet cho lightbox.
import { useFetchAllcode } from '../../../customize/fetch'; // Import custom hook useFetchAllcode để lấy danh sách mã (ví dụ: SIZE).
import { CreateNewProductDetailService } from '../../../../services/userService'; // Import dịch vụ API để tạo mới chi tiết sản phẩm.

const AddProductDetail = (props) => {
    // Lấy dữ liệu về SIZE từ API bằng custom hook useFetchAllcode.
    const { data: dataSize } = useFetchAllcode('SIZE');
    const { id } = useParams(); // Lấy id từ URL.

    // Khai báo state inputValues để lưu trữ các giá trị từ các trường nhập liệu trong form.
    const [inputValues, setInputValues] = useState({
        width: '', height: '', sizeId: '', originalPrice: '', discountPrice: '',
        image: '', imageReview: '', isOpen: false, nameDetail: '', description: '', weight: ''
    });

    // Nếu dữ liệu SIZE đã được tải và chưa có giá trị sizeId, gán sizeId mặc định là size đầu tiên trong dataSize.
    if (dataSize && dataSize.length > 0 && inputValues.sizeId === '') {
        setInputValues({ ...inputValues, ["sizeId"]: dataSize[0].code });
    }

    // Hàm xử lý sự kiện khi giá trị trong form thay đổi.
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường nhập liệu.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật lại state inputValues với giá trị mới.
    };

    // Hàm xử lý khi người dùng chọn file ảnh để upload.
    let handleOnChangeImage = async (event) => {
        let data = event.target.files; // Lấy file từ input.
        let file = data[0]; // Chỉ lấy file đầu tiên nếu người dùng chọn nhiều file.

        if (file.size > 31312281) { // Kiểm tra kích thước file, nếu lớn hơn 30MB thì hiển thị thông báo lỗi.
            toast.error("Dung lượng file bé hơn 30mb");
        } else {
            // Nếu file hợp lệ, chuyển đổi file thành base64 để lưu trữ.
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file); // Tạo URL cho ảnh để hiển thị hình ảnh xem trước.
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl }); // Cập nhật ảnh vào state.
        }
    };

    // Hàm mở Lightbox để xem ảnh phóng to.
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return; // Nếu không có ảnh để xem, không làm gì.
        setInputValues({ ...inputValues, ["isOpen"]: true }); // Mở Lightbox khi người dùng click vào ảnh.
    };

    // Hàm lưu thông tin sản phẩm khi người dùng bấm nút "Lưu".
    let handleSaveProductDetail = async () => {
        // Gọi API để tạo mới chi tiết sản phẩm với các giá trị từ form.
        let res = await CreateNewProductDetailService({
            id: id,
            width: inputValues.width,
            height: inputValues.height,
            description: inputValues.description,
            sizeId: inputValues.sizeId,
            originalPrice: inputValues.originalPrice,
            discountPrice: inputValues.discountPrice,
            image: inputValues.image,
            nameDetail: inputValues.nameDetail,
            weight: inputValues.weight
        });

        // Nếu tạo mới thành công, hiển thị thông báo thành công và reset form.
        if (res && res.errCode === 0) {
            toast.success("Tạo mới loại sản phẩm thành công!");
            setInputValues({
                ...inputValues,
                ["width"]: '',
                ["height"]: '',
                ["description"]: '',
                ["sizeId"]: '',
                ["originalPrice"]: '',
                ["discountPrice"]: '',
                ["image"]: '',
                ["imageReview"]: '',
                ["nameDetail"]: '',
                ["weight"]: '',
            });
        } else {
            // Nếu có lỗi, hiển thị thông báo lỗi.
            toast.error(res.errMessage);
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới chi tiết sản phẩm
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Tên loại sản phẩm</label>
                                <input type="text" value={inputValues.nameDetail} name="nameDetail" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Chiều rộng</label>
                                <input type="text" value={inputValues.width} name="width" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">chiều dài</label>
                                <input type="text" value={inputValues.height} name="height" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputEmail4">Giá gốc</label>
                                <input type="number" value={inputValues.originalPrice} name="originalPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputPassword4">Giá khuyến mãi</label>
                                <input type="number" value={inputValues.discountPrice} name="discountPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Khối lượng</label>
                                <input type="text" value={inputValues.weight} name="weight" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>


                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Mô tả chi tiết</label>
                            <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                        </div>
                        <div className="form-row">

                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Kích thước</label>
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
                            <div className="form-group col-md-3">
                                <label htmlFor="inputPassword4">Chọn hình ảnh</label>
                                <input type="file" id="previewImg" accept=".jpg,.png"
                                    hidden onChange={(event) => handleOnChangeImage(event)}
                                />
                                <br></br>
                                <label style={{ backgroundColor: '#eee', borderRadius: '5px', padding: '6px', cursor: 'pointer' }} className="label-upload" htmlFor="previewImg"

                                >Tải ảnh <i className="fas fa-upload"></i></label>
                                <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="box-image"></div>
                            </div>
                        </div>

                        <button onClick={() => handleSaveProductDetail()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div>
    )
}
export default AddProductDetail;