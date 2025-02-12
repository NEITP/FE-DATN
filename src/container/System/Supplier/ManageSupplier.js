import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch'; // Hook tùy chỉnh, không được sử dụng trong đoạn mã này
import { deleteSupplierService, getAllSupplier } from '../../../services/userService'; // Các hàm dịch vụ để lấy và xóa nhà cung cấp
import moment from 'moment'; // Thư viện xử lý ngày tháng (không được sử dụng trong đoạn mã này)
import { toast } from 'react-toastify'; // Thông báo thành công/ lỗi
import { PAGINATION } from '../../../utils/constant'; // Tham số phân trang
import ReactPaginate from 'react-paginate'; // Thư viện phân trang
import FormSearch from '../../../component/Search/FormSearch'; // Form tìm kiếm nhà cung cấp
import CommonUtils from '../../../utils/CommonUtils'; // Các công cụ chung, ví dụ xuất Excel
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"; // Các thành phần của React Router (cho điều hướng)

const ManageSupplier = () => {
    const [keyword, setkeyword] = useState(''); // Trạng thái để lưu từ khóa tìm kiếm
    const [dataSupplier, setdataSupplier] = useState([]); // Trạng thái để lưu danh sách nhà cung cấp
    const [count, setCount] = useState(''); // Trạng thái lưu tổng số trang
    const [numberPage, setnumberPage] = useState(''); // Trạng thái lưu số trang hiện tại

    useEffect(() => {
        // Chạy khi component được render lần đầu, lấy dữ liệu nhà cung cấp
        try {
            fetchData(keyword);
        } catch (error) {
            console.log(error); // In lỗi nếu có
        }
    }, []); // Chỉ chạy một lần khi component được mount

    let fetchData = async (keyword) => {
        // Hàm lấy danh sách nhà cung cấp từ API
        let arrData = await getAllSupplier({
            limit: PAGINATION.pagerow, // Số dòng mỗi trang
            offset: 0, // Bắt đầu từ trang đầu tiên
            keyword: keyword, // Từ khóa tìm kiếm
        });

        if (arrData && arrData.errCode === 0) {
            setdataSupplier(arrData.data); // Cập nhật danh sách nhà cung cấp
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật số trang
        }
    };

    let handleDeleteSupplier = async (event, id) => {
        // Hàm xử lý xóa nhà cung cấp
        event.preventDefault(); // Ngừng hành động mặc định của thẻ <a>
        let res = await deleteSupplierService({
            data: {
                id: id, // ID của nhà cung cấp cần xóa
            },
        });

        if (res && res.errCode === 0) {
            toast.success("Xóa nhà cung cấp thành công"); // Thông báo thành công
            // Cập nhật lại danh sách nhà cung cấp sau khi xóa
            let arrData = await getAllSupplier({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword,
            });
            if (arrData && arrData.errCode === 0) {
                setdataSupplier(arrData.data); // Cập nhật lại dữ liệu
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật lại số trang
            }
        } else toast.error("Xóa nhà cung cấp thất bại"); // Thông báo thất bại
    };

    let handleChangePage = async (number) => {
        // Hàm thay đổi trang
        setnumberPage(number.selected); // Cập nhật số trang
        // Lấy lại dữ liệu của trang hiện tại
        let arrData = await getAllSupplier({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword,
        });
        if (arrData && arrData.errCode === 0) {
            setdataSupplier(arrData.data); // Cập nhật lại danh sách nhà cung cấp
        }
    };

    let handleSearchSupplier = (keyword) => {
        // Hàm tìm kiếm nhà cung cấp
        fetchData(keyword); // Lấy dữ liệu theo từ khóa tìm kiếm
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    };

    let handleOnchangeSearch = (keyword) => {
        // Hàm xử lý thay đổi từ khóa tìm kiếm
        if (keyword === '') {
            fetchData(keyword); // Nếu từ khóa trống, lấy tất cả nhà cung cấp
            setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
        }
    };

    let handleOnClickExport = async () => {
        // Hàm xuất danh sách nhà cung cấp ra file Excel
        let res = await getAllSupplier({
            limit: '',
            offset: '',
            keyword: '',
        });
        if (res && res.errCode === 0) {
            // Sử dụng CommonUtils để xuất Excel
            await CommonUtils.exportExcel(res.data, "Danh sách nhà cung cấp", "ListSupplier");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhà cung cấp</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhà cung cấp sản phẩm
                </div>
                <div className="card-body">
                    {/* Form tìm kiếm nhà cung cấp */}
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch
                                title={"tên nhà cung cấp"}
                                handleOnchange={handleOnchangeSearch}
                                handleSearch={handleSearchSupplier}
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

                    {/* Bảng danh sách nhà cung cấp */}
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Địa chỉ</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataSupplier && dataSupplier.length > 0 &&
                                    dataSupplier.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{item.email}</td>
                                                <td>{item.address}</td>
                                                <td>
                                                    {/* Liên kết để sửa thông tin nhà cung cấp */}
                                                    <Link to={`/admin/edit-Supplier/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    {/* Xóa nhà cung cấp */}
                                                    <a href="#" onClick={(event) => handleDeleteSupplier(event, item.id)}>Delete</a>
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
    );
}

export default ManageSupplier;
