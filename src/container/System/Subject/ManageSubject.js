import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';

const ManageSubject = () => {
    // State để lưu trữ dữ liệu của các chủ đề
    const [dataSubject, setdataSubject] = useState([]);
    const [count, setCount] = useState(''); // Tổng số trang
    const [numberPage, setnumberPage] = useState(''); // Số trang hiện tại
    const [keyword, setkeyword] = useState(''); // Từ khóa tìm kiếm

    // useEffect để fetch dữ liệu khi component được render lần đầu tiên
    useEffect(() => {
        fetchData(keyword); // Gọi hàm fetch dữ liệu với từ khóa tìm kiếm hiện tại
    }, []);

    // Hàm fetch dữ liệu chủ đề từ API
    let fetchData = async (keyword) => {
        let arrData = await getListAllCodeService({
            type: 'SUBJECT', // Loại dữ liệu là "SUBJECT"
            limit: PAGINATION.pagerow, // Giới hạn số lượng item mỗi trang
            offset: 0, // Vị trí bắt đầu
            keyword: keyword // Từ khóa tìm kiếm
        });

        // Kiểm tra kết quả trả về từ API
        if (arrData && arrData.errCode === 0) {
            setdataSubject(arrData.data); // Lưu dữ liệu vào state
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính tổng số trang
        }
    };

    // Hàm xử lý khi click vào nút xóa một chủ đề
    let handleDeleteSubject = async (event, id) => {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        let res = await DeleteAllcodeService(id); // Gọi API xóa chủ đề
        if (res && res.errCode === 0) {
            toast.success("Xóa chủ đề thành công"); // Thông báo thành công
            // Lấy lại danh sách chủ đề sau khi xóa
            let arrData = await getListAllCodeService({
                type: 'SUBJECT',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword
            });
            if (arrData && arrData.errCode === 0) {
                setdataSubject(arrData.data); // Lưu lại dữ liệu mới
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính lại số trang
            }
        } else toast.error("Xóa chủ đề thất bại"); // Thông báo thất bại
    };

    // Hàm thay đổi trang (Pagination)
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật số trang hiện tại
        // Lấy dữ liệu cho trang mới
        let arrData = await getListAllCodeService({
            type: 'SUBJECT',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword
        });
        if (arrData && arrData.errCode === 0) {
            setdataSubject(arrData.data); // Cập nhật danh sách chủ đề
        }
    };

    // Hàm tìm kiếm chủ đề
    let handleSearchSubject = (keyword) => {
        fetchData(keyword); // Gọi lại hàm fetch dữ liệu với từ khóa mới
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    };

    // Hàm xử lý thay đổi từ khóa tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchData(keyword); // Gọi lại khi không có từ khóa
            setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
        }
    };

    // Hàm xuất dữ liệu ra Excel
    let handleOnClickExport = async () => {
        let res = await getListAllCodeService({
            type: 'SUBJECT',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách chủ đề", "ListSubject"); // Xuất Excel
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chủ đề</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chủ đề sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch
                                title={"tên chủ đề"}
                                handleOnchange={handleOnchangeSearch}
                                handleSearch={handleSearchSubject}
                            />
                        </div>
                        <div className='col-8'>
                            <button
                                style={{ float: 'right' }}
                                onClick={() => handleOnClickExport()}
                                className="btn btn-success"
                            >
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSubject && dataSubject.length > 0 &&
                                    dataSubject.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td>
                                                    <Link to={`/admin/edit-Brand/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleDeleteSubject(event, item.id)} >Delete</a>
                                                </td>
                                            </tr>
                                        );
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
                pageCount={count} // Tổng số trang
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
                onPageChange={handleChangePage} // Gọi hàm xử lý khi thay đổi trang
            />
        </div>
    );
};

export default ManageSubject;
