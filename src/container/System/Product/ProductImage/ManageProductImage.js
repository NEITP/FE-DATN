import React from 'react';
import { useEffect, useState } from 'react';
import {
    // Các service được sử dụng để lấy, tạo, cập nhật và xóa hình ảnh và kích thước sản phẩm
    getAllProductDetailImageByIdService, createNewProductImageService, UpdateProductDetailImageService,
    DeleteProductDetailImageService, getAllProductDetailSizeByIdService, createNewProductSizeService,
    UpdateProductDetailSizeService, DeleteProductDetailSizeService
} from '../../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import './ManageProductImage.scss';
import Lightbox from 'react-image-lightbox'; // Dùng để hiển thị ảnh trong chế độ ánh sáng
import 'react-image-lightbox/style.css';
import { PAGINATION } from '../../../../utils/constant'; // Constants chứa thông số phân trang
import ReactPaginate from 'react-paginate'; // Thư viện để phân trang trong React
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import AddImageModal from './AddImageModal'; // Modal để thêm hình ảnh
import AddSizeModal from './AddSizeModal'; // Modal để thêm kích thước sản phẩm

const ManageProductImage = () => {

    // Dùng useParams để lấy id sản phẩm từ URL
    const { id } = useParams();
    // Khai báo các state cần thiết để lưu trữ dữ liệu hình ảnh và kích thước sản phẩm
    const [dataProductDetailImage, setdataProductDetailImage] = useState([]);
    const [dataProductDetailSize, setdataProductDetailSize] = useState([]);
    const [isOpen, setisOpen] = useState(false); // Trạng thái mở modal ảnh
    const [isOpenModal, setisOpenModal] = useState(false); // Trạng thái mở modal hình ảnh
    const [isOpenModalSize, setisOpenModalSize] = useState(false); // Trạng thái mở modal kích thước
    const [imgPreview, setimgPreview] = useState(''); // Dữ liệu xem trước ảnh
    const [productImageId, setproductImageId] = useState(''); // Id của ảnh sản phẩm
    const [productSizeId, setproductSizeId] = useState(''); // Id của kích thước sản phẩm
    const [count, setCount] = useState(''); // Tổng số trang hình ảnh
    const [countSize, setcountSizes] = useState(''); // Tổng số trang kích thước
    const [numberPage, setnumberPage] = useState(''); // Trang hiện tại

    // useEffect để gọi các hàm tải dữ liệu khi component mount
    useEffect(() => {
        let fetchProductDetailImage = async () => {
            await loadProductDetailImage();
        }
        let fetchProductSize = async () => {
            await loadProductDetailSize();
        }
        fetchProductDetailImage(); // Lấy dữ liệu hình ảnh sản phẩm
        fetchProductSize(); // Lấy dữ liệu kích thước sản phẩm
    }, [])

    // Hàm lấy dữ liệu hình ảnh sản phẩm từ dịch vụ
    let loadProductDetailImage = async () => {
        let arrData = await getAllProductDetailImageByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: 0
        });
        if (arrData && arrData.errCode === 0) {
            setdataProductDetailImage(arrData.data); // Lưu dữ liệu hình ảnh vào state
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính tổng số trang
        }
    }

    // Hàm lấy dữ liệu kích thước sản phẩm từ dịch vụ
    let loadProductDetailSize = async () => {
        let arrSize = await getAllProductDetailSizeByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: 0
        });
        if (arrSize && arrSize.errCode === 0) {
            setdataProductDetailSize(arrSize.data); // Lưu dữ liệu kích thước vào state
            setcountSizes(Math.ceil(arrSize.count / PAGINATION.pagerow)); // Tính tổng số trang
        }
    }

    // Hàm mở xem trước hình ảnh
    let openPreviewImage = (url) => {
        setimgPreview(url); // Lưu URL ảnh để xem trước
        setisOpen(true); // Mở modal
    }

    // Hàm đóng modal hình ảnh
    let closeModal = () => {
        setisOpenModal(false); // Đóng modal hình ảnh
        setproductImageId(''); // Xóa ID ảnh
    }

    // Hàm mở modal để thêm hình ảnh
    let handleOpenModal = () => {
        setisOpenModal(true); // Mở modal
    }

    // Hàm đóng modal kích thước sản phẩm
    let closeModalSize = () => {
        setisOpenModalSize(false); // Đóng modal kích thước
        setproductSizeId(''); // Xóa ID kích thước
    }

    // Hàm mở modal để thêm kích thước sản phẩm
    let handleOpenModalSize = () => {
        setisOpenModalSize(true); // Mở modal kích thước
    }

    // Hàm gửi dữ liệu từ modal hình ảnh
    let sendDataFromModal = async (data) => {
        if (data.isActionUpdate === false) {
            let response = await createNewProductImageService({
                caption: data.caption,
                image: data.image,
                id: id
            });
            if (response && response.errCode === 0) {
                toast.success("Thêm hình ảnh thành công !");
                setisOpenModal(false); // Đóng modal
                await loadProductDetailImage(); // Tải lại danh sách hình ảnh
            } else {
                toast.error("Thêm hình ảnh thất bại !");
            }
        } else {
            let response = await UpdateProductDetailImageService({
                caption: data.caption,
                image: data.image,
                id: data.id
            });
            if (response && response.errCode === 0) {
                setproductImageId(''); // Xóa ID ảnh
                toast.success("Cập nhật hình ảnh thành công !");
                setisOpenModal(false); // Đóng modal
                await loadProductDetailImage(); // Tải lại danh sách hình ảnh
            } else {
                toast.error("Cập nhật ảnh thất bại !");
            }
        }
    }

    // Hàm gửi dữ liệu từ modal kích thước sản phẩm
    let sendDataFromModalSize = async (data) => {
        if (data.isActionUpdate === false) {
            let response = await createNewProductSizeService({
                productdetailId: id,
                sizeId: data.sizeId,
                width: data.width,
                height: data.height,
                stock: data.stock,
                weight: data.weight
            });
            if (response && response.errCode === 0) {
                toast.success("Thêm kích thước thành công !");
                setisOpenModalSize(false); // Đóng modal
                await loadProductDetailSize(); // Tải lại danh sách kích thước
            } else {
                toast.error("Thêm kích thước thất bại");
            }
        } else {
            let response = await UpdateProductDetailSizeService({
                sizeId: data.sizeId,
                width: data.width,
                height: data.height,
                stock: data.stock,
                id: data.id,
                weight: data.weight
            });
            if (response && response.errCode === 0) {
                setproductSizeId(''); // Xóa ID kích thước
                toast.success("Cập nhật kích thước thành công !");
                setisOpenModalSize(false); // Đóng modal
                await loadProductDetailSize(); // Tải lại danh sách kích thước
            } else {
                toast.error("Cập nhật kích thước thất bại !");
            }
        }
    }

    // Hàm chỉnh sửa thông tin hình ảnh sản phẩm
    let handleEditProductImage = (id) => {
        setproductImageId(id); // Lưu ID ảnh vào state
        setisOpenModal(true); // Mở modal
    }

    // Hàm chỉnh sửa thông tin kích thước sản phẩm
    let handleEditProductSize = (id) => {
        setproductSizeId(id); // Lưu ID kích thước vào state
        setisOpenModalSize(true); // Mở modal
    }

    // Hàm xóa hình ảnh sản phẩm
    let handleDeleteProductImage = async (productdetailImageId) => {
        let response = await DeleteProductDetailImageService({
            data: {
                id: productdetailImageId
            }
        });
        if (response && response.errCode === 0) {
            toast.success("Xóa hình ảnh thành công !");
            let arrData = await getAllProductDetailImageByIdService({
                id: id,
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow
            });
            if (arrData && arrData.errCode === 0) {
                setdataProductDetailImage(arrData.data); // Lưu dữ liệu hình ảnh mới vào state
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính lại tổng số trang
            }
        } else {
            toast.error("Xóa hình ảnh thất bại !");
        }
    }

    // Hàm xóa kích thước sản phẩm
    let handleDeleteProductSize = async (productdetailsizeId) => {
        let response = await DeleteProductDetailSizeService({
            data: {
                id: productdetailsizeId
            }
        });
        if (response && response.errCode === 0) {
            toast.success("Xóa kích thước thành công !");
            let arrData = await getAllProductDetailSizeByIdService({
                id: id,
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow
            });
            if (arrData && arrData.errCode === 0) {
                setdataProductDetailSize(arrData.data); // Lưu dữ liệu kích thước mới vào state
                setcountSizes(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính lại tổng số trang
            }
        } else {
            toast.error("Xóa kích thước thất bại !");
        }
    }

    // Hàm thay đổi trang khi phân trang hình ảnh
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Lưu trang hiện tại
        let arrData = await getAllProductDetailImageByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow
        });
        if (arrData && arrData.errCode === 0) {
            setdataProductDetailImage(arrData.data); // Lưu dữ liệu hình ảnh vào state
        }
    }

    // Hàm thay đổi trang khi phân trang kích thước
    let handleChangePageProductSize = async (number) => {
        setnumberPage(number.selected); // Lưu trang hiện tại
        let arrSize = await getAllProductDetailSizeByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow
        });
        if (arrSize && arrSize.errCode === 0) {
            setdataProductDetailSize(arrSize.data); // Lưu dữ liệu kích thước vào state
        }
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thông tin chi tiết sản phẩm</h1>

            <div>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách hình ảnh chi tiết sản phẩm
                        <div onClick={() => handleOpenModal()} className="float-right"><i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i></div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên hình ảnh</th>
                                        <th>Hình ảnh</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dataProductDetailImage && dataProductDetailImage.length > 0 &&
                                        dataProductDetailImage.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.caption}</td>
                                                    <td ><div onClick={() => openPreviewImage(item.image)} className="box-image" style={{ backgroundImage: `url(${item.image})` }}></div></td>
                                                    <td>

                                                        <span onClick={() => handleEditProductImage(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Edit</span>
                                                        &nbsp; &nbsp;
                                                        <span onClick={() => handleDeleteProductImage(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Delete</span>

                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }




                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddImageModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        sendDataFromModal={sendDataFromModal}
                        productImageId={productImageId}
                    />
                </div>

                {
                    isOpen === true &&
                    <Lightbox mainSrc={imgPreview}
                        onCloseRequest={() => setisOpen(false)}
                    />
                }
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={count}
                    marginPagesDisplayed={3}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={handleChangePage}
                />
            </div>

            <div>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách kích thước chi tiết sản phẩm
                        <div onClick={() => handleOpenModalSize()} className="float-right"><i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i></div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Kích thước</th>
                                        <th>Chiều rộng</th>
                                        <th>Chiều dài</th>
                                        <th>Khối lượng</th>
                                        <th>Số lượng tồn</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.sizeData.value}</td>
                                                    <td>{item.width}</td>
                                                    <td>{item.height}</td>
                                                    <td>{item.weight}</td>
                                                    <td>{item.stock}</td>
                                                    <td>

                                                        <span onClick={() => handleEditProductSize(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Edit</span>
                                                        &nbsp; &nbsp;
                                                        <span onClick={() => handleDeleteProductSize(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Delete</span>

                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <AddSizeModal
                        isOpenModal={isOpenModalSize}
                        closeModal={closeModalSize}
                        sendDataFromModalSize={sendDataFromModalSize}
                        productSizeId={productSizeId}
                    />
                </div>

                {
                    isOpen === true &&
                    <Lightbox mainSrc={imgPreview}
                        onCloseRequest={() => setisOpen(false)}
                    />
                }
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={countSize}
                    marginPagesDisplayed={3}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={handleChangePageProductSize}
                />
            </div>
        </div >
    )
}
export default ManageProductImage;