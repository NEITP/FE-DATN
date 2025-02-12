import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';  // Tùy chỉnh hook để lấy tất cả mã
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';  // Dịch vụ để xóa và lấy danh sách mã
import moment from 'moment';  // Thư viện để xử lý thời gian
import { toast } from 'react-toastify';  // Thư viện thông báo khi có sự kiện xảy ra
import { PAGINATION } from '../../../utils/constant';  // Cấu hình phân trang
import ReactPaginate from 'react-paginate';  // Thư viện phân trang cho React
import FormSearch from '../../../component/Search/FormSearch';  // Thành phần tìm kiếm
import CommonUtils from '../../../utils/CommonUtils';  // Các phương thức tiện ích chung
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";  // Các thành phần điều hướng của React Router

const ManageBrand = () => {
    // Các state để lưu trữ thông tin cần thiết
    const [keyword, setkeyword] = useState('')  // Từ khóa tìm kiếm
    const [dataBrand, setdataBrand] = useState([])  // Dữ liệu nhãn hàng
    const [count, setCount] = useState('')  // Tổng số trang
    const [numberPage, setnumberPage] = useState('')  // Trang hiện tại

    // Hook useEffect chạy lần đầu khi component được render
    useEffect(() => {
        try {
            fetchData(keyword);  // Lấy dữ liệu nhãn hàng khi component được render lần đầu
        } catch (error) {
            console.log(error)  // Nếu có lỗi thì log ra console
        }
    }, [])

    // Hàm lấy dữ liệu từ API
    let fetchData = async (keyword) => {
        let arrData = await getListAllCodeService({
            type: 'BRAND',  // Lấy dữ liệu loại "BRAND"
            limit: PAGINATION.pagerow,  // Giới hạn số lượng hàng mỗi trang
            offset: 0,  // Vị trí bắt đầu (từ trang đầu tiên)
            keyword: keyword  // Từ khóa tìm kiếm
        })
        if (arrData && arrData.errCode === 0) {
            setdataBrand(arrData.data)  // Cập nhật dữ liệu nhãn hàng
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))  // Tính toán tổng số trang
        }
    }

    // Hàm xử lý xóa nhãn hàng
    let handleDeleteBrand = async (event, id) => {
        event.preventDefault();  // Ngừng hành động mặc định của sự kiện (click link)
        let res = await DeleteAllcodeService(id)  // Gọi dịch vụ xóa nhãn hàng
        if (res && res.errCode === 0) {
            toast.success("Xóa nhãn hàng thành công")  // Thông báo thành công
            let arrData = await getListAllCodeService({
                type: 'BRAND',  // Lấy lại dữ liệu nhãn hàng sau khi xóa
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,  // Cập nhật offset khi chuyển trang
                keyword: keyword
            })
            if (arrData && arrData.errCode === 0) {
                setdataBrand(arrData.data)  // Cập nhật lại danh sách nhãn hàng
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))  // Cập nhật lại số trang
            }
        } else toast.error("Xóa nhãn hàng thất bại")  // Thông báo thất bại nếu xóa không thành công
    }

    // Hàm xử lý thay đổi trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)  // Cập nhật số trang hiện tại
        let arrData = await getListAllCodeService({
            type: 'BRAND',  // Lấy dữ liệu loại "BRAND"
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,  // Cập nhật offset khi thay đổi trang
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataBrand(arrData.data)  // Cập nhật dữ liệu nhãn hàng khi thay đổi trang
        }
    }

    // Hàm xử lý tìm kiếm nhãn hàng
    let handleSearchBrand = (keyword) => {
        fetchData(keyword)  // Gọi lại hàm fetchData để lấy dữ liệu mới
        setkeyword(keyword)  // Cập nhật từ khóa tìm kiếm
    }

    // Hàm xử lý thay đổi trong ô tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {  // Nếu từ khóa trống
            fetchData(keyword)  // Lấy lại tất cả dữ liệu
            setkeyword(keyword)  // Cập nhật lại từ khóa tìm kiếm
        }
    }

    // Hàm xử lý xuất Excel
    let handleOnClickExport = async () => {
        let res = await getListAllCodeService({
            type: 'BRAND',  // Lấy dữ liệu "BRAND" cho xuất
            limit: '',  // Không giới hạn số lượng
            offset: '',
            keyword: ''  // Không có từ khóa tìm kiếm
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách nhãn hàng", "ListBrand")  // Xuất dữ liệu ra file Excel
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhãn hàng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhãn hàng sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên nhãn hàng"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBrand} />  {/* Form tìm kiếm */}
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>  {/* Nút xuất Excel */}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>Mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataBrand && dataBrand.length > 0 &&
                                    dataBrand.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    <Link to={`/admin/edit-Brand/${item.id}`}>Edit</Link>  {/* Liên kết đến trang chỉnh sửa nhãn hàng */}
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleDeleteBrand(event, item.id)} >Delete</a>  {/* Liên kết xóa nhãn hàng */}
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

            {/* Phân trang */}
            <ReactPaginate
                previousLabel={'Quay lại'}
                nextLabel={'Tiếp'}
                breakLabel={'...'}
                pageCount={count}  // Số trang
                marginPagesDisplayed={3}  // Số trang hiển thị bên cạnh trang hiện tại
                containerClassName={"pagination justify-content-center"}  // Thêm lớp CSS cho phân trang
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}  // Thêm lớp CSS cho trang hiện tại
                onPageChange={handleChangePage}  // Hàm xử lý thay đổi trang
            />
        </div>
    )
}

export default ManageBrand;
