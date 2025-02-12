import React from 'react'; // Import React để sử dụng JSX.
import { useEffect, useState } from 'react'; // Import các hook useEffect và useState từ React.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo thành công hoặc lỗi.
import { useParams } from "react-router-dom"; // Import useParams để lấy tham số từ URL.
import 'react-toastify/dist/ReactToastify.css'; // Import stylesheet của react-toastify để sử dụng thông báo.
import CommonUtils from '../../../../utils/CommonUtils'; // Import các hàm tiện ích chung (mặc dù không được sử dụng trong đoạn mã này).
import '../AddProduct.scss'; // Import stylesheet cho component.
import { getProductDetailByIdService, UpdateProductDetailService } from '../../../../services/userService'; // Import các dịch vụ API để lấy và cập nhật chi tiết sản phẩm.

const EditProductDetail = (props) => {
    // Khai báo state inputValues để lưu trữ dữ liệu của các trường nhập liệu
    const [inputValues, setInputValues] = useState({
        originalPrice: '', discountPrice: '', image: '', imageReview: '', isOpen: false, nameDetail: '', description: ''
    });

    const { id } = useParams(); // Lấy id của sản phẩm từ URL.

    // useEffect để gọi hàm fetchProductDetail khi component được render lần đầu tiên.
    useEffect(() => {
        let fetchProductDetail = async () => {
            // Gọi API để lấy chi tiết sản phẩm theo id từ URL.
            let res = await getProductDetailByIdService(id);
            if (res && res.errCode === 0) {
                // Nếu có dữ liệu trả về thành công, gọi hàm setStateProductdetail để cập nhật state.
                setStateProductdetail(res.data);
            }
        };
        fetchProductDetail(); // Gọi hàm fetchProductDetail khi component được mount.
    }, []); // Chỉ chạy khi component được render lần đầu tiên.

    // Hàm setStateProductdetail để cập nhật state inputValues từ dữ liệu sản phẩm.
    let setStateProductdetail = (data) => {
        setInputValues({
            ...inputValues, // Giữ nguyên các giá trị hiện tại của state.
            ["originalPrice"]: data.originalPrice, // Cập nhật giá gốc của sản phẩm.
            ["stock"]: data.stock, // Cập nhật số lượng sản phẩm trong kho (không sử dụng trong form này, có thể bỏ qua).
            ["discountPrice"]: data.discountPrice, // Cập nhật giá giảm của sản phẩm.
            ["nameDetail"]: data.nameDetail, // Cập nhật tên chi tiết sản phẩm.
            ["description"]: data.description, // Cập nhật mô tả chi tiết sản phẩm.
        });
    };

    // Hàm handleOnChange để xử lý sự kiện thay đổi giá trị trong form khi người dùng nhập dữ liệu.
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường nhập liệu.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật state inputValues với giá trị mới.
    };

    // Hàm handleSaveProductDetail để xử lý lưu dữ liệu khi người dùng bấm nút lưu.
    let handleSaveProductDetail = async () => {
        // Gọi API cập nhật chi tiết sản phẩm với các thông tin đã nhập vào form.
        let res = await UpdateProductDetailService({
            id: id, // Truyền id của sản phẩm.
            description: inputValues.description, // Mô tả sản phẩm.
            originalPrice: inputValues.originalPrice, // Giá gốc sản phẩm.
            discountPrice: inputValues.discountPrice, // Giá giảm của sản phẩm.
            nameDetail: inputValues.nameDetail // Tên chi tiết sản phẩm.
        });

        if (res && res.errCode === 0) {
            // Nếu cập nhật thành công, hiển thị thông báo thành công.
            toast.success("Cập nhật loại sản phẩm thành công!");
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
                    Cập nhật chi tiết sản phẩm
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Tên loại sản phẩm</label>
                                <input type="text" value={inputValues.nameDetail} name="nameDetail" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Giá gốc</label>
                                <input type="number" value={inputValues.originalPrice} name="originalPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Giá khuyến mãi</label>
                                <input type="number" value={inputValues.discountPrice} name="discountPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Mô tả chi tiết</label>
                            <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                        </div>

                        <button onClick={() => handleSaveProductDetail()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>

        </div>
    )
}
export default EditProductDetail;