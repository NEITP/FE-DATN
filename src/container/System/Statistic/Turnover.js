import React from 'react'; // Import thư viện React để sử dụng các chức năng của React.
import { useEffect, useState } from 'react'; // Import useEffect và useState từ React để quản lý trạng thái và các hiệu ứng bên ngoài.
import { getStatisticOverturn } from '../../../services/userService'; // Import hàm để lấy thống kê doanh thu từ dịch vụ API.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo cho người dùng.
import { Link, useParams } from "react-router-dom"; // Import Link và useParams từ react-router-dom để quản lý các liên kết và tham số URL.
import DatePicker from "react-datepicker"; // Import thư viện DatePicker để chọn ngày tháng.
import CommonUtils from '../../../utils/CommonUtils'; // Import các tiện ích chung, như hàm xuất Excel.
import "react-datepicker/dist/react-datepicker.css"; // Import style cho DatePicker.
import moment from 'moment'; // Import thư viện moment để thao tác với thời gian.

const Turnover = (props) => {
    const [dataOrder, setdataOrder] = useState([]); // Khai báo state để lưu trữ dữ liệu đơn hàng.
    const [dataExport, setdataExport] = useState([]); // Khai báo state để lưu trữ dữ liệu xuất khẩu.
    const [totalPrice, settotalPrice] = useState(0); // Khai báo state để lưu tổng giá trị doanh thu.
    const [type, settype] = useState('day'); // Khai báo state để lưu loại thời gian (theo ngày, tháng, hay năm).
    const [dateRange, setDateRange] = useState([null, null]); // Khai báo state để lưu khoảng thời gian chọn.
    const [startDate, endDate] = dateRange; // Destructure startDate và endDate từ dateRange.
    const [DateTime, setDateTime] = useState(new Date()); // Khai báo state để lưu thời gian hiện tại.

    // Hàm xử lý khi người dùng nhấn để lấy thống kê doanh thu.
    let handleOnclick = async () => {
        // Gọi API để lấy thống kê doanh thu dựa trên loại thời gian và khoảng thời gian đã chọn.
        let res = await getStatisticOverturn({
            oneDate: type == 'day' ? startDate : DateTime, // Kiểm tra nếu là 'day' thì lấy startDate, nếu không lấy DateTime.
            twoDate: endDate, // Nếu có khoảng thời gian, lấy endDate.
            type: type // Truyền loại thời gian (day, month, year).
        });
        if (res && res.errCode == 0) { // Kiểm tra nếu API trả về thành công.
            let total = 0;
            for (let i = 0; i < res.data.length; i++) { // Duyệt qua tất cả các đơn hàng để tính tổng doanh thu.
                total = total + res.data[i].totalpriceProduct; // Cộng dồn doanh thu từ mỗi đơn hàng.
            }
            settotalPrice(total); // Cập nhật tổng doanh thu vào state totalPrice.
            setdataOrder(res.data); // Cập nhật danh sách đơn hàng vào state dataOrder.
            let arrayObject = []; // Khởi tạo một mảng mới để lưu trữ dữ liệu theo định dạng xuất khẩu.
            res.data.forEach(item => { // Duyệt qua tất cả các đơn hàng và chuẩn hóa dữ liệu để xuất khẩu.
                arrayObject.push({
                    id: item.id, // ID đơn hàng.
                    createdAt: moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss'), // Định dạng thời gian tạo đơn hàng.
                    updatedAt: moment.utc(item.updatedAt).local().format('DD/MM/YYYY HH:mm:ss'), // Định dạng thời gian cập nhật đơn hàng.
                    typeShip: item.typeShipData.type, // Loại hình vận chuyển.
                    codeVoucher: item.voucherData.codeVoucher, // Mã voucher nếu có.
                    paymentType: item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online', // Loại hình thanh toán.
                    statusOrder: item.statusOrderData.value, // Trạng thái đơn hàng.
                    totalpriceProduct: item.totalpriceProduct, // Tổng giá trị sản phẩm trong đơn hàng.
                });
            });
            setdataExport(arrayObject); // Cập nhật dữ liệu xuất khẩu vào state dataExport.
        }
    };

    // Hàm xử lý khi người dùng nhấn xuất file Excel.
    let handleOnClickExport = async () => {
        await CommonUtils.exportExcel(dataExport, "Thống kê doanh thu", "TurnOver"); // Gọi hàm exportExcel từ CommonUtils để xuất dữ liệu ra file Excel.
    };
    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thống kê</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thống kê doanh thu
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
                    <span style={{ fontSize: '26px' }} className="text-total">Tổng doanh thu:  </span>
                    <span style={{ color: '#71cd14', fontSize: '26px' }} className="text-price">{CommonUtils.formatter.format(totalPrice)}</span>
                </div>
            </div>
        </div>
    )
}
export default Turnover;