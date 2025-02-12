import React, { useEffect, useState } from 'react';  // Nhập các hook và thư viện cần thiết
import { Link, NavLink, useHistory, useParams } from 'react-router-dom';  // Thư viện React Router để điều hướng
import { useSelector, useDispatch } from 'react-redux';  // Thư viện Redux để quản lý trạng thái toàn cục
import { getDetailOrder, updateStatusOrderService } from '../../../services/userService';  // Các API để lấy chi tiết đơn hàng và cập nhật trạng thái đơn hàng
import './../../Order/OrderHomePage.scss';  // Import file CSS để tạo kiểu cho trang
import { toast } from 'react-toastify';  // Thư viện thông báo
import storeVoucherLogo from '../../../../src/resources/img/storeVoucher.png';  // Hình ảnh voucher cửa hàng
import ShopCartItem from '../../../component/ShopCart/ShopCartItem';  // Component hiển thị các sản phẩm trong giỏ hàng
import CommonUtils from '../../../utils/CommonUtils';  // Các công cụ chung như xử lý hình ảnh
import Lightbox from 'react-image-lightbox';  // Thư viện hiển thị ảnh dạng lightbox (ảnh lớn khi người dùng click)
import 'react-image-lightbox/style.css';  // Import kiểu cho lightbox

function DetailOrder(props) {
    const { id } = useParams();  // Lấy id từ URL sử dụng hook useParams
    const [DataOrder, setDataOrder] = useState({});  // Lưu trữ dữ liệu đơn hàng
    const [imgPreview, setimgPreview] = useState('');  // Lưu trữ URL ảnh xem trước
    const [isOpen, setisOpen] = useState(false);  // Trạng thái mở/đóng lightbox
    let price = 0;  // Khởi tạo biến giá của đơn hàng (được tính toán sau)
    const [priceShip, setpriceShip] = useState(0);  // Lưu trữ giá phí ship

    useEffect(() => {
        loadDataOrder();  // Gọi hàm tải chi tiết đơn hàng khi component được mount
    }, []);  // Mảng phụ thuộc rỗng, chỉ chạy khi component được render lần đầu

    // Hàm mở lightbox xem ảnh lớn khi người dùng click vào ảnh
    let openPreviewImage = (url) => {
        setimgPreview(url);  // Cập nhật URL ảnh xem trước
        setisOpen(true);  // Mở lightbox
    };

    // Hàm tải dữ liệu đơn hàng từ API
    let loadDataOrder = () => {
        if (id) {
            let fetchOrder = async () => {
                let order = await getDetailOrder(id);  // Gọi API để lấy chi tiết đơn hàng
                if (order && order.errCode == 0) {
                    setDataOrder(order.data);  // Cập nhật dữ liệu đơn hàng vào state
                    setpriceShip(order.data.typeShipData.price);  // Cập nhật phí ship
                }
            };
            fetchOrder();  // Gọi hàm fetchOrder để lấy dữ liệu đơn hàng
        }
    };

    // Hàm tính toán giá trị giảm giá sau khi áp dụng voucher
    let totalPriceDiscount = (price, discount) => {
        try {
            if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
                // Nếu voucher giảm giá theo phần trăm
                if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {
                    // Nếu giá trị giảm giá theo phần trăm vượt quá giá trị tối đa của voucher
                    return price - discount.typeVoucherOfVoucherData.maxValue;  // Giảm giá theo mức tối đa
                } else {
                    return price - ((price * discount.typeVoucherOfVoucherData.value) / 100);  // Giảm giá theo phần trăm
                }
            } else {
                // Nếu voucher giảm giá theo giá trị cố định
                return price - discount.typeVoucherOfVoucherData.maxValue;  // Giảm giá theo giá trị cố định
            }
        } catch (error) {
            // Nếu có lỗi trong quá trình tính toán, không làm gì cả
        }
    };

    // Hàm xử lý khi người dùng xác nhận đơn hàng
    let handleAcceptOrder = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,  // ID của đơn hàng
            statusId: 'S4'  // Cập nhật trạng thái đơn hàng thành "S4" (đã xác nhận)
        });
        if (res && res.errCode == 0) {
            toast.success("Xác nhận đơn hàng thành công");  // Thông báo thành công
            loadDataOrder();  // Tải lại dữ liệu đơn hàng
        }
    };

    // Hàm xử lý khi người dùng xác nhận gửi hàng
    let handleSendProduct = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,  // ID của đơn hàng
            statusId: 'S5'  // Cập nhật trạng thái đơn hàng thành "S5" (đã gửi hàng)
        });
        if (res && res.errCode == 0) {
            toast.success("Xác nhận gửi hàng thành công");  // Thông báo thành công
            loadDataOrder();  // Tải lại dữ liệu đơn hàng
        }
    };

    // Hàm xử lý khi giao hàng thành công
    let handleSuccessShip = async () => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,  // ID của đơn hàng
            statusId: 'S6'  // Cập nhật trạng thái đơn hàng thành "S6" (đã giao hàng)
        });
        if (res && res.errCode == 0) {
            toast.success("Đã giao hàng thành công");  // Thông báo thành công
            loadDataOrder();  // Tải lại dữ liệu đơn hàng
        }
    };

    // Hàm xử lý khi người dùng hủy đơn hàng
    let handleCancelOrder = async (data) => {
        let res = await updateStatusOrderService({
            id: DataOrder.id,  // ID của đơn hàng
            statusId: 'S7',  // Cập nhật trạng thái đơn hàng thành "S7" (đã hủy)
            dataOrder: data  // Dữ liệu đơn hàng
        });
        if (res && res.errCode == 0) {
            toast.success("Hủy đơn hàng thành công");  // Thông báo thành công
            loadDataOrder();  // Tải lại dữ liệu đơn hàng
        }
    };

    return (


        <>


            <div className="wrap-order">
                <div className="wrap-heading-order">
                    <NavLink to="/" className="navbar-brand logo_h">
                        <img src="/resources/img/logo.png" alt="" />
                    </NavLink>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="wrap-address-order">
                    <div className="border-top-address-order"></div>
                    <div className="wrap-content-address">
                        <div className="content-up">
                            <div className="content-left">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Địa Chỉ Nhận Hàng</span>
                            </div>


                        </div>
                        <div className="content-down">
                            {DataOrder && DataOrder.addressUser &&
                                <>
                                    <div className="content-left">

                                        <span>{DataOrder.addressUser.shipName} ({DataOrder.addressUser.shipPhonenumber})</span>


                                    </div>
                                    <div className="content-center">
                                        <span>

                                            {DataOrder.addressUser.shipAdress}
                                        </span>
                                    </div>
                                </>
                            }
                        </div>


                    </div>
                </div>
                <div className="wrap-order-item">
                    <section className="cart_area">
                        <div className="container">
                            <div className="cart_inner">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>

                                                <th scope="col">Sản phẩm</th>
                                                <th scope="col">Giá</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Số lượng</th>
                                                <th style={{ textAlign: 'center' }} scope="col">Tổng tiền</th>

                                            </tr>
                                        </thead>
                                        <tbody>


                                            {DataOrder.orderDetail && DataOrder.orderDetail.length > 0 &&
                                                DataOrder.orderDetail.map((item, index) => {
                                                    price += item.quantity * item.productDetail.discountPrice

                                                    let name = `${item.product.name} - ${item.productDetail.nameDetail} - ${item.productDetailSize.sizeData.value}`
                                                    return (
                                                        <ShopCartItem isOrder={true} id={item.id} productdetailsizeId={item.productDetailSize.id} key={index} name={name} price={item.productDetail.discountPrice} quantity={item.quantity} image={item.productImage[0].image} />
                                                    )
                                                })

                                            }


                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div className="box-shipping">


                                <h6>
                                    Đơn vị vận chuyển
                                </h6>
                                <div>
                                    {
                                        DataOrder && DataOrder.typeShipData &&
                                        <label className="form-check-label">{DataOrder.typeShipData.type} - {CommonUtils.formatter.format(DataOrder.typeShipData.price)} </label>
                                    }

                                </div>
                            </div>
                            <div className="box-shopcart-bottom">
                                <div className="content-left">
                                    <div className="wrap-voucher">
                                        <img width="20px" height="20px" style={{ marginLeft: "-3px" }} src={storeVoucherLogo}></img>
                                        <span className="name-easier">Easier voucher</span>


                                        <span className="choose-voucher">Mã voucher: {DataOrder && DataOrder.voucherData && DataOrder.voucherData.codeVoucher}</span>


                                    </div>
                                    <div className="wrap-note">
                                        <span>Lời Nhắn:</span>
                                        <input value={DataOrder.note} type="text" placeholder="Lưu ý cho Người bán..." />
                                    </div>
                                </div>


                                <div className="content-right">
                                    <div className="wrap-price">
                                        <span className="text-total">Tổng thanh toán {DataOrder && DataOrder.orderDetail && DataOrder.orderDetail.length} sản phẩm: </span>
                                        <span className="text-price">{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(totalPriceDiscount(price, DataOrder.voucherData) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}</span>
                                    </div>


                                </div>



                            </div>

                        </div>


                    </section>
                </div>
                <div className="wrap-payment">
                    <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                        <span>Phương Thức Thanh Toán</span>
                        <div className='box-type-payment active'>{DataOrder.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán onlien'}</div>

                    </div>
                    <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                        <span>Trạng Thái Đơn Hàng</span>
                        <div className='box-type-payment active'>{DataOrder.statusOrderData && DataOrder.statusOrderData.value}</div>

                    </div>
                    <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                        <span>Hình ảnh giao hàng</span>
                        <div onClick={() => openPreviewImage(DataOrder.image)} className="box-img-preview" style={{ backgroundImage: `url(${DataOrder.image})`, width: '200px', height: '200px', borderRadius: "10px" }}></div>

                    </div>
                    <div className="content-bottom">
                        {DataOrder && DataOrder.addressUser &&
                            <div className="wrap-bottom">
                                <div className="box-flex">
                                    <div className="head">Tên khách hàng</div>
                                    <div >{DataOrder.addressUser.shipName}</div>
                                </div>
                                <div className="box-flex">
                                    <div className="head">Số điện thoại</div>
                                    <div >{DataOrder.addressUser.shipPhonenumber}</div>
                                </div>
                                <div className="box-flex">
                                    <div className="head">Địa chỉ email</div>
                                    <div >{DataOrder.addressUser.shipEmail}</div>
                                </div>




                            </div>
                        }

                        <div className="wrap-bottom">
                            <div className="box-flex">
                                <div className="head">Tổng tiền hàng</div>
                                <div >{CommonUtils.formatter.format(price)}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Tổng giảm giá</div>
                                <div >{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(price - totalPriceDiscount(price, DataOrder.voucherData)) : CommonUtils.formatter.format(0)}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Phí vận chuyển</div>
                                <div >{CommonUtils.formatter.format(priceShip)}</div>
                            </div>

                            <div className="box-flex">
                                <div className="head">Tổng thanh toán:</div>
                                <div className="money">{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(totalPriceDiscount(price, DataOrder.voucherData) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}</div>
                            </div>
                            <div className="box-flex">
                                {DataOrder && DataOrder.statusId == 'S3' &&

                                    <a onClick={() => handleAcceptOrder()} className="main_btn">Xác nhận đơn</a>



                                }
                                {DataOrder && DataOrder.statusId == 'S4' &&
                                    <a onClick={() => handleSendProduct()} className="main_btn">Gửi hàng</a>
                                }
                                {DataOrder && DataOrder.statusId == 'S5' &&
                                    <a onClick={() => handleSuccessShip()} className="main_btn">Đã giao hàng</a>
                                }
                            </div>
                            {(DataOrder && DataOrder.statusId == 'S3' && DataOrder.isPaymentOnlien == 0)
                                &&
                                <a onClick={() => handleCancelOrder(DataOrder)} style={{ marginLeft: '30px', background: '#cd2b14', border: '1px solid #cd2b14', width: '213px' }} className="main_btn">Hủy đơn</a>
                            }


                        </div>
                    </div>
                </div>

            </div>
            <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>

            {
                isOpen === true &&
                <Lightbox mainSrc={imgPreview}
                    onCloseRequest={() => setisOpen(false)}
                />
            }


        </>

    );
}

export default DetailOrder;