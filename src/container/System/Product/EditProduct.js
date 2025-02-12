import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Thư viện thông báo (toast) dùng để hiển thị thông báo cho người dùng.
import { useParams } from "react-router-dom"; // Dùng để lấy tham số từ URL (ví dụ: ID của sản phẩm cần sửa).
import 'react-toastify/dist/ReactToastify.css'; // Cung cấp các kiểu dáng mặc định cho thông báo toast.
import { useFetchAllcode } from '../../customize/fetch'; // Tùy chỉnh hook dùng để lấy dữ liệu danh mục, thương hiệu từ API.
import './AddProduct.scss'; // Import file SCSS cho kiểu dáng của trang này.
import MarkdownIt from 'markdown-it'; // Thư viện dùng để chuyển Markdown thành HTML.
import MdEditor from 'react-markdown-editor-lite'; // Thư viện để hiển thị trình soạn thảo Markdown.
import 'react-markdown-editor-lite/lib/index.css'; // Cung cấp kiểu dáng cho trình soạn thảo Markdown.
import { getDetailProductByIdService, UpdateProductService } from '../../../services/userService'; // Các API dùng để lấy chi tiết sản phẩm và cập nhật sản phẩm.

const EditProduct = (props) => {
    const mdParser = new MarkdownIt(); // Khởi tạo đối tượng MarkdownIt để xử lý Markdown thành HTML.
    const { id } = useParams(); // Lấy tham số "id" từ URL (ID của sản phẩm cần sửa).
    const { data: dataBrand } = useFetchAllcode('BRAND'); // Lấy danh sách thương hiệu từ API.
    const { data: dataCategory } = useFetchAllcode('CATEGORY'); // Lấy danh sách danh mục sản phẩm từ API.

    // State lưu trữ thông tin của sản phẩm khi đang chỉnh sửa.
    const [inputValues, setInputValues] = useState({
        brandId: '', categoryId: '', name: '', contentHTML: '', contentMarkdown: '',
        madeby: '', material: '', // Các thông tin cần thiết cho sản phẩm.
    });

    // useEffect sẽ chạy khi component được load, để lấy thông tin sản phẩm cần sửa từ API.
    useEffect(() => {
        let fetchProduct = async () => {
            let res = await getDetailProductByIdService(id); // Gọi API lấy thông tin sản phẩm theo ID.
            if (res && res.errCode === 0) {
                setStateProduct(res.data); // Nếu có dữ liệu sản phẩm, sẽ lưu vào state.
            }
        }
        fetchProduct();
    }, []); // useEffect chỉ chạy 1 lần khi component được render lần đầu tiên.

    // Hàm để cập nhật lại state với thông tin sản phẩm.
    let setStateProduct = (data) => {
        setInputValues({
            ...inputValues,
            ["brandId"]: data.brandId,
            ["categoryId"]: data.categoryId,
            ["name"]: data.name,
            ["contentMarkdown"]: data.contentMarkdown,
            ["contentHTML"]: data.contentHTML,
            ["madeby"]: data.madeby,
            ["material"]: data.material,
        });
    }

    // Hàm xử lý sự kiện thay đổi giá trị của các input.
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường thay đổi.
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật lại state với giá trị mới.
    };

    // Hàm lưu thông tin sản phẩm khi người dùng nhấn "Lưu".
    let handleSaveProduct = async () => {
        let res = await UpdateProductService({
            name: inputValues.name,
            material: inputValues.material,
            madeby: inputValues.madeby,
            brandId: inputValues.brandId,
            categoryId: inputValues.categoryId,
            contentHTML: inputValues.contentHTML,
            contentMarkdown: inputValues.contentMarkdown,
            id: id // Cập nhật sản phẩm theo ID.
        });
        if (res && res.errCode === 0) {
            toast.success("Cập nhật sản phẩm thành công !"); // Hiển thị thông báo thành công.
        } else {
            toast.error(res.errMessage); // Nếu có lỗi, hiển thị thông báo lỗi.
        }
    }

    // Hàm xử lý thay đổi nội dung trong trình soạn thảo Markdown.
    let handleEditorChange = ({ html, text }) => {
        setInputValues({
            ...inputValues,
            ["contentMarkdown"]: text, // Lưu lại nội dung Markdown.
            ["contentHTML"]: html // Lưu lại nội dung HTML.
        });
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Cập nhật sản phẩm
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


                        <button onClick={() => handleSaveProduct()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>

        </div>
    )
}
export default EditProduct;