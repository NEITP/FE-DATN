import React from 'react'; // Import React để sử dụng các tính năng của React.
import { useEffect, useState } from 'react'; // Import useEffect và useState từ React để quản lý trạng thái và hiệu ứng phụ.
import { getStatisticProfit } from '../../../services/userService'; // Import hàm API lấy thông tin thống kê lợi nhuận từ dịch vụ userService.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo cho người dùng.
import { Link, useParams } from "react-router-dom"; // Import các thành phần của react-router-dom để quản lý điều hướng.
import DatePicker from "react-datepicker"; // Import DatePicker để cho phép người dùng chọn ngày từ giao diện.
import CommonUtils from '../../../utils/CommonUtils'; // Import các tiện ích chung, như hàm xuất Excel.
import "react-datepicker/dist/react-datepicker.css"; // Import CSS cho DatePicker.
import moment from 'moment'; // Import thư viện moment để xử lý và định dạng thời gian.

const Profit = (props) => {
    // State để lưu trữ dữ liệu đơn hàng
    const [dataOrder, setdataOrder] = useState([]);
    // State để lưu trữ dữ liệu xuất ra file Excel
    const [dataExport, setdataExport] = useState([]);
    // State để lưu trữ tổng lợi nhuận
    const [sumPrice, setsumPrice] = useState(0);
    // State để lưu trữ loại thống kê (theo ngày hoặc theo khoảng thời gian)
    const [type, settype] = useState('day');
    // State để lưu trữ khoảng thời gian người dùng chọn
    const [dateRange, setDateRange] = useState([null, null]);
    // Giải nén giá trị từ dateRange
    const [startDate, endDate] = dateRange;
    // State để lưu trữ ngày giờ hiện tại
    const [DateTime, setDateTime] = useState(new Date());

    // Hàm xử lý khi người dùng nhấn nút thống kê
    let handleOnclick = async () => {
        // Gọi API để lấy thông tin thống kê lợi nhuận
        let res = await getStatisticProfit({
            oneDate: type === 'day' ? startDate : DateTime, // Nếu thống kê theo ngày thì chỉ lấy ngày bắt đầu
            twoDate: endDate, // Nếu thống kê theo khoảng thời gian thì lấy ngày kết thúc
            type: type // Loại thống kê (theo ngày hoặc khoảng thời gian)
        });

        let sumPrice = 0; // Biến tạm để tính tổng lợi nhuận

        if (res && res.errCode === 0) { // Kiểm tra nếu API trả về thành công
            // Cập nhật dữ liệu đơn hàng vào state dataOrder
            setdataOrder(res.data);

            let arrayObject = []; // Mảng chứa các đối tượng dữ liệu được chuyển đổi để xuất ra Excel
            res.data.forEach(item => {
                arrayObject.push({
                    id: item.id, // ID đơn hàng
                    createdAt: moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss'), // Định dạng thời gian tạo đơn hàng
                    updatedAt: moment.utc(item.updatedAt).local().format('DD/MM/YYYY HH:mm:ss'), // Định dạng thời gian cập nhật đơn hàng
                    typeShip: item.typeShipData.type, // Loại hình vận chuyển
                    codeVoucher: item.voucherData.codeVoucher, // Mã voucher nếu có
                    paymentType: item.isPaymentOnlien === 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online', // Kiểu thanh toán
                    statusOrder: item.statusOrderData.value, // Trạng thái đơn hàng
                    totalpriceProduct: item.totalpriceProduct, // Tổng giá trị sản phẩm
                    importPrice: item.importPrice, // Giá nhập vào
                    profitPrice: item.profitPrice, // Lợi nhuận
                });
                sumPrice = sumPrice + item.profitPrice; // Tính tổng lợi nhuận
            });

            // Cập nhật lại dữ liệu xuất Excel và tổng lợi nhuận vào state
            setdataExport(arrayObject);
            setsumPrice(sumPrice);
        }
    }

    // Hàm xử lý khi người dùng nhấn nút xuất Excel
    let handleOnClickExport = async () => {
        // Gọi hàm exportExcel từ CommonUtils để xuất dữ liệu ra file Excel
        await CommonUtils.exportExcel(dataExport, "Thống kê lợi nhuận", "Profit");
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thống kê</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thống kê lợi nhuận
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label htmlFor="inputZip">Loại thống kê</label>
                                <select value={type} name="type" onChange={(event) => settype(event.target.value)} id="inputState" className="form-control">
                                    <option value="day">Ngày</option>
                                    <option value="month">Tháng</option>
                                    <option value="year">Năm</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            {type == "day" &&
                                <>

                                    <div className="form-group col-md-2">
                                        <DatePicker
                                            showMonthDropdown
                                            showYearDropdown
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            className="form-control"
                                            isClearable={true}
                                        />
                                    </div>


                                </>
                            }
                            {type == "month" &&
                                <>
                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputCity">Chọn tháng</label>
                                        <DatePicker
                                            selected={DateTime}
                                            onChange={(date) => setDateTime(date)}
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            className='form-control'
                                        />
                                    </div>
                                </>
                            }
                            {type == "year" &&
                                <>
                                    <div className="form-group col-md-2">
                                        <label htmlFor="inputCity">Chọn năm</label>
                                        <DatePicker
                                            selected={DateTime}
                                            onChange={(date) => setDateTime(date)}
                                            dateFormat="yyyy"
                                            showYearPicker
                                            className='form-control'
                                        />
                                    </div>
                                </>
                            }


                        </div>
                        <button type="button" onClick={() => handleOnclick()} className="btn btn-primary">Lọc</button>
                    </form>
                </div>
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
                                    <th>Ngày đặt</th>
                                    <th>Ngày cập nhật</th>
                                    <th>Loại ship</th>
                                    <th>Mã voucher</th>
                                    <th>Hình thức</th>
                                    <th>Trạng thái</th>
                                    <th>Tổng tiền</th>
                                    <th>Tiền nhập hàng</th>
                                    <th>Lợi nhuận</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataOrder && dataOrder.length > 0 &&
                                    dataOrder.map((item, index) => {

                                        return (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{moment.utc(item.updatedAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{item.typeShipData.type}</td>
                                                <td>{item.voucherData.codeVoucher}</td>
                                                <td>{item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</td>
                                                <td>{item.statusOrderData.value}</td>
                                                <td>{CommonUtils.formatter.format(item.totalpriceProduct)}</td>
                                                <td>{CommonUtils.formatter.format(item.importPrice)}</td>
                                                <td>{CommonUtils.formatter.format(item.profitPrice)}</td>
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
                    <span style={{ fontSize: '26px' }} className="text-total">Tổng lợi nhuận:  </span>
                    <span style={{ color: '#71cd14', fontSize: '26px' }} className="text-price">{CommonUtils.formatter.format(sumPrice)}</span>
                </div>
            </div>
        </div>
    )
}
export default Profit;