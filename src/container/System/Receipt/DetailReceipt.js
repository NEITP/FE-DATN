import React from 'react'; // Import React để sử dụng các tính năng của React.
import { useEffect, useState } from 'react'; // Import useEffect và useState từ React để quản lý trạng thái và hiệu ứng phụ.
import { getAllProductAdmin, getDetailReceiptByIdService, createNewReceiptDetailService } from '../../../services/userService'; // Import các hàm dịch vụ để lấy sản phẩm, chi tiết hóa đơn và thêm chi tiết hóa đơn.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo cho người dùng.
import { Link, useParams } from "react-router-dom"; // Import các thành phần từ react-router-dom để sử dụng đường dẫn và tham số URL.
import 'react-toastify/dist/ReactToastify.css'; // Import css của react-toastify để hiển thị thông báo.
import CommonUtils from '../../../utils/CommonUtils'; // Import các tiện ích chung, ví dụ như xuất file Excel.
import moment from 'moment'; // Import thư viện moment để xử lý và định dạng thời gian.

const DetailReceipt = (props) => {
    const { id } = useParams(); // Lấy tham số 'id' từ URL (dùng để nhận diện hóa đơn).
    const [dataProduct, setdataProduct] = useState([]); // State để lưu trữ danh sách sản phẩm.
    const [dataProductDetail, setdataProductDetail] = useState([]); // State để lưu trữ chi tiết sản phẩm.
    const [dataProductDetailSize, setdataProductDetailSize] = useState([]); // State để lưu trữ kích thước của sản phẩm chi tiết.
    const [productDetailSizeId, setproductDetailSizeId] = useState(''); // State để lưu trữ ID kích thước sản phẩm.
    const [dataReceiptDetail, setdataReceiptDetail] = useState({}); // State để lưu trữ chi tiết hóa đơn.
    const [inputValues, setInputValues] = useState({ // State để lưu trữ các giá trị đầu vào từ form.
        quantity: '', // Số lượng của sản phẩm
        price: '', // Giá của sản phẩm
        productId: '' // ID của sản phẩm
    });

    // Kiểm tra và cập nhật state khi dữ liệu sản phẩm được tải về
    if (dataProduct && dataProduct.length > 0 && inputValues.productId === '') {
        setInputValues({ ...inputValues, ["productId"]: dataProduct[0].id }); // Thiết lập giá trị mặc định cho productId
        setproductDetailSizeId(dataProduct[0].productDetail[0].productDetailSize[0].id); // Thiết lập kích thước mặc định cho sản phẩm
        setdataProductDetail(dataProduct[0].productDetail); // Cập nhật chi tiết sản phẩm
        setdataProductDetailSize(dataProduct[0].productDetail[0].productDetailSize); // Cập nhật kích thước của sản phẩm chi tiết
    }

    // Dùng useEffect để tải dữ liệu khi component được render lần đầu tiên
    useEffect(() => {
        loadProduct(); // Gọi hàm để tải dữ liệu sản phẩm
        loadReceiptDetail(id); // Gọi hàm để tải chi tiết hóa đơn theo ID
    }, []); // useEffect sẽ chạy một lần khi component được mount

    // Hàm tải chi tiết hóa đơn từ API theo ID
    let loadReceiptDetail = async (id) => {
        let res = await getDetailReceiptByIdService(id); // Gọi service để lấy chi tiết hóa đơn
        if (res && res.errCode === 0) {
            setdataReceiptDetail(res.data.receiptDetail); // Cập nhật chi tiết hóa đơn vào state
        }
    };

    // Hàm tải danh sách sản phẩm từ API
    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({
            sortName: '', // Không sắp xếp theo tên
            sortPrice: '', // Không sắp xếp theo giá
            categoryId: 'ALL', // Lọc theo tất cả các danh mục
            brandId: 'ALL', // Lọc theo tất cả các thương hiệu
            limit: '', // Không giới hạn số lượng
            offset: '', // Không có offset
            keyword: '' // Không lọc theo từ khóa
        });
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data); // Cập nhật danh sách sản phẩm vào state
        }
    };

    // Hàm xử lý thay đổi giá trị các trường nhập liệu
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường nhập liệu
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật giá trị tương ứng trong state
    };

    // Hàm xử lý thay đổi khi người dùng chọn sản phẩm
    const handleOnChangeProduct = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của sản phẩm
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật giá trị trong state
        // Tìm sản phẩm tương ứng trong dataProduct và cập nhật chi tiết sản phẩm và kích thước
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].id == value) {
                setdataProductDetail(dataProduct[i].productDetail); // Cập nhật chi tiết sản phẩm
                setdataProductDetailSize(dataProduct[i].productDetail[0].productDetailSize); // Cập nhật kích thước sản phẩm
                setproductDetailSizeId(dataProduct[i].productDetail[0].productDetailSize[0].id); // Cập nhật ID kích thước
            }
        }
    };

    // Hàm xử lý khi người dùng chọn chi tiết sản phẩm
    let handleOnChangeProductDetail = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của chi tiết sản phẩm
        // Tìm chi tiết sản phẩm và cập nhật kích thước sản phẩm
        for (let i = 0; i < dataProductDetail.length; i++) {
            if (dataProductDetail[i].id == value) {
                setdataProductDetailSize(dataProductDetail[i].productDetailSize); // Cập nhật kích thước sản phẩm
                setproductDetailSizeId(dataProductDetail[i].productDetailSize[0].id); // Cập nhật ID kích thước
            }
        }
    };

    // Hàm lưu chi tiết hóa đơn mới
    let handleSaveReceiptDetail = async () => {
        let res = await createNewReceiptDetailService({
            receiptId: id, // ID của hóa đơn
            productDetailSizeId: productDetailSizeId, // ID kích thước sản phẩm
            quantity: inputValues.quantity, // Số lượng sản phẩm
            price: inputValues.price // Giá của sản phẩm
        });
        if (res && res.errCode === 0) {
            toast.success("Thêm nhập chi tiết hàng thành công"); // Hiển thị thông báo thành công
            setInputValues({
                ...inputValues,
                ["quantity"]: '', // Reset các giá trị nhập liệu sau khi lưu thành công
                ["price"]: ''
            });
            loadReceiptDetail(id); // Tải lại chi tiết hóa đơn sau khi lưu thành công
        } else if (res && res.errCode === 2) {
            toast.error(res.errMessage); // Hiển thị thông báo lỗi từ API
        } else {
            toast.error("Thêm nhập hàng thất bại"); // Hiển thị thông báo lỗi mặc định
        }
    };


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết nhập hàng</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới chi tiết nhập hàng
                </div>
                <div className="card-body">
                    <form>
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

                        <button type="button" onClick={() => handleSaveReceiptDetail()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết nhập hàng
                </div>
                <div className="card-body">

                    <div className='row'>

                        <div className='col-12'>
                            {/* <button  style={{float:'right'}} onClick={() => handleOnClickExport()} className="btn btn-success mb-2" >Xuất excel <i class="fa-solid fa-file-excel"></i></button> */}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>

                                </tr>
                            </thead>

                            <tbody>
                                {dataReceiptDetail && dataReceiptDetail.length > 0 &&
                                    dataReceiptDetail.map((item, index) => {
                                        let name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeData.value}`
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.receiptId}</td>
                                                <td>{name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>

                                            </tr>
                                        )
                                    })
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default DetailReceipt;