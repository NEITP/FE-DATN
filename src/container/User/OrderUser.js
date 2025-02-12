import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Các import từ react-router-dom để điều hướng các URL và lấy thông tin tham số URL
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams
} from "react-router-dom";
import './OrderUser.scss'; // Import file CSS cho component
import { getAllOrdersByUser, updateStatusOrderService } from '../../services/userService' // Import các hàm API từ service
import { concat } from 'lodash'; // Import lodash để nối các mảng lại với nhau
import CommonUtils from '../../utils/CommonUtils'; // Import các utils cho việc format giá trị

function OrderUser(props) {
    const { id } = useParams(); // Lấy thông tin id từ URL parameters
    const [DataOrder, setDataOrder] = useState([]); // State chứa thông tin đơn hàng
    let price = 0; // Biến tạm thời để tính tổng giá trị đơn hàng
    const [priceShip, setpriceShip] = useState(0); // State chứa giá vận chuyển của đơn hàng

    useEffect(() => {
        loadDataOrder() // Load dữ liệu đơn hàng khi component mount
    }, [])

    // Hàm loadDataOrdser để lấy danh sách đơn hàng của người dùng
    let loadDataOrder = () => {
        if (id) {
            let fetchOrder = async () => {
                let order = await getAllOrdersByUser(id); // Gọi API để lấy dữ liệu đơn hàng
                if (order && order.errCode == 0) { // Kiểm tra nếu có dữ liệu trả về và không có lỗi
                    let orderArray = []
                    for (let i = 0; i < order.data.length; i++) {
                        orderArray = concat(orderArray, order.data[i].order); // Nối các đơn hàng lại với nhau
                    }

                    setDataOrder(orderArray); // Cập nhật state với dữ liệu đơn hàng
                }
            }
            fetchOrder(); // Gọi hàm fetch dữ liệu
        }
    }

    // Hàm xử lý khi người dùng muốn hủy đơn hàng
    let handleCancelOrder = async (data) => {
        let res = await updateStatusOrderService({
            id: data.id,
            statusId: 'S7', // Cập nhật trạng thái đơn hàng thành "Đã hủy"
            dataOrder: data
        })
        if (res && res.errCode == 0) { // Kiểm tra nếu trả về thành công
            toast.success("Hủy đơn hàng thành công") // Hiển thị thông báo
            loadDataOrder(); // Tải lại danh sách đơn hàng
        }
    }

    // Hàm xử lý khi người dùng nhận đơn hàng
    let handleReceivedOrder = async (orderId) => {
        let res = await updateStatusOrderService({
            id: orderId,
            statusId: 'S6' // Cập nhật trạng thái đơn hàng thành "Đã nhận"
        })
        if (res && res.errCode == 0) { // Kiểm tra nếu trả về thành công
            toast.success("Đã nhận đơn hàng") // Hiển thị thông báo
            loadDataOrder(); // Tải lại danh sách đơn hàng
        }
    }

    // Hàm tính toán giá trị sau khi áp dụng voucher giảm giá
    let totalPriceDiscount = (price, discount) => {
        // Kiểm tra loại voucher (phần trăm hoặc tiền)
        if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
            // Tính phần trăm giảm giá và kiểm tra nếu vượt quá giá trị tối đa của voucher
            if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {
                return price - discount.typeVoucherOfVoucherData.maxValue; // Giảm giá tối đa
            } else {
                return price - ((price * discount.typeVoucherOfVoucherData.value) / 100); // Giảm giá theo phần trăm
            }
        } else {
            return price - discount.typeVoucherOfVoucherData.maxValue; // Giảm giá theo số tiền cố định
        }
    }

    return (
        <div className="container container-list-order rounded mt-5 mb-5">
            <div className="row">
                <div className="col-md-12">
                    {/* Phần tiêu đề danh sách đơn hàng */}
                    <div className="box-nav-order">
                        <a className='nav-item-order active'>
                            <span>Tất cả</span>
                        </a>
                    </div>

                    {/* Phần hiển thị danh sách đơn hàng */}
                    {DataOrder && DataOrder.length > 0 &&
                        DataOrder.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className='box-list-order'>
                                        {/* Thông tin shop và trạng thái đơn hàng */}
                                        <div className='content-top'>
                                            <div className='content-left'>
                                                <div className='label-favorite'>
                                                    Yêu thích
                                                </div>
                                                <span className='label-name-shop'>Eiser shop</span>
                                                <div className='view-shop'>
                                                    <i className="fas fa-store"></i>
                                                    <a style={{ color: 'black' }} href='/shop'>Xem shop</a>
                                                </div>
                                            </div>
                                            <div className='content-right'>
                                                {item.statusOrderData && item.statusOrderData.value} {item.isPaymentOnlien == 1 && ' | Đã thanh toán'}
                                            </div>
                                        </div>

                                        {/* Chi tiết các sản phẩm trong đơn hàng */}
                                        {item.orderDetail && item.orderDetail.length > 0 &&
                                            item.orderDetail.map((item, index) => {
                                                price += item.quantity * item.productDetail.discountPrice; // Tính giá của các sản phẩm trong đơn hàng
                                                return (
                                                    <div className='content-center'>
                                                        <div className='box-item-order'>
                                                            <img src={item.productImage[0].image}></img>
                                                            <div className='box-des'>
                                                                <span className='name'>{item.product.name}</span>
                                                                <span className='type'>Phân loại hàng: {item.productDetail.nameDetail} | {item.productDetailSize.sizeData.value}</span>
                                                                <span>x{item.quantity}</span>
                                                            </div>
                                                            <div className='box-price'>{CommonUtils.formatter.format(item.productDetail.discountPrice)}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    {/* Thông tin tổng số tiền và các hành động */}
                                    <div className='content-bottom'>
                                        <div className='up'>
                                            <svg width="16" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.94 1.664s.492 5.81-1.35 9.548c0 0-.786 1.42-1.948 2.322 0 0-1.644 1.256-4.642 2.561V0s2.892 1.813 7.94 1.664zm-15.88 0C5.107 1.813 8 0 8 0v16.095c-2.998-1.305-4.642-2.56-4.642-2.56-1.162-.903-1.947-2.323-1.947-2.323C-.432 7.474.059 1.664.059 1.664z" fill="url(#paint0_linear)"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8.073 6.905s-1.09-.414-.735-1.293c0 0 .255-.633 1.06-.348l4.84 2.55c.374-2.013.286-4.009.286-4.009-3.514.093-5.527-1.21-5.527-1.21s-2.01 1.306-5.521 1.213c0 0-.06 1.352.127 2.955l5.023 2.59s1.09.42.693 1.213c0 0-.285.572-1.09.28L2.928 8.593c.126.502.285.99.488 1.43 0 0 .456.922 1.233 1.56 0 0 1.264 1.126 3.348 1.941 2.087-.813 3.352-1.963 3.352-1.963.785-.66 1.235-1.556 1.235-1.556a6.99 6.99 0 00.252-.632L8.073 6.905z" fill="#FEFEFE"></path><defs><linearGradient id="paint0_linear" x1="8" y1="0" x2="8" y2="16.095" gradientUnits="userSpaceOnUse"><stop stop-color="#F53D2D"></stop><stop offset="1" stop-color="#F63"></stop></linearGradient></defs></svg>
                                            <span>Tổng số tiền: </span>
                                            <span className='name'>{item && item.voucherData && item.voucherData.id ? CommonUtils.formatter.format(totalPriceDiscount(price, item.voucherData) + item.typeShipData.price) : CommonUtils.formatter.format(price + (+item.typeShipData.price))}</span>
                                        </div>
                                        <div className='down'>
                                            {/* Các nút hành động như hủy đơn hoặc xác nhận nhận hàng */}
                                            {((item.statusId == 'S3') || (item.statusId == 'S4')) && item.isPaymentOnlien == 0 &&
                                                <div className='btn-buy' onClick={() => handleCancelOrder(item)}>
                                                    Hủy đơn
                                                </div>
                                            }
                                            {
                                                item.statusId == 'S5' &&
                                                <div className='btn-buy' onClick={() => handleReceivedOrder(item.id)} >
                                                    Đã nhận hàng
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default OrderUser;
