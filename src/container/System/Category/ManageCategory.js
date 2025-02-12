import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant'; // Dùng cho phân trang
import CommonUtils from '../../../utils/CommonUtils'; // Các hàm tiện ích chung
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import ReactPaginate from 'react-paginate'; // Dùng để phân trang
import FormSearch from '../../../component/Search/FormSearch'; // Component tìm kiếm

const ManageCategory = () => {

    const [dataCategory, setdataCategory] = useState([]); // Lưu dữ liệu danh mục
    const [count, setCount] = useState(''); // Tổng số trang phân trang
    const [numberPage, setnumberPage] = useState(''); // Trang hiện tại
    const [keyword, setkeyword] = useState(''); // Từ khóa tìm kiếm

    // useEffect để gọi fetchData khi component được render lần đầu
    useEffect(() => {
        fetchData(keyword); // Gọi hàm fetchData khi vừa render component
    }, [])

    // Hàm lấy dữ liệu danh mục từ server
    let fetchData = async (keyword) => {
        let arrData = await getListAllCodeService({
            type: 'CATEGORY', // Chỉ lấy danh mục
            limit: PAGINATION.pagerow, // Số lượng bản ghi mỗi trang
            offset: 0, // Bắt đầu từ bản ghi đầu tiên
            keyword: keyword // Tìm kiếm theo từ khóa
        });
        if (arrData && arrData.errCode === 0) {
            setdataCategory(arrData.data); // Lưu dữ liệu danh mục
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính tổng số trang
        }
    }

    // Hàm xóa danh mục
    let handleDeleteCategory = async (event, id) => {
        event.preventDefault();
        let res = await DeleteAllcodeService(id); // Gọi API xóa danh mục
        if (res && res.errCode === 0) {
            toast.success("Xóa danh mục thành công"); // Thông báo thành công
            // Sau khi xóa, lấy lại danh mục sau khi thay đổi
            let arrData = await getListAllCodeService({
                type: 'CATEGORY',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword
            });
            if (arrData && arrData.errCode === 0) {
                setdataCategory(arrData.data); // Cập nhật lại danh sách
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật số trang
            }
        } else {
            toast.error("Xóa danh mục thất bại"); // Thông báo lỗi
        }
    }

    // Hàm thay đổi trang phân trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại
        // Lấy lại dữ liệu khi chuyển trang
        let arrData = await getListAllCodeService({
            type: 'CATEGORY',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword
        });
        if (arrData && arrData.errCode === 0) {
            setdataCategory(arrData.data); // Cập nhật dữ liệu danh mục
        }
    }

    // Hàm xử lý tìm kiếm danh mục
    let handleSearchCategory = (keyword) => {
        fetchData(keyword); // Tìm kiếm theo từ khóa
        setkeyword(keyword); // Cập nhật giá trị từ khóa tìm kiếm
    }

    // Hàm thay đổi khi từ khóa tìm kiếm bị thay đổi
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchData(keyword); // Nếu không có từ khóa tìm kiếm, lấy lại tất cả dữ liệu
            setkeyword(keyword); // Cập nhật giá trị từ khóa
        }
    }

    // Hàm xuất danh sách danh mục ra file Excel
    let handleOnClickExport = async () => {
        let res = await getListAllCodeService({
            type: 'CATEGORY', // Lấy tất cả danh mục
            limit: '', // Không giới hạn số bản ghi
            offset: '', // Không giới hạn offset
            keyword: '' // Không có từ khóa tìm kiếm
        });
        if (res && res.errCode === 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách danh mục", "ListCategory"); // Xuất ra file Excel
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý danh mục</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách danh mục sản phẩm
                </div>
                <div className="card-body">

                    {/* Phần tìm kiếm và xuất excel */}
                    <div className='row'>
                        <div className='col-4'>
                            {/* Component tìm kiếm */}
                            <FormSearch title={"tên danh mục"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchCategory} />
                        </div>
                        <div className='col-8'>
                            {/* Nút xuất excel */}
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success">
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>

                    {/* Bảng danh mục */}
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
                                {/* Render dữ liệu danh mục */}
                                {dataCategory && dataCategory.length > 0 &&
                                    dataCategory.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    {/* Link chỉnh sửa và nút xóa */}
                                                    <Link to={`/admin/edit-category/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleDeleteCategory(event, item.id)} >Delete</a>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        {/* Phân trang */}
                        <ReactPaginate
                            previousLabel={'Quay lại'}
                            nextLabel={'Tiếp'}
                            breakLabel={'...'}
                            pageCount={count} // Số trang
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
                            onPageChange={handleChangePage} // Hàm gọi khi thay đổi trang
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ManageCategory;
