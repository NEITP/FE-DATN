import React from 'react';  // Nhập React để sử dụng trong component
import { useEffect, useState } from 'react';  // Hook useEffect và useState từ React để quản lý trạng thái và hiệu ứng
import { getAllProductAdmin, handleBanProductService, handleActiveProductService } from '../../../services/userService';  // Import các hàm từ service quản lý sản phẩm
import moment from 'moment';  // Thư viện moment.js để xử lý thời gian
import { toast } from 'react-toastify';  // Thư viện để hiển thị thông báo toast
import { PAGINATION } from '../../../utils/constant';  // Import thông số phân trang từ constants
import ReactPaginate from 'react-paginate';  // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils';  // Các hàm tiện ích cho ứng dụng (ví dụ: xuất file Excel)
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";  // Thư viện React Router để điều hướng giữa các trang
import FormSearch from '../../../component/Search/FormSearch';  // Component tìm kiếm sản phẩm

const ManageProduct = () => {
    // Khai báo các state cần thiết để quản lý dữ liệu sản phẩm, phân trang và tìm kiếm
    const [dataProduct, setdataProduct] = useState([]);  // Lưu danh sách sản phẩm
    const [count, setCount] = useState('');  // Lưu số trang phân trang
    const [numberPage, setnumberPage] = useState('');  // Lưu số trang hiện tại
    const [keyword, setkeyword] = useState('');  // Lưu từ khóa tìm kiếm

    useEffect(() => {
        // Hàm này sẽ chạy khi component được render lần đầu tiên
        let fetchProduct = async () => {
            await loadProduct(keyword);  // Gọi hàm load sản phẩm
        }
        fetchProduct();  // Gọi hàm fetch product
    }, []);  // Chạy một lần khi component mount

    let loadProduct = async (keyword) => {
        // Hàm lấy dữ liệu sản phẩm từ API
        let arrData = await getAllProductAdmin({
            sortName: '',  // Không sắp xếp theo tên
            sortPrice: '',  // Không sắp xếp theo giá
            categoryId: 'ALL',  // Lọc sản phẩm theo tất cả danh mục
            brandId: 'ALL',  // Lọc sản phẩm theo tất cả thương hiệu
            limit: PAGINATION.pagerow,  // Giới hạn số sản phẩm trên mỗi trang
            offset: 0,  // Bắt đầu từ sản phẩm đầu tiên
            keyword: keyword  // Tìm kiếm sản phẩm theo từ khóa
        });

        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data);  // Cập nhật danh sách sản phẩm
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Cập nhật số lượng trang
        }
    };

    let handleBanProduct = async (id) => {
        // Hàm ẩn sản phẩm
        let data = await handleBanProductService({ id: id });
        if (data && data.errCode === 0) {
            toast.success("Ẩn sản phẩm thành công!");  // Hiển thị thông báo thành công
            let arrData = await getAllProductAdmin({
                sortName: '',
                sortPrice: '',
                categoryId: 'ALL',
                brandId: 'ALL',
                keyword: '',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow
            });
            if (arrData && arrData.errCode === 0) {
                setdataProduct(arrData.data);  // Cập nhật lại danh sách sản phẩm sau khi ẩn
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Cập nhật số lượng trang
            }
        } else {
            toast.error("Ẩn sản phẩm thất bại!");  // Thông báo thất bại
        }
    };

    let handleActiveProduct = async (id) => {
        // Hàm hiển thị sản phẩm trở lại
        let data = await handleActiveProductService({ id: id });
        if (data && data.errCode === 0) {
            toast.success("Hiện sản phẩm thành công!");  // Hiển thị thông báo thành công
            loadProduct('');  // Tải lại danh sách sản phẩm
        } else {
            toast.error("Hiện sản phẩm thất bại!");  // Thông báo thất bại
        }
    };

    let handleChangePage = async (number) => {
        // Hàm thay đổi trang khi người dùng click vào phân trang
        setnumberPage(number.selected);  // Cập nhật số trang hiện tại
        let arrData = await getAllProductAdmin({
            limit: PAGINATION.pagerow,  // Giới hạn số sản phẩm trên mỗi trang
            offset: number.selected * PAGINATION.pagerow,  // Xác định offset dựa trên số trang
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword: keyword  // Tìm kiếm sản phẩm theo từ khóa
        });
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data);  // Cập nhật lại danh sách sản phẩm
        }
    };

    let handleSearchProduct = (keyword) => {
        // Hàm tìm kiếm sản phẩm
        loadProduct(keyword);
        setkeyword(keyword);  // Cập nhật từ khóa tìm kiếm
    };

    let handleOnchangeSearch = (keyword) => {
        // Hàm xử lý thay đổi từ khóa tìm kiếm
        if (keyword === '') {
            loadProduct(keyword);
            setkeyword(keyword);
        }
    };

    let handleOnClickExport = async () => {
        // Hàm xuất danh sách sản phẩm ra file Excel
        let res = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            keyword: '',
            limit: '',
            offset: ''
        });
        if (res && res.errCode === 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách sản phẩm", "ListProduct");  // Xuất dữ liệu ra Excel
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách sản phẩm

                </div>



                <div className="card-body">

                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên sản phẩm"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchProduct} />                    </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Nhãn hàng</th>
                                    <th>Chất liệu</th>
                                    <th>Được làm bởi</th>
                                    <th>Lượt xem</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataProduct && dataProduct.length > 0 &&
                                    dataProduct.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.categoryData.value}</td>
                                                <td>{item.brandData.value}</td>
                                                <td>{item.material}</td>
                                                <td>{item.madeby}</td>
                                                <td>{item.view ? item.view : 0}</td>
                                                <td>{item.statusData.value}</td>
                                                <td style={{ width: '12%' }}>
                                                    <Link to={`/admin/list-product-detail/${item.id}`}>View</Link>
                                                    &nbsp; &nbsp;
                                                    <Link to={`/admin/edit-product/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    {item.statusData.code === 'S1' ?
                                                        <span onClick={() => handleBanProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Ban</span>
                                                        : <span onClick={() => handleActiveProduct(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }}   >Active</span>
                                                    }



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
export default ManageProduct;