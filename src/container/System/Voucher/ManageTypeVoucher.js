import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../customize/fetch';  // Lấy custom hook fetch (không sử dụng trong code, có thể bỏ nếu không cần)
import { deleteTypeVoucherService, getAllTypeVoucher } from '../../../services/userService';  // Lấy các service API cho loại voucher
import moment from 'moment';  // Thư viện xử lý thời gian (không sử dụng trong code, có thể bỏ nếu không cần)
import { toast } from 'react-toastify';  // Thư viện hiển thị thông báo
import { PAGINATION } from '../../../utils/constant';  // Constant cho pagination
import ReactPaginate from 'react-paginate';  // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils';  // Các utils chung như export excel
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";  // Các thành phần của React Router

const ManageTypeShip = () => {

    // Khai báo state cho danh sách loại voucher, số lượng trang, số trang hiện tại
    const [dataTypeVoucher, setdataTypeVoucher] = useState([]);
    const [count, setCount] = useState('');  // Số trang
    const [numberPage, setnumberPage] = useState('');  // Trang hiện tại

    // useEffect để fetch dữ liệu khi component render lần đầu
    useEffect(() => {
        try {
            // Hàm lấy dữ liệu loại voucher
            let fetchData = async () => {
                let arrData = await getAllTypeVoucher({
                    limit: PAGINATION.pagerow,  // Số dòng mỗi trang
                    offset: 0  // Dữ liệu bắt đầu từ trang 0
                });

                // Nếu lấy được dữ liệu, cập nhật state
                if (arrData && arrData.errCode === 0) {
                    setdataTypeVoucher(arrData.data);
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Tính số trang
                }
            }
            fetchData();
        } catch (error) {
            console.log(error);  // Xử lý lỗi nếu có
        }
    }, []);

    // Hàm xóa loại voucher khi nhấn Delete
    let handleDeleteTypeVoucher = async (id) => {
        // Gửi yêu cầu xóa loại voucher
        let res = await deleteTypeVoucherService({
            data: { id: id }  // Truyền id cần xóa
        });

        // Nếu xóa thành công, reload dữ liệu
        if (res && res.errCode === 0) {
            toast.success("Xóa loại voucher thành công");  // Thông báo thành công
            let arrData = await getAllTypeVoucher({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow  // Lấy dữ liệu cho trang hiện tại
            });

            // Nếu lấy lại dữ liệu thành công, cập nhật lại danh sách voucher và số trang
            if (arrData && arrData.errCode === 0) {
                setdataTypeVoucher(arrData.data);
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Cập nhật số trang
            }

        } else {
            toast.error("Xóa loại voucher thất bại");  // Thông báo lỗi
        }
    };

    // Hàm thay đổi trang khi người dùng chuyển trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected);  // Cập nhật trang hiện tại
        // Lấy dữ liệu của trang mới
        let arrData = await getAllTypeVoucher({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow  // Dữ liệu của trang mới
        });

        // Nếu lấy được dữ liệu, cập nhật lại danh sách
        if (arrData && arrData.errCode === 0) {
            setdataTypeVoucher(arrData.data);
        }
    };

    // Hàm xuất danh sách loại voucher ra file Excel
    let handleOnClickExport = async () => {
        // Lấy tất cả dữ liệu loại voucher (không phân trang)
        let res = await getAllTypeVoucher({
            limit: '',
            offset: '',
        });

        // Nếu lấy được dữ liệu, xuất ra file Excel
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách loại voucher", "ListTypeVoucher");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại voucher</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách loại voucher
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-12 mb-2'>
                            {/* Nút xuất file Excel */}
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Loại voucher</th>
                                    <th>Giá trị</th>
                                    <th>Giá trị tối thiểu</th>
                                    <th>Giá trị tối đa</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                    dataTypeVoucher.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.typeVoucherData.value}</td>
                                                {/* Hiển thị giá trị voucher, nếu là phần trăm thì thêm % */}
                                                <td>{item.typeVoucher === "percent" ? item.value + "%" : CommonUtils.formatter.format(item.value)}</td>
                                                <td>{CommonUtils.formatter.format(item.minValue)}</td>
                                                <td>{CommonUtils.formatter.format(item.maxValue)}</td>
                                                <td>
                                                    {/* Link để chỉnh sửa loại voucher */}
                                                    <Link to={`/admin/edit-typevoucher/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    {/* Nút xóa loại voucher */}
                                                    <span onClick={() => handleDeleteTypeVoucher(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Delete</span>
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
                pageCount={count}  // Tổng số trang
                marginPagesDisplayed={3}  // Số trang hiển thị gần đầu và cuối
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakLinkClassName={"page-link"}
                breakClassName={"page-item"}
                activeClassName={"active"}
                onPageChange={handleChangePage}  // Hàm thay đổi trang
            />
        </div>
    )
}

export default ManageTypeShip;
