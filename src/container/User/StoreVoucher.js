import React, { useState, useEffect } from 'react';  // Import React và các hook cần thiết.
import VoucherItem from '../Voucher/VoucherItem';  // Import component VoucherItem để hiển thị voucher.
import logoVoucher from '../../../src/resources/img/logoVoucher.png';  // Import logo voucher, có thể dùng trong giao diện.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";  // Import các component và hooks của react-router-dom để quản lý routing.
import './StoreVoucher.scss';  // Import file CSS cho component này.
import VoucherItemSmall from './VoucherItemSmall';  // Import component VoucherItemSmall để hiển thị voucher nhỏ.
import { getAllVoucherByUserIdService } from '../../services/userService';  // Import service để lấy thông tin voucher của người dùng.
import moment, { now } from 'moment';  // Import thư viện moment để xử lý thời gian.
import { toast } from 'react-toastify';  // Import thư viện toast để thông báo cho người dùng.
import { PAGINATION } from '../../utils/constant';  // Import các hằng số liên quan đến phân trang.
import CommonUtils from '../../utils/CommonUtils';  // Import CommonUtils để xử lý các hàm tiện ích.

function StoreVoucher(props) {
    const [inputValues, setInputValues] = useState({  // State để lưu trữ thông tin nhập vào của người dùng.
        codeVoucher: '', activeBtn: false
    });
    const [dataVoucher, setdataVoucher] = useState([]);  // State lưu trữ dữ liệu các voucher.
    const [count, setCount] = useState('');  // State lưu trữ tổng số trang (dùng cho phân trang).
    const [numberPage, setnumberPage] = useState('');  // State lưu trữ số trang hiện tại.

    // Hàm so sánh ngày tháng
    function compareDates(d1, d2) {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]);  // Chuyển đổi d1 thành số (năm + tháng + ngày)
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);  // Chuyển đổi d2 thành số (năm + tháng + ngày)
        if (d1 <= d2) return true  // Nếu d1 <= d2 thì trả về true.
        if (d1 >= d2) return false  // Nếu d1 >= d2 thì trả về false.
    }

    // useEffect để gọi API lấy voucher khi component mount hoặc props.id thay đổi.
    useEffect(() => {
        let id = props.id  // Lấy id người dùng từ props.
        if (id) {  // Kiểm tra nếu có id người dùng.
            let fetchData = async () => {  // Hàm bất đồng bộ để lấy dữ liệu voucher.
                let arrData = await getAllVoucherByUserIdService({
                    limit: PAGINATION.pagerow,  // Số lượng voucher trên mỗi trang.
                    offset: 0,  // Vị trí bắt đầu (mặc định là 0).
                    id: props.id  // Truyền id người dùng.
                })
                let arrTemp = []  // Mảng tạm để lưu trữ voucher hợp lệ.

                // Kiểm tra nếu API trả về dữ liệu thành công.
                if (arrData && arrData.errCode === 0) {
                    let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY')  // Lấy ngày hiện tại theo định dạng 'DD/MM/YYYY'.

                    // Duyệt qua tất cả các voucher trả về từ API.
                    for (let i = 0; i < arrData.data.length; i++) {
                        let fromDate = moment.unix(arrData.data[i].voucherData.fromDate / 1000).format('DD/MM/YYYY')  // Lấy ngày bắt đầu voucher.
                        let toDate = moment.unix(arrData.data[i].voucherData.toDate / 1000).format('DD/MM/YYYY')  // Lấy ngày kết thúc voucher.
                        let amount = arrData.data[i].voucherData.amount  // Số lượng voucher.
                        let usedAmount = arrData.data[i].voucherData.usedAmount  // Số lượng voucher đã sử dụng.

                        // Kiểm tra xem voucher còn hiệu lực hay không (chưa hết hạn và chưa sử dụng hết).
                        if (amount !== usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true) {
                            arrTemp[i] = arrData.data[i]  // Nếu còn hiệu lực thì thêm vào mảng tạm.
                        }
                    }

                    setdataVoucher(arrTemp)  // Cập nhật dữ liệu voucher hợp lệ.
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))  // Cập nhật số trang cho phân trang.
                }
            }
            fetchData()  // Gọi hàm fetchData.
        }

    }, [props.id])  // Chạy lại khi props.id thay đổi.

    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-12 border-right border-left">
                    <div className="box-heading">
                        <div className="content-left">
                            <span>Ví voucher</span>  {/* Tiêu đề của phần ví voucher. */}
                        </div>
                    </div>

                    <div className="container-voucher">
                        {dataVoucher && dataVoucher.length > 0 &&  // Kiểm tra nếu có voucher hợp lệ.
                            dataVoucher.map((item, index) => {  // Duyệt qua tất cả voucher và render VoucherItemSmall cho từng voucher.
                                let percent = ""
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
                                    percent = item.voucherData.typeVoucherOfVoucherData.value + "%"  // Nếu voucher là giảm giá theo tỷ lệ phần trăm.
                                }
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "money") {
                                    percent = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.value)  // Nếu voucher là giảm giá theo số tiền.
                                }
                                let MaxValue = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.maxValue)  // Lấy giá trị tối đa của voucher.

                                // Render VoucherItemSmall với các thông tin voucher.
                                return (
                                    <VoucherItemSmall
                                        id={item.id}
                                        key={index}
                                        name={item.voucherData.codeVoucher}
                                        widthPercent={item.voucherData.usedAmount * 100 / item.voucherData.amount}  // Tỷ lệ đã sử dụng của voucher.
                                        maxValue={MaxValue}  // Giá trị tối đa.
                                        usedAmount={Math.round((item.voucherData.usedAmount * 100 / item.voucherData.amount) * 10) / 10}  // Số lượng đã sử dụng (theo tỷ lệ %).
                                        typeVoucher={percent}  // Kiểu voucher (tiền hoặc phần trăm).
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreVoucher;
