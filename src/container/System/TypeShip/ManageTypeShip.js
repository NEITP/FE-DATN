import React from 'react';
import { useEffect, useState } from 'react'; // Import React hooks để quản lý state và effect
import { useFetchAllcode } from '../../customize/fetch'; // Hook tùy chỉnh (không được sử dụng trong code này, có thể xóa)
import { deleteTypeShipService, getAllTypeShip } from '../../../services/userService'; // Các service để gọi API
import moment from 'moment'; // Thư viện để xử lý thời gian (chưa dùng trong code này)
import { toast } from 'react-toastify'; // Thư viện để thông báo người dùng
import { PAGINATION } from '../../../utils/constant'; // Constants cho phân trang
import ReactPaginate from 'react-paginate'; // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils'; // Thư viện utility cho các hàm tiện ích
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"; // Các component của React Router
import FormSearch from '../../../component/Search/FormSearch'; // Component tìm kiếm

// Component quản lý loại ship
const ManageTypeShip = () => {

    const [dataTypeShip, setdataTypeShip] = useState([]); // State lưu dữ liệu các loại ship
    const [count, setCount] = useState(''); // State lưu số trang (để phân trang)
    const [numberPage, setnumberPage] = useState(''); // State lưu trang hiện tại
    const [keyword, setkeyword] = useState(''); // State lưu từ khóa tìm kiếm

    // useEffect hook để load dữ liệu khi component được mount
    useEffect(() => {
        fetchData(keyword); // Gọi hàm fetchData để lấy dữ liệu lần đầu
    }, [])

    // Hàm fetch dữ liệu loại ship từ server với từ khóa tìm kiếm
    let fetchData = async (keyword) => {
        let arrData = await getAllTypeShip({
            limit: PAGINATION.pagerow, // Giới hạn số bản ghi trên mỗi trang
            offset: 0, // Bắt đầu từ bản ghi đầu tiên
            keyword: keyword // Từ khóa tìm kiếm
        })
        if (arrData && arrData.errCode === 0) { // Kiểm tra kết quả trả về từ API
            setdataTypeShip(arrData.data); // Cập nhật state với dữ liệu loại ship
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật số trang
        }
    }

    // Hàm xóa loại ship khi nhấn vào nút delete
    let handleDeleteTypeShip = async (id) => {
        let res = await deleteTypeShipService({
            data: { id: id } // Truyền ID loại ship cần xóa
        })
        if (res && res.errCode === 0) { // Kiểm tra kết quả trả về từ API
            toast.success("Xóa loại ship thành công"); // Thông báo thành công
            let arrData = await getAllTypeShip({
                limit: PAGINATION.pagerow, // Giới hạn bản ghi
                offset: numberPage * PAGINATION.pagerow, // Tính toán vị trí bản ghi bắt đầu
                keyword: keyword // Từ khóa tìm kiếm
            })
            if (arrData && arrData.errCode === 0) {
                setdataTypeShip(arrData.data); // Cập nhật lại danh sách sau khi xóa
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật lại số trang
            }
        } else {
            toast.error("Xóa loại ship thất bại"); // Thông báo thất bại nếu có lỗi
        }
    }

    // Hàm xử lý khi thay đổi trang (phân trang)
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại
        let arrData = await getAllTypeShip({
            limit: PAGINATION.pagerow, // Giới hạn bản ghi
            offset: number.selected * PAGINATION.pagerow, // Tính toán vị trí bản ghi bắt đầu
            keyword: keyword // Từ khóa tìm kiếm
        })
        if (arrData && arrData.errCode === 0) {
            setdataTypeShip(arrData.data); // Cập nhật lại danh sách loại ship theo trang
        }
    }

    // Hàm tìm kiếm loại ship
    let handleSearchTypeShip = (keyword) => {
        fetchData(keyword); // Gọi hàm fetchData với từ khóa tìm kiếm
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    }

    // Hàm thay đổi từ khóa tìm kiếm khi người dùng nhập vào ô tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchData(keyword); // Lọc lại dữ liệu nếu ô tìm kiếm rỗng
            setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
        }
    }

    // Hàm xuất dữ liệu ra file Excel
    let handleOnClickExport = async () => {
        let res = await getAllTypeShip({
            limit: '', // Không giới hạn bản ghi
            offset: '', // Không giới hạn offset
            keyword: '' // Không có từ khóa tìm kiếm
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách loại ship", "ListTypeShip"); // Xuất ra file Excel
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại ship</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách loại ship
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            {/* Component tìm kiếm */}
                            <FormSearch title={"tên loại ship"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchTypeShip} />
                        </div>
                        <div className='col-8'>
                            {/* Nút xuất dữ liệu ra Excel */}
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>

                    {/* Bảng hiển thị danh sách loại ship */}
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên loại ship</th>
                                    <th>Giá tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Lặp qua danh sách loại ship và hiển thị */}
                                {dataTypeShip && dataTypeShip.length > 0 &&
                                    dataTypeShip.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.type}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>
                                                <td>
                                                    {/* Liên kết tới trang chỉnh sửa loại ship */}
                                                    <Link to={`/admin/edit-typeship/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    {/* Xử lý xóa loại ship */}
                                                    <span onClick={() => handleDeleteTypeShip(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Delete</span>
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
    )
}

export default ManageTypeShip;
