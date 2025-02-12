import React from 'react';
import { useEffect, useState } from 'react';
import { createNewReceiptService, getAllSupplier, getAllProductAdmin } from '../../../services/userService';

import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import moment from 'moment';

const AddReceipt = (props) => {
    const [user, setUser] = useState({});  // Khởi tạo state để lưu thông tin người dùng
    const [dataSupplier, setdataSupplier] = useState([]);  // Khởi tạo state để lưu danh sách nhà cung cấp
    const [dataProduct, setdataProduct] = useState([]);  // Khởi tạo state để lưu danh sách sản phẩm
    const [dataProductDetail, setdataProductDetail] = useState([]);  // Khởi tạo state để lưu chi tiết sản phẩm
    const [dataProductDetailSize, setdataProductDetailSize] = useState([]);  // Khởi tạo state để lưu các kích thước chi tiết sản phẩm
    const [productDetailSizeId, setproductDetailSizeId] = useState('');  // Khởi tạo state để lưu ID kích thước sản phẩm
    const [inputValues, setInputValues] = useState({  // Khởi tạo state để lưu các giá trị đầu vào của form
        supplierId: '', quantity: '', price: '', productId: ''
    });

    // Kiểm tra nếu chưa có nhà cung cấp và sản phẩm, thiết lập giá trị mặc định cho supplierId và productId
    if (dataSupplier && dataSupplier.length > 0 && inputValues.supplierId === '' && dataProduct && dataProduct.length > 0 && inputValues.productId === '') {
        setInputValues({ ...inputValues, ["supplierId"]: dataSupplier[0].id, })
        setdataProductDetail(dataProduct[0].productDetail)
        setdataProductDetailSize(dataProduct[0].productDetail[0].productDetailSize)
        setproductDetailSizeId(dataProduct[0].productDetail[0].productDetailSize[0].id)
    }

    // Hook useEffect chạy khi component được load để lấy dữ liệu nhà cung cấp, sản phẩm, và thông tin người dùng
    useEffect(() => {
        loadDataSupplier()  // Gọi hàm lấy dữ liệu nhà cung cấp
        loadProduct()  // Gọi hàm lấy dữ liệu sản phẩm
        const userData = JSON.parse(localStorage.getItem('userData'));  // Lấy thông tin người dùng từ localStorage
        setUser(userData)  // Lưu thông tin người dùng vào state
    }, []);  // Chạy một lần khi component được mount

    // Hàm lấy danh sách nhà cung cấp
    let loadDataSupplier = async () => {
        let arrData = await getAllSupplier({
            limit: '',
            offset: '',
            keyword: ''
        });
        if (arrData && arrData.errCode === 0) {
            setdataSupplier(arrData.data);  // Cập nhật state với dữ liệu nhà cung cấp
        }
    }

    // Hàm lấy danh sách sản phẩm
    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data);  // Cập nhật state với dữ liệu sản phẩm
        }
    }

    // Hàm xử lý sự kiện thay đổi giá trị trong form
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });  // Cập nhật giá trị của các input tương ứng
    };

    // Hàm xử lý sự kiện thay đổi sản phẩm
    const handleOnChangeProduct = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].id == value) {  // Tìm sản phẩm theo ID
                setdataProductDetail(dataProduct[i].productDetail);  // Cập nhật chi tiết sản phẩm
                setdataProductDetailSize(dataProduct[i].productDetail[0].productDetailSize);  // Cập nhật kích thước chi tiết sản phẩm
                setproductDetailSizeId(dataProduct[i].productDetail[0].productDetailSize[0].id);  // Cập nhật ID kích thước sản phẩm
            }
        }
    };

    // Hàm xử lý sự kiện thay đổi chi tiết sản phẩm
    let handleOnChangeProductDetail = event => {
        const { name, value } = event.target;
        for (let i = 0; i < dataProductDetail.length; i++) {
            if (dataProductDetail[i].id == value) {  // Tìm chi tiết sản phẩm theo ID
                setdataProductDetailSize(dataProductDetail[i].productDetailSize);  // Cập nhật kích thước của chi tiết sản phẩm
                setproductDetailSizeId(dataProductDetail[i].productDetailSize[0].id);  // Cập nhật ID kích thước sản phẩm
            }
        }
    }

    // Hàm lưu hóa đơn nhập hàng
    let handleSaveReceipt = async () => {
        let res = await createNewReceiptService({
            supplierId: inputValues.supplierId,
            userId: user.id,  // Lấy ID người dùng từ state
            productDetailSizeId: productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price
        });

        if (res && res.errCode === 0) {
            toast.success("Thêm nhập hàng thành công")  // Thông báo thành công
            setInputValues({
                ...inputValues,
                ["quantity"]: '',
                ["price"]: ''
            })
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)  // Thông báo lỗi nếu có
        }
        else toast.error("Thêm nhập hàng thất bại")  // Thông báo thất bại chung
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhập hàng</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới nhập hàng
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Nhà cung cấp</label>
                                <select value={inputValues.supplierId} name="supplierId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataSupplier && dataSupplier.length > 0 &&
                                        dataSupplier.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Sản phẩm</label>
                                <select value={inputValues.productId} name="productId" onChange={(event) => handleOnChangeProduct(event)} id="inputState" className="form-control">
                                    {dataProduct && dataProduct.length > 0 &&
                                        dataProduct.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Loại sản phẩm</label>
                                <select onChange={(event) => handleOnChangeProductDetail(event)} id="inputState" className="form-control">
                                    {dataProductDetail && dataProductDetail.length > 0 &&
                                        dataProductDetail.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.nameDetail}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="inputEmail4">Size sản phẩm</label>
                                <select value={productDetailSizeId} name="productDetailSizeId" onChange={(event) => setproductDetailSizeId(event.target.value)} id="inputState" className="form-control">
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.sizeId}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Số lượng</label>
                                <input type="number" value={inputValues.quantity} name="quantity" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Đơn giá</label>
                                <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                        </div>

                        <button type="button" onClick={() => handleSaveReceipt()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default AddReceipt;