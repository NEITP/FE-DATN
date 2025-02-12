import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Thư viện để hiển thị thông báo (toast) cho người dùng.
import { useParams } from "react-router-dom"; // Dùng để lấy tham số trong URL (ví dụ: ID của sản phẩm).
import 'react-toastify/dist/ReactToastify.css'; // Cung cấp kiểu dáng mặc định cho các thông báo (toast).
import { useFetchAllcode } from '../../customize/fetch'; // Tùy chỉnh hook dùng để lấy danh mục dữ liệu như thương hiệu, kích thước, loại sản phẩm từ API.
import CommonUtils from '../../../utils/CommonUtils'; // Các hàm tiện ích, ví dụ như chuyển đổi file thành base64.
import localization from 'moment/locale/vi'; // Định dạng ngày tháng theo ngôn ngữ tiếng Việt.
import moment from 'moment'; // Thư viện để làm việc với thời gian và ngày tháng.
import './AddProduct.scss'; // Import file SCSS cho giao diện của trang.
import Lightbox from 'react-image-lightbox'; // Thư viện để tạo chức năng xem ảnh phóng to.
import 'react-image-lightbox/style.css'; // Cung cấp kiểu dáng cho Lightbox.
import { CreateNewProduct } from '../../../services/userService'; // API để tạo sản phẩm mới.
import MarkdownIt from 'markdown-it'; // Thư viện chuyển Markdown thành HTML.
import MdEditor from 'react-markdown-editor-lite'; // Trình soạn thảo Markdown.
import 'react-markdown-editor-lite/lib/index.css'; // Cung cấp kiểu dáng cho trình soạn thảo Markdown.

const AddProduct = (props) => {
    const mdParser = new MarkdownIt(); // Khởi tạo đối tượng MarkdownIt để chuyển Markdown thành HTML.
    const { data: dataBrand } = useFetchAllcode('BRAND'); // Lấy danh sách thương hiệu từ API.
    const { data: dataCategory } = useFetchAllcode('CATEGORY'); // Lấy danh sách danh mục sản phẩm từ API.
    const { data: dataSize } = useFetchAllcode('SIZE'); // Lấy danh sách kích thước từ API.

    // State để lưu trữ thông tin của sản phẩm khi người dùng nhập vào form.
    const [inputValues, setInputValues] = useState({
        brandId: '', categoryId: '', name: '', shortdescription: '', description: '',
        madeby: '', material: '', width: '', height: '', sizeId: '', originalPrice: '', discountPrice: '',
        image: '', imageReview: '', isOpen: false, nameDetail: '', contentHTML: '', contentMarkdown: '', weight: ''
    });

    // Cập nhật giá trị mặc định của các trường nếu danh sách dữ liệu đã được lấy từ API và các trường còn trống.
    if (dataBrand && dataBrand.length > 0 && inputValues.brandId === '' && dataCategory && dataCategory.length > 0 && inputValues.categoryId === '' && dataSize && dataSize.length > 0 && inputValues.sizeId === '') {
        setInputValues({ ...inputValues, ["brandId"]: dataBrand[0].code, ["categoryId"]: dataCategory[0].code, ["sizeId"]: dataSize[0].code });
    }

    // Hàm xử lý sự kiện khi người dùng thay đổi giá trị trong các input.
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường input thay đổi.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật lại state với giá trị mới.
    };

    // Hàm xử lý sự kiện thay đổi hình ảnh khi người dùng chọn ảnh.
    let handleOnChangeImage = async (event) => {
        let data = event.target.files; // Lấy dữ liệu của file người dùng chọn.
        let file = data[0]; // Lấy file đầu tiên (chỉ hỗ trợ một file ảnh).
        if (file.size > 31312281) { // Kiểm tra dung lượng file, nếu lớn hơn 30MB sẽ hiển thị thông báo lỗi.
            toast.error("Dung lượng file bé hơn 30mb");
        } else {
            let base64 = await CommonUtils.getBase64(file); // Chuyển file thành base64 để lưu trữ.
            let objectUrl = URL.createObjectURL(file); // Tạo URL để hiển thị ảnh preview.
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl }); // Lưu thông tin base64 và URL vào state.
        }
    };

    // Hàm mở cửa sổ xem ảnh phóng to khi người dùng nhấp vào ảnh xem trước.
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return; // Kiểm tra xem có ảnh xem trước hay không.
        setInputValues({ ...inputValues, ["isOpen"]: true }); // Mở cửa sổ xem ảnh phóng to.
    };

    // Hàm lưu sản phẩm mới vào cơ sở dữ liệu khi người dùng nhấn nút "Lưu".
    let handleSaveProduct = async () => {
        console.log(inputValues.sizeId); // In ra giá trị kích thước sản phẩm (debugging).
        let res = await CreateNewProduct({
            name: inputValues.name,
            description: inputValues.description,
            categoryId: inputValues.categoryId,
            madeby: inputValues.madeby,
            material: inputValues.material,
            brandId: inputValues.brandId,
            width: inputValues.width,
            height: inputValues.height,
            sizeId: inputValues.sizeId,
            originalPrice: inputValues.originalPrice,
            discountPrice: inputValues.discountPrice,
            image: inputValues.image,
            nameDetail: inputValues.nameDetail,
            contentMarkdown: inputValues.contentMarkdown,
            contentHTML: inputValues.contentHTML,
            weight: inputValues.weight
        }); // Gọi API để tạo sản phẩm mới.
        if (res && res.errCode === 0) { // Nếu tạo sản phẩm thành công.
            toast.success("Tạo mới sản phẩm thành công!"); // Hiển thị thông báo thành công.
            setInputValues({
                ...inputValues,
                // Reset các trường thông tin về mặc định sau khi tạo sản phẩm mới.
                ["name"]: '', ["shortdescription"]: '', ["categoryId"]: '', ["madeby"]: '', ["material"]: '',
                ["brandId"]: '', ["height"]: '', ["width"]: '', ["sizeId"]: '', ["originalPrice"]: '',
                ["discountPrice"]: '', ["image"]: '', ["imageReview"]: '', ["nameDetail"]: '', ["contentHTML"]: '',
                ["contenMarkdown"]: '', ["weight"]: ''
            });
        } else {
            toast.error(res.errMessage); // Hiển thị thông báo lỗi nếu có.
        }
    };

    // Hàm xử lý sự kiện khi người dùng thay đổi nội dung trong trình soạn thảo Markdown.
    let handleEditorChange = ({ html, text }) => {
        setInputValues({
            ...inputValues,
            ["contentMarkdown"]: text, // Lưu lại nội dung Markdown.
            ["contentHTML"]: html // Lưu lại nội dung HTML.
        });
    };
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới sản phẩm
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Tên sản phẩm</label>
                                <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Chất liệu</label>
                                <input type="text" value={inputValues.material} name="material" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Được làm bởi</label>
                                <input type="text" value={inputValues.madeby} name="madeby" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Danh mục sản phẩm</label>
                                <select value={inputValues.categoryId} name="categoryId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataCategory && dataCategory.length > 0 &&
                                        dataCategory.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Nhãn hàng</label>
                                <select value={inputValues.brandId} name="brandId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataBrand && dataBrand.length > 0 &&
                                        dataBrand.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Mô tả sản phẩm</label>
                            <MdEditor
                                style={{ height: '400px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={handleEditorChange}
                                value={inputValues.contentMarkdown}
                            />
                        </div>

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
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Giá gốc</label>
                                <input type="number" value={inputValues.originalPrice} name="originalPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputPassword4">Giá khuyến mãi</label>
                                <input type="number" value={inputValues.discountPrice} name="discountPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Khối lượng</label>
                                <input type="text" value={inputValues.weight} name="weight" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>


                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAddress">Mô tả chi tiết</label>
                            <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                        </div>
                        <div className="form-row">

                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Kích thước</label>
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
                            <div className="form-group col-md-4">
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

                        <button onClick={() => handleSaveProduct()} type="button" className="btn btn-primary">Lưu thông tin</button>
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
export default AddProduct;