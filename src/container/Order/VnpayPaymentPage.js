import React, { useEffect, useState } from 'react';  // Import React và các hook cần thiết
import { Link, NavLink, useHistory, useParams, useLocation } from 'react-router-dom';  // Các hook của React Router để điều hướng
import { paymentOrderVnpayService } from '../../services/userService';  // Import service để xử lý thanh toán qua VNPAY
import './OrderHomePage.scss';  // Import file CSS cho giao diện

import { toast } from 'react-toastify';  // Thư viện thông báo cho người dùng

import CommonUtils from '../../utils/CommonUtils';  // Các hàm tiện ích chung

function VnpayPaymentPage(props) {
    // Khai báo state lưu trữ các giá trị của form thanh toán
    const [inputValues, setInputValues] = useState({
        orderType: 'billpayment',  // Loại đơn hàng (mặc định là thanh toán hóa đơn)
        orderDescription: '',  // Mô tả đơn hàng
        bankCode: '',  // Mã ngân hàng (nếu có)
        language: 'vn',  // Ngôn ngữ (mặc định là Tiếng Việt)
        amount: ''  // Số tiền cần thanh toán
    });
    const location = useLocation();  // Hook để lấy thông tin location (URL, state, v.v.)

    // Hàm xử lý thay đổi giá trị nhập vào trong form
    const handleOnChange = event => {
        const { name, value } = event.target;  // Lấy tên và giá trị của input
        if (name == "amount") {  // Nếu trường 'amount' thì không xử lý
            return;
        }
        // Cập nhật giá trị của input tương ứng trong state
        setInputValues({ ...inputValues, [name]: value });
    };

    // useEffect để thực hiện khi component được render hoặc khi location thay đổi
    useEffect(() => {
        if (location && location.orderData) {
            // Nếu có dữ liệu orderData trong location (từ khi nhấn thanh toán), thiết lập số tiền
            setInputValues({ ...inputValues, ["amount"]: location.orderData.total });
        }
    }, [location]);  // Hook này sẽ chạy mỗi khi location thay đổi

    // Hàm xử lý khi người dùng nhấn vào nút thanh toán
    let handleOnclick = async () => {
        // Gọi API thanh toán VNPAY với các giá trị đã nhập trong form
        let res = await paymentOrderVnpayService({
            orderType: inputValues.orderType,  // Loại đơn hàng
            orderDescription: inputValues.orderDescription,  // Mô tả đơn hàng
            bankCode: inputValues.bankCode,  // Mã ngân hàng (nếu có)
            language: inputValues.language,  // Ngôn ngữ
            amount: inputValues.amount  // Số tiền thanh toán
        });

        if (res && res.errCode === 200) {  // Kiểm tra nếu phản hồi thành công
            console.log("orderData", location.orderData);  // Log dữ liệu orderData từ location
            localStorage.setItem("orderData", JSON.stringify(location.orderData));  // Lưu dữ liệu đơn hàng vào localStorage

            // Điều hướng đến link thanh toán từ phản hồi của API (VNPAY)
            window.location.href = res.link;
        } else {
            toast.error("Thanh toán thất bại!");  // Nếu có lỗi, thông báo lỗi cho người dùng
        }
    };
    return (

        <>

            <div className="wrap-order">
                <div className="wrap-heading-order">
                    <NavLink to="/" className="navbar-brand logo_h">
                        <img src="/resources/img/logo.png" alt="" />
                    </NavLink>
                    <span>Thanh Toán VNPAY</span>
                </div>

                <div className="wrap-order-item">
                    <section className="cart_area">
                        <div className="container">
                            <div className="cart_inner">
                                <div className="col-md-12">
                                    <div className="p-3 py-5">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="text-right">Thông tin thanh toán</h4>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-12"><label className="labels">Loại hàng hóa</label><select value={inputValues.orderType} onChange={(event) => handleOnChange(event)} name="orderType" id="inputState" className="form-control">

                                                <option value='billpayment'>Thanh toán hóa đơn</option>
                                            </select></div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-12"><label className="labels">Số tiền</label><input name="amount" disabled={true} value={inputValues.amount} onChange={(event) => handleOnChange(event)} type="text" className="form-control" /></div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-12"><label className="labels">Nội dung thanh toán</label><input value={inputValues.orderDescription} onChange={(event) => handleOnChange(event)} name="orderDescription" type="text" className="form-control" /></div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-12"><label className="labels">Ngân hàng</label><select value={inputValues.bankCode} onChange={(event) => handleOnChange(event)} name="bankCode" id="inputState" className="form-control">

                                                <option value=''>  Không chọn </option>
                                                <option value='VNPAYQR'>  Ngân hàng VNPAYQR</option>
                                                <option value='NCB'>  Ngân hàng NCB</option>
                                                <option value='SCB'>  Ngân hàng SCB</option>
                                                <option value='SACOMBANK'>  Ngân hàng SACOMBANK</option>
                                                <option value='EXIMBANK'>  Ngân hàng EXIMBANK</option>
                                                <option value='MSBANK'>  Ngân hàng MSBANK</option>
                                                <option value='NAMABANK'>  Ngân hàng NAMABANK</option>
                                                <option value='VISA'>  Ngân hàng VISA</option>
                                                <option value='VNMART'>  Ngân hàng VNMART</option>
                                                <option value='VIETINBANK'>  Ngân hàng VIETINBANK</option>
                                                <option value='VIETCOMBANK'>  Ngân hàng VIETCOMBANK</option>
                                                <option value='HDBANK'>  Ngân hàng HDBANK</option>
                                                <option value='DONGABANK'>  Ngân hàng Dong A</option>
                                                <option value='TPBANK'>  Ngân hàng Tp Bank</option>
                                                <option value='OJB'>  Ngân hàng OceanBank</option>
                                                <option value='BIDV'>  Ngân hàng BIDV</option>
                                                <option value='TECHCOMBANK'>  Ngân hàng Techcombank</option>
                                                <option value='VPBANK'>  Ngân hàng VPBank</option>
                                                <option value='AGRIBANK'>  Ngân hàng AGRIBANK</option>
                                                <option value='MBBANK'>  Ngân hàng MBBank</option>
                                                <option value='ACB'>  Ngân hàng ACB</option>
                                                <option value='OCB'>  Ngân hàng OCB</option>
                                                <option value='SHB'>  Ngân hàng SHB</option>
                                                <option value='IVB'>  Ngân hàng IVB</option>

                                            </select></div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-12"><label className="labels">Ngôn ngữ</label><select value={inputValues.language} onChange={(event) => handleOnChange(event)} name="language" id="inputState" className="form-control">

                                                <option value='vn'>Tiếng Việt</option>
                                                <option value='en'>English</option>


                                            </select></div>
                                        </div>

                                        <div className="mt-3"><button onClick={() => handleOnclick()} className="btn btn-primary profile-button" type="button">Thanh Toán</button></div>
                                    </div>
                                </div>
                            </div>



                        </div>


                    </section>
                </div>


            </div>
            <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>
        </>

    );
}

export default VnpayPaymentPage;