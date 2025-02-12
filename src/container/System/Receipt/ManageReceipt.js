import React from 'react'; // Import React để sử dụng các tính năng của React.
import { useEffect, useState } from 'react'; // Import useEffect và useState từ React để quản lý trạng thái và hiệu ứng phụ.
import { deleteReceiptService, getAllReceipt } from '../../../services/userService'; // Import các hàm từ service để lấy và xóa hóa đơn từ server.
import moment from 'moment'; // Import thư viện moment để xử lý và định dạng thời gian.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo cho người dùng.
import { PAGINATION } from '../../../utils/constant'; // Import các hằng số về phân trang.
import ReactPaginate from 'react-paginate'; // Import thư viện ReactPaginate để phân trang.
import CommonUtils from '../../../utils/CommonUtils'; // Import các tiện ích chung như xuất Excel.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"; // Import các thành phần của react-router-dom để quản lý điều hướng.

const ManageReceipt = () => {
    // State để lưu trữ danh sách hóa đơn
    const [dataReceipt, setdataReceipt] = useState([]);
    // State để lưu trữ tổng số trang (số trang cần phân trang)
    const [count, setCount] = useState('');
    // State để lưu trữ số trang hiện tại đang được hiển thị
    const [numberPage, setnumberPage] = useState('');

    // Hàm sử dụng useEffect để gọi dữ liệu khi component được load
    useEffect(() => {
        try {
            fetchData(); // Gọi hàm lấy dữ liệu hóa đơn từ server
        } catch (error) {
            console.log(error); // Xử lý lỗi nếu có
        }
    }, []); // useEffect chỉ chạy một lần khi component được render lần đầu tiên

    // Hàm lấy dữ liệu hóa đơn từ server
    let fetchData = async () => {
        let arrData = await getAllReceipt({
            limit: PAGINATION.pagerow, // Số lượng hóa đơn trên mỗi trang
            offset: 0, // Vị trí bắt đầu (0 là bắt đầu từ trang đầu tiên)
        });
        if (arrData && arrData.errCode === 0) { // Kiểm tra xem API có trả về dữ liệu thành công không
            setdataReceipt(arrData.data); // Cập nhật danh sách hóa đơn vào state dataReceipt
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính toán số trang và cập nhật vào state count
        }
    };

    // Hàm xử lý khi người dùng thay đổi trang (phân trang)
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật số trang đang được hiển thị
        let arrData = await getAllReceipt({
            limit: PAGINATION.pagerow, // Số lượng hóa đơn trên mỗi trang
            offset: number.selected * PAGINATION.pagerow, // Tính toán offset dựa trên trang người dùng chọn
        });
        if (arrData && arrData.errCode === 0) { // Kiểm tra xem API có trả về dữ liệu thành công không
            setdataReceipt(arrData.data); // Cập nhật lại danh sách hóa đơn vào state dataReceipt
        }
    };

    // Hàm xử lý khi người dùng nhấn nút xuất danh sách hóa đơn ra file Excel
    let handleOnClickExport = async () => {
        let res = await getAllReceipt({
            limit: '', // Không giới hạn số lượng khi xuất toàn bộ dữ liệu
            offset: '', // Không có offset
        });
        if (res && res.errCode === 0) { // Kiểm tra nếu API trả về thành công
            // Gọi hàm exportExcel từ CommonUtils để xuất dữ liệu ra file Excel
            await CommonUtils.exportExcel(res.data, "Danh sách nhập hàng", "ListReceipt");
        }
    };
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhập hàng</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhập hàng
                </div>
                <div className="card-body">

                    <div className='row'>

                        <div className='col-12'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success mb-2" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ngày nhập hàng</th>
                                    <th>Tên nhà cung cấp</th>
                                    <th>Số điện thoại</th>
                                    <th>Tên nhân viên</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataReceipt && dataReceipt.length > 0 &&
                                    dataReceipt.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{item.supplierData.name}</td>
                                                <td>{item.supplierData.phonenumber}</td>
                                                <td>{item.userData.firstName + " " + item.userData.lastName}</td>

                                                <td>
                                                    <Link to={`/admin/detail-receipt/${item.id}`}>view</Link>
                                                    &nbsp; &nbsp;

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
export default ManageReceipt;