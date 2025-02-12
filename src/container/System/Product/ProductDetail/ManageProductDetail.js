import React from 'react'; // Import React để sử dụng JSX.
import { useEffect, useState } from 'react'; // Import các hook useEffect và useState từ React.
import { getAllProductDetailByIdService, DeleteProductDetailService } from '../../../../services/userService'; // Import các dịch vụ API từ userService để lấy và xóa chi tiết sản phẩm.
import moment from 'moment'; // Import thư viện moment để xử lý ngày giờ (mặc dù không sử dụng trong đoạn mã này).
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo thành công hoặc thất bại.
import { PAGINATION } from '../../../../utils/constant'; // Import hằng số về pagination để phân trang.
import ReactPaginate from 'react-paginate'; // Import thư viện ReactPaginate để xử lý phân trang.
import CommonUtils from '../../../../utils/CommonUtils'; // Import CommonUtils cho các hàm tiện ích.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom"; // Import các thành phần từ react-router-dom để điều hướng trong ứng dụng.

const ManageProductDetail = () => {
    const { id } = useParams(); // Lấy id của sản phẩm từ URL (params).
    const [dataProductDetail, setdataProductDetail] = useState([]); // State lưu trữ dữ liệu chi tiết sản phẩm.
    const [count, setCount] = useState(''); // State lưu trữ số trang (total pages).
    const [numberPage, setnumberPage] = useState(''); // State lưu trữ trang hiện tại.

    // useEffect để gọi hàm fetchProductDetail khi component được render lần đầu tiên.
    useEffect(() => {
        let fetchProductDetail = async () => {
            await loadProductDetail(); // Gọi hàm loadProductDetail để lấy dữ liệu chi tiết sản phẩm.
        }
        fetchProductDetail(); // Gọi hàm fetchProductDetail.
    }, []); // Chỉ chạy khi component được mount lần đầu tiên.

    // Hàm loadProductDetail dùng để gọi API lấy dữ liệu chi tiết sản phẩm theo id sản phẩm.
    let loadProductDetail = async () => {
        let arrData = await getAllProductDetailByIdService({
            id: id, // Truyền id sản phẩm từ URL vào API.
            limit: PAGINATION.pagerow, // Số lượng chi tiết sản phẩm trên mỗi trang.
            offset: 0 // Bắt đầu từ trang đầu tiên.
        });

        if (arrData && arrData.errCode === 0) {
            setdataProductDetail(arrData.data); // Lưu dữ liệu chi tiết sản phẩm vào state.
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính số trang dựa trên tổng số bản ghi và số bản ghi trên mỗi trang.
        }
    }

    // Hàm handleDeleteProductDetail dùng để xóa một chi tiết sản phẩm khi người dùng bấm nút xóa.
    let handleDeleteProductDetail = async (productdetailId) => {
        // Gọi API xóa chi tiết sản phẩm.
        let response = await DeleteProductDetailService({
            data: {
                id: productdetailId // Truyền id của chi tiết sản phẩm cần xóa.
            }
        });

        if (response && response.errCode === 0) {
            toast.success("Xóa chi tiết sản phẩm thành công !"); // Hiển thị thông báo thành công.

            // Sau khi xóa thành công, lấy lại danh sách chi tiết sản phẩm mới từ API.
            let arrData = await getAllProductDetailByIdService({
                id: id, // Truyền id sản phẩm.
                limit: PAGINATION.pagerow, // Giới hạn số lượng bản ghi trên mỗi trang.
                offset: numberPage * PAGINATION.pagerow // Tính offset dựa trên số trang hiện tại.
            });

            if (arrData && arrData.errCode === 0) {
                setdataProductDetail(arrData.data); // Cập nhật lại danh sách chi tiết sản phẩm.
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật lại số trang.
            }
        } else {
            toast.error("Xóa sản phẩm thất bại"); // Hiển thị thông báo lỗi nếu xóa thất bại.
        }
    }

    // Hàm handleChangePage dùng để thay đổi trang khi người dùng chọn một trang mới trong phân trang.
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại.

        // Gọi API để lấy lại dữ liệu chi tiết sản phẩm cho trang mới.
        let arrData = await getAllProductDetailByIdService({
            id: id, // Truyền id sản phẩm.
            limit: PAGINATION.pagerow, // Giới hạn số lượng bản ghi trên mỗi trang.
            offset: number.selected * PAGINATION.pagerow // Tính offset dựa trên trang được chọn.
        });

        if (arrData && arrData.errCode === 0) {
            setdataProductDetail(arrData.data); // Cập nhật lại danh sách chi tiết sản phẩm cho trang mới.
        }
    }
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết sản phẩm
                    <div className="float-right"><Link to={`/admin/add-product-detail/${id}`}><i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i></Link></div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên loại sản phẩm</th>
                                    <th>Giá gốc</th>
                                    <th>Giá khuyến mãi</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataProductDetail && dataProductDetail.length > 0 &&
                                    dataProductDetail.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.nameDetail}</td>
                                                <td>{CommonUtils.formatter.format(item.originalPrice)}</td>
                                                <td>{CommonUtils.formatter.format(item.discountPrice)}</td>
                                                <td>
                                                    <Link to={`/admin/list-product-detail-image/${item.id}`}>View</Link>
                                                    &nbsp; &nbsp;
                                                    <Link to={`/admin/update-product-detail/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <span onClick={() => handleDeleteProductDetail(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Delete</span>

                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
    )
}
export default ManageProductDetail;