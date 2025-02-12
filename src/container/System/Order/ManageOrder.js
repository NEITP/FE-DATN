import React from 'react';
import { useEffect, useState } from 'react';
import { getAllOrder } from '../../../services/userService';  // Gọi API lấy tất cả đơn hàng
import moment from 'moment';  // Thư viện dùng để xử lý ngày tháng
import { toast } from 'react-toastify';  // Thư viện thông báo
import { PAGINATION } from '../../../utils/constant';  // Các hằng số liên quan đến phân trang
import ReactPaginate from 'react-paginate';  // Thư viện để hiển thị phân trang
import { useFetchAllcode } from '../../customize/fetch';  // Custom hook để lấy dữ liệu mã code
import CommonUtils from '../../../utils/CommonUtils';  // Các công cụ chung như export excel
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";  // Các component của React Router để điều hướng

const ManageOrder = () => {
    // Khởi tạo các state
    const [dataOrder, setdataOrder] = useState([]);  // Lưu trữ danh sách đơn hàng
    const [count, setCount] = useState('');  // Lưu trữ số lượng trang
    const [numberPage, setnumberPage] = useState('');  // Lưu trữ số trang hiện tại
    const { data: dataStatusOrder } = useFetchAllcode('STATUS-ORDER');  // Lấy dữ liệu trạng thái đơn hàng
    const [StatusId, setStatusId] = useState('ALL');  // Lưu trữ trạng thái đơn hàng, mặc định là ALL

    // useEffect để load dữ liệu khi component được mount lần đầu
    useEffect(() => {
        loadOrderData('ALL');  // Tải tất cả đơn hàng khi component được render lần đầu
    }, []);  // Mảng phụ thuộc rỗng, chỉ chạy khi component được mount

    // Hàm tải dữ liệu đơn hàng theo trạng thái
    let loadOrderData = (statusId) => {
        try {
            let fetchData = async () => {
                // Gọi API để lấy danh sách đơn hàng
                let arrData = await getAllOrder({
                    limit: PAGINATION.pagerow,  // Số lượng đơn hàng mỗi trang
                    offset: 0,  // Bắt đầu từ trang đầu tiên
                    statusId: statusId  // Trạng thái đơn hàng (mặc định là 'ALL')
                });
                if (arrData && arrData.errCode === 0) {
                    setdataOrder(arrData.data);  // Cập nhật dữ liệu đơn hàng vào state
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Tính số trang và cập nhật vào state
                }
            };
            fetchData();  // Gọi hàm fetchData để tải dữ liệu
        } catch (error) {
            console.log(error);  // In lỗi nếu có
        }
    };

    // Hàm xử lý sự kiện khi thay đổi trạng thái đơn hàng
    let handleOnchangeStatus = (event) => {
        loadOrderData(event.target.value);  // Tải lại đơn hàng với trạng thái mới
        setStatusId(event.target.value);  // Cập nhật trạng thái đơn hàng vào state
    };

    // Hàm xử lý thay đổi trang khi người dùng chọn trang mới trong phân trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected);  // Cập nhật trang hiện tại
        // Gọi lại API để tải lại danh sách đơn hàng theo trang và trạng thái hiện tại
        let arrData = await getAllOrder({
            limit: PAGINATION.pagerow,  // Số lượng đơn hàng mỗi trang
            offset: number.selected * PAGINATION.pagerow,  // Tính toán offset cho trang hiện tại
            statusId: StatusId  // Trạng thái đơn hàng
        });
        if (arrData && arrData.errCode === 0) {
            setdataOrder(arrData.data);  // Cập nhật lại danh sách đơn hàng
        }
    };

    // Hàm xuất danh sách đơn hàng ra file Excel
    let handleOnClickExport = async () => {
        let res = await getAllOrder({
            limit: '',  // Không giới hạn số lượng đơn hàng
            offset: '',  // Không có offset
            statusId: 'ALL'  // Lấy tất cả trạng thái đơn hàng
        });
        if (res && res.errCode === 0) {
            // Sử dụng công cụ CommonUtils để xuất danh sách đơn hàng ra file Excel
            await CommonUtils.exportExcel(res.data, "Danh sách đơn hàng", "ListOrder");
        }
    };
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý đơn đặt hàng</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách đơn đặt hàng
                </div>
                <select onChange={(event) => handleOnchangeStatus(event)} class="form-select col-3 ml-3 mt-3">
                    <option value={'ALL'} selected>Trạng thái đơn hàng</option>
                    {
                        dataStatusOrder && dataStatusOrder.length > 0 &&
                        dataStatusOrder.map((item, index) => {
                            return (
                                <option value={item.code}>{item.value}</option>
                            )
                        })
                    }
                </select>
                <div className="card-body">
                    <div className='row'>

                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>SDT</th>
                                    <th>Email</th>
                                    <th>Ngày đặt</th>
                                    <th>Loại ship</th>
                                    <th>Mã voucher</th>
                                    <th>Hình thức</th>
                                    <th>Trạng thái</th>
                                    <th>Shipper</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataOrder && dataOrder.length > 0 &&
                                    dataOrder.map((item, index) => {
                                        let date = moment.unix(item.orderdate / 1000).format('DD/MM/YYYY')
                                        return (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.userData.phonenumber}</td>
                                                <td>{item.userData.email}</td>
                                                <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{item.typeShipData.type}</td>
                                                <td>{item.voucherData.codeVoucher}</td>
                                                <td>{item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</td>
                                                <td>{item.statusOrderData.value}</td>
                                                <td>{item.shipperData && item.shipperData.firstName + " " + item.shipperData.lastName + " - " + item.shipperData.phonenumber}</td>
                                                <td>
                                                    <Link to={`/admin/order-detail/${item.id}`}>Xem chi tiết</Link>


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
export default ManageOrder;