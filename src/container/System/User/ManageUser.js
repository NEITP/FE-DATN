import React, { useEffect, useState } from 'react';
import { getAllUsers, DeleteUserService } from '../../../services/userService'; // Các hàm từ service để lấy và xóa người dùng
import moment from 'moment';
import { toast } from 'react-toastify'; // Thư viện để hiển thị thông báo
import { PAGINATION } from '../../../utils/constant'; // Định nghĩa giá trị phân trang
import ReactPaginate from 'react-paginate'; // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils'; // Các tiện ích chung như xuất excel
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch'; // Form tìm kiếm người dùng

const ManageUser = () => {

    const [dataUser, setdataUser] = useState([]); // Dữ liệu người dùng
    const [count, setCount] = useState(''); // Số lượng trang phân trang
    const [numberPage, setnumberPage] = useState(''); // Trang hiện tại
    const [keyword, setkeyword] = useState(''); // Từ khóa tìm kiếm

    // useEffect sẽ chạy mỗi khi component được mount, lấy danh sách người dùng
    useEffect(() => {
        fetchAllUser(keyword); // Lấy dữ liệu người dùng ngay khi component load
    }, []);

    // Hàm lấy tất cả người dùng từ API
    let fetchAllUser = async (keyword) => {
        let res = await getAllUsers({
            limit: PAGINATION.pagerow, // Giới hạn số lượng người dùng trên mỗi trang
            offset: 0, // Bắt đầu từ trang đầu tiên
            keyword: keyword // Từ khóa tìm kiếm
        });

        if (res && res.errCode === 0) {
            // Nếu thành công, cập nhật state với dữ liệu người dùng và tổng số trang
            setdataUser(res.data);
            setCount(Math.ceil(res.count / PAGINATION.pagerow)); // Tính tổng số trang
        }
    };

    // Hàm xử lý khi bấm "Xóa người dùng"
    let handleBanUser = async (event, id) => {
        event.preventDefault(); // Ngừng hành động mặc định

        let res = await DeleteUserService(id); // Gọi API xóa người dùng
        if (res && res.errCode === 0) {
            toast.success("Xóa người dùng thành công"); // Hiển thị thông báo thành công
            // Cập nhật lại danh sách người dùng sau khi xóa
            let user = await getAllUsers({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow, // Lấy người dùng từ trang hiện tại
                keyword: keyword
            });

            if (user && user.errCode === 0) {
                setdataUser(user.data); // Cập nhật lại dữ liệu người dùng
                setCount(Math.ceil(user.count / PAGINATION.pagerow)); // Tính lại số trang
            }
        } else {
            toast.error("Xóa người dùng thất bại"); // Hiển thị thông báo lỗi
        }
    };

    // Hàm xử lý khi người dùng thay đổi trang phân trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại
        // Lấy dữ liệu người dùng của trang mới
        let arrData = await getAllUsers({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword
        });

        if (arrData && arrData.errCode === 0) {
            setdataUser(arrData.data); // Cập nhật lại dữ liệu người dùng
        }
    };

    // Hàm tìm kiếm người dùng theo từ khóa
    let handleSearchUser = (keyword) => {
        fetchAllUser(keyword); // Lấy lại dữ liệu người dùng sau khi tìm kiếm
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    };

    // Hàm xử lý thay đổi từ khóa trong form tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchAllUser(keyword); // Lấy lại tất cả người dùng nếu không có từ khóa
            setkeyword(keyword);
        }
    };

    // Hàm xuất dữ liệu người dùng ra file excel
    let handleOnClickExport = async () => {
        let res = await getAllUsers({
            limit: '', // Không giới hạn số lượng
            offset: '',
            keyword: ''
        });
        if (res && res.errCode === 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách người dùng", "ListUser"); // Xuất ra file excel
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý người dùng</h1>

            {/* Card chứa danh sách người dùng */}
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách người dùng
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"số điện thoại"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchUser} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success">
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>

                    {/* Bảng danh sách người dùng */}
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Email</th>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Quyền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataUser && dataUser.length > 0 &&
                                    dataUser.map((item, index) => {
                                        let date = moment.unix(item.dob / 1000).format('DD/MM/YYYY'); // Định dạng ngày sinh
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.email}</td>
                                                <td>{`${item.firstName} ${item.lastName}`}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{date}</td>
                                                <td>{item.genderData.value}</td>
                                                <td>{item.roleData.value}</td>
                                                <td>
                                                    <Link to={`/admin/edit-user/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <a href="#" onClick={(event) => handleBanUser(event, item.id)} >Delete</a>
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
};

export default ManageUser;
