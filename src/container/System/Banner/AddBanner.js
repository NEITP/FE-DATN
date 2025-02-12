import React from 'react';
import { useEffect, useState } from 'react';
import { createNewBannerService, getDetailBannerByIdService, updateBannerService } from '../../../services/userService';  // Các dịch vụ để tạo, lấy chi tiết và cập nhật băng rôn
import CommonUtils from '../../../utils/CommonUtils';  // Utility dùng để chuyển đổi file thành base64
import Lightbox from 'react-image-lightbox';  // Thư viện để hiển thị ảnh dưới dạng lightbox
import 'react-image-lightbox/style.css';  // CSS cho lightbox
import { toast } from 'react-toastify';  // Thư viện để thông báo cho người dùng
import { useParams } from "react-router-dom";  // Hook để lấy tham số từ URL
import 'react-toastify/dist/ReactToastify.css';  // CSS cho thông báo từ react-toastify
import './AddBanner.scss';  // CSS cho component
import moment from 'moment';  // Thư viện để xử lý ngày giờ

// Component quản lý việc thêm và cập nhật băng rôn
const AddBanner = (props) => {

    // Lấy tham số id từ URL
    const { id } = useParams();

    // State lưu trữ thông tin băng rôn, các trạng thái và hình ảnh
    const [inputValues, setInputValues] = useState({
        name: '',  // Tên băng rôn
        description: '',  // Mô tả chi tiết
        image: '',  // Dữ liệu hình ảnh (base64)
        isActionADD: true,  // Biến để xác định xem là thêm mới hay cập nhật
        imageReview: '',  // Dữ liệu hình ảnh cho preview
        isOpen: false,  // Trạng thái mở lightbox
    });

    // useEffect chạy khi component render lần đầu, kiểm tra nếu có id thì gọi API lấy thông tin băng rôn
    useEffect(() => {
        if (id) {
            let fetchBanner = async () => {
                let res = await getDetailBannerByIdService(id)  // Lấy chi tiết băng rôn
                if (res && res.errCode === 0) {
                    setStateBanner(res.data)  // Nếu thành công, cập nhật state với dữ liệu băng rôn
                }
            }
            fetchBanner();
        }
    }, []);  // Chạy khi component render lần đầu

    // Hàm cập nhật trạng thái băng rôn khi lấy từ API
    let setStateBanner = (data) => {
        setInputValues({
            ...inputValues,
            ["name"]: data.name,  // Cập nhật tên
            ["description"]: data.description,  // Cập nhật mô tả
            ["image"]: data.image,  // Cập nhật hình ảnh (base64)
            ["imageReview"]: data.image,  // Cập nhật hình ảnh cho preview
            ["isActionADD"]: false  // Đặt trạng thái là "Cập nhật" thay vì "Thêm mới"
        });
    }

    // Hàm xử lý sự kiện thay đổi giá trị trong input (tên, mô tả)
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm xử lý sự kiện thay đổi hình ảnh
    let handleOnChangeImage = async (event) => {
        let data = event.target.files;  // Lấy file từ input
        let file = data[0];  // Chỉ lấy file đầu tiên
        if (file.size > 31312281) {  // Kiểm tra dung lượng file
            toast.error("Dung lượng file bé hơn 30mb")  // Nếu quá lớn, thông báo lỗi
        } else {
            let base64 = await CommonUtils.getBase64(file);  // Chuyển file thành base64
            let objectUrl = URL.createObjectURL(file)  // Tạo URL cho preview hình ảnh
            console.log(base64)  // In base64 ra console
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl });  // Cập nhật hình ảnh vào state
        }
    }

    // Hàm mở preview hình ảnh (lightbox)
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return;  // Nếu không có hình ảnh, không mở preview
        setInputValues({ ...inputValues, ["isOpen"]: true })  // Mở lightbox
    }

    // Hàm lưu băng rôn (thêm mới hoặc cập nhật)
    let handleSaveBanner = async () => {
        if (inputValues.isActionADD === true) {  // Nếu là hành động thêm mới
            let res = await createNewBannerService({
                name: inputValues.name,
                description: inputValues.description,
                image: inputValues.image
            })
            if (res && res.errCode === 0) {  // Nếu thành công, thông báo và reset form
                toast.success("Tạo mới băng rôn thành công !")
                setInputValues({
                    ...inputValues,
                    ["name"]: '',
                    ["image"]: '',
                    ["description"]: '',
                    ["imageReview"]: ''
                })
            } else {
                toast.error(res.errMessage)  // Nếu thất bại, thông báo lỗi
            }
        } else {  // Nếu là hành động cập nhật
            let res = await updateBannerService({
                name: inputValues.name,
                description: inputValues.description,
                image: inputValues.image,
                id: id
            })
            if (res && res.errCode === 0) {  // Nếu thành công, thông báo
                toast.success("Cập nhật băng rôn thành công !")
            } else {
                toast.error(res.errMessage)  // Nếu thất bại, thông báo lỗi
            }
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý băng rôn</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD === true ? 'Thêm mới băng rôn' : 'Cập nhật thông tin băng rôn'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Tên băng rôn</label>
                                <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="col-md-4 form-group">
                                <label>Chọn hình ảnh</label>
                                <input accept=".jpg,.png" onChange={(event) => handleOnChangeImage(event)} type="file" className="form-control form-file" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Hình ảnh hiển thị</label>
                                <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="box-img-preview"></div>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">Mô tả chi tiết</label>
                                <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                            </div>
                        </div>
                        <button onClick={() => handleSaveBanner()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>

            {/* Hiển thị lightbox nếu imageReview tồn tại và isOpen là true */}
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}  // Đóng lightbox
                />
            }
        </div>
    )
}

export default AddBanner;
