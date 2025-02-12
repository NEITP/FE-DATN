import React from 'react';
import { useEffect, useState } from 'react';
import { deleteVoucherService, getAllVoucher } from '../../../services/userService'; // Các API dịch vụ liên quan đến voucher
import moment from 'moment'; // Thư viện xử lý thời gian
import { toast } from 'react-toastify'; // Thông báo thành công/thất bại
import { PAGINATION } from '../../../utils/constant'; // Định nghĩa số dòng mỗi trang cho phân trang
import ReactPaginate from 'react-paginate'; // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils'; // Các hàm tiện ích chung như xuất file Excel
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"; // Điều hướng giữa các trang

const ManageVoucher = () => {
    // Khai báo các state để lưu trữ thông tin về danh sách voucher và phân trang
    const [dataVoucher, setdataVoucher] = useState([]); // Dữ liệu voucher
    const [count, setCount] = useState(''); // Số trang
    const [numberPage, setnumberPage] = useState(''); // Trang hiện tại

    // useEffect để gọi API lấy danh sách voucher khi component được render
    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getAllVoucher({
                    limit: PAGINATION.pagerow, // Giới hạn số dòng mỗi trang
                    offset: 0 // Bắt đầu từ trang 0
                });
                if (arrData && arrData.errCode === 0) {
                    setdataVoucher(arrData.data); // Lưu dữ liệu voucher vào state
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính tổng số trang dựa trên tổng số voucher
                }
            }
            fetchData(); // Gọi hàm fetchData khi component mount
        } catch (error) {
            console.log(error); // Xử lý lỗi khi gọi API
        }
    }, []);

    // Hàm xóa voucher khi người dùng nhấn nút "Delete"
    let handleDeleteVoucher = async (id) => {
        let res = await deleteVoucherService({
            data: { id: id }
        });
        if (res && res.errCode === 0) {
            toast.success("Xóa mã voucher thành công"); // Thông báo thành công
            // Sau khi xóa, gọi lại API để cập nhật danh sách voucher
            let arrData = await getAllVoucher({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow
            });
            if (arrData && arrData.errCode === 0) {
                setdataVoucher(arrData.data); // Cập nhật lại danh sách voucher
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật số trang
            }
        } else toast.error("Xóa mã voucher thất bại"); // Thông báo thất bại
    }

    // Hàm thay đổi trang khi người dùng chuyển trang trong phân trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Lưu trang mới được chọn
        let arrData = await getAllVoucher({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow // Tính toán offset cho trang mới
        });
        if (arrData && arrData.errCode === 0) {
            setdataVoucher(arrData.data); // Cập nhật lại danh sách voucher
        }
    }

    // Hàm xuất danh sách voucher ra file Excel
    let handleOnClickExport = async () => {
        let res = await getAllVoucher({
            limit: '', // Không giới hạn số dòng
            offset: '', // Không giới hạn offset
        });
        if (res && res.errCode === 0) {
            // Chuyển đổi thời gian từ Unix timestamp sang định dạng ngày tháng
            res.data.forEach(item => {
                item.fromDate = moment.unix(item.fromDate / 1000).format('DD/MM/YYYY');
                item.toDate = moment.unix(item.toDate / 1000).format('DD/MM/YYYY');
            });
            // Gọi hàm xuất Excel từ CommonUtils
            await CommonUtils.exportExcel(res.data, "Danh sách voucher", "ListVoucher");
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý mã voucher</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách mã voucher
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success">
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã voucher</th>
                                    <th>Loại voucher</th>
                                    <th>Số lượng</th>
                                    <th>Đã sử dụng</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Ngày kết thúc</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataVoucher && dataVoucher.length > 0 &&
                                    dataVoucher.map((item, index) => {
                                        let name = `${item.typeVoucherOfVoucherData.value} ${item.typeVoucherOfVoucherData.typeVoucherData.value}`; // Kết hợp tên loại voucher
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.codeVoucher}</td>
                                                <td>{name}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.usedAmount}</td>
                                                <td>{moment.unix(item.fromDate / 1000).format('DD/MM/YYYY')}</td>
                                                <td>{moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}</td>
                                                <td>
                                                    <Link to={`/admin/edit-voucher/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <span onClick={() => handleDeleteVoucher(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Delete</span>
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
                onPageChange={handleChangePage} // Hàm gọi khi thay đổi trang
            />
        </div>
    );
}

export default ManageVoucher;
